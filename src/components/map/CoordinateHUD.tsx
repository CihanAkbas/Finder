'use client'

import { Share2 } from 'lucide-react'
import { Hint } from '@/components/ui/switch'
import { useMapApi } from '@/components/map/mapApi'
import { applyMapSearch } from '@/lib/mapUrl'
import { copyText, formatCoord } from '@/lib/utils'
import { useI18n } from '@/i18n/provider'
import { useMapStore } from '@/store/useMapStore'

export function CoordinateHUD({ gameSlug }: { gameSlug: string }) {
  const pointer = useMapStore((state) => state.pointer)
  const camera = useMapStore((state) => state.camera)
  const api = useMapApi()
  const point = pointer ?? camera
  const { t } = useI18n()
  const mode = pointer ? t.map.cursor : t.map.center

  return (
    <div className="pointer-events-auto border border-[color:var(--game-accent)]/35 bg-black/75 px-3 py-2 font-mono text-[11px] leading-5 text-[#f3efe6] shadow-lg backdrop-blur-sm">
      <div className="mb-1 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-[var(--game-accent)]">
        <span>{mode}</span>
        <Hint label={t.map.copyLink}>
          <button
            type="button"
            className="grid size-7 place-items-center border border-white/15 text-[#f3efe6] hover:border-[var(--game-accent)]"
            aria-label={t.map.share}
            disabled={!api}
            onClick={() => {
              if (!api) return
              const view = api.getView()
              const url = new URL(window.location.href)
              applyMapSearch(url, gameSlug, view)
              const href = url.toString()
              window.history.replaceState(null, '', `${url.pathname}${url.search}`)
              void copyText(href).then(
                () => useMapStore.getState().showToast(t.map.linkCopied),
                () => useMapStore.getState().showToast(t.map.linkFailed),
              )
            }}
          >
            <Share2 className="size-3.5" />
          </button>
        </Hint>
      </div>
      <div>X {point ? formatCoord(point.x, 2) : '—'}</div>
      <div>Y {point ? formatCoord(point.y, 2) : '—'}</div>
      <div>ZOOM {camera ? formatCoord(camera.z, 2) : '—'}</div>
    </div>
  )
}
