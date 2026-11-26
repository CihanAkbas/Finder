'use client'

import { useEffect, useLayoutEffect, useMemo, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'next/navigation'
import { CoordinateHUD } from '@/components/map/CoordinateHUD'
import { CustomPinDialog } from '@/components/map/CustomPinTool'
import { GameMap } from '@/components/map/GameMap'
import { MapChrome } from '@/components/map/MapChrome'
import { MapApiContext, type MapApi } from '@/components/map/mapApi'
import { MarkerDetailModal } from '@/components/sidebar/MarkerDetailModal'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { TooltipProvider } from '@/components/ui/switch'
import { getGame } from '@/config/games'
import { viewGame } from '@/lib/mapMode'
import { useI18n } from '@/i18n/provider'
import { useMapStore } from '@/store/useMapStore'

export default function GameApp({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const params = useSearchParams()
  const savedRegion = useMapStore((state) => state.byGame[gameSlug]?.mapRegion)
  const urlRegion = params.get('region')
  const region = urlRegion === 'cayo' || urlRegion === 'los-santos' ? urlRegion : savedRegion === 'cayo' ? 'cayo' : 'los-santos'
  const view = useMemo(() => (game ? viewGame(game, region) : null), [game, region])
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const [api, setApi] = useState<MapApi | null>(null)
  const styleId = useMapStore((state) => (game ? state.byGame[game.slug]?.mapStyle ?? game.styles[0].id : 'atlas'))
  const { t } = useI18n()

  const urlMode = params.get('mode')
  useLayoutEffect(() => {
    if (urlRegion === 'los-santos' || urlRegion === 'cayo') useMapStore.getState().setMapRegion(gameSlug, urlRegion)
    if (urlMode === 'story' || urlMode === 'online') useMapStore.getState().setMapMode(gameSlug, urlMode)
  }, [gameSlug, urlMode, urlRegion])

  useEffect(() => {
    return useMapStore.subscribe((state, previous) => {
      if (!state.selected || state.selected === previous.selected) return
      if (window.innerWidth < 1024) setSidebarOpen(false)
    })
  }, [])

  useEffect(() => {
    if (!game) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)
      if (typing) return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') return
      if (event.key === '/') return
      const state = useMapStore.getState()
      if (event.key === 'Escape') {
        if (state.searchOpen) state.setSearchOpen(false)
        else if (state.pinDraft) state.closePinDraft()
        else if (state.resetOpen) state.setResetOpen(false)
        else if (state.selected) state.clearSelection()
        else setSidebarOpen(false)
        return
      }
      if (state.searchOpen || state.pinDraft || state.resetOpen) return
      if ((event.key === 'f' || event.key === 'F' || event.key === ' ') && !(target instanceof HTMLButtonElement)) {
        if (!state.selected || state.selected.game !== game.slug) return
        const marker = game.markers.find((entry) => entry.id === state.selected?.id)
        if (!marker) return
        event.preventDefault()
        const already = state.byGame[game.slug]?.found.includes(marker.id) ?? false
        state.toggleFound(game.slug, marker.id)
        state.showToast(already ? t.map.notFound : t.map.found)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [game, t])

  if (!game || !view) return null

  return (
    <TooltipProvider>
      <MapApiContext.Provider value={api}>
        <div className="relative h-full min-h-0 overflow-hidden text-[#f3efe6]" style={{ '--game-accent': game.accent } as CSSProperties}>
          <GameMap key={`${view.slug}-${view.atlas ?? 'los-santos'}`} game={view} styleId={styleId} sidebarOpen={sidebarOpen} onReady={setApi} />
          <MapChrome game={game} sidebarOpen={sidebarOpen} />
          <div className={`absolute bottom-4 z-20 ${sidebarOpen ? 'left-16 lg:left-[408px]' : 'left-16'}`}>
            <CoordinateHUD gameSlug={game.slug} />
          </div>
          <Sidebar game={game} open={sidebarOpen} onOpenChange={setSidebarOpen} />
          <MarkerDetailModal game={game} />
          <CustomPinDialog game={game} />
        </div>
      </MapApiContext.Provider>
    </TooltipProvider>
  )
}

