'use client'

import { useMemo, useState } from 'react'
import { Copy, ExternalLink, Trash2 } from 'lucide-react'
import { CategoryIcon } from '@/components/icons'
import { MarkerGlyph } from '@/components/map/MarkerGlyph'
import { gta6Sprite } from '@/config/games/gta6/markerIcons'
import { Badge } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/form'
import { localizeCategory } from '@/i18n/categories'
import { markerDescription, markerTitle } from '@/i18n/markerText'
import { useI18n } from '@/i18n/provider'
import { categoryMap } from '@/lib/categories'
import { coordText, copyText, guideUrl } from '@/lib/utils'
import { PIN_COLORS, useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function MarkerDetailModal({ game }: { game: GameConfig }) {
  const { t, locale } = useI18n()
  const selected = useMapStore((state) => (state.selected?.game === game.slug ? state.selected : null))
  const slice = useMapStore((state) => state.byGame[game.slug])
  const categories = useMemo(() => categoryMap(game.categories), [game])
  const [confirmFor, setConfirmFor] = useState<string | null>(null)
  const confirmDelete = confirmFor != null && confirmFor === selected?.id

  if (!selected) return null
  const marker = game.markers.find((item) => item.id === selected.id)
  const pin = slice?.customPins.find((item) => item.id === selected.id)
  if (!marker && !pin) return null

  const category = marker ? localizeCategory(categories.get(marker.category), locale) : undefined
  const sprite = marker && game.slug === 'gta6' ? gta6Sprite(marker.category, marker.tags) : undefined
  const found = marker ? (slice?.found.includes(marker.id) ?? false) : false
  const pointId = marker?.id ?? pin?.id ?? ''
  const favorite = slice?.favorites.includes(pointId) ?? false
  const onRoute = slice?.route.includes(pointId) ?? false
  const title = marker ? markerTitle(locale, marker.title) : pin?.title ?? ''
  const description = marker ? markerDescription(locale, marker.description) : ''

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="marker-title"
      className="absolute z-30 flex flex-col border border-white/10 bg-[#0d1016]/95 shadow-2xl backdrop-blur-md max-lg:inset-x-0 max-lg:bottom-0 max-lg:max-h-[78dvh] max-lg:rounded-t-2xl lg:bottom-3 lg:right-3 lg:top-3 lg:w-[380px]"
    >
      <div className="relative h-36 shrink-0 overflow-hidden" style={{ background: `linear-gradient(160deg, ${category?.color ?? pin?.color ?? game.accent}55, #07080c 72%)` }}>
        {marker?.image ? (
          // User-supplied reference image. Empty until a contribution includes one.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={marker.image} alt="" className="h-full w-full object-cover" />
        ) : sprite ? (
          <span className="absolute right-4 top-4">
            <MarkerGlyph sprite={sprite} size={64} />
          </span>
        ) : (
          <CategoryIcon name={category?.icon ?? 'pin'} className="absolute right-4 top-4 size-16 opacity-30" />
        )}
        <button type="button" className="absolute right-3 top-3 border border-white/15 bg-black/60 px-2 py-1 text-xs" onClick={() => useMapStore.getState().clearSelection()}>
          {t.close}
        </button>
        <div className="absolute bottom-3 left-4 right-14">
          {category ? <Badge style={{ borderColor: category.color, color: category.color }}>{category.name}</Badge> : <Badge>{t.map.personalPin}</Badge>}
        </div>
      </div>
      <div key={selected.id} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <h2 id="marker-title" className="font-display text-3xl leading-none tracking-wide">
            {title}
          </h2>
          <p className="mt-2 font-mono text-xs text-[var(--game-accent)]">{coordText({ x: (marker ?? pin)!.x, y: (marker ?? pin)!.y, z: marker?.z })}</p>
        </div>
        {marker?.source ? (
          <p className={`text-xs uppercase tracking-[0.16em] ${marker.source === 'approximate' || marker.source === 'placeholder' ? 'text-amber-200' : 'text-[#a39c90]'}`}>
            {t.map.sources[marker.source]}
          </p>
        ) : null}
        {marker ? <p className="whitespace-pre-line text-sm leading-6 text-[#d9d3c8]">{description}</p> : null}
        {pin ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-pin-title">{t.map.pinTitle}</Label>
              <Input
                id="edit-pin-title"
                defaultValue={pin.title}
                maxLength={80}
                onBlur={(event) => useMapStore.getState().updatePin(game.slug, pin.id, { title: event.target.value.trim() || t.map.customPin })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-pin-note">{t.map.pinNote}</Label>
              <Textarea
                id="edit-pin-note"
                defaultValue={pin.note}
                maxLength={2000}
                onBlur={(event) => useMapStore.getState().updatePin(game.slug, pin.id, { note: event.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {PIN_COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={t.map.color(swatch)}
                  className="size-7 border border-white/20"
                  style={{ background: swatch, outline: pin.color === swatch ? '2px solid white' : undefined }}
                  onClick={() => useMapStore.getState().updatePin(game.slug, pin.id, { color: swatch })}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const point = marker ?? pin
              if (!point) return
              void copyText(coordText(point)).then(
                () => useMapStore.getState().showToast(t.map.coordsCopied),
                () => useMapStore.getState().showToast(t.map.coordsBlocked),
              )
            }}
          >
            <Copy className="size-3.5" />
            {t.map.copyCoords}
          </Button>
          {marker ? (
            <a
              className="inline-flex h-8 items-center gap-2 border border-white/15 px-3 text-xs font-semibold uppercase tracking-wider hover:bg-white/10"
              href={guideUrl(marker.title, game.title, marker.videoUrl)}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-3.5" />
              {t.map.guide}
            </a>
          ) : null}
        </div>
      </div>
      <div className="shrink-0 border-t border-white/10 p-4">
        {marker ? (
          <>
            <Button
              className="w-full"
              variant={found ? 'outline' : 'default'}
              size="lg"
              onClick={() => {
                useMapStore.getState().toggleFound(game.slug, marker.id)
                useMapStore.getState().showToast(found ? t.map.notFound : t.map.found)
              }}
            >
              {found ? t.map.foundUndo : t.map.markFound}
            </Button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="sm" aria-pressed={favorite} onClick={() => useMapStore.getState().toggleFavorite(game.slug, marker.id)}>
                {favorite ? t.map.unfavorite : t.map.favorite}
              </Button>
              <Button type="button" variant="outline" size="sm" aria-pressed={onRoute} onClick={() => useMapStore.getState().toggleRouteStop(game.slug, marker.id)}>
                {onRoute ? t.map.removeRoute : t.map.addRoute}
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-[0.16em] text-[#7d776e]">{t.map.markHint}</p>
          </>
        ) : pin ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="sm" aria-pressed={favorite} onClick={() => useMapStore.getState().toggleFavorite(game.slug, pin.id)}>
                {favorite ? t.map.unfavorite : t.map.favorite}
              </Button>
              <Button type="button" variant="outline" size="sm" aria-pressed={onRoute} onClick={() => useMapStore.getState().toggleRouteStop(game.slug, pin.id)}>
                {onRoute ? t.map.removeRoute : t.map.addRoute}
              </Button>
            </div>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              if (!confirmDelete) {
                setConfirmFor(pin.id)
                return
              }
              useMapStore.getState().removePin(game.slug, pin.id)
              useMapStore.getState().showToast(t.map.pinDeleted)
            }}
          >
            <Trash2 className="size-4" />
            {confirmDelete ? t.map.confirmDelete : t.map.deletePin}
          </Button>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
