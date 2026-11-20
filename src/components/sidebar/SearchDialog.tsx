'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useMapApi } from '@/components/map/mapApi'
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/form'
import { localizeCategory } from '@/i18n/categories'
import { markerTitle } from '@/i18n/markerText'
import { categoryMap } from '@/lib/categories'
import { buildSearchDocs, searchDocs } from '@/lib/search'
import { isCategoryVisible } from '@/lib/mapMode'
import type { MapMode, MapRegion } from '@/store/slice'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/provider'
import { EMPTY_PINS, useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function SearchDialog({ game }: { game: GameConfig }) {
  const open = useMapStore((state) => state.searchOpen)
  const { t, locale } = useI18n()
  const categories = useMemo(() => categoryMap(game.categories), [game])
  const pins = useMapStore((state) => state.byGame[game.slug]?.customPins ?? EMPTY_PINS)
  const slice = useMapStore((state) => state.byGame[game.slug])
  const mode: MapMode = slice?.mapMode === 'online' ? 'online' : 'story'
  const region: MapRegion = slice?.mapRegion === 'cayo' ? 'cayo' : 'los-santos'
  const view = useMemo(() => ({ mode, region }), [mode, region])
  const scoped = useMemo(
    () => ({ ...game, markers: game.markers.filter((marker) => isCategoryVisible(marker.category, view)) }),
    [game, view],
  )
  const api = useMapApi()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    setQuery('')
    setActive(0)
  }
  const docs = useMemo(() => buildSearchDocs(scoped, pins), [scoped, pins])
  const results = useMemo(() => searchDocs(docs, query), [docs, query])

  const choose = (index: number) => {
    const hit = results[index]
    if (!hit) return
    useMapStore.getState().select(game.slug, hit.id)
    useMapStore.getState().setSearchOpen(false)
    api?.flyTo(hit.x, hit.y, 5)
  }

  return (
    <DialogRoot open={open} onOpenChange={(next) => useMapStore.getState().setSearchOpen(next)}>
      <DialogContent
        className="max-w-xl p-0"
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActive((current) => Math.min(current + 1, Math.max(results.length - 1, 0)))
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActive((current) => Math.max(current - 1, 0))
          } else if (event.key === 'Enter') {
            event.preventDefault()
            choose(active)
          }
        }}
      >
        <DialogTitle className="sr-only">{t.searchRegion(game.region)}</DialogTitle>
        <DialogDescription className="sr-only">{t.searchMarkers}</DialogDescription>
        <div className="flex items-center gap-2 border-b border-white/10 px-3">
          <Search className="size-4 text-[#a39c90]" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            placeholder={t.searchRegion(game.region)}
            className="h-12 border-0 bg-transparent px-0 focus:border-0"
            aria-label={t.searchMarkers}
          />
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? <li className="px-4 py-6 text-sm text-[#a39c90]">{t.noMatches}</li> : null}
          {results.map((hit, index) => (
            <li key={hit.id}>
              <button
                type="button"
                className={cn('flex w-full items-center gap-3 px-4 py-2 text-left', index === active && 'bg-white/10')}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{hit.kind === 'marker' ? markerTitle(locale, hit.title) : hit.title}</span>
                  <span className="block text-[11px] uppercase tracking-wider text-[#a39c90]">
                    {hit.kind === 'pin' ? t.map.personalPin : localizeCategory(categories.get(hit.category), locale)?.name ?? hit.categoryLabel}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </DialogRoot>
  )
}
