import type { GameMarker, MarkerGuide } from '@/types/game'
import { canonicalMarkerId } from '@/lib/markerAliases'
function combineGuides(a?: MarkerGuide, b?: MarkerGuide): MarkerGuide | undefined {
  if(!a&&!b)return undefined
  const unique=<T,>(values:T[])=>[...new Map(values.map(value=>[JSON.stringify(value),value])).values()]
  return { locationSpecific:a?.locationSpecific??b?.locationSpecific, rewards:unique([...(a?.rewards??[]),...(b?.rewards??[])]), relatedPins:unique([...(a?.relatedPins??[]),...(b?.relatedPins??[])]), summary:a?.summary??b?.summary, directions:unique([...(a?.directions??[]),...(b?.directions??[])]), requirements:unique([...(a?.requirements??[]),...(b?.requirements??[])]), warnings:unique([...(a?.warnings??[]),...(b?.warnings??[])]), sources:unique([...(a?.sources??[]),...(b?.sources??[])]) }
}
export function deduplicateGta6Pins(markers: GameMarker[]) {
  const byId=new Map(markers.map(marker=>[marker.id,marker]))
  for(const marker of markers) {
    const canonical=canonicalMarkerId(marker.id)
    if(canonical===marker.id)continue
    const kept=byId.get(canonical)
    if(!kept)throw Error(`Missing canonical marker ${canonical}`)
    byId.set(canonical,{...kept, category:kept.category==='mg-29055' && marker.category==='mg-29031' ? marker.category : kept.category, description:marker.id.startsWith('gta6-tip-') && kept.description && !kept.description.includes(marker.description) ? kept.description+'\n\n'+marker.description : kept.description||marker.description, descriptionTr:kept.descriptionTr||marker.descriptionTr, guide:combineGuides(kept.guide,marker.guide), tags:[...new Set([...(kept.tags??[]),...(marker.tags??[]),marker.title])]})
    byId.delete(marker.id)
  }
  return [...byId.values()]
}
