'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { gameToLatLng } from '@/lib/projection'
import { useCompanionStore } from '@/store/useCompanionStore'
import type { GameConfig } from '@/types/game'
import L from 'leaflet'

/** Dashed straight segments between stops the player picked. Not a driving route. */
export function RouteLayer({ game }: { game: GameConfig }) {
  const map = useMap()
  const route = useCompanionStore((state) => state.byGame[game.slug]?.route)
  const pins = useCompanionStore((state) => state.byGame[game.slug]?.customPins)

  useEffect(() => {
    const stops = route ?? []
    const points = stops.flatMap((id) => {
      const marker = game.markers.find((item) => item.id === id)
      const pin = pins?.find((item) => item.id === id)
      const point = marker ?? pin
      if (!point) return []
      return [gameToLatLng(point.x, point.y, game.bounds, game.projection)]
    })
    if (points.length < 2) return
    const line = L.polyline(points, {
      color: '#10B981',
      weight: 3,
      opacity: 0.9,
      dashArray: '7 6',
      interactive: false,
    }).addTo(map)
    return () => {
      map.removeLayer(line)
    }
  }, [game, map, pins, route])

  return null
}
