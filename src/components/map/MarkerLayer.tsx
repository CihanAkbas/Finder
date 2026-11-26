'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { markerTitle } from '@/i18n/markerText'
import { useI18n } from '@/i18n/provider'
import { categoryMap } from '@/lib/categories'
import { hiddenCategoryIds } from '@/config/games/gta6/playLayers'
import { isCategoryVisible, mapViewFromSlice } from '@/lib/mapMode'
import { useClock } from '@/lib/clock'
import { gunVanMarkerId } from '@/lib/gunVan'
import { dailyKey, dayOfYear } from '@/lib/resets'
import { CanvasMarkerLayer, type DrawMarker } from '@/components/map/canvasMarkers'
import { gta6Atlas, gta6Sprite } from '@/config/games/gta6/markerIcons'
import { useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function MarkerLayer({ game }: { game: GameConfig }) {
  const map = useMap()
  const slice = useMapStore((state) => state.byGame[game.slug])
  const selected = useMapStore((state) => (state.selected?.game === game.slug ? state.selected.id : null))
  const { locale, t } = useI18n()
  const now = useClock()
  const period = dailyKey(new Date(now), 6)
  const categories = useMemo(() => categoryMap(game.categories), [game])
  const items = useMemo<DrawMarker[]>(() => {
    const view = mapViewFromSlice(slice)
    const hidden = new Set(hiddenCategoryIds(game.slug, slice))
    const found = new Set(slice?.found ?? [])
    const todayVan = game.slug === 'gta5' ? gunVanMarkerId(dayOfYear(new Date(`${period}T12:00:00Z`), 6)) : undefined
    const next: DrawMarker[] = []
    for (const marker of game.markers) {
      if (!isCategoryVisible(marker.category, view)) continue
      if (hidden.has(marker.category) && marker.id !== selected) continue
      const isFound = found.has(marker.id)
      if (slice?.hideFound && isFound && marker.id !== selected) continue
      const today = marker.id === todayVan
      next.push({
        id: marker.id,
        kind: 'marker',
        x: marker.x,
        y: marker.y,
        title: today ? `${markerTitle(locale, marker.title)} · ${t.map.today}` : markerTitle(locale, marker.title),
        color: today ? '#F59E0B' : categories.get(marker.category)?.color ?? game.accent,
        found: isFound,
        icon: game.slug === 'gta6' ? gta6Sprite(marker.category) : undefined,
      })
    }
    for (const pin of slice?.customPins ?? []) {
      if (game.atlas === 'cayo' && (pin.x < game.bounds.minX || pin.x > game.bounds.maxX || pin.y < game.bounds.minY || pin.y > game.bounds.maxY)) continue
      next.push({
        id: pin.id,
        kind: 'pin',
        x: pin.x,
        y: pin.y,
        title: pin.title,
        color: pin.color,
        found: false,
      })
    }
    return next
  }, [categories, game, locale, period, selected, slice, t.map.today])

  const clusterTitle = t.map.locations
  const projection = game.projection ?? 'simple'
  const atlasUrl = game.slug === 'gta6' ? gta6Atlas.url : undefined
  const stateRef = useRef({ items, bounds: game.bounds, selectedId: selected, accent: game.accent, clusterTitle, projection, atlasUrl })
  const layerRef = useRef<CanvasMarkerLayer | null>(null)

  useEffect(() => {
    const layer = new CanvasMarkerLayer(map, () => stateRef.current)
    layerRef.current = layer
    layer.attach()
    return () => {
      layer.detach()
      layerRef.current = null
    }
  }, [map])

  useEffect(() => {
    stateRef.current = { items, bounds: game.bounds, selectedId: selected, accent: game.accent, clusterTitle, projection, atlasUrl }
    layerRef.current?.redraw()
  }, [atlasUrl, clusterTitle, game.accent, game.bounds, items, projection, selected])

  return null
}
