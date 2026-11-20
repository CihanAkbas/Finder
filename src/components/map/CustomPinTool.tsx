'use client'

import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import { getMarkerIndex } from '@/components/map/canvasMarkers'
import { suppressNextMapClick } from '@/components/map/hover'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/form'
import { useI18n } from '@/i18n/provider'
import { latLngToGame } from '@/lib/projection'
import { roundCoord } from '@/lib/utils'
import { PIN_COLORS, useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function CustomPinTool({ game }: { game: GameConfig }) {
  const map = useMap()

  useEffect(() => {
    let pressTimer = 0
    let lastLongPress = 0
    const container = map.getContainer()

    const onContext = (event: LeafletMouseEvent) => {
      event.originalEvent.preventDefault()
      if (Date.now() - lastLongPress < 800) return
      const hit = getMarkerIndex(map)?.hitTest(event.containerPoint.x, event.containerPoint.y)
      if (hit && hit.type !== 'cluster') return
      const point = latLngToGame(event.latlng.lat, event.latlng.lng, game.bounds, game.projection)
      useMapStore.getState().openPinDraft(game.slug, point.x, point.y)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return
      const startX = event.clientX
      const startY = event.clientY
      const latlng = map.mouseEventToLatLng(event)
      window.clearTimeout(pressTimer)
      pressTimer = window.setTimeout(() => {
        lastLongPress = Date.now()
        const hit = getMarkerIndex(map)?.hitTest(
          event.clientX - container.getBoundingClientRect().left,
          event.clientY - container.getBoundingClientRect().top,
        )
        if (hit && hit.type !== 'cluster') return
        suppressNextMapClick()
        const point = latLngToGame(latlng.lat, latlng.lng, game.bounds, game.projection)
        useMapStore.getState().openPinDraft(game.slug, point.x, point.y)
      }, 560)
      const onMove = (moveEvent: PointerEvent) => {
        if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 14) window.clearTimeout(pressTimer)
      }
      const onUp = () => {
        window.clearTimeout(pressTimer)
        container.removeEventListener('pointermove', onMove)
        container.removeEventListener('pointerup', onUp)
        container.removeEventListener('pointercancel', onUp)
      }
      container.addEventListener('pointermove', onMove)
      container.addEventListener('pointerup', onUp)
      container.addEventListener('pointercancel', onUp)
    }

    map.on('contextmenu', onContext)
    container.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(pressTimer)
      map.off('contextmenu', onContext)
      container.removeEventListener('pointerdown', onPointerDown)
    }
  }, [game, map])

  return null
}

export function CustomPinDialog({ game }: { game: GameConfig }) {
  const { t } = useI18n()
  const draft = useMapStore((state) => state.pinDraft)
  const open = draft?.game === game.slug
  const [title, setTitle] = useState(t.map.customPin)
  const [note, setNote] = useState('')
  const [color, setColor] = useState(PIN_COLORS[0])
  const draftKey = open && draft ? `${draft.x.toFixed(2)}:${draft.y.toFixed(2)}` : ''
  const [seenDraft, setSeenDraft] = useState(draftKey)
  if (seenDraft !== draftKey) {
    setSeenDraft(draftKey)
    setTitle(t.map.customPin)
    setNote('')
    setColor(PIN_COLORS[0])
  }

  return (
    <DialogRoot open={open} onOpenChange={(next) => { if (!next) useMapStore.getState().closePinDraft() }}>
      <DialogContent>
        <DialogTitle className="font-display pr-8 text-2xl tracking-wide">{t.map.dropPin}</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-[#a39c90]">
          {t.map.pinKeep}
        </DialogDescription>
        {draft ? (
          <p className="mt-3 font-mono text-xs text-[var(--game-accent)]">
            X {roundCoord(draft.x).toFixed(2)} · Y {roundCoord(draft.y).toFixed(2)}
          </p>
        ) : null}
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (!draft) return
            const id = `pin-${crypto.randomUUID()}`
            useMapStore.getState().addPin(game.slug, {
              id,
              title: title.trim() || t.map.customPin,
              note: note.trim(),
              color,
              x: roundCoord(draft.x),
              y: roundCoord(draft.y),
              createdAt: new Date().toISOString(),
            })
            useMapStore.getState().select(game.slug, id)
            useMapStore.getState().closePinDraft()
            useMapStore.getState().showToast(t.map.pinSaved)
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="pin-title">{t.map.pinTitle}</Label>
            <Input id="pin-title" value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pin-note">{t.map.pinNote}</Label>
            <Textarea id="pin-note" value={note} maxLength={2000} onChange={(event) => setNote(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.map.colorLabel}</Label>
            <div className="flex flex-wrap gap-2">
              {PIN_COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={t.map.color(swatch)}
                  aria-pressed={color === swatch}
                  className="size-8 border border-white/20"
                  style={{ background: swatch, outline: color === swatch ? '2px solid white' : undefined, outlineOffset: 2 }}
                  onClick={() => setColor(swatch)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => useMapStore.getState().closePinDraft()}>
              {t.cancel}
            </Button>
            <Button type="submit">{t.map.savePin}</Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
