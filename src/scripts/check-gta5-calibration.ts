import { gta5 } from '@/config/games/gta5/config'
import { MAP_EXTENT, gameToLatLng } from '@/lib/projection'

const names = ['Maze Bank Tower', 'Mount Chiliad Summit', 'Los Santos International', 'Fort Zancudo Tower', 'Stunt Jump 01 — Vinewood Hills']
const zoom5 = 8192
const { bounds } = gta5

let failed = false
for (const name of names) {
  const marker = gta5.markers.find((item) => item.title === name)
  if (!marker) {
    console.error(`Missing landmark: ${name}`)
    failed = true
    continue
  }
  const inside = marker.x >= bounds.minX && marker.x <= bounds.maxX && marker.y >= bounds.minY && marker.y <= bounds.maxY
  const [lat, lng] = gameToLatLng(marker.x, marker.y, bounds)
  const pixelX = (lng / MAP_EXTENT) * zoom5
  const pixelY = (-lat / MAP_EXTENT) * zoom5
  console.log(
    `${name}: game ${marker.x}, ${marker.y} -> pixel ${pixelX.toFixed(0)}, ${pixelY.toFixed(0)} ${inside ? 'inside atlas' : 'OUTSIDE ATLAS'}`,
  )
  if (!inside || pixelX < 0 || pixelX > zoom5 || pixelY < 0 || pixelY > zoom5) failed = true
}

const expected = {
  'spaceship-parts': 50,
  'letter-scraps': 50,
  'stunt-jumps': 50,
  'nuclear-waste': 30,
  'under-bridge': 50,
  'knife-flights': 15,
  'peyote-plants': 27,
  'ammu-nation': 11,
  'los-santos-customs': 4,
  convenience: 14,
  clothing: 14,
}
const counts = new Map<string, number>()
for (const marker of gta5.markers) counts.set(marker.category, (counts.get(marker.category) ?? 0) + 1)
for (const [category, needed] of Object.entries(expected)) {
  const have = counts.get(category) ?? 0
  console.log(`${category}: ${have}/${needed}`)
  if (have !== needed) failed = true
}
console.log(`pins ${gta5.markers.length}`)
if (failed) process.exit(1)
