import type { GameMarker } from '@/types/game'
export type StyleSourcePoint = { name: string; lat?: number; lng?: number }
export type StyleMapTransform = { xScale: number; yScale: number; xOffset: number; yOffset: number; anchors: number; p95Error: number }
const normalize = (name: string) => name.normalize('NFKD').toLowerCase().replace(/gas station/g, 'gas').replace(/[^a-z0-9]/g, '')
const base = (name: string) => normalize(name.split(/\s+-\s+/)[0])
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

/** Calibrate the two public map projections using many uniquely named existing places.
 * Robust medians resist an incorrect source/legacy pin. No marker is added or moved.
 */
export function calibrateStyleMap(sources: StyleSourcePoint[], markers: GameMarker[]): StyleMapTransform | null {
  const anchors = sources.flatMap(source => {
    if (!Number.isFinite(source.lat) || !Number.isFinite(source.lng)) return []
    if (sources.filter(row => normalize(row.name) === normalize(source.name)).length !== 1) return []
    const matches = markers.filter(marker => marker.source !== 'approximate' && normalize(marker.title) === normalize(source.name))
    return matches.length === 1 ? [{ source, marker: matches[0] }] : []
  })
  if (anchors.length < 20) return null
  const xs: number[] = [], ys: number[] = []
  for (let i = 0; i < anchors.length; i++) for (let j = i + 1; j < anchors.length; j++) {
    const a = anchors[i], b = anchors[j]
    const dx = a.source.lng! - b.source.lng!, dy = a.source.lat! - b.source.lat!
    if (Math.abs(dx) > 10) xs.push((a.marker.x - b.marker.x) / dx)
    if (Math.abs(dy) > 10) ys.push((a.marker.y - b.marker.y) / dy)
  }
  if (!xs.length || !ys.length) return null
  const xScale = median(xs), yScale = median(ys)
  const xOffset = median(anchors.map(row => row.marker.x - xScale * row.source.lng!))
  const yOffset = median(anchors.map(row => row.marker.y - yScale * row.source.lat!))
  const errors = anchors.map(row => Math.hypot(row.marker.x - (xScale * row.source.lng! + xOffset), row.marker.y - (yScale * row.source.lat! + yOffset))).sort((a, b) => a - b)
  const p95Error = errors[Math.floor(errors.length * .95)]
  if (![xScale, yScale, xOffset, yOffset].every(Number.isFinite) || xScale <= 0 || yScale <= 0 || p95Error > .0005) return null
  return { xScale, yScale, xOffset, yOffset, anchors: anchors.length, p95Error }
}
export function styleMapPoint(source: StyleSourcePoint, transform: StyleMapTransform | null) {
  if (!transform || !Number.isFinite(source.lat) || !Number.isFinite(source.lng)) return undefined
  return { x: transform.xScale * source.lng! + transform.xOffset, y: transform.yScale * source.lat! + transform.yOffset }
}
/** A chain name alone cannot choose a branch. Position must agree, and a close
 * alternative keeps the result ambiguous rather than selecting an arbitrary pin.
 */
export function matchStyleStore(source: StyleSourcePoint, markers: GameMarker[], transform: StyleMapTransform | null): string[] {
  const point = styleMapPoint(source, transform)
  const candidates = markers.filter(marker => normalize(marker.title) === normalize(source.name) || base(marker.title) === base(source.name))
  if (!point) return candidates.length === 1 ? [candidates[0].id] : []
  const nearby = candidates.map(marker => ({ id: marker.id, distance: Math.hypot(marker.x - point.x, marker.y - point.y) })).sort((a, b) => a.distance - b.distance)
  if (!nearby[0] || nearby[0].distance > .0015 || nearby[1] && nearby[1].distance - nearby[0].distance < .0002) return []
  return [nearby[0].id]
}
