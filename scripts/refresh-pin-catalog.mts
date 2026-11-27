import { readFile, writeFile } from 'node:fs/promises'
import original from '../src/config/games/gta6/markers.json'
import { communityMarkers, COMMUNITY_LAYERS } from '../src/config/games/gta6/community'
import { GTA6_STORY_PINS } from '../src/config/games/gta6/storyPins'
import { addReviewedVariants, GTA6_EXTRA_VARIANTS } from '../src/config/games/gta6/extraVariants'
import { applyVehicleCorrections } from '../src/config/games/gta6/vehicleCorrections'
import { extractLocationHints, type LocationHints } from '../src/lib/locationHints'
import { communityToMap } from '../src/lib/communityProjection'
import type { GameMarker } from '../src/types/game'

type Point = { id: string; name: string; category: string; x: number; y: number; description?: string }
const [sourcePath, gpsPath] = process.argv.slice(2)
if (!sourcePath || !gpsPath) throw new Error('Usage: tsx scripts/refresh-pin-catalog.mts <GTABase decoded JSON> <GPS JSON>')
const source: Point[] = JSON.parse(await readFile(sourcePath, 'utf8'))
const gps: { points: { id: string; name: string; cat: string; x: number; y: number; description?: string }[] } = JSON.parse(await readFile(gpsPath, 'utf8'))
const base = addReviewedVariants(applyVehicleCorrections([...GTA6_STORY_PINS, ...communityMarkers, ...original as GameMarker[]]))
const all = new Map(base.map(p => [p.id, p]))
const patches = new Map<string, GameMarker>()
const protectedIds = new Set([...GTA6_EXTRA_VARIANTS.map(p=>p.id), 'gta6-community-vehicle-spawn-029', 'gta6-community-standout-vehicle-149', 'gta6-community-standout-vehicle-156'])
const excluded = new Set(['standout-vehicle-170']) // The Battler page contradicts this second position; retain reviewed record 149.
const native: Record<string, string[]> = {
 bank:['mg-29022','mg-29023'], fence:['mg-29082','mg-29027'], 'gang-operation':['mg-29133','mg-29134','mg-29135','mg-29136','mg-29137','mg-29138','mg-29139','mg-29140','mg-29141'],
 'kitty-litter-lab':['mg-29216'],'payday-loan':['mg-29024'],safe:['mg-29083'],'smash-n-grab':['mg-29025','mg-29026','mg-29027'],'towable-atm':['mg-29037'],mural:['mg-29144'],'base-jump':['mg-29057'],
 'book-swap':['mg-29093'],'knife-flight':['mg-29059'],magazine:['mg-29120'],meditation:['mg-29196'],'stunt-jump':['mg-29019'],'under-the-bridge':['mg-29060'],playlist:['mg-29143'],
 'waink-curiosity':['mg-29066'],'waink-landmark':['mg-29065'],'waink-sculpture':['mg-29067'],arcade:['mg-29028'],basketball:['mg-29011'],'drone-race':['mg-29142'],fishing:['mg-29099'],golf:['mg-29013'],gym:['mg-29030'],
 'mini-golf':['mg-29015'],pool:['mg-29061'],race:['mg-29084','mg-29086','mg-29087','mg-29088','mg-29089','mg-29090','mg-29091'],'race-challenge':['mg-29085'],'shooting-range':['mg-29017'],
 garage:['mg-29062','mg-29063'],'bus-stop':['mg-29036'],'car-wash':['mg-29034'],'ev-charger':['mg-29035'],'gas-station':['mg-29033'],'vehicle-mod-shop':['mg-29032'],'pay-n-spray':['mg-29029'],
 'public-transport':['mg-29038'],ferry:['mg-29039'],'standout-vehicle':['mg-29095'],'vehicle-rental':['mg-29040'],'vehicle-request':['mg-29096','mg-29097'],'wyman-car':['mg-29186'],
 'ammu-nation':['mg-29041'],clothing:['mg-29042'],'clothing-sportswear':['mg-29043'],'clothing-formal':['mg-29044'],'clothing-souvenir':['mg-29045'],'clothing-thrift':['mg-29046'],
 electronics:['mg-29050'],footwear:['mg-29047'],haircut:['mg-29048'],tattoo:['mg-29049'],bar:['mg-29055'],'cafe-takeout':['mg-29053'],'convenience-store':['mg-29051'],'food-and-drink':['mg-29052'],'liquor-store':['mg-29054'],'street-food':['mg-29056'],atm:['mg-29021'],nightclub:['mg-29031'],
 'card-americas-next-top-hooker':['mg-29178'],'card-backyard-wrestling':['mg-29177'],'card-delights':['mg-29113'],'card-ed-comics':['mg-29180'],'card-jack-of-hearts':['mg-29112'],
 'card-liberty-city-penetrators':['mg-29172'],'card-liberty-city-swingers':['mg-29169'],'card-liberty-city-wrath':['mg-29175'],'card-los-santos-corkers':['mg-29167'],'card-los-santos-panic':['mg-29171'],'card-los-santos-pounders':['mg-29174'],
 'card-nine1nine':['mg-29114'],'card-right-wing':['mg-29179'],'card-legends-of-ratface':['mg-29181'],'card-vice-city-club-de-futbol':['mg-29176'],'card-vice-city-flamingos':['mg-29168'],'card-vice-city-manatees':['mg-29173'],'card-vice-city-narcos':['mg-29170'],
}
const gpsCats: Record<string,string> = {'bank-jobs':'bank',safes:'safe','unique-vehicles':'standout-vehicle','weapon-variants':'unique-weapon',flamingos:'cocaine-flamingo',meteorites:'meteorite','street-art':'ahol-street-art','style-unlocks':'style-magazine','loot-boxes':'yellow-loot-box',magazines:'magazine',books:'magazine','random-events':'random-event','underwater-discoveries':'underwater',landmarks:'landmark',garages:'garage','randys-wish-list':'vehicle-request','missing-tourists':'missing-tourists','unique-animals':'unique-animals',hunting:'hunting'}
const norm=(s:string)=>s.toLowerCase().replace(/\b(?:spot|bank|big|the|lab|kitty litter)\b/g,'').replace(/[^a-z0-9]/g,'')
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y)
const sourceBindings:Record<string,string>={}, gpsBindings:Record<string,string>={}
const skipped:{source:string;id:string;reason:string}[]=[]
const choices=(category:string)=> native[category] ?? (COMMUNITY_LAYERS.some(l=>l.id===category)?['community-'+category]:[])
function ingest(p:Point, origin:'gtabase'|'gps') {
 if(excluded.has(p.id)) { skipped.push({source:origin,id:p.id,reason:'Conflicting reviewed vehicle position'}); return }
 const categories=choices(p.category)
 if(!categories.length){skipped.push({source:origin,id:p.id,reason:'Unmapped or empty source category'});return}
 if(!/^[a-zA-Z0-9_-]+$/.test(p.id)||!p.name||!Number.isFinite(p.x)||!Number.isFinite(p.y))throw Error('Invalid point '+p.id)
 const position=communityToMap(p.x,p.y)
 if(position.x< -1.0737702086651435||position.x> -0.2782257709894464||position.y<0.2826283173759064||position.y>1.0781727550516036) { skipped.push({source:origin,id:p.id,reason:'Outside catalog bounds'});return }
 const exact=all.get('gta6-community-'+p.id)
 const candidates=[...all.values()].filter(m=>categories.includes(m.category)&&!m.id.startsWith('gta6-tip-'))
 const nameMatch=candidates.filter(m=>norm(m.title)===norm(p.name)&&distance(m,position)<0.003).sort((a,b)=>distance(a,position)-distance(b,position))[0]
 const near=candidates.filter(m=>distance(m,position)<(origin==='gps'?0.0025:0.0003)).sort((a,b)=>distance(a,position)-distance(b,position))[0]
 const match=origin==='gtabase'?exact??nameMatch??near:nameMatch??near
 const bindings=origin==='gtabase'?sourceBindings:gpsBindings
 if(match){
  bindings[p.id]=match.id
  if(origin==='gtabase'&&exact&&!protectedIds.has(exact.id)) {
   const updated={...match,title:p.name,category:categories.includes(match.category)?match.category:categories[0],...position,reviewedAt:'2026-11-27'}
   patches.set(updated.id,updated);all.set(updated.id,updated)
  }
  return
 }
 const id=origin==='gtabase'?'gta6-community-'+p.id:'gta6-gps-'+p.id
 const marker:GameMarker={id,title:p.name,category:categories[0],...position,description:'',tags:[p.category,origin==='gtabase'?'GTABase / GTADB':'GTA6 GPS'],source:'approximate',sourceUrl:origin==='gtabase'?'https://www.gtabase.com/gta-6/map/':'https://gta6gps.com/map/whats-new',reviewedAt:'2026-11-27'}
 all.set(id,marker);patches.set(id,marker);bindings[p.id]=id
}
for(const p of source)ingest(p,'gtabase')
for(const p of gps.points){
 let category=gpsCats[p.cat]
 if(p.cat==='collectible-cards') {
  const position=communityToMap(p.x,p.y)
  const cardCategories=Object.entries(native).filter(([key])=>key.startsWith('card-')).flatMap(([,ids])=>ids)
  const near=[...all.values()].filter(marker=>cardCategories.includes(marker.category)&&distance(marker,position)<0.0025).sort((a,b)=>distance(a,position)-distance(b,position))[0]
  if(near){gpsBindings[p.id]=near.id;continue}
  const person=norm(p.name.split(/[—–]/)[0])
  const matching=source.filter(point=>point.category.startsWith('card-')&&norm(point.name).includes(person))
  const sets=[...new Set(matching.map(point=>point.category))]
  category=sets.length===1?sets[0]:'collectible-card'
 }
 if(category)ingest({...p,category},'gps')
}
const hints: Record<string, LocationHints> = {}
for(const point of source) {
 const id=sourceBindings[point.id]
 if(!id||!point.description)continue
 const hint=extractLocationHints(point.description,'https://www.gtabase.com/gta-6/map/')
 if(hint)hints[id]={...hint,reviewedAt:'2026-11-27'}
}
await writeFile('src/config/games/gta6/catalogHints.json',JSON.stringify(hints,null,2)+'\n')
const result=[...patches.values()].sort((a,b)=>a.id.localeCompare(b.id))
const stats={reviewedAt:'2026-11-27',gtabaseUpdatedAt:'2026-11-26T21:47:50Z',sourceRecords:source.length,gpsRecords:gps.points.length,baseRecords:base.length,added:result.filter(p=>!base.some(b=>b.id===p.id)).length,updated:result.filter(p=>base.some(b=>b.id===p.id)).length,total:all.size,sourceBindings,gpsBindings,skipped}
await writeFile('src/config/games/gta6/catalogRefresh.json',JSON.stringify(result,null,2)+'\n')
await writeFile('src/config/games/gta6/catalogRefresh.meta.json',JSON.stringify(stats,null,2)+'\n')
console.log(JSON.stringify({added:stats.added,updated:stats.updated,total:stats.total,unmapped:skipped.length,categories:[...new Set(result.map(p=>p.category))].length}))
