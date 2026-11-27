import aliases from '@/config/games/gta6/pinAliases.json'
const index = aliases as Record<string, string>
export function canonicalMarkerId(id: string) {
  const seen = new Set<string>()
  while (index[id] && !seen.has(id)) { seen.add(id); id = index[id] }
  return id
}
export function canonicalMarkerIds(ids: readonly string[]) {
  return [...new Set(ids.map(canonicalMarkerId))]
}
