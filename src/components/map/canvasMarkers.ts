import type { Map as LeafletMap } from 'leaflet'
import { gameToLatLng } from '@/lib/projection'
import type { MapProjection, WorldBounds } from '@/types/game'

export type MarkerIcon = { x: number; y: number; w: number; h: number }

export type DrawMarker = {
  id: string
  kind: 'marker' | 'pin'
  x: number
  y: number
  title: string
  color: string
  found: boolean
  icon?: MarkerIcon
}

export type MarkerHit =
  | { type: 'marker' | 'pin'; id: string; title: string; color: string; icon?: MarkerIcon }
  | { type: 'cluster'; count: number; title: string; color: string; lat: number; lng: number; ids: string[] }

type Drawn = {
  hit: MarkerHit
  x: number
  y: number
  radius: number
  found: boolean
  marker?: DrawMarker
  icon?: MarkerIcon
}

type Frame = {
  items: DrawMarker[]
  bounds: WorldBounds
  selectedId: string | null
  accent: string
  clusterTitle?: (count: number) => string
  projection?: MapProjection
  atlasUrl?: string
}

const indexes = new WeakMap<LeafletMap, CanvasMarkerLayer>()

export function getMarkerIndex(map: LeafletMap) {
  return indexes.get(map) ?? null
}

/**
 * Screen-space canvas markers. A few thousand points stay on one canvas,
 * so the DOM does not grow with the dataset.
 */
const VIEW_PAD = 180

export class CanvasMarkerLayer {
  private canvas: HTMLCanvasElement | null = null
  private drawn: Drawn[] = []
  private pixelWidth = 0
  private pixelHeight = 0
  private atlasUrl: string | null = null
  private atlas: HTMLImageElement | null = null
  private readonly onView = () => this.redraw()

  constructor(
    private readonly map: LeafletMap,
    private readonly getState: () => Frame,
  ) {}

  attach() {
    const canvas = document.createElement('canvas')
    canvas.className = 'finder-markers'
    canvas.setAttribute('aria-hidden', 'true')
    this.canvas = canvas
    this.map.getPanes().overlayPane.appendChild(canvas)
    indexes.set(this.map, this)
    this.map.on('moveend viewreset resize', this.onView)
    this.redraw()
  }

  detach() {
    this.map.off('moveend viewreset resize', this.onView)
    indexes.delete(this.map)
    this.canvas?.remove()
    this.canvas = null
    this.drawn = []
  }

  redraw() {
    const canvas = this.canvas
    if (!canvas) return
    const size = this.map.getSize()
    const dpr = window.devicePixelRatio || 1
    const cssWidth = size.x + VIEW_PAD * 2
    const cssHeight = size.y + VIEW_PAD * 2
    const nextWidth = Math.max(1, Math.floor(cssWidth * dpr))
    const nextHeight = Math.max(1, Math.floor(cssHeight * dpr))
    if (this.pixelWidth !== nextWidth || this.pixelHeight !== nextHeight) {
      this.pixelWidth = nextWidth
      this.pixelHeight = nextHeight
      canvas.width = nextWidth
      canvas.height = nextHeight
      canvas.style.width = `${cssWidth}px`
      canvas.style.height = `${cssHeight}px`
    }
    const origin = this.map.containerPointToLayerPoint([-VIEW_PAD, -VIEW_PAD])
    canvas.style.transform = `translate3d(${origin.x}px, ${origin.y}px, 0)`
    const ctx = canvas.getContext('2d')
    if (!ctx || size.x === 0 || size.y === 0) {
      this.drawn = []
      return
    }
    ctx.setTransform(dpr, 0, 0, dpr, VIEW_PAD * dpr, VIEW_PAD * dpr)
    ctx.clearRect(-VIEW_PAD, -VIEW_PAD, cssWidth, cssHeight)
    const state = this.getState()
    this.ensureAtlas(state.atlasUrl)
    this.drawn = this.layout(state.items, state.bounds, size.x, size.y, state.clusterTitle, state.projection)
    const under = this.drawn.filter((item) => item.hit.type !== 'pin' && item.found)
    const over = this.drawn.filter((item) => item.hit.type !== 'pin' && !item.found)
    const pins = this.drawn.filter((item) => item.hit.type === 'pin')
    for (const item of [...under, ...over, ...pins]) this.paint(ctx, item, state.selectedId, state.accent)
  }

  hitTest(x: number, y: number) {
    for (let index = this.drawn.length - 1; index >= 0; index -= 1) {
      const item = this.drawn[index]
      const dx = item.x - x
      const dy = item.y - y
      if (dx * dx + dy * dy <= item.radius * item.radius) return item.hit
    }
    return null
  }

  private layout(items: DrawMarker[], bounds: WorldBounds, width: number, height: number, clusterTitle?: (count: number) => string, projection: MapProjection = 'simple') {
    const zoom = this.map.getZoom()
    const geographic = projection === 'geographic'
    const cluster = geographic ? zoom < 11 : zoom < 4
    const cell = geographic ? (zoom < 10 ? 72 : 54) : zoom < 2.5 ? 72 : 54
    const groups = new Map<string, { item: DrawMarker; px: number; py: number }[]>()
    const pins: Drawn[] = []
    const drawn: Drawn[] = []

    const visible = (x: number, y: number) =>
      x >= -VIEW_PAD && y >= -VIEW_PAD && x <= width + VIEW_PAD && y <= height + VIEW_PAD

    for (const item of items) {
      const latlng = gameToLatLng(item.x, item.y, bounds, projection)
      if (item.kind === 'pin' || !cluster) {
        const point = this.map.latLngToContainerPoint(latlng)
        if (!visible(point.x, point.y)) continue
        if (item.kind === 'pin') {
          pins.push({
            hit: { type: 'pin', id: item.id, title: item.title, color: item.color },
            x: point.x,
            y: point.y,
            radius: 14,
            found: false,
            marker: item,
          })
        } else {
          drawn.push(this.asMarker(item, point.x, point.y))
        }
        continue
      }
      const projected = this.map.project(latlng, zoom)
      const key = `${Math.floor(projected.x / cell)}:${Math.floor(projected.y / cell)}`
      const group = groups.get(key)
      const entry = { item, px: projected.x, py: projected.y }
      if (group) group.push(entry)
      else groups.set(key, [entry])
    }

    for (const group of groups.values()) {
      if (group.length === 1) {
        const only = group[0]
        const point = this.map.latLngToContainerPoint(this.map.unproject([only.px, only.py], zoom))
        if (!visible(point.x, point.y)) continue
        drawn.push(this.asMarker(only.item, point.x, point.y))
        continue
      }
      const px = group.reduce((sum, entry) => sum + entry.px, 0) / group.length
      const py = group.reduce((sum, entry) => sum + entry.py, 0) / group.length
      const latlng = this.map.unproject([px, py], zoom)
      const point = this.map.latLngToContainerPoint(latlng)
      if (!visible(point.x, point.y)) continue
      const colors = new Set(group.map((entry) => entry.item.color))
      const color = colors.size === 1 ? group[0].item.color : '#e4b341'
      const count = group.length
      const firstIcon = group[0].item.icon
      const icon = firstIcon && group.every((entry) => entry.item.icon?.x === firstIcon.x && entry.item.icon?.y === firstIcon.y) ? firstIcon : undefined
      drawn.push({
        hit: {
          type: 'cluster',
          count,
          title: clusterTitle?.(count) ?? `${count} locations`,
          color,
          lat: latlng.lat,
          lng: latlng.lng,
          ids: group.map((entry) => entry.item.id),
        },
        x: point.x,
        y: point.y,
        radius: icon ? 16 : 16 + Math.min(8, Math.log2(count) * 2),
        found: group.every((entry) => entry.item.found),
        icon,
      })
    }

    return [...drawn, ...pins]
  }

  private asMarker(item: DrawMarker, x: number, y: number): Drawn {
    return {
      hit: { type: item.kind, id: item.id, title: item.title, color: item.color, icon: item.icon },
      x,
      y,
      radius: item.icon ? 16 : 12,
      found: item.found,
      marker: item,
      icon: item.icon,
    }
  }

  private ensureAtlas(url?: string) {
    if (!url || this.atlasUrl === url) return
    this.atlasUrl = url
    this.atlas = null
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      if (this.atlasUrl !== url) return
      this.atlas = image
      this.redraw()
    }
    image.src = url
  }

  private drawSprite(ctx: CanvasRenderingContext2D, item: Drawn) {
    const sprite = item.icon
    const image = this.atlas
    if (!sprite || !image?.complete || image.naturalWidth === 0) return false
    const size = sprite.w / 2
    ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, item.x - size / 2, item.y - size / 2, size, size)
    if (item.hit.type !== 'cluster') return true
    ctx.globalAlpha = 1
    ctx.font = '700 10px Rajdhani, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const badgeX = item.x + size * 0.34
    const badgeY = item.y - size * 0.34
    ctx.beginPath()
    ctx.arc(badgeX, badgeY, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#14110a'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#f3efe6'
    ctx.stroke()
    ctx.fillStyle = '#f3efe6'
    ctx.fillText(String(item.hit.count), badgeX, badgeY + 0.5)
    return true
  }

  private paint(ctx: CanvasRenderingContext2D, item: Drawn, selectedId: string | null, accent: string) {
    const selected =
      (item.hit.type !== 'cluster' && item.hit.id === selectedId) ||
      (item.hit.type === 'cluster' && selectedId != null && item.hit.ids.includes(selectedId))
    ctx.save()
    ctx.globalAlpha = item.found ? 0.38 : 1
    if (item.marker?.kind === 'pin') {
      ctx.beginPath()
      ctx.moveTo(item.x, item.y - 12)
      ctx.lineTo(item.x + 8, item.y)
      ctx.lineTo(item.x, item.y + 12)
      ctx.lineTo(item.x - 8, item.y)
      ctx.closePath()
      ctx.fillStyle = item.marker.color
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#07080c'
      ctx.stroke()
    } else if (item.hit.type === 'cluster' && !this.drawSprite(ctx, item)) {
      ctx.beginPath()
      ctx.arc(item.x, item.y, item.radius - 2, 0, Math.PI * 2)
      ctx.fillStyle = item.hit.color
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#07080c'
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.fillStyle = '#14110a'
      ctx.font = '700 12px Rajdhani, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(item.hit.count), item.x, item.y + 0.5)
    } else if (item.marker && !this.drawSprite(ctx, item)) {
      ctx.beginPath()
      ctx.arc(item.x, item.y, item.found ? 5 : 6.5, 0, Math.PI * 2)
      ctx.fillStyle = item.marker.color
      ctx.fill()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = 'rgba(0,0,0,0.7)'
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(item.x, item.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
    }
    ctx.restore()
    if (!selected) return
    ctx.beginPath()
    ctx.arc(item.x, item.y, item.radius + 3, 0, Math.PI * 2)
    ctx.strokeStyle = accent
    ctx.lineWidth = 2
    ctx.stroke()
  }
}
