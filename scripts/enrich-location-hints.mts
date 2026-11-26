import { readFile, writeFile } from 'node:fs/promises'
import { extractLocationHints } from '../src/lib/locationHints'
import pins from '../src/config/games/gta6/communityMarkers.json'

const inputPath = process.argv[2]
if (!inputPath) throw new Error('Usage: tsx scripts/enrich-location-hints.mts <public-marker-json>')
const input = JSON.parse(await readFile(inputPath, 'utf8')) as { id: string; description?: string }[]
const byId = new Map(input.map((point) => [point.id, point]))
const result: Record<string, NonNullable<ReturnType<typeof extractLocationHints>>> = {}
for (const marker of pins) {
  const source = byId.get(marker.id.replace(/^gta6-community-/, ''))
  if (!source?.description) continue
  const facts = extractLocationHints(source.description, marker.sourceUrl)
  if (facts) result[marker.id] = facts
}
await writeFile('src/config/games/gta6/locationHints.json', `${JSON.stringify(result, null, 2)}\n`)
console.log(`Enriched ${Object.keys(result).length} existing positions with source-specific facts; no new pins.`)
