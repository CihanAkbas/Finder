'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getGame } from '@/config/games'
import { formatRemaining } from '@/lib/resets'
import { SAFES, safeProgress, withSafeDefaults, type SafeDef } from '@/lib/safes'
import { normalizeSlice, type SafeTrack } from '@/store/slice'
import { safeCopy } from '@/i18n/catalog'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'

function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}

export function SafeBoard({ gameSlug, compact = false }: { gameSlug: string; compact?: boolean }) {
  const game = getGame(gameSlug)
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const now = useNow()
  const { t } = useI18n()
  if (!game || game.slug !== 'gta5') return null
  const slice = normalizeSlice(raw)

  return (
    <section id={compact ? undefined : 'safes'} className={compact ? 'border border-white/10 bg-[#12141A] p-4' : 'space-y-3'}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-2xl">{t.safes.title}</h2>
        {compact ? (
          <Link href={`/${game.slug}/economy#safes`} className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
            {t.safes.open}
          </Link>
        ) : null}
      </div>
      <p className={compact ? 'mt-1 text-xs text-[#a39c90]' : 'text-sm text-[#a39c90]'}>
        {compact ? t.safes.compact : t.safes.full}
      </p>
      <div className={compact ? 'mt-3 space-y-3' : 'grid gap-3 lg:grid-cols-2'}>
        {SAFES.map((def) => (
          <SafeCard key={def.id} def={def} track={withSafeDefaults(slice.safes[def.id])} now={now} gameSlug={game.slug} compact={compact} />
        ))}
      </div>
    </section>
  )
}

function SafeCard({ def, track, now, gameSlug, compact }: { def: SafeDef; track: SafeTrack; now: number; gameSlug: string; compact: boolean }) {
  const setSafe = useCompanionStore((state) => state.setSafe)
  const { t, locale, money } = useI18n()
  const copy = safeCopy(locale, def.id, def.name, def.note)
  const progress = safeProgress(def, track, now)
  const percent = progress.cap > 0 ? Math.min(100, (progress.amount / progress.cap) * 100) : 0
  const [draft, setDraft] = useState('')

  function commit(amount: number) {
    setSafe(gameSlug, def.id, {
      anchorAt: new Date().toISOString(),
      anchorAmount: Math.min(progress.cap, Math.max(0, Math.round(amount))),
      popularity: track.popularity,
      contracts: track.contracts,
      wallSafe: track.wallSafe,
      peak: track.peak,
      machines: track.machines,
    })
  }

  return (
    <article className={compact ? '' : 'border border-white/10 bg-[#12141A] p-4'}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{copy.name}</h3>
        <p className="font-mono text-sm" suppressHydrationWarning>
          {progress.tracking ? `${money(progress.amount)} / ${money(progress.cap)}` : money(progress.cap)}
        </p>
      </div>
      <div className="mt-2 h-2 bg-white/10" aria-hidden>
        <div className="h-full bg-[#10B981]" style={{ width: `${progress.tracking ? percent : 0}%` }} />
      </div>
      <p className="mt-2 text-xs text-[#a39c90]" suppressHydrationWarning>
        {t.safes.rate(money(progress.perDay))}
        {progress.tracking
          ? progress.amount >= progress.cap
            ? ` ${t.safes.fullStatus}`
            : progress.fullAt
              ? t.safes.next(formatRemaining(progress.nextAt ?? progress.fullAt, now), formatRemaining(progress.fullAt, now), progress.daysLeft)
              : t.safes.noMore
          : t.safes.notTracking}
      </p>
      {compact ? null : (
        <>
          <p className="mt-2 text-xs leading-5 text-[#a39c90]">{copy.note}</p>
          <SafeControls def={def} track={track} gameSlug={gameSlug} />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="h-8 bg-[#10B981] px-3 text-xs font-semibold uppercase text-[#04140e]" onClick={() => commit(0)}>
              {t.safes.emptied}
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric"
              placeholder={t.safes.cashPlaceholder}
              aria-label={t.safes.cashLabel(copy.name)}
              className="h-8 w-40 border border-white/15 bg-black/40 px-2 text-sm"
            />
            <button
              type="button"
              className="h-8 border border-white/15 px-3 text-xs uppercase disabled:opacity-40"
              disabled={!draft}
              onClick={() => {
                commit(Number(draft))
                setDraft('')
              }}
            >
              {t.safes.setCash}
            </button>
            {progress.tracking ? (
              <button type="button" className="h-8 px-2 text-xs uppercase text-[#fb7185]" onClick={() => setSafe(gameSlug, def.id, { anchorAt: null, anchorAmount: 0 })}>
                {t.safes.stop}
              </button>
            ) : null}
          </div>
        </>
      )}
    </article>
  )
}

function SafeControls({ def, track, gameSlug }: { def: SafeDef; track: SafeTrack; gameSlug: string }) {
  const setSafe = useCompanionStore((state) => state.setSafe)
  const { t } = useI18n()
  if (def.control === 'nightclub') {
    const popularity = track.popularity ?? 100
    return (
      <label className="mt-3 block text-xs text-[#a39c90]">
        {t.safes.popularity(popularity)}
        <input
          type="range"
          min={0}
          max={100}
          value={popularity}
          aria-label={t.safes.popularityLabel}
          className="mt-1 block w-full"
          onChange={(event) => setSafe(gameSlug, def.id, { popularity: Number(event.target.value) })}
        />
      </label>
    )
  }
  if (def.control === 'agency') {
    const contracts = track.contracts ?? 201
    return (
      <label className="mt-3 block text-xs text-[#a39c90]">
        {t.safes.contracts}
        <input
          type="number"
          min={0}
          max={201}
          value={contracts}
          aria-label={t.safes.contractsLabel}
          className="mt-1 block h-8 w-28 border border-white/15 bg-black/40 px-2 text-sm text-[#f3efe6]"
          onChange={(event) => {
            const value = Number(event.target.value)
            if (!Number.isFinite(value)) return
            setSafe(gameSlug, def.id, { contracts: Math.min(201, Math.max(0, Math.round(value))) })
          }}
        />
      </label>
    )
  }
  if (def.control === 'salvage') {
    return (
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#d9d3c8]">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={track.wallSafe ?? true} onChange={(event) => setSafe(gameSlug, def.id, { wallSafe: event.target.checked })} />
          {t.safes.wall}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={track.peak ?? true} onChange={(event) => setSafe(gameSlug, def.id, { peak: event.target.checked })} />
          {t.safes.peak}
        </label>
      </div>
    )
  }
  if (def.control === 'arcade') {
    return (
      <label className="mt-3 flex items-center gap-2 text-xs text-[#d9d3c8]">
        <input type="checkbox" checked={track.machines ?? true} onChange={(event) => setSafe(gameSlug, def.id, { machines: event.target.checked })} />
        {t.safes.machines}
      </label>
    )
  }
  return null
}
