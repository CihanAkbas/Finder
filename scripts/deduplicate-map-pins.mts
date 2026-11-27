import { writeFileSync } from 'node:fs'
import { gta6Catalog } from '../src/config/games/gta6/config'
import { findDuplicatePinPairs } from '../src/lib/pinDeduplication'
const parent=new Map(gta6Catalog.map(marker=>[marker.id,marker.id]))
const markers=new Map(gta6Catalog.map(marker=>[marker.id,marker]))
const root=(id:string):string=>parent.get(id)===id?id:root(parent.get(id)!)
const rank=(id:string)=>{const m=markers.get(id)!;return(id.startsWith('gta6-loc-')?100:0)+(m.guide?30:0)+(m.description?10:0)+(['community-underwater','community-marina'].includes(m.category)?15:0)-(id.startsWith('gta6-tip-')?200:0)-(id.startsWith('gta6-gps-')?20:0)}
const pairs=findDuplicatePinPairs(gta6Catalog)
for(const[a,b]of pairs){const ra=root(a.id),rb=root(b.id);if(ra===rb)continue;const keep=rank(ra)>rank(rb)?ra:rank(ra)<rank(rb)?rb:ra.localeCompare(rb)<0?ra:rb;parent.set(keep===ra?rb:ra,keep)}
const aliases=Object.fromEntries([...parent.keys()].filter(id=>root(id)!==id).sort().map(id=>[id,root(id)]))
// Individually reviewed: GPS uses a rougher coordinate for the same named site.
aliases['gta6-gps-pin-917007']='gta6-loc-1091641'
aliases['gta6-gps-pin-919044']='gta6-community-vehicle-spawn-026'
writeFileSync('src/config/games/gta6/pinAliases.json',JSON.stringify(aliases,null,2)+'\n')
console.log('Duplicates merged:',Object.keys(aliases).length)
console.log('Rumpo:',aliases['gta6-community-standout-vehicle-069'])
