export type HeatmapEntry = {
  id: number
  title: string
  label: string
  points: number
  minZoom: number
  maxZoom: number
  bounds: [number, number, number, number]
  tiles: string
}
