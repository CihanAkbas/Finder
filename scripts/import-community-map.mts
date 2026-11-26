import { readFile, writeFile } from 'node:fs/promises'
import { COMMUNITY_LAYERS, COMMUNITY_SOURCE, COMMUNITY_REVIEWED } from '../src/config/games/gta6/community'
import original from '../src/config/games/gta6/markers.json'
import type { GameMarker } from '../src/types/game'

// Import factual names and positions only. Never execute downloaded JavaScript.
// The input is GTABase's public marker JSON; guide prose and third-party photos are excluded.
const [inputPath, calibrationPath] = process.argv.slice(2)
if (!inputPath || !calibrationPath) throw new Error('Usage: tsx scripts/import-community-map.mts <markers.json> <calibration.json>')
const input = JSON.parse(await readFile(inputPath, 'utf8')) as { id: string; name: string; category: string; x: number; y: number }[]
const calibration = JSON.parse(await readFile(calibrationPath, 'utf8')) as {
  fx: { scale: number; offset: number }; fy: { scale: number; offset: number }
}
const normalized = (name: string) => name.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9]/g, '')
const result: GameMarker[] = []
const ids = new Set<string>()
let duplicates = 0
for (const point of input) {
  const layer = COMMUNITY_LAYERS.find((layer) => layer.id === point.category)
  if (!layer) continue
  if (!point.id || !point.name || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error('Malformed source point')
  const x = point.x * calibration.fx.scale + calibration.fx.offset
  const mercatorY = point.y * calibration.fy.scale + calibration.fy.offset
  const y = (2 * Math.atan(Math.exp(mercatorY * Math.PI / 180)) - Math.PI / 2) * 180 / Math.PI
  if (x < -1.0737702086651435 || x > -0.2782257709894464 || y < 0.2826283173759064 || y > 1.0781727550516036) throw new Error(`Outside map: ${point.id}`)
  if (original.some((marker) => normalized(marker.title) === normalized(point.name) && Math.hypot(marker.x - x, marker.y - y) < 0.001)) { duplicates++; continue }
  const id = `gta6-community-${point.id}`
  if (ids.has(id)) throw new Error(`Duplicate source ID: ${id}`)
  ids.add(id)
  result.push({ id, title: point.name, category: `community-${layer.id}`, x, y,
    description: '', tags: [layer.en, 'GTABase / GTADB'], source: 'approximate', sourceUrl: COMMUNITY_SOURCE, reviewedAt: COMMUNITY_REVIEWED })
}
await writeFile('src/config/games/gta6/communityMarkers.json', `${JSON.stringify(result, null, 2)}\n`)
console.log(`Imported ${result.length} community positions; skipped ${duplicates} existing named locations.`)
console.log('Positions are calibrated community estimates, not in-game verification.')
