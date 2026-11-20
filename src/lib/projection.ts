import type { MapProjection, WorldBounds } from '@/types/game'

/** Leaflet units across the full atlas. At zoom 5 this is an 8192px tile pyramid. */
export const MAP_EXTENT = 256

export function gameToLatLng(x: number, y: number, bounds: WorldBounds, projection: MapProjection = 'simple'): [number, number] {
  if (projection === 'geographic') return [y, x]
  const nx = (x - bounds.minX) / (bounds.maxX - bounds.minX)
  const ny = (y - bounds.minY) / (bounds.maxY - bounds.minY)
  return [(ny - 1) * MAP_EXTENT, nx * MAP_EXTENT]
}

export function latLngToGame(lat: number, lng: number, bounds: WorldBounds, projection: MapProjection = 'simple') {
  if (projection === 'geographic') return { x: lng, y: lat }
  const nx = lng / MAP_EXTENT
  const ny = lat / MAP_EXTENT + 1
  return {
    x: bounds.minX + nx * (bounds.maxX - bounds.minX),
    y: bounds.minY + ny * (bounds.maxY - bounds.minY),
  }
}

export function leafletBounds(): [[number, number], [number, number]] {
  return [
    [-MAP_EXTENT, 0],
    [0, MAP_EXTENT],
  ]
}

export function atlasCorners(bounds: WorldBounds, projection: MapProjection = 'simple'): [[number, number], [number, number]] {
  if (projection === 'geographic') return [[bounds.minY, bounds.minX], [bounds.maxY, bounds.maxX]]
  return leafletBounds()
}

export function projectToSvg(x: number, y: number, bounds: WorldBounds, size: number) {
  const nx = (x - bounds.minX) / (bounds.maxX - bounds.minX)
  const ny = (y - bounds.minY) / (bounds.maxY - bounds.minY)
  return [nx * size, (1 - ny) * size] as const
}
