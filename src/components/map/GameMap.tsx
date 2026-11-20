'use client'

import { createLeafletContext, LeafletContext, type LeafletContextInterface } from '@react-leaflet/core'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { CustomPinTool } from '@/components/map/CustomPinTool'
import { MarkerGlyph } from '@/components/map/MarkerGlyph'
import { useMarkerHover } from '@/components/map/hover'
import { MapController } from '@/components/map/MapController'
import { SIDEBAR_WIDTH, type MapApi } from '@/components/map/mapApi'
import { HeatmapLayer } from '@/components/map/HeatmapLayer'
import { MarkerLayer } from '@/components/map/MarkerLayer'
import { RouteLayer } from '@/components/map/RouteLayer'
import { TileLayerManager } from '@/components/map/TileLayerManager'
import { getStyle } from '@/config/games/defineGame'
import { atlasCorners, gameToLatLng } from '@/lib/projection'
import { useI18n } from '@/i18n/provider'
import { useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'
import 'leaflet/dist/leaflet.css'

function HoverLabel() {
  const hover = useMarkerHover()
  if (!hover) return null
  return (
    <div
      className="pointer-events-none absolute z-20 flex max-w-64 -translate-x-1/2 -translate-y-full items-center gap-1.5 border border-white/15 bg-black/85 px-2 py-1 text-xs text-[#f3efe6]"
      style={{ left: hover.x, top: hover.y - 12 }}
    >
      {hover.icon ? <MarkerGlyph sprite={hover.icon} size={16} /> : <span className="mr-2 inline-block size-2 translate-y-px rounded-full" style={{ background: hover.color }} />}
      {hover.title}
    </div>
  )
}

export function GameMap({
  game,
  styleId,
  sidebarOpen,
  onReady,
}: {
  game: GameConfig
  styleId: string
  sidebarOpen: boolean
  onReady: (api: MapApi | null) => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [context, setContext] = useState<LeafletContextInterface | null>(null)
  const ocean = getStyle(game, styleId).palette.oceanDeep
  const { t } = useI18n()

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const projection = game.projection ?? 'simple'
    const map = L.map(host, {
      crs: projection === 'geographic' ? L.CRS.EPSG3857 : L.CRS.Simple,
      minZoom: game.minZoom,
      maxZoom: game.maxZoom,
      zoomControl: false,
      attributionControl: false,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      inertia: true,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      maxBoundsViscosity: 0.85,
      wheelPxPerZoomLevel: 80,
    })
    const bounds = L.latLngBounds(atlasCorners(game.bounds, projection))
    map.setMaxBounds(bounds.pad(1.25))
    let framed = false
    const limitZoomOut = () => {
      const size = map.getSize()
      if (size.x < 80 || size.y < 80) return
      const northEast = map.project(bounds.getNorthEast(), 0)
      const southWest = map.project(bounds.getSouthWest(), 0)
      const width = Math.abs(northEast.x - southWest.x)
      const height = Math.abs(northEast.y - southWest.y)
      if (!width || !height) return
      const scale = Math.min(size.x / width, size.y / height)
      const fit = map.getScaleZoom(scale, 0)
      const floor = Math.min(game.maxZoom, Math.max(game.minZoom, fit))
      map.setMinZoom(floor)
      if (map.getZoom() < floor) map.setZoom(floor)
    }
    const frameMap = () => {
      map.invalidateSize({ animate: false, pan: false })
      limitZoomOut()
      if (map.getSize().y < 80 || framed) return
      framed = true
      const params = new URLSearchParams(window.location.search)
      const x = Number(params.get('x'))
      const y = Number(params.get('y'))
      const z = Number(params.get('z'))
      if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z) && z > 0) {
        const inside = x >= game.bounds.minX && x <= game.bounds.maxX && y >= game.bounds.minY && y <= game.bounds.maxY
        if (inside) {
          map.setView(gameToLatLng(x, y, game.bounds, projection), z, { animate: false })
          return
        }
      }
      const pad = window.innerWidth >= 1024 ? SIDEBAR_WIDTH + 16 : 24
      map.fitBounds(bounds, {
        paddingTopLeft: L.point(pad, 24),
        paddingBottomRight: L.point(24, 78),
        animate: false,
      })
    }
    frameMap()
    const observer = new ResizeObserver(() => frameMap())
    observer.observe(host)

    const applyPin = () => {
      const pin = new URLSearchParams(window.location.search).get('pin')
      if (!pin) return
      const pins = useMapStore.getState().byGame[game.slug]?.customPins ?? []
      if (game.markers.some((marker) => marker.id === pin) || pins.some((item) => item.id === pin)) {
        useMapStore.getState().select(game.slug, pin)
      }
    }
    applyPin()
    const unsubHydration = useMapStore.persist.onFinishHydration(applyPin)
    host.setAttribute('role', 'application')
    host.setAttribute('aria-label', t.map.mapLabel)
    setContext(createLeafletContext(map))
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      unsubHydration()
      map.remove()
      setContext(null)
    }
  }, [game, t.map.mapLabel])

  return (
    <div className="absolute inset-0 z-0" style={{ background: ocean }}>
      <div ref={hostRef} className="h-full w-full" />
      <HoverLabel />
      {game.atlas === 'cayo' ? (
        <div className="pointer-events-none absolute bottom-4 right-16 z-10 max-w-56 border border-teal-200/30 bg-black/75 px-3 py-2 text-xs leading-5 text-teal-100">
          {t.map.cayoNote}
        </div>
      ) : null}
      {context ? (
        <LeafletContext.Provider value={context}>
          <TileLayerManager game={game} styleId={styleId} />
          <MarkerLayer game={game} />
          <HeatmapLayer game={game} />
          <RouteLayer game={game} />
          <CustomPinTool game={game} />
          <MapController game={game} sidebarOpen={sidebarOpen} onReady={onReady} />
        </LeafletContext.Provider>
      ) : null}
    </div>
  )
}
