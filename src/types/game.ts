export type MapProjection = 'simple' | 'geographic'

export type WorldBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export type MarkerSource = 'story-script' | 'storefront' | 'landmark' | 'approximate' | 'placeholder' | 'catalog'

export type GameMarker = {
  id: string
  title: string
  category: string
  x: number
  y: number
  z?: number
  description: string
  image?: string
  videoUrl?: string
  tags?: string[]
  source?: MarkerSource
  placeholder?: boolean
}

export type CategoryNode = {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  /** Full in-game count when this atlas only tracks part of the set. */
  worldTotal?: number
  children?: CategoryNode[]
}

export type MapPalette = {
  ocean: string
  oceanDeep: string
  land: string
  beach: string
  urban: string
  desert: string
  hills: string
  forest: string
  mountain: string
  lake: string
  wetland: string
  highway: string
  road: string
  label: string
  halo: string
  grid: string
  ink: string
}

export type MapStyle = {
  id: string
  name: string
  tileUrl: string
  fallbackImage?: string
  /** `image` uses fallbackImage. Anything else draws the built-in vector atlas. */
  fallbackMode?: 'vector' | 'image'
  palette: MapPalette
}

export type GeoPoint = [number, number]

export type RegionKind = 'urban' | 'desert' | 'hills' | 'forest' | 'mountain' | 'wetland'

export type Geography = {
  land: GeoPoint[][]
  lakes: GeoPoint[][]
  regions: { kind: RegionKind; points: GeoPoint[] }[]
  roads: { rank: 'highway' | 'arterial'; points: GeoPoint[] }[]
  peaks: GeoPoint[]
  labels: { text: string; x: number; y: number; size: number }[]
  note: string
  hint: string
}

export type GameStatus = 'ready' | 'preview'

export type GameConfig = {
  slug: string
  title: string
  shortTitle: string
  region: string
  subtitle: string
  accent: string
  status: GameStatus
  bounds: WorldBounds
  /** `geographic` uses longitude and latitude on the published slippy map. */
  projection?: MapProjection
  minZoom: number
  maxZoom: number
  maxNativeZoom: number
  styles: MapStyle[]
  categories: CategoryNode[]
  markers: GameMarker[]
  geography: Geography
  /** Which tile window the map is showing. Cayo uses its own bounds because it sits outside the Los Santos atlas. */
  atlas?: 'los-santos' | 'cayo'
}
