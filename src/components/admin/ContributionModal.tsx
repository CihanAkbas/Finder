'use client'

import { useMemo, useState } from 'react'
import { localizeCategories } from '@/i18n/categories'
import { useI18n } from '@/i18n/provider'
import { leafCategories } from '@/lib/categories'
import { copyText, roundCoord, slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { HudSelect } from '@/components/ui/hud-select'
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/form'
import { useMapStore } from '@/store/useMapStore'
import type { GameConfig } from '@/types/game'

export function ContributionModal({ game }: { game: GameConfig }) {
  const draft = useMapStore((state) => state.contributeDraft)
  const open = draft?.game === game.slug
  const { t, locale } = useI18n()
  const leaves = useMemo(() => leafCategories(localizeCategories(game.categories, locale)), [game, locale])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(leaves[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  const payload = useMemo(() => {
    if (!draft) return ''
    return JSON.stringify(
      {
        id: `${game.slug}-${slugify(title || 'marker')}`,
        title: title || t.map.untitled,
        category,
        x: roundCoord(draft.x),
        y: roundCoord(draft.y),
        description,
        image,
        videoUrl: '',
      },
      null,
      2,
    )
  }, [category, description, draft, game.slug, image, t.map.untitled, title])

  return (
    <DialogRoot
      open={open}
      onOpenChange={(next) => {
        if (!next) useMapStore.getState().closeContribute()
      }}
    >
      <DialogContent>
        <DialogTitle className="font-display pr-8 text-2xl tracking-wide">{t.map.suggest}</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-[#a39c90]">{t.map.suggestBody}</DialogDescription>
        {draft ? (
          <p className="mt-3 font-mono text-xs text-[var(--game-accent)]">
            X {roundCoord(draft.x).toFixed(2)} · Y {roundCoord(draft.y).toFixed(2)}
          </p>
        ) : null}
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="contrib-title">{t.map.pinTitle}</Label>
            <Input id="contrib-title" value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contrib-category">{t.map.category}</Label>
            <HudSelect
              label={t.map.contributionCategory}
              value={category}
              onChange={setCategory}
              options={leaves.map((leaf) => ({ value: leaf.id, label: leaf.name }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contrib-description">{t.map.description}</Label>
            <Textarea id="contrib-description" value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contrib-image">{t.map.screenshot}</Label>
            <Input id="contrib-image" value={image} placeholder="https://" onChange={(event) => setImage(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contrib-json">{t.map.markerJson}</Label>
            <Textarea id="contrib-json" readOnly value={payload} className="min-h-48 font-mono text-xs" />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                void copyText(payload).then(
                  () => useMapStore.getState().showToast(t.map.jsonCopied),
                  () => useMapStore.getState().showToast(t.map.jsonManual),
                )
              }}
            >
              {t.map.copyJson}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}
