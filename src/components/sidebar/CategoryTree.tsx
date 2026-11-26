'use client'

import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryIcon } from '@/components/icons'
import { MarkerGlyph } from '@/components/map/MarkerGlyph'
import { gta6CategoryIcons } from '@/config/games/gta6/markerIcons'
import { useMapApi } from '@/components/map/mapApi'
import { GTA6_NOISE_LAYERS, GTA6_PLAYER_VIEWS, hiddenCategoryIds, playerViewHidden } from '@/config/games/gta6/playLayers'
import { leafIds, markersFor } from '@/lib/categories'
import { localizeCategories } from '@/i18n/categories'
import { markerTitle } from '@/i18n/markerText'
import { useI18n } from '@/i18n/provider'
import { categoriesInView, mapViewFromSlice } from '@/lib/mapMode'
import { cn } from '@/lib/utils'
import { useMapStore } from '@/store/useMapStore'
import type { CategoryNode, GameConfig, GameMarker } from '@/types/game'

function chipsOf(group: CategoryNode): CategoryNode[] {
  if (!group.children?.length) return [group]
  return group.children.flatMap((child) => (child.children?.length ? chipsOf(child) : [child]))
}

export function CategoryTree({ game }: { game: GameConfig }) {
  const slice = useMapStore((state) => state.byGame[game.slug])
  const selectedId = useMapStore((state) => (state.selected?.game === game.slug ? state.selected.id : null))
  const api = useMapApi()
  const hidden = useMemo(() => new Set(hiddenCategoryIds(game.slug, slice)), [game.slug, slice])
  const found = useMemo(() => new Set(slice?.found ?? []), [slice?.found])
  const view = mapViewFromSlice(slice)
  const { t, locale } = useI18n()
  const categories = useMemo(() => localizeCategories(categoriesInView(game.categories, view), locale), [game.categories, view, locale])
  const [openLeaf, setOpenLeaf] = useState<string | null>(null)
  const allLeaves = categories.flatMap(chipsOf)
  const total = allLeaves.reduce((sum, leaf) => sum + markersFor(game.markers, leaf).length, 0)
  const shown = allLeaves.reduce((sum, leaf) => sum + (hidden.has(leaf.id) ? 0 : markersFor(game.markers, leaf).length), 0)

  const setGroup = (ids: string[], show: boolean) => {
    const next = new Set(hidden)
    for (const id of ids) {
      if (show) next.delete(id)
      else next.add(id)
    }
    useMapStore.getState().setHidden(game.slug, [...next])
  }

  const zoomFor = (spread: boolean) => (game.projection === 'geographic' ? Math.min(game.maxZoom, spread ? 12 : 15) : spread ? 3 : 5)

  const focus = (markers: GameMarker[]) => {
    if (!api || markers.length === 0) return
    const xs = markers.map((marker) => marker.x)
    const ys = markers.map((marker) => marker.y)
    api.flyTo((Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, zoomFor(markers.length > 12))
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2">
        <p className="text-[11px] text-[#a39c90]">{t.map.pinsShown(shown, total)}</p>
        <div className="flex gap-3 text-[11px] font-semibold text-[#f3efe6]">
          {game.slug === 'gta6' ? (
            <button type="button" className="hover:text-[var(--game-accent)]" onClick={() => useMapStore.getState().setHidden(game.slug, [...GTA6_NOISE_LAYERS])}>
              {t.map.playView}
            </button>
          ) : null}
          <button type="button" className="hover:text-[var(--game-accent)]" onClick={() => setGroup(allLeaves.map((leaf) => leaf.id), true)}>
            {t.map.showAll}
          </button>
          <button type="button" className="hover:text-[var(--game-accent)]" onClick={() => setGroup(allLeaves.map((leaf) => leaf.id), false)}>
            {t.map.hideAll}
          </button>
        </div>
      </div>
      {game.slug === 'gta6' ? (
        <div className="space-y-2 px-3 pb-3">
          <p className="text-[11px] leading-4 text-[#8d877c]">{t.map.playHint}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {GTA6_PLAYER_VIEWS.map((preset) => {
              const ids = playerViewHidden(preset.id)
              const active = hidden.size === ids.length && ids.every((id) => hidden.has(id))
              return (
                <button key={preset.id} type="button" aria-pressed={active}
                  className={cn('min-h-9 rounded-md border px-2 text-xs font-semibold', active ? 'border-[var(--game-accent)] bg-white/10 text-white' : 'border-white/15 text-[#a39c90] hover:bg-white/5')}
                  onClick={() => useMapStore.getState().setHidden(game.slug, ids)}>
                  {preset.title[locale]}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
      {categories.length === 0 ? <p className="px-4 py-6 text-sm text-[#a39c90]">{t.map.noLayers}</p> : null}
      {categories.map((group) => {
        const chips = chipsOf(group)
        const ids = leafIds(group)
        const groupHidden = ids.length > 0 && ids.every((id) => hidden.has(id))
        const openNode = chips.find((node) => node.id === openLeaf)
        const openMarkers = openNode ? markersFor(game.markers, openNode) : []
        return (
          <section key={group.id} className="border-t border-white/10 px-2 py-2">
            <div className="flex items-center justify-between gap-2 px-1 pb-1.5">
              <h3 className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8d877c]">{group.name}</h3>
              <button type="button" className="shrink-0 text-[11px] font-semibold text-[#d9d3c8] hover:text-white" onClick={() => setGroup(ids, groupHidden)}>
                {groupHidden ? t.map.show : t.map.hide}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {chips.map((node) => {
                const markers = markersFor(game.markers, node)
                const off = hidden.has(node.id)
                const sprite = gta6CategoryIcons[node.id]
                const open = openLeaf === node.id
                return (
                  <div key={node.id} className="flex min-w-0 items-center rounded-md bg-white/[0.04]">
                    <button
                      type="button"
                      aria-pressed={!off}
                      className={cn('flex min-w-0 flex-1 items-center gap-1.5 px-1.5 py-1.5 text-left hover:bg-white/10', off && 'opacity-35')}
                      onClick={() => useMapStore.getState().toggleLeaves(game.slug, [node.id], off)}
                    >
                      {sprite ? (
                        <MarkerGlyph sprite={sprite} size={18} />
                      ) : (
                        <CategoryIcon name={node.icon} className="size-4 shrink-0" style={{ color: node.color }} />
                      )}
                      <span className="min-w-0 flex-1 truncate text-xs">{node.name}</span>
                    </button>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-label={`${open ? t.map.collapse : t.map.expand} ${node.name}`}
                      className={cn('px-1.5 py-1.5 font-mono text-[10px] text-[#8d877c] hover:text-white', open && 'text-[var(--game-accent)]')}
                      onClick={() => setOpenLeaf(open ? null : node.id)}
                    >
                      {markers.length}
                    </button>
                  </div>
                )
              })}
            </div>
            {openNode ? (
              <div className="mt-1 max-h-48 overflow-y-auto rounded-md border border-white/10 bg-black/40">
                <button type="button" className="w-full px-2 py-1 text-left text-[10px] uppercase tracking-wider text-[#a39c90]" onClick={() => focus(openMarkers)}>
                  {t.checklist.showOnMap}
                </button>
                {openMarkers.map((marker) => {
                      const place = marker.tags?.[1]
                  return (
                    <button
                      key={marker.id}
                      type="button"
                      className={cn('flex w-full items-center gap-2 px-2 py-1 text-left text-xs hover:bg-white/5', selectedId === marker.id && 'bg-white/10', found.has(marker.id) && 'text-[#8d877c]')}
                      onClick={() => {
                        useMapStore.getState().requestFocus({ game: game.slug, id: marker.id, x: marker.x, y: marker.y, zoom: zoomFor(false) })
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate">{markerTitle(locale, marker.title)}</span>
                      {place ? <span className="max-w-[46%] truncate text-[10px] text-[#8d877c]">{place}</span> : null}
                      {found.has(marker.id) ? <Check className="size-3 shrink-0 text-emerald-300" /> : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
