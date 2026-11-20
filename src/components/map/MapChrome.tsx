'use client'

import { Maximize2, Minus, Plus } from 'lucide-react'
import { Hint } from '@/components/ui/switch'
import { useMapApi } from '@/components/map/mapApi'
import { getStyle } from '@/config/games/defineGame'
import { useI18n } from '@/i18n/provider'
import { useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function MapChrome({ game, sidebarOpen }: { game: GameConfig; sidebarOpen: boolean }) {
  const api = useMapApi()
  const styleId = useMapStore((state) => state.byGame[game.slug]?.mapStyle ?? game.styles[0].id)
  const active = getStyle(game, styleId)
  const contribute = useMapStore((state) => state.contributeMode)
  const detailOpen = useMapStore((state) => state.selected?.game === game.slug)
  const { t } = useI18n()
  const styleName = (id: string, fallback: string) => (id === 'atlas' ? t.map.atlas : id === 'satellite' ? t.map.satellite : id === 'grid' ? t.map.grid : id === 'road' ? t.map.road : id === 'day' ? t.map.day : id === 'night' ? t.map.night : fallback)

  return (
    <>
      <div className={`absolute top-3 z-20 flex flex-col items-end gap-2 ${detailOpen ? 'right-3 lg:right-[408px]' : 'right-3'} ${sidebarOpen ? 'max-lg:hidden' : ''}`}>
        <div className="flex border border-white/10 bg-black/75 shadow-lg backdrop-blur-sm" role="group" aria-label={t.map.style}>
          {game.styles.map((style) => (
            <button
              key={style.id}
              type="button"
              aria-pressed={style.id === active.id}
              className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${style.id === active.id ? 'bg-[var(--game-accent)] text-[#14110a]' : 'text-[#f3efe6] hover:bg-white/10'}`}
              onClick={() => useMapStore.getState().setMapStyle(game.slug, style.id)}
            >
              {styleName(style.id, style.name)}
            </button>
          ))}
        </div>
      </div>

      {contribute ? (
        <div className="pointer-events-none absolute left-1/2 top-16 z-20 -translate-x-1/2 border border-[var(--game-accent)] bg-black/80 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--game-accent)]">
          {t.map.contribute}
        </div>
      ) : null}

      {!sidebarOpen ? (
        <div className="pointer-events-none absolute left-16 top-3 z-20 border border-white/10 bg-black/70 px-3 py-2">
          <div className="font-display text-lg leading-none tracking-[0.18em]">{game.shortTitle}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#a39c90]">{game.region}</div>
        </div>
      ) : null}

      <div className={`absolute bottom-24 right-3 z-20 flex flex-col gap-1 ${detailOpen ? 'lg:right-[408px]' : ''}`}>
        <Hint label={t.map.zoomIn}>
          <button type="button" aria-label={t.map.zoomIn} className="grid size-11 place-items-center border border-white/15 bg-black/75 hover:border-[var(--game-accent)]" onClick={() => api?.zoomIn()}>
            <Plus className="size-4" />
          </button>
        </Hint>
        <Hint label={t.map.zoomOut}>
          <button type="button" aria-label={t.map.zoomOut} className="grid size-11 place-items-center border border-white/15 bg-black/75 hover:border-[var(--game-accent)]" onClick={() => api?.zoomOut()}>
            <Minus className="size-4" />
          </button>
        </Hint>
        <Hint label={t.map.fit}>
          <button type="button" aria-label={t.map.fit} className="grid size-11 place-items-center border border-white/15 bg-black/75 hover:border-[var(--game-accent)]" onClick={() => api?.fit()}>
            <Maximize2 className="size-4" />
          </button>
        </Hint>
      </div>
    </>
  )
}
