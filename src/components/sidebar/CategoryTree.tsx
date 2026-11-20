'use client'

import { Check, ChevronDown, ChevronRight, Eye, EyeOff, LocateFixed } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryIcon } from '@/components/icons'
import { MarkerGlyph } from '@/components/map/MarkerGlyph'
import { gta6CategoryIcons } from '@/config/games/gta6/markerIcons'
import { useMapApi } from '@/components/map/mapApi'
import { Progress } from '@/components/ui/form'
import { countFound, leafIds, markersFor } from '@/lib/categories'
import { localizeCategories } from '@/i18n/categories'
import { markerTitle } from '@/i18n/markerText'
import { useI18n } from '@/i18n/provider'
import { categoriesInView, mapViewFromSlice } from '@/lib/mapMode'
import { cn } from '@/lib/utils'
import { useMapStore } from '@/store/useMapStore'
import type { CategoryNode, GameConfig, GameMarker } from '@/types/game'

function visibilityOf(ids: string[], hidden: Set<string>) {
  const hiddenCount = ids.filter((id) => hidden.has(id)).length
  if (hiddenCount === 0) return 'shown'
  if (hiddenCount === ids.length) return 'hidden'
  return 'mixed'
}

export function CategoryTree({ game }: { game: GameConfig }) {
  const slice = useMapStore((state) => state.byGame[game.slug])
  const selectedId = useMapStore((state) => (state.selected?.game === game.slug ? state.selected.id : null))
  const api = useMapApi()
  const hidden = useMemo(() => new Set(slice?.hiddenCategories ?? []), [slice?.hiddenCategories])
  const found = useMemo(() => new Set(slice?.found ?? []), [slice?.found])
  const view = mapViewFromSlice(slice)
  const { t, locale } = useI18n()
  const categories = useMemo(() => localizeCategories(categoriesInView(game.categories, view), locale), [game.categories, view, locale])
  const [openGroups, setOpenGroups] = useState<string[]>(() => game.categories.map((category) => category.id))
  const [openLeaves, setOpenLeaves] = useState<string[]>([])

  const focus = (markers: GameMarker[]) => {
    if (!api || markers.length === 0) return
    const xs = markers.map((marker) => marker.x)
    const ys = markers.map((marker) => marker.y)
    api.flyTo((Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, markers.length > 12 ? 3 : 5)
  }

  const renderLeaf = (node: CategoryNode) => {
    const markers = markersFor(game.markers, node)
    const done = countFound(markers, found)
    const open = openLeaves.includes(node.id)
    const visibility = visibilityOf([node.id], hidden)
    const sprite = gta6CategoryIcons[node.id]
    return (
      <div key={node.id} className="border-t border-white/5">
        <div className="flex items-center gap-1 py-2 pl-2">
          <button
            type="button"
            className="grid size-8 place-items-center text-[#a39c90]"
            aria-expanded={open}
            aria-label={`${open ? t.map.collapse : t.map.expand} ${node.name}`}
            onClick={() => setOpenLeaves((current) => (current.includes(node.id) ? current.filter((id) => id !== node.id) : [...current, node.id]))}
          >
            {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
          {sprite ? <MarkerGlyph sprite={sprite} size={22} /> : <span className="size-2.5 shrink-0 rounded-full" style={{ background: node.color }} />}
          <button type="button" className="min-w-0 flex-1 truncate text-left text-sm" onClick={() => focus(markers)}>
            {node.name}
          </button>
          <span className="font-mono text-[11px] text-[#a39c90]">
            {done}/{markers.length}
          </span>
          <button
            type="button"
            className="grid size-8 place-items-center"
            aria-label={visibility === 'hidden' ? `${t.map.show} ${node.name}` : `${t.map.hide} ${node.name}`}
            onClick={() => useMapStore.getState().toggleLeaves(game.slug, [node.id], visibility === 'hidden')}
          >
            {visibility === 'hidden' ? <EyeOff className="size-4 text-[#6f695f]" /> : <Eye className={cn('size-4', visibility === 'mixed' && 'opacity-50')} />}
          </button>
        </div>
        <div className="px-3 pb-2">
          <Progress value={markers.length ? (done / markers.length) * 100 : 0} label={`${node.name} ${t.map.pinsFound}`} />
          {node.worldTotal && node.worldTotal > markers.length ? (
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[#7d776e]">{t.map.atlasCount(node.worldTotal, markers.length)}</p>
          ) : null}
        </div>
        {open ? (
          <div className="max-h-64 overflow-y-auto pb-2">
            {markers.length === 0 ? <p className="px-11 py-1 text-xs text-[#7d776e]">{t.map.emptySet}</p> : null}
            {markers.map((marker) => {
              const isFound = found.has(marker.id)
              return (
                <button
                  key={marker.id}
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-2 px-11 py-1.5 text-left text-sm hover:bg-white/5',
                    selectedId === marker.id && 'bg-white/10',
                    isFound && 'text-[#8d877c]',
                  )}
                  onClick={() => {
                    useMapStore.getState().select(game.slug, marker.id)
                    api?.flyTo(marker.x, marker.y, 5)
                  }}
                >
                  {sprite ? <MarkerGlyph sprite={sprite} size={16} /> : <span className="size-1.5 shrink-0 rounded-full" style={{ background: node.color }} />}
                  <span className="min-w-0 flex-1 truncate">{markerTitle(locale, marker.title)}</span>
                  {isFound ? <Check className="size-3.5 text-emerald-300" /> : null}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div>
      {categories.length === 0 ? <p className="px-4 py-6 text-sm text-[#a39c90]">{t.map.noLayers}</p> : null}
      {categories.map((group) => {
        const ids = leafIds(group)
        const markers = markersFor(game.markers, group)
        const done = countFound(markers, found)
        const open = openGroups.includes(group.id)
        const visibility = visibilityOf(ids, hidden)
        return (
          <section key={group.id} className="border-b border-white/10">
            <div className="flex items-center gap-2 px-3 py-3">
              <button
                type="button"
                className="grid size-8 place-items-center"
                aria-expanded={open}
                aria-label={`${open ? t.map.collapse : t.map.expand} ${group.name}`}
                onClick={() => setOpenGroups((current) => (current.includes(group.id) ? current.filter((id) => id !== group.id) : [...current, group.id]))}
              >
                {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </button>
              <CategoryIcon name={group.icon} className="size-4" style={{ color: group.color }} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg leading-none tracking-wide">{group.name}</div>
                <div className="mt-1 font-mono text-[11px] text-[#a39c90]">
                  {done}/{markers.length}
                </div>
              </div>
              <button
                type="button"
                aria-label={visibility === 'hidden' ? `${t.map.show} ${group.name}` : `${t.map.hide} ${group.name}`}
                className="grid size-8 place-items-center"
                onClick={() => useMapStore.getState().toggleLeaves(game.slug, ids, visibility === 'hidden')}
              >
                {visibility === 'hidden' ? <EyeOff className="size-4 text-[#6f695f]" /> : <Eye className={cn('size-4', visibility === 'mixed' && 'opacity-40')} />}
              </button>
              <button type="button" aria-label={`${t.map.fit} ${group.name}`} className="grid size-8 place-items-center" onClick={() => focus(markers)}>
                <LocateFixed className="size-4" />
              </button>
            </div>
            <div className="px-4 pb-2">
              <Progress value={markers.length ? (done / markers.length) * 100 : 0} label={`${group.name} ${t.map.pinsFound}`} />
            </div>
            {open ? <div className="pb-2">{(group.children ?? [group]).map(renderLeaf)}</div> : null}
          </section>
        )
      })}
    </div>
  )
}

