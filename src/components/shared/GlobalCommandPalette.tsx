'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Fuse from 'fuse.js'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { vehicleClass, weaponClass } from '@/i18n/catalog'
import { markerTitle } from '@/i18n/markerText'
import { itemLabel } from '@/i18n/nav'
import { useI18n } from '@/i18n/provider'
import { dollars } from '@/lib/money'
import { useCompanionStore } from '@/store/useCompanionStore'
import { modulesFor } from '@/components/layout/modules'
import { isCategoryVisible } from '@/lib/mapMode'
import type { MapMode, MapRegion } from '@/store/slice'

type Hit = {
  key: string
  title: string
  subtitle: string
  kind: 'marker' | 'checklist' | 'vehicle' | 'weapon' | 'heist' | 'page'
  href: string
  x?: number
  y?: number
  id?: string
  alias?: string
}

export function GlobalCommandPalette({ gameSlug }: { gameSlug: string }) {
  const open = useCompanionStore((state) => state.searchOpen)
  const { t, locale } = useI18n()
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const router = useRouter()
  const pathname = usePathname()
  const slice = useCompanionStore((state) => state.byGame[gameSlug])
  const mode: MapMode = slice?.mapMode === 'online' ? 'online' : 'story'
  const region: MapRegion = slice?.mapRegion === 'cayo' ? 'cayo' : 'los-santos'
  const view = useMemo(() => ({ mode, region }), [mode, region])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    setQuery('')
    setActive(0)
  }

  const docs = useMemo<Hit[]>(() => {
    if (!game || !data) return []
    const pages = modulesFor(game.slug).map((item) => ({
      key: `page-${item.href}`,
      title: itemLabel(item.href, t),
      subtitle: t.kinds.page,
      kind: 'page' as const,
      href: `/${game.slug}${item.href}`,
    }))
    return [
      ...pages,
      ...game.markers
        .filter((marker) => isCategoryVisible(marker.category, view))
        .map((marker) => ({
        key: marker.id,
        title: markerTitle(locale, marker.title),
        alias: marker.title,
        subtitle: t.kinds.pin,
        kind: 'marker' as const,
        href: `/${game.slug}/map?x=${marker.x}&y=${marker.y}&z=5&pin=${marker.id}&region=${view.region}&mode=${view.mode}`,
        x: marker.x,
        y: marker.y,
        id: marker.id,
      })),
      ...(view.mode === 'story' && view.region === 'los-santos' ? data.checklist : []).map((item) => ({
        key: item.id,
        title: item.title,
        subtitle: t.kinds.checklist,
        kind: 'checklist' as const,
        href: item.markerId ? `/${game.slug}/map?pin=${item.markerId}&region=${view.region}&mode=${view.mode}` : `/${game.slug}/checklist`,
        id: item.markerId,
        x: game.markers.find((marker) => marker.id === item.markerId)?.x,
        y: game.markers.find((marker) => marker.id === item.markerId)?.y,
      })),
      ...(modulesFor(game.slug).some(item => item.href === '/database') ? data.vehicles : []).map((vehicle) => ({
        key: vehicle.id,
        title: vehicle.name,
        subtitle: `${vehicleClass(locale, vehicle.class)} · ${dollars(vehicle.price, locale)}`,
        kind: 'vehicle' as const,
        href: `/${game.slug}/database?kind=vehicle&id=${vehicle.id}`,
      })),
      ...(modulesFor(game.slug).some(item => item.href === '/database') ? data.weapons : []).map((weapon) => ({
        key: weapon.id,
        title: weapon.name,
        subtitle: weaponClass(locale, weapon.class),
        kind: 'weapon' as const,
        href: `/${game.slug}/database?kind=weapon&id=${weapon.id}`,
      })),
      ...data.heists.map((heist) => ({
        key: heist.id,
        title: heist.name,
        subtitle: t.kinds.calculator,
        kind: 'heist' as const,
        href: `/${game.slug}/calculators?heist=${heist.id}`,
      })),
    ]
  }, [data, game, locale, t, view])

  const results = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) return docs.filter((doc) => doc.kind === 'page' || doc.kind === 'marker').slice(0, 8)
    return new Fuse(docs, { keys: ['title', 'alias', 'subtitle'], threshold: 0.38, ignoreLocation: true }).search(trimmed, { limit: 20 }).map((result) => result.item)
  }, [docs, query])

  const choose = (index: number) => {
    const hit = results[index]
    if (!hit || !game) return
    useCompanionStore.getState().setSearchOpen(false)
    if (hit.kind === 'marker' && hit.id != null && hit.x != null && hit.y != null && pathname?.endsWith('/map')) {
      useCompanionStore.getState().requestFocus({ game: game.slug, id: hit.id, x: hit.x, y: hit.y, zoom: 5 })
      return
    }
    router.push(hit.href)
  }

  return (
    <DialogRoot open={open} onOpenChange={(next) => useCompanionStore.getState().setSearchOpen(next)}>
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
        <DialogTitle className="sr-only">{t.searchLabel}</DialogTitle>
        <DialogDescription className="sr-only">{t.searchCompanion}</DialogDescription>
        <div className="flex items-center gap-2 border-b border-white/10 px-3">
          <Search className="size-4 text-[#a39c90]" />
          <Input
            autoFocus
            value={query}
            aria-label={t.searchLabel}
            placeholder={t.searchCompanion}
            className="h-12 border-0 bg-transparent px-0"
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
          />
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? <li className="px-4 py-6 text-sm text-[#a39c90]">{t.noMatches}</li> : null}
          {results.map((hit, index) => (
            <li key={hit.key}>
              <button type="button" className={cn('flex w-full items-center justify-between gap-3 px-4 py-2 text-left', index === active && 'bg-white/10')} onMouseEnter={() => setActive(index)} onClick={() => choose(index)}>
                <span className="min-w-0 truncate text-sm">{hit.title}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#a39c90]">{hit.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </DialogRoot>
  )
}
