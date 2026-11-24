'use client'

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { getMarkerIndex } from '@/components/map/canvasMarkers'
import { consumeSuppressedMapClick, setMarkerHover } from '@/components/map/hover'
import { SIDEBAR_WIDTH, type MapApi } from '@/components/map/mapApi'
import { applyMapSearch } from '@/lib/mapUrl'
import { atlasCorners, gameToLatLng, latLngToGame } from '@/lib/projection'
import { copyText, roundCoord } from '@/lib/utils'
import { useI18n } from '@/i18n/provider'
import { useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'
import L from 'leaflet'

export function MapController({
  game,
  sidebarOpen,
  onReady,
}: {
  game: GameConfig
  sidebarOpen: boolean
  onReady: (api: MapApi | null) => void
}) {
  const map = useMap()
  const { t } = useI18n()
  const sidebarReady = useRef(false)

  useEffect(() => {
    if (!sidebarReady.current) {
      sidebarReady.current = true
      return
    }
    if (window.innerWidth < 1024) return
    const shift = SIDEBAR_WIDTH / 2
    map.panBy(L.point(sidebarOpen ? -shift : shift, 0), { animate: false })
  }, [map, sidebarOpen])

  useEffect(() => {
    const sidebarRef = { current: sidebarOpen }
    sidebarRef.current = sidebarOpen
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const api: MapApi = {
      flyTo(x, y, zoom) {
        const close = game.projection === 'geographic' ? Math.min(game.maxZoom, 15) : 5
        const target = zoom == null ? Math.max(map.getZoom(), close) : game.projection === 'geographic' && zoom <= game.minZoom ? close : zoom
        map.setView(gameToLatLng(x, y, game.bounds, game.projection), target, {
          animate: !reduced(),
        })
      },
      zoomIn() {
        map.zoomIn()
      },
      zoomOut() {
        map.zoomOut()
      },
      fit() {
        const sidebar = sidebarRef.current && window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0
        const detail = useMapStore.getState().selected && window.innerWidth >= 1024 ? 380 : 0
        map.fitBounds(atlasCorners(game.bounds, game.projection), {
          paddingTopLeft: L.point(sidebar + 16, 64),
          paddingBottomRight: L.point(detail + 16, 24),
          animate: !reduced(),
        })
      },
      getView() {
        const center = map.getCenter()
        const point = latLngToGame(center.lat, center.lng, game.bounds, game.projection)
        return { x: point.x, y: point.y, z: map.getZoom() }
      },
    }
    onReady(api)
    return () => onReady(null)
  }, [game, map, onReady, sidebarOpen])

  useEffect(() => {
    const publishCamera = () => {
      const center = map.getCenter()
      const point = latLngToGame(center.lat, center.lng, game.bounds, game.projection)
      useMapStore.getState().setCamera({ x: point.x, y: point.y, z: map.getZoom() })
    }
    const writeUrl = () => {
      if (map.getSize().y < 80) return
      const view = {
        ...latLngToGame(map.getCenter().lat, map.getCenter().lng, game.bounds, game.projection),
        z: map.getZoom(),
      }
      const url = new URL(window.location.href)
      applyMapSearch(url, game.slug, view)
      window.history.replaceState(null, '', `${url.pathname}${url.search}`)
    }
    let urlTimer = 0
    const scheduleUrl = () => {
      window.clearTimeout(urlTimer)
      urlTimer = window.setTimeout(writeUrl, 160)
    }
    const onMove = () => {
      publishCamera()
    }
    const onClick = (event: L.LeafletMouseEvent) => {
      if (consumeSuppressedMapClick()) return
      const hit = getMarkerIndex(map)?.hitTest(event.containerPoint.x, event.containerPoint.y) ?? null
      if (hit?.type === 'cluster') {
        map.flyTo([hit.lat, hit.lng], Math.min(map.getZoom() + 1.75, map.getMaxZoom()))
        return
      }
      if (hit && (hit.type === 'marker' || hit.type === 'pin')) {
        useMapStore.getState().select(game.slug, hit.id)
        scheduleUrl()
        return
      }
      const point = latLngToGame(event.latlng.lat, event.latlng.lng, game.bounds, game.projection)
      const state = useMapStore.getState()
      if (state.contributeMode) {
        const payload = JSON.stringify({ x: roundCoord(point.x), y: roundCoord(point.y) })
        void copyText(payload).then(
          () => state.showToast(t.map.coordsCopied),
          () => state.showToast(t.map.coordsBlocked),
        )
        state.openContribute(game.slug, point.x, point.y)
        return
      }
      state.clearSelection()
    }
    const onPointer = (event: L.LeafletMouseEvent) => {
      const hit = getMarkerIndex(map)?.hitTest(event.containerPoint.x, event.containerPoint.y) ?? null
      const point = latLngToGame(event.latlng.lat, event.latlng.lng, game.bounds, game.projection)
      useMapStore.getState().setPointer(point)
      if (!hit) {
        setMarkerHover(null)
        map.getContainer().style.cursor = useMapStore.getState().contributeMode ? 'crosshair' : 'grab'
        return
      }
      setMarkerHover({
        id: hit.type === 'cluster' ? `cluster-${hit.lat}` : hit.id,
        title: hit.title,
        x: event.containerPoint.x,
        y: event.containerPoint.y,
        color: hit.color,
        icon: hit.type === 'cluster' ? undefined : hit.icon,
      })
      map.getContainer().style.cursor = 'pointer'
    }
    const onLeave = () => {
      useMapStore.getState().setPointer(null)
      setMarkerHover(null)
    }

    publishCamera()
    map.on('move', onMove)
    map.on('moveend', scheduleUrl)
    map.on('click', onClick)
    map.on('mousemove', onPointer)
    map.on('mouseout', onLeave)
    const unsub = useMapStore.subscribe((state, previous) => {
      const nextSlice = state.byGame[game.slug]
      const previousSlice = previous.byGame[game.slug]
      const viewChanged = nextSlice?.mapMode !== previousSlice?.mapMode || nextSlice?.mapRegion !== previousSlice?.mapRegion
      if (state.selected !== previous.selected || state.contributeMode !== previous.contributeMode || viewChanged) scheduleUrl()
      if (state.contributeMode !== previous.contributeMode && !state.contributeMode) {
        map.getContainer().style.cursor = 'grab'
      }
      const request = state.focusRequest
      if (request && request !== previous.focusRequest && request.game === game.slug) {
        const close = game.projection === 'geographic' ? Math.min(game.maxZoom, 15) : request.zoom
        const zoom = game.projection === 'geographic' && request.zoom <= game.minZoom ? close : request.zoom
        map.setView(gameToLatLng(request.x, request.y, game.bounds, game.projection), zoom, {
          animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        })
        scheduleUrl()
      }
    })
    return () => {
      window.clearTimeout(urlTimer)
      map.off('move', onMove)
      map.off('moveend', scheduleUrl)
      map.off('click', onClick)
      map.off('mousemove', onPointer)
      map.off('mouseout', onLeave)
      unsub()
    }
  }, [game, map, t])

  return null
}
