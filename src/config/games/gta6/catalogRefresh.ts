import updates from './catalogRefresh.json'
import type { GameMarker } from '@/types/game'

/** Additive snapshot: existing save IDs are retained, reviewed variants stay authoritative. */
export function applyCatalogRefresh(markers: GameMarker[]) {
  const byId = new Map(markers.map(marker => [marker.id, marker]))
  for (const marker of updates as GameMarker[]) byId.set(marker.id, marker)
  return [...byId.values()]
}
