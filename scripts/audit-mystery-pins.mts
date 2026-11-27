import { mkdir, writeFile } from 'node:fs/promises'
import { gta6 } from '../src/config/games/gta6/config'
import { MYSTERY_GUIDES, MYSTERY_FAMILIES } from '../src/config/games/gta6/mysteryGuides'
import { markerGuide } from '../src/lib/markerGuides'
import { canonicalMarkerId } from '../src/lib/markerAliases'
const categories = new Set(['community-random-event', 'community-easter-egg', 'community-missing-tourists'])
const reviewed = new Set(Object.keys(MYSTERY_GUIDES))
const rows = gta6.markers.filter(marker => categories.has(marker.category) || reviewed.has(marker.id)).map(marker => {
 const guide = markerGuide(marker, 'en')
 const status = reviewed.has(marker.id) ? (marker.guide?.locationSpecific === false ? 'quest-context-added-position-pending' : 'source-reviewed-guide') : guide.locationSpecific ? 'existing-detail' : 'needs-source-review'
 for (const ref of guide.relatedPins) if (!gta6.markers.some(point => point.id === canonicalMarkerId(ref.id))) throw Error('Broken related location: '+ref.id)
 return { id: marker.id, title: marker.title, category: marker.category, status }
})
for (const id of reviewed) if (!rows.some(row => row.id === id)) throw Error('Reviewed pin absent: '+id)
const counts = rows.reduce<Record<string,number>>((out, row) => ({...out, [row.status]: (out[row.status] ?? 0)+1}), {})
const report = { reviewedAt: '2026-11-27', scope: 'Automatic scan of encounter, easter-egg and missing-tourist records; named guide families reviewed against linked sources. This is not an in-game validation of every coordinate.', scanned: rows.length, enriched: reviewed.size, families: Object.fromEntries(Object.entries(MYSTERY_FAMILIES).map(([key, ids]) => [key, ids.length])), counts, rows }
if (process.argv.includes('--report')) { await mkdir('docs/reports', {recursive:true}); await writeFile('docs/reports/mystery-pin-audit.json',JSON.stringify(report,null,2)+'\n') }
console.log(JSON.stringify({scanned:report.scanned,enriched:report.enriched,families:report.families,counts}))
