'use client'

import { useMemo, useState } from 'react'
import { Download, Menu, Search, Upload, X } from 'lucide-react'
import { CategoryTree } from '@/components/sidebar/CategoryTree'
import { HeatmapPanel } from '@/components/sidebar/HeatmapPanel'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { backupPayload } from '@/lib/backup'
import { countFound, leafCategories } from '@/lib/categories'
import { categoriesInView, markersInView } from '@/lib/mapMode'
import type { MapMode, MapRegion } from '@/store/slice'
import { downloadJson } from '@/lib/utils'
import { markerTitle } from '@/i18n/markerText'
import { useI18n } from '@/i18n/provider'
import { useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function Sidebar({
  game,
  open,
  onOpenChange,
}: {
  game: GameConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const slice = useMapStore((state) => state.byGame[game.slug])
  const found = useMemo(() => new Set(slice?.found ?? []), [slice?.found])
  const mode: MapMode = slice?.mapMode === 'online' ? 'online' : 'story'
  const region: MapRegion = slice?.mapRegion === 'cayo' ? 'cayo' : 'los-santos'
  const view = useMemo(() => ({ mode, region }), [mode, region])
  const modeMarkers = useMemo(() => markersInView(game.markers, view), [game.markers, view])
  const modeLeaves = useMemo(
    () => leafCategories(categoriesInView(game.categories, view)).map((category) => category.id),
    [game.categories, view],
  )
  const done = countFound(modeMarkers, found)
  const percent = modeMarkers.length ? (done / modeMarkers.length) * 100 : 0
  const contribute = useMapStore((state) => state.contributeMode)
  const { t, locale } = useI18n()
  const resetOpen = useMapStore((state) => state.resetOpen)
  const [viewName, setViewName] = useState('')
  const titleFor = (id: string) => {
    const marker = game.markers.find((item) => item.id === id)
    if (marker) return markerTitle(locale, marker.title)
    return slice?.customPins.find((pin) => pin.id === id)?.title ?? id
  }

  return (
    <>
      <button
        type="button"
        className={`absolute top-3 z-50 grid size-11 place-items-center border border-white/15 bg-black/80 text-[#f3efe6] ${open ? 'left-[min(92vw,392px)] max-lg:left-auto max-lg:right-3' : 'left-3'}`}
        aria-expanded={open}
        aria-label={open ? t.nav.collapseSidebar : t.nav.sidebar}
        onClick={() => onOpenChange(!open)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? <button type="button" className="absolute inset-0 z-30 bg-black/50 lg:hidden" aria-label={t.nav.closeMenu} onClick={() => onOpenChange(false)} /> : null}
      <aside
        className={`absolute inset-y-0 left-0 z-40 flex w-[min(92vw,380px)] flex-col overflow-y-auto overscroll-contain border-r border-[color:var(--game-accent)]/25 bg-[#0c0e13] shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="shrink-0 space-y-3 border-b border-white/10 p-4 pr-14 max-sm:space-y-2 max-sm:p-3 max-sm:pr-12">
          <div>
            <p className="font-display text-xs tracking-[0.42em] text-[var(--game-accent)]">FINDER</p>
            <h1 className="mt-1 font-display text-4xl leading-none tracking-wide">{game.shortTitle}</h1>
            <p className="mt-1 text-sm text-[#a39c90] max-sm:hidden">{game.subtitle}</p>
          </div>
          {game.status === 'preview' ? (
            <p className="border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">
              {t.launch.preview}
            </p>
          ) : null}
          <button
            type="button"
            className="flex h-11 w-full items-center gap-2 border border-white/10 bg-black/40 px-3 text-left text-sm text-[#a39c90]"
            onClick={() => useMapStore.getState().setSearchOpen(true)}
          >
            <Search className="size-4" />
            <span className="flex-1">{t.map.searchMarkers}</span>
            <kbd className="border border-white/10 px-1.5 text-[10px]">/</kbd>
          </button>
          {game.slug === 'gta5' ? (
            <div className="grid grid-cols-2 gap-1 bg-black/40 p-1" role="tablist" aria-label={t.map.region}>
              {(
                [
                  ['los-santos', 'Los Santos'],
                  ['cayo', 'Cayo Perico'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={view.region === id}
                  className={`h-9 text-xs font-semibold uppercase tracking-[0.12em] ${view.region === id ? 'bg-[#2dd4bf] text-[#04211c]' : 'text-[#a39c90] hover:bg-white/5'}`}
                  onClick={() => useMapStore.getState().setMapRegion(game.slug, id)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          {game.slug === 'gta5' && view.region === 'los-santos' ? (
            <div className="grid grid-cols-2 gap-1 bg-black/40 p-1" role="tablist" aria-label={t.map.mode}>
              {(
                [
                  ['story', t.map.story],
                  ['online', t.map.online],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={view.mode === id}
                  className={`h-9 text-xs font-semibold uppercase tracking-[0.12em] ${view.mode === id ? 'bg-[#10B981] text-[#04140e]' : 'text-[#a39c90] hover:bg-white/5'}`}
                  onClick={() => useMapStore.getState().setMapMode(game.slug, id)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          <div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#a39c90]">
                  {view.region === 'cayo' ? 'Cayo Perico' : view.mode === 'story' ? t.map.story : t.map.online}
                </div>
                <div className="font-mono text-xs text-[#d9d3c8]">
                  {done}/{modeMarkers.length} {t.map.pinsFound}
                </div>
              </div>
              <div className="font-display text-4xl leading-none">
                {Math.round(percent)}
                <span className="text-lg">%</span>
              </div>
            </div>
            <div className="mt-2">
              <Progress value={percent} label={view.region === 'cayo' ? `Cayo Perico ${t.map.pinsFound}` : view.mode === 'story' ? `${t.map.story} ${t.map.pinsFound}` : `${t.map.online} ${t.map.pinsFound}`} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const hidden = new Set(slice?.hiddenCategories ?? [])
                for (const id of modeLeaves) hidden.delete(id)
                useMapStore.getState().setHidden(game.slug, [...hidden])
              }}
            >
              {t.map.showAll}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const hidden = new Set(slice?.hiddenCategories ?? [])
                for (const id of modeLeaves) hidden.add(id)
                useMapStore.getState().setHidden(game.slug, [...hidden])
              }}
            >
              {t.map.hideAll}
            </Button>
          </div>
          <Switch id="hide-found" label={t.map.hideFound} checked={slice?.hideFound ?? false} onCheckedChange={(value) => useMapStore.getState().setHideFound(game.slug, value)} />
        </div>
        <div>
          <CategoryTree game={game} />
          {game.slug === 'gta6' ? <HeatmapPanel /> : null}
          <details className="border-t border-white/10 px-4 py-3">
          <summary className="cursor-pointer text-xs uppercase tracking-[0.14em] text-[#a39c90]">{t.map.personal}</summary>
          <div className="mt-3 space-y-3">
            <p className="text-xs leading-5 text-[#8d877c]">{t.map.keys}</p>
            <div>
              <p className="text-xs font-semibold">{t.map.favorites}</p>
              {(slice?.favorites.length ?? 0) === 0 ? <p className="text-xs text-[#8d877c]">{t.map.noFavorites}</p> : null}
              <ul className="mt-1 space-y-1">
                {(slice?.favorites ?? []).map((id) => (
                  <li key={id}>
                    <button type="button" className="text-left text-sm text-[#d9d3c8] hover:text-white" onClick={() => useMapStore.getState().select(game.slug, id)}>
                      {titleFor(id)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                useMapStore.getState().saveFilter(game.slug, viewName)
                setViewName('')
              }}
            >
              <input
                value={viewName}
                onChange={(event) => setViewName(event.target.value)}
                placeholder={t.map.viewName}
                aria-label={t.map.viewName}
                maxLength={40}
                className="h-8 min-w-0 flex-1 border border-white/15 bg-black/40 px-2 text-xs"
              />
              <button type="submit" className="h-8 border border-white/15 px-2 text-[10px] uppercase" disabled={!viewName.trim()}>
                {t.map.saveView}
              </button>
            </form>
            <ul className="space-y-1">
              {(slice?.savedFilters ?? []).map((filter) => (
                <li key={filter.id} className="flex items-center justify-between gap-2 text-sm">
                  <button type="button" className="truncate text-left" aria-label={`${t.map.applyView} ${filter.name}`} onClick={() => useMapStore.getState().applyFilter(game.slug, filter.id)}>
                    {filter.name}
                  </button>
                  <button type="button" className="text-[10px] uppercase text-[#fb7185]" aria-label={`${t.map.deleteView} ${filter.name}`} onClick={() => useMapStore.getState().deleteFilter(game.slug, filter.id)}>
                    {t.remove}
                  </button>
                </li>
              ))}
            </ul>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{t.map.route}</p>
                {(slice?.route.length ?? 0) > 0 ? (
                  <button type="button" className="text-[10px] uppercase text-[#a39c90]" onClick={() => useMapStore.getState().clearRoute(game.slug)}>
                    {t.map.clearRoute}
                  </button>
                ) : null}
              </div>
              <p className="text-xs leading-5 text-[#8d877c]">{t.map.routeNote}</p>
              {(slice?.route.length ?? 0) === 0 ? <p className="text-xs text-[#8d877c]">{t.map.noRoute}</p> : null}
              <ol className="mt-1 space-y-1">
                {(slice?.route ?? []).map((id, index) => (
                  <li key={id} className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-xs text-[#10B981]">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{titleFor(id)}</span>
                    <button type="button" className="text-[10px] uppercase" aria-label={t.map.moveEarlier} disabled={index === 0} onClick={() => useMapStore.getState().moveRouteStop(game.slug, id, -1)}>↑</button>
                    <button type="button" className="text-[10px] uppercase" aria-label={t.map.moveLater} disabled={index === (slice?.route.length ?? 1) - 1} onClick={() => useMapStore.getState().moveRouteStop(game.slug, id, 1)}>↓</button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          </details>
          <div className="space-y-3 border-t border-white/10 p-4">
          <Switch
            id="contribute-mode"
            label={t.map.contributeMode}
            checked={contribute}
            onCheckedChange={(value) => useMapStore.getState().setContributeMode(value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadJson(`finder-${game.slug}-progress.json`, backupPayload(useMapStore.getState().byGame))
                useMapStore.getState().showToast(t.backupDownloaded)
              }}
            >
              <Download className="size-3.5" />
              {t.export}
            </Button>
            <Button variant="outline" size="sm" onClick={() => useMapStore.getState().setImportOpen(true)}>
              <Upload className="size-3.5" />
              {t.import}
            </Button>
          </div>
          <button type="button" className="text-xs text-[#8d877c] underline-offset-2 hover:underline" onClick={() => useMapStore.getState().setResetOpen(true)}>
            {t.map.resetProgress(game.shortTitle)}
          </button>
          </div>
        </div>
      </aside>

      <DialogRoot open={resetOpen} onOpenChange={(next) => useMapStore.getState().setResetOpen(next)}>
        <DialogContent>
          <DialogTitle className="font-display pr-8 text-2xl">{t.map.resetTitle(game.region)}</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-[#a39c90]">
            {t.map.resetBody(game.shortTitle)}
          </DialogDescription>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => useMapStore.getState().setResetOpen(false)}>
              {t.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                useMapStore.getState().resetGame(game.slug)
                useMapStore.getState().setResetOpen(false)
                useMapStore.getState().showToast(t.map.resetDone(game.shortTitle))
              }}
            >
              {t.reset}
            </Button>
          </div>
        </DialogContent>
      </DialogRoot>
    </>
  )
}
