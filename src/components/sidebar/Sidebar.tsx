'use client'

import { useMemo } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { FavoritePoints } from '@/components/sidebar/FavoritePoints'
import { CategoryTree } from '@/components/sidebar/CategoryTree'
import { HeatmapPanel } from '@/components/sidebar/HeatmapPanel'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { countFound } from '@/lib/categories'
import { markersInView } from '@/lib/mapMode'
import type { MapMode, MapRegion } from '@/store/slice'
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
  const done = countFound(modeMarkers, found)
  const percent = modeMarkers.length ? (done / modeMarkers.length) * 100 : 0
  const { t } = useI18n()
  const resetOpen = useMapStore((state) => state.resetOpen)

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
          <Switch id="hide-found" label={t.map.hideFound} checked={slice?.hideFound ?? false} onCheckedChange={(value) => useMapStore.getState().setHideFound(game.slug, value)} />
        </div>
        <div>
          <FavoritePoints game={game} onNavigate={() => { if (window.innerWidth < 1024) onOpenChange(false) }} />
          <CategoryTree game={game} />
          {game.slug === 'gta6' ? <HeatmapPanel /> : null}
          <div className="border-t border-white/10 p-4">
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
