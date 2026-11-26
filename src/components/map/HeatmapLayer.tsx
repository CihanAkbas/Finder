'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useHeatmapStore } from '@/components/map/heatmapStore'
import heatmaps from '@/config/games/gta6/heatmaps.json'
import type { HeatmapEntry } from '@/config/games/gta6/heatmaps'
import { loadHeatmapPoints } from '@/lib/heatmapTiles'
import { gameToLatLng } from '@/lib/projection'
import type { GameConfig } from '@/types/game'
import L from 'leaflet'

const catalog = heatmaps as HeatmapEntry[]

export function HeatmapLayer({ game }: { game: GameConfig }) {
  const map = useMap()
  const id = useHeatmapStore((state) => (game.slug === 'gta6' ? state.id : null))

  useEffect(() => {
    if (game.slug !== 'gta6' || id == null) return
    const entry = catalog.find((item) => item.id === id)
    if (!entry) return
    const controller = new AbortController()
    let remove = () => {}
    let cancelled = false

    void loadHeatmapPoints(entry, controller.signal)
      .then((points) => {
        if (cancelled) return
        useHeatmapStore.getState().setResult('ready', points.length)
        const canvas = document.createElement('canvas')
        canvas.style.pointerEvents = 'none'
        const draw = () => {
          const size = map.getSize()
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = Math.max(1, size.x) * dpr
          canvas.height = Math.max(1, size.y) * dpr
          canvas.style.width = `${size.x}px`
          canvas.style.height = `${size.y}px`
          L.DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]))
          const ctx = canvas.getContext('2d')
          if (!ctx) return
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, size.x, size.y)
          const radius = Math.max(3, map.getZoom() * 1.6)
          ctx.fillStyle = 'rgba(255, 56, 48, 0.32)'
          for (const [lng, lat] of points) {
            const projected = map.latLngToContainerPoint(gameToLatLng(lng, lat, game.bounds, game.projection))
            if (projected.x < -radius || projected.y < -radius || projected.x > size.x + radius || projected.y > size.y + radius) continue
            ctx.beginPath()
            ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        map.getPane('overlayPane')?.appendChild(canvas)
        map.on('move zoom viewreset', draw)
        draw()
        remove = () => {
          map.off('move zoom viewreset', draw)
          canvas.remove()
        }
      })
      .catch((error: unknown) => {
        if (cancelled || (error instanceof DOMException && error.name === 'AbortError')) return
        useHeatmapStore.getState().setResult('error', 0)
      })

    return () => {
      cancelled = true
      controller.abort()
      remove()
    }
  }, [game.bounds, game.projection, game.slug, id, map])

  return null
}
