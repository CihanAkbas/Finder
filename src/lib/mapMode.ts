import type { CategoryNode, GameConfig, GameMarker, WorldBounds } from '@/types/game'
import type { MapMode, MapRegion } from '@/store/slice'

/** Online-only layers. Everything else, including GTA VI placeholders, stays in Story Mode. */
const ONLINE = new Set([
  'playing-cards',
  'action-figures',
  'signal-jammers',
  'ld-organics',
  'movie-props',
  'ls-tags',
  'media-sticks',
  'shipwrecks',
  'hidden-caches',
  'smoke-on-the-water',
  'gun-van',
  'offices',
  'clubhouses',
  'nightclubs',
  'arcades',
  'agencies',
  'auto-shops',
  'salvage-yards',
  'bail-offices',
  'bunkers',
  'facilities',
  'hangars',
  'cargo-warehouses',
  'vehicle-warehouses',
  'cocaine-lockups',
  'meth-labs',
  'counterfeit-cash',
  'weed-farms',
  'document-forgery',
  'garment-factory',
  'apartments',
  'garages',
  'mansions',
  'office-garages',
  'casino',
  'arena-workshop',
  'car-meet',
  'freakshop',
  'money-fronts',
  'yacht-moorings',
  'mobile-bases',
  'snowmen',
  'jack-o-lanterns',
  'lucky-clovers',
  'golden-clovers',
  'yuanbao',
  'ghosts-exposed',
  'exotic-exports',
  'stash-houses',
  'peyote-online',
  'rc-bandito',
  'hsw-trials',
  'junk-energy-trials',
  'junk-energy-skydives',
  'kosatka',
  'payphone-hits',
  'madrazo-hits',
  'cayo-chests',
  'cayo-stashes',
  'cayo-loot',
  'cayo-infiltration',
  'cayo-cutters',
  'cayo-grapples',
  'cayo-uniforms',
])

/**
 * Square window around the published Cayo Perico points.
 * Those points sit south of the Los Santos tile atlas, so they get their own projection.
 */
export const CAYO_BOUNDS: WorldBounds = {
  minX: 3764.76,
  maxX: 5734.83,
  minY: -6062.29,
  maxY: -4092.22,
}

export type MapView = {
  mode: MapMode
  region: MapRegion
}

export function mapViewFromSlice(slice?: { mapMode?: string; mapRegion?: string } | null): MapView {
  return {
    mode: slice?.mapMode === 'online' ? 'online' : 'story',
    region: slice?.mapRegion === 'cayo' ? 'cayo' : 'los-santos',
  }
}

export function markerMode(category: string): MapMode {
  return ONLINE.has(category) ? 'online' : 'story'
}

export function isCategoryVisible(id: string, view: MapView) {
  if (id.startsWith('mg-')) return view.region !== 'cayo'
  if (id.startsWith('cayo-')) return view.region === 'cayo'
  if (view.region === 'cayo') return false
  return markerMode(id) === view.mode
}

export function markersInView(markers: GameMarker[], view: MapView) {
  return markers.filter((marker) => isCategoryVisible(marker.category, view))
}

export function categoriesInView(nodes: CategoryNode[], view: MapView): CategoryNode[] {
  return nodes.flatMap((node) => {
    if (!node.children?.length) return isCategoryVisible(node.id, view) ? [node] : []
    const children = node.children.filter((child) => isCategoryVisible(child.id, view))
    return children.length ? [{ ...node, children }] : []
  })
}

/** Swap the projection window when the sidebar is on the Cayo tab. The Los Santos object stays untouched. */
export function viewGame(game: GameConfig, region: MapRegion): GameConfig {
  if (region !== 'cayo' || game.slug !== 'gta5') return game
  return { ...game, bounds: CAYO_BOUNDS, atlas: 'cayo' }
}
