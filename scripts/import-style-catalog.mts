import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { gta6 } from '../src/config/games/gta6/config'
import type { StyleCatalog, StyleCharacter, StyleItem, StyleStore } from '../src/config/games/gta6/style/types'

// Read public HTML and factual metadata. Do not call authenticated APIs or execute site code.
const cache=join(tmpdir(),'finder-style-source')
await mkdir(cache,{recursive:true})
const decode=(s:string)=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(?:39|x27);/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
const text=(s:string)=>decode(s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim())
const hash=(url:string)=>createHash('sha256').update(url).digest('hex').slice(0,16)
const id=(kind:string,url:string)=>`fits-${kind}-${hash(url)}`
let rateLimited=false
async function html(url:string){
 if(new URL(url).origin!=='https://gtafits.com')throw Error('Unexpected source origin')
 const path=join(cache,hash(url)+'.html')
 try{return await readFile(path,'utf8')}catch{}
 if(rateLimited||process.env.STYLE_FETCH_PUBLIC!=='1')throw Error('Page not cached: '+url)
 const response=await fetch(url)
 if(response.status===429){rateLimited=true;throw Error('Source rate limit reached; using cached metadata only')}
 if(!response.ok)throw Error(`Public page unavailable (${response.status}): ${url}`)
 const body=await response.text()
 if(!body.includes('application/ld+json'))throw Error('Source did not return public catalog metadata: '+url)
 await writeFile(path,body)
 return body
}
const schemas=(h:string)=>[...h.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]))
const links=(h:string)=>[...h.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({url:new URL(decode(m[1]),'https://gtafits.com').href,name:text(m[2])}))
const meta=(h:string,key:string)=>decode(h.match(new RegExp(`<meta[^>]*(?:name|property)="${key}"[^>]*content="([^"]*)"`))?.[1]??'')
const char=(h:string):StyleCharacter=>{const paths=links(h).map(l=>new URL(l.url).pathname);const l=paths.some(p=>p==='/items/lucia'||p==='/outfits/lucia'),j=paths.some(p=>p==='/items/jason'||p==='/outfits/jason');return l&&!j?'lucia':j&&!l?'jason':'unisex'}
const safeImage=(url:string)=>url.startsWith('https://cdn.gtafits.com/gta6/')?url:undefined
async function batch<T,R>(values:T[],label:string,fn:(value:T)=>Promise<R>){const out:R[]=[];for(let i=0;i<values.length;i+=4){const results=await Promise.allSettled(values.slice(i,i+4).map(fn));for(const result of results){if(result.status==='rejected')throw result.reason;out.push(result.value)}if(i%40===0)console.log(`${label}: ${Math.min(i+4,values.length)}/${values.length}`)}return out}
const [home,itemIndex,storeIndex]=await Promise.all([html('https://gtafits.com/'),html('https://gtafits.com/items'),html('https://gtafits.com/stores')])
const listing=(h:string)=>schemas(h).find(s=>s['@type']==='ItemList').itemListElement as {name:string;url:string}[]
const outfitPages=listing(home)
const outfitItems=new Map<string,{name:string;url:string}>()
const outfits=await batch(outfitPages,'Outfits',async entry=>{const h=await html(entry.url);const work=schemas(h).find(s=>s['@type']==='CreativeWork');if(!work)throw Error('Missing outfit metadata: '+entry.url);const parts=(work.hasPart??[]) as {name:string;url:string}[];for(const part of parts)outfitItems.set(part.url,part);return{id:id('outfit',entry.url),name:work.name,author:work.author?.name??'GTAFits',sourceUrl:entry.url,imageUrl:safeImage(work.image??''),character:char(h),itemIds:parts.map(part=>id('item',part.url))}})
const itemsToRead=new Map([...listing(itemIndex),...outfitItems.values()].map(item=>[item.url,item]))
const storePages=listing(storeIndex)
const storeMap=new Map(storePages.map(store=>[store.url,store]))
const items=await batch([...itemsToRead.values()],'Items',async(entry):Promise<StyleItem>=>{let h='';try{h=await html(entry.url)}catch{};const description=meta(h,'description');const stores=links(h).filter(l=>/^\/stores\/\d+$/.test(new URL(l.url).pathname));for(const store of stores)storeMap.set(store.url,store);const category=description.match(/in GTA 6 \(([^)]+)\)/)?.[1]??'Other';return{id:id('item',entry.url),name:entry.name,sourceUrl:entry.url,imageUrl:safeImage(meta(h,'og:image')),character:char(h),category,storeIds:[...new Set(stores.map(store=>id('store',store.url)))],detailed:Boolean(h)}})
const normalized=(s:string)=>s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'')
const shopCategories=new Set(['mg-29042','mg-29043','mg-29044','mg-29045','mg-29046','mg-29047','mg-29048','mg-29049','mg-29041','mg-29050','mg-29051','mg-29033','mg-29030','community-landmark','mg-29032'])
const stores=await batch([...storeMap.values()],'Stores',async(entry):Promise<StyleStore>=>{let h='';try{h=await html(entry.url)}catch{};const description=meta(h,'description');const district=description.match(/in GTA 6 in ([^.]+)\./)?.[1]??'';const category=description.match(/ is (?:a|an) (.+?) in GTA 6/)?.[1]??'store';const base=entry.name.split(/\s+-\s+/)[0];let candidates=gta6.markers.filter(marker=>shopCategories.has(marker.category)&&(normalized(marker.title)===normalized(entry.name)||normalized(marker.title)===normalized(base)));if(candidates.length>1&&district){const regional=candidates.filter(marker=>normalized(marker.title+' '+marker.description+' '+marker.tags?.join(' ')).includes(normalized(district)));if(regional.length)candidates=regional}return{id:id('store',entry.url),name:entry.name,sourceUrl:entry.url,district,category,markerIds:[...new Set(candidates.map(marker=>marker.id))]}})
const catalog:StyleCatalog={reviewedAt:'2026-11-27',source:'https://gtafits.com/',items,outfits,stores}
await writeFile('src/config/games/gta6/style/catalog.json',JSON.stringify(catalog,null,2)+'\n')
console.log(JSON.stringify({outfits:outfits.length,items:items.length,stores:stores.length,linkedStores:stores.filter(store=>store.markerIds.length).length}))
