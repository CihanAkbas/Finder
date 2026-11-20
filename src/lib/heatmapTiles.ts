import { PbfReader } from 'pbf'
import { VectorTile } from '@mapbox/vector-tile'
import type { HeatmapEntry } from '@/config/games/gta6/heatmaps'

const TILE_CAP = 240

type TileIndex = {
  minZoom: number
  maxZoom: number
  byZoom: Map<number, Array<[number, number]>>
}

function readIndex(buffer: ArrayBuffer): TileIndex {
  const view = new DataView(buffer)
  if (buffer.byteLength < 12) throw new Error('short index')
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
  if (magic !== 'MGHI' || view.getUint8(4) !== 1) throw new Error('bad index')
  const minZoom = view.getUint8(5)
  const maxZoom = view.getUint8(6)
  const count = view.getUint32(8, true)
  let offset = 12
  let tiles: Array<[number, number]> = []
  for (let i = 0; i < count; i += 1) {
    tiles.push([view.getUint32(offset, true), view.getUint32(offset + 4, true)])
    offset += 8
  }
  const byZoom = new Map<number, Array<[number, number]>>([[minZoom, tiles]])
  for (let zoom = minZoom; zoom < maxZoom; zoom += 1) {
    const next: Array<[number, number]> = []
    for (const [x, y] of tiles) {
      const mask = view.getUint8(offset)
      offset += 1
      for (let child = 0; child < 4; child += 1) {
        if (mask & (1 << child)) next.push([2 * x + (child & 1), 2 * y + (child >> 1)])
      }
    }
    tiles = next
    byZoom.set(zoom + 1, tiles)
  }
  return { minZoom, maxZoom, byZoom }
}

function tileToLngLat(zoom: number, tileX: number, tileY: number, px: number, py: number, extent: number) {
  const world = 2 ** zoom
  const nx = (tileX + px / extent) / world
  const ny = (tileY + py / extent) / world
  const lng = nx * 360 - 180
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(Math.PI * (1 - 2 * ny)))
  return [lng, lat] as [number, number]
}

function chooseZoom(index: TileIndex) {
  let chosen = index.minZoom
  for (let zoom = index.minZoom; zoom <= index.maxZoom; zoom += 1) {
    const count = index.byZoom.get(zoom)?.length ?? 0
    if (count > 0 && count <= TILE_CAP) chosen = zoom
  }
  return chosen
}

export async function loadHeatmapPoints(entry: HeatmapEntry, signal: AbortSignal) {
  const indexUrl = entry.tiles.replace('{z}/{x}/{y}.pbf', 'index.bin')
  const indexResponse = await fetch(indexUrl, { signal })
  if (!indexResponse.ok) throw new Error('index')
  const index = readIndex(await indexResponse.arrayBuffer())
  const zoom = chooseZoom(index)
  const tiles = index.byZoom.get(zoom) ?? []
  const points: Array<[number, number]> = []
  await Promise.all(
    tiles.map(async ([x, y]) => {
      const url = entry.tiles.replace('{z}', String(zoom)).replace('{x}', String(x)).replace('{y}', String(y))
      const response = await fetch(url, { signal })
      if (!response.ok) return
      const tile = new VectorTile(new PbfReader(new Uint8Array(await response.arrayBuffer())))
      const layer = tile.layers.heatmap
      if (!layer) return
      for (let i = 0; i < layer.length; i += 1) {
        const rings = layer.feature(i).loadGeometry()
        for (const ring of rings) {
          for (const point of ring) points.push(tileToLngLat(zoom, x, y, point.x, point.y, layer.extent))
        }
      }
    }),
  )
  return points
}
