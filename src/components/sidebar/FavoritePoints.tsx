'use client'
import { Star } from 'lucide-react'
import { useMemo } from 'react'
import { useI18n } from '@/i18n/provider'
import { markerTitle } from '@/i18n/markerText'
import { CAYO_BOUNDS, markerMode } from '@/lib/mapMode'
import { useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function FavoritePoints({ game, onNavigate }: { game: GameConfig; onNavigate: () => void }) {
  const { t, locale } = useI18n()
  const slice = useMapStore(state => state.byGame[game.slug])
  const markers = useMemo(() => new Map(game.markers.map(marker => [marker.id, marker])), [game.markers])
  const favorites = slice?.favorites ?? []
  return <details className="border-b border-white/10 px-3 py-3">
    <summary className="cursor-pointer text-xs font-semibold text-[#d9d3c8]"><span className="ml-1 inline-flex items-center gap-2"><Star className="size-4 text-amber-300" />{t.map.favorites}<span className="font-mono text-[10px] text-[#8d877c]">{favorites.length}</span></span></summary>
    {favorites.length ? <ul className="mt-2 max-h-60 space-y-1 overflow-y-auto" aria-label={t.map.favorites}>
      {favorites.map(id => {
        const marker = markers.get(id)
        const pin = slice?.customPins.find(item => item.id === id)
        const point = marker ?? pin
        const title = marker ? markerTitle(locale, marker.title) : pin?.title ?? (locale === 'tr' ? 'Konum artık katalogda yok' : 'Location no longer in catalog')
        const customInCayo = pin && pin.x >= CAYO_BOUNDS.minX && pin.x <= CAYO_BOUNDS.maxX && pin.y >= CAYO_BOUNDS.minY && pin.y <= CAYO_BOUNDS.maxY
        const region = marker?.category.startsWith('cayo-') || customInCayo ? 'cayo' : 'los-santos'
        const mode = region === 'cayo' ? 'online' : marker ? markerMode(marker.category) : slice?.mapMode ?? 'story'
        const zoom = game.projection === 'geographic' ? 15 : 5
        const href = point ? `/${game.slug}/map?${new URLSearchParams({ pin: id, x: String(point.x), y: String(point.y), z: String(zoom), ...(game.slug === 'gta5' ? { region, mode } : {}) })}` : ''
        return <li key={id} className="flex items-center gap-1 rounded-md bg-white/[0.04]">
          {point ? <a href={href} onClick={event => {
            if (game.slug !== 'gta5' || region === (slice?.mapRegion ?? 'los-santos')) {
              event.preventDefault()
              if (game.slug === 'gta5') useMapStore.getState().setMapMode(game.slug, mode)
              useMapStore.getState().requestFocus({ game: game.slug, id, x: point.x, y: point.y, zoom })
            }
            onNavigate()
          }} className="min-w-0 flex-1 truncate px-2 py-2 text-sm text-[#d9d3c8] hover:text-white" title={title}>{title}</a> : <span className="min-w-0 flex-1 px-2 py-2 text-xs text-[#8d877c]">{title}</span>}
          <button type="button" aria-label={`${t.map.unfavorite}: ${title}`} title={t.map.unfavorite} className="grid size-9 shrink-0 place-items-center rounded text-amber-300 hover:bg-white/10" onClick={() => useMapStore.getState().toggleFavorite(game.slug, id)}><Star className="size-4 fill-current" /></button>
        </li>
      })}
    </ul> : <p className="mt-2 text-xs leading-5 text-[#8d877c]">{t.map.noFavorites} {locale === 'tr' ? 'Bir konumu açıp Favori düğmesine dokun.' : 'Open a location and select Favorite.'}</p>}
  </details>
}
