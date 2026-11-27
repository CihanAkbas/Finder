import type { GameMarker } from '@/types/game'

export function normalizedPinName(title: string) {
  return title.normalize('NFKD').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9]/g, '')
}
const vehicles = new Set(['mg-29095', 'community-vehicle-spawn'])
const contacts = new Set(['mg-29082', 'community-strangers'])
const food = new Set(['mg-29031', 'mg-29052', 'mg-29053', 'mg-29055'])
const landmarks = new Set(['community-landmark', 'mg-29065'])
const wrecks = new Set(['community-underwater', 'community-shipwreck'])
const landmarkServices = new Set(['community-marina', 'community-airport', 'mg-29032', 'mg-29062', 'mg-29063'])
const sameGroup = (set: Set<string>, a: GameMarker, b: GameMarker) => set.has(a.category) && set.has(b.category)
const provider = (id: string) => id.startsWith('gta6-loc-') ? 'native' : id.startsWith('gta6-gps-') ? 'gps' : id.startsWith('gta6-tip-') ? 'tip' : 'community'

/** Detection is deliberately limited to named entities and compatible interactions. */
export function areDuplicatePins(a: GameMarker, b: GameMarker) {
  if (a.id === b.id || normalizedPinName(a.title) !== normalizedPinName(b.title)) return false
  if (/^(?:atm(?:\s*\(towable\))?|safe(?:\s*\([^)]*\))?|cafe|bar|street food(?: vendor)?|electric vehicle charger|cocaine flamingo|flamingo|meteorite(?: fragment)?|yellow loot box|unique vehicle|scoop container|weapon|parachute|meditation spot|unidentified building)$/i.test(a.title.trim())) return false
  const d = Math.hypot(a.x - b.x, a.y - b.y)
  if (d > 0.0013) return false
  if (provider(a.id) === 'tip' || provider(b.id) === 'tip') return d < 1e-9
  if (sameGroup(vehicles, a, b)) return provider(a.id) !== provider(b.id) && d < 0.0004
  if (sameGroup(contacts, a, b)) return d < 0.0004
  if (sameGroup(food, a, b)) return d < 0.0008
  if (sameGroup(landmarks, a, b)) return provider(a.id) !== provider(b.id) && d < 0.001
  if ((a.category === 'community-landmark' && landmarkServices.has(b.category)) || (b.category === 'community-landmark' && landmarkServices.has(a.category))) return d < 0.0013
  if (sameGroup(wrecks, a, b) && a.category !== b.category) return true
  if (/^Book Swap\s*\d+$/i.test(a.title) && [a.category,b.category].every(c=>['mg-29093','mg-29120'].includes(c))) return d < 0.0005
  // A very close named encounter from the same source can also be an accidental second entry.
  return a.category === 'community-random-event' && b.category === a.category && d < 0.00015
}

export function findDuplicatePinPairs(markers: GameMarker[]) {
  const groups = new Map<string, GameMarker[]>()
  for (const marker of markers) {
    const name = normalizedPinName(marker.title)
    const group = groups.get(name) ?? []
    group.push(marker); groups.set(name, group)
  }
  const pairs: [GameMarker, GameMarker][] = []
  for (const group of groups.values()) for (let i=0;i<group.length;i++) for(let j=i+1;j<group.length;j++) if(areDuplicatePins(group[i],group[j])) pairs.push([group[i],group[j]])
  return pairs
}
