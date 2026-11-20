import { useMapStore } from '@/store/useMapStore'

export function applyMapSearch(url: URL, gameSlug: string, view?: { x: number; y: number; z: number }) {
  if (view) {
    url.searchParams.set('x', view.x.toFixed(2))
    url.searchParams.set('y', view.y.toFixed(2))
    url.searchParams.set('z', view.z.toFixed(2))
  }
  const slice = useMapStore.getState().byGame[gameSlug]
  url.searchParams.set('region', slice?.mapRegion === 'cayo' ? 'cayo' : 'los-santos')
  url.searchParams.set('mode', slice?.mapMode === 'online' ? 'online' : 'story')
  const selected = useMapStore.getState().selected
  if (selected?.game === gameSlug) url.searchParams.set('pin', selected.id)
  else url.searchParams.delete('pin')
}
