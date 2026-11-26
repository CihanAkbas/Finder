'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { ProgressRing } from '@/components/shared/ProgressRing'
import {
  collectProgress,
  goldMedalTally,
  isChecklistComplete,
  itemMedal,
  medalTracks,
  objectiveKey,
  trackMedal,
  weightedCompletion,
} from '@/lib/checklist'
import { GTA6_CHAPTERS, gta6ChapterId } from '@/lib/gta6Chapters'
import { cn } from '@/lib/utils'
import type { ChecklistItem, MedalRank } from '@/store/slice'
import { normalizeSlice } from '@/store/slice'
import { checklistDetail, checklistObjective } from '@/i18n/checklistText'
import { SourceNote } from '@/components/shared/SourceNote'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'
import { Gta6ChecklistBoard } from './Gta6ChecklistBoard'

const FILTERS = ['All', 'Remaining', 'Completed', '100%', 'Beyond 100%', 'Trophy', 'Gold Medals'] as const
type ViewTab = 'score' | 'story' | 'extras'

function medalClass(rank: MedalRank) {
  if (rank === 'gold') return 'border-[#e4b341] bg-[#e4b341]/15 text-[#e4b341] shadow-[0_0_12px_rgba(228,179,65,0.55)]'
  if (rank === 'silver') return 'border-[#d5dbe3] bg-white/10 text-[#d5dbe3]'
  if (rank === 'bronze') return 'border-[#cd7f32] bg-[#cd7f32]/15 text-[#e8a15a]'
  return 'border-white/15 text-[#a39c90]'
}

function MedalBadge({ rank, text }: { rank: MedalRank; text?: string }) {
  const { t } = useI18n()
  if (rank === 'none' && !text) return null
  return (
    <span className={`inline-flex h-6 items-center border px-2 text-[10px] font-semibold uppercase tracking-wider ${medalClass(rank)}`}>
      {text ?? t.checklist.medalsRank[rank]}
    </span>
  )
}

export function ChecklistBoard({ gameSlug }: { gameSlug: string }) {
  return gameSlug === 'gta6' ? <Gta6ChecklistBoard /> : <LegacyChecklistBoard gameSlug={gameSlug} />
}
function LegacyChecklistBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const slice = useMemo(() => normalizeSlice(raw), [raw])
  const isGta6 = gameSlug === 'gta6'
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(isGta6 ? '100%' : 'All')
  const [group, setGroup] = useState<'all' | ChecklistItem['group']>('all')
  const [view, setView] = useState<ViewTab>('score')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [chaptersOpen, setChaptersOpen] = useState<Record<string, boolean>>({ ch1: true, ch2: false, ch3: false })
  const { t, locale } = useI18n()
  const filterLabel: Record<(typeof FILTERS)[number], string> = {
    All: t.checklist.all,
    Remaining: t.checklist.remaining,
    Completed: t.checklist.completed,
    '100%': t.checklist.required,
    'Beyond 100%': t.checklist.beyond,
    Trophy: t.checklist.trophy,
    'Gold Medals': t.checklist.goldMedals,
  }
  if (!game || !data) return null
  const activeGame = game
  const found = new Set(slice.found)
  const manual = new Set(slice.checklistDone)
  const objectives = new Set(slice.objectiveDone)
  const score = weightedCompletion(data.checklist, found, manual, game.markers)
  const golds = goldMedalTally(data.checklist, objectives)
  const visibleFilters = FILTERS.filter((item) => !(item === 'Gold Medals' && golds.available === 0))
  const needle = query.trim().toLocaleLowerCase(locale === 'tr' ? 'tr' : 'en')

  const matchesQuery = (item: ChecklistItem) => {
    if (!needle) return true
    const detail = checklistDetail(locale, item.detail)
    return `${item.title} ${detail}`.toLocaleLowerCase(locale === 'tr' ? 'tr' : 'en').includes(needle)
  }

  const matchesFilter = (item: ChecklistItem) => {
    const done = isChecklistComplete(item, found, manual, game.markers)
    if (filter === 'Remaining' && done) return false
    if (filter === 'Completed' && !done) return false
    if (filter === '100%' && !item.requiredFor100) return false
    if (filter === 'Beyond 100%' && item.group !== 'beyond') return false
    if (filter === 'Trophy' && !item.trophy) return false
    if (filter === 'Gold Medals' && !item.solidGold) return false
    if (!isGta6 && group !== 'all' && item.group !== group) return false
    return matchesQuery(item)
  }

  const rows = data.checklist.filter((item) => {
    if (!isGta6) return matchesFilter(item)
    if (view === 'score') return Boolean(item.requiredFor100) && matchesFilter(item)
    if (view === 'story') return false
    return !item.requiredFor100 && !item.id.startsWith('gta6-mission-') && matchesFilter(item)
  })

  const storyRows =
    isGta6 && view === 'story'
      ? data.checklist.filter((item) => {
          if (!item.id.startsWith('gta6-mission-') || !matchesQuery(item)) return false
          const done = isChecklistComplete(item, found, manual, game.markers)
          if (filter === 'Remaining' && done) return false
          if (filter === 'Completed' && !done) return false
          return true
        })
      : []

  function showNext() {
    const pool = isGta6 && view === 'story' ? storyRows : rows
    const next = pool.find((item) => !isChecklistComplete(item, found, manual, activeGame.markers))
    if (!next) {
      useCompanionStore.getState().showToast(t.checklist.noneLeft)
      return
    }
    const chapter = gta6ChapterId(next.title)
    if (chapter) setChaptersOpen((current) => ({ ...current, [chapter]: true }))
    setOpen((current) => ({ ...current, [next.id]: true }))
    requestAnimationFrame(() => document.getElementById(`check-${next.id}`)?.scrollIntoView({ block: 'center' }))
  }

  function renderRow(item: ChecklistItem) {
    const done = isChecklistComplete(item, found, manual, activeGame.markers)
    const progress = collectProgress(item, found, activeGame.markers)
    const mapId = item.mapId ?? item.markerId
    const marker = mapId ? activeGame.markers.find((entry) => entry.id === mapId) : undefined
    const tracks = medalTracks(item)
    const rank = itemMedal(item, objectives, done)
    const goldCount = tracks.filter((track) => trackMedal(item.id, track, objectives, done) === 'gold').length
    const checked = (item.objectives ?? []).filter((objective) => objectives.has(objectiveKey(item.id, objective.id))).length
    const expanded = Boolean(open[item.id])
    const summaryRank = tracks.length > 1 && goldCount > 0 ? 'gold' : rank
    const badge = tracks.length > 1 ? t.checklist.goldCount(goldCount, tracks.length) : undefined
    return (
      <li id={`check-${item.id}`} key={item.id} className="border border-white/10 bg-[#12141A]">
        <div className="flex flex-wrap items-start gap-3 p-4 sm:items-center">
          <button
            type="button"
            aria-label={t.checklist.mark(item.title, done)}
            aria-pressed={done}
            disabled={Boolean(item.collect)}
            className={`grid size-6 shrink-0 place-items-center border ${done ? 'border-[#10B981] bg-[#10B981] text-[#04140e]' : 'border-white/20'}`}
            onClick={() => useCompanionStore.getState().toggleChecklist(activeGame.slug, item.id, item.markerId)}
          >
            {done ? '✓' : ''}
          </button>
          <div className="min-w-0 flex-1">
            <button
              type="button"
              className="w-full text-left"
              aria-expanded={tracks.length ? expanded : undefined}
              onClick={() => {
                if (!tracks.length) return
                setOpen((current) => ({ ...current, [item.id]: !current[item.id] }))
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold">{item.title}</div>
                {item.share != null ? (
                  <span className="rounded border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">{t.checklist.share(item.share)}</span>
                ) : null}
                {tracks.length ? <MedalBadge rank={summaryRank} text={badge} /> : null}
              </div>
              <p className="text-xs leading-5 text-[#a39c90]">{checklistDetail(locale, item.detail)}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-[#F59E0B]">
                <span>{t.checklist.groups[item.group]}</span>
                {item.trophy ? <span>{t.checklist[item.trophy]}</span> : null}
                {item.solidGold ? <span className="text-[#e4b341]">{t.checklist.solid}</span> : null}
                {tracks.length ? <span className="text-[#d5dbe3]">{t.checklist.objectives(checked, item.objectives?.length ?? 0)}</span> : null}
                {progress ? <span className="text-[#3B82F6]">{progress.have}/{progress.needed}</span> : null}
              </div>
            </button>
          </div>
          {marker ? (
            <Link href={`/${activeGame.slug}/map?x=${marker.x}&y=${marker.y}&z=${activeGame.projection === 'geographic' ? 15 : 5}&pin=${marker.id}`} className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
              {t.viewOnMap}
            </Link>
          ) : null}
        </div>
        {expanded && tracks.length ? <ObjectiveList gameSlug={activeGame.slug} item={item} done={objectives} missionDone={done} /> : null}
      </li>
    )
  }

  return (
    <ModuleFrame title={t.checklist.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <SourceNote kind="checklist" />
      <div className={`checklist-summary grid gap-3 ${golds.available > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div className="border border-white/10 bg-[#12141A] p-4">
          <ProgressRing value={score.percent} label={t.checklist.ring} color="#10B981" />
        </div>
        {golds.available > 0 ? (
          <div className="border border-white/10 bg-[#12141A] p-4">
            <ProgressRing value={(golds.earned / golds.target) * 100} label={t.checklist.solid} color="#e4b341" readout={String(golds.earned)} caption={`${golds.earned} / ${golds.target}`} />
            <p className="mt-2 text-xs text-[#a39c90]">{t.checklist.medals(golds.available, golds.target)}</p>
          </div>
        ) : null}
      </div>
      <details className="rounded-xl border border-white/10 p-3">
        <summary className="text-sm text-slate-400">{t.checklist.how}</summary>
        <div className="mt-3 space-y-4">
          <p className="text-sm text-[#a39c90]">{isGta6 ? t.checklist.introVi : t.checklist.intro}</p>
          <div className={`grid gap-2 ${isGta6 ? 'sm:grid-cols-4' : 'sm:grid-cols-5'}`}>
            {score.rows
              .filter((row) => row.weight > 0)
              .map((row) => (
                <div key={row.group} className="border border-white/10 bg-[#12141A] p-3">
                  <div className="text-[10px] uppercase tracking-wider text-[#a39c90]">{t.checklist.groups[row.group]}</div>
                  <div className="mt-1 font-mono text-sm">
                    {row.done}/{row.total}
                  </div>
                  <div className="text-xs text-[#10B981]">
                    {row.points.toFixed(1)} / {row.weight}
                  </div>
                  {golds.available > 0 && (golds.byGroup[row.group] > 0 || row.group === 'story' || row.group === 'strangers') ? (
                    <div className="mt-1 text-xs text-[#e4b341]">
                      {t.checklist.medalsRank.gold} {golds.byGroup[row.group]}
                    </div>
                  ) : null}
                </div>
              ))}
          </div>
        </div>
      </details>
      {isGta6 ? (
        <div className="flex gap-2">
          {(
            [
              ['score', t.checklist.tabScore],
              ['story', t.checklist.tabStory],
              ['extras', t.checklist.tabExtras],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              className={cn('h-9 flex-1 rounded-lg text-xs font-semibold uppercase tracking-wider', view === id ? 'bg-[var(--game-accent,#10B981)] text-[#04140e]' : 'border border-white/15')}
              onClick={() => {
                setView(id)
                setFilter(id === 'score' ? '100%' : id === 'story' ? 'Remaining' : 'All')
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.checklist.search} aria-label={t.checklist.searchLabel} className="h-8 min-w-48 flex-1 border border-white/15 bg-black/40 px-2 text-sm" />
        {!isGta6 ? (
          <label className="text-xs text-[#a39c90]">
            {t.checklist.group}
            <select value={group} aria-label={t.checklist.group} onChange={(event) => setGroup(event.target.value as typeof group)} className="ml-2 h-8 border border-white/15 bg-[#0A0B0E] px-2 text-sm text-[#f3efe6]">
              <option value="all">{t.checklist.everyGroup}</option>
              {Object.entries(t.checklist.groups).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button type="button" className="h-8 bg-[#10B981] px-3 text-xs font-semibold uppercase text-[#04140e]" onClick={showNext}>
          {t.checklist.nextOpen}
        </button>
      </div>
      <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#0a0f15]/95 py-2 backdrop-blur">
        {(isGta6 ? (view === 'story' ? (['Remaining', 'Completed', 'All'] as const) : view === 'score' ? (['100%', 'Remaining', 'Completed'] as const) : (['All', 'Remaining', 'Completed', 'Trophy', 'Beyond 100%'] as const)) : visibleFilters).map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} className={`h-8 shrink-0 rounded-lg px-3 text-xs uppercase tracking-wider ${filter === item ? 'bg-[#10B981] text-[#04140e]' : 'border border-white/15'}`} onClick={() => setFilter(item)}>
            {filterLabel[item]}
          </button>
        ))}
      </div>
      {isGta6 && view === 'story' ? (
        <div className="space-y-3">
          {GTA6_CHAPTERS.map((chapter) => {
            const items = chapter.missions
              .map((title) => storyRows.find((row) => row.title === title))
              .filter((row): row is ChecklistItem => Boolean(row))
            if (items.length === 0) return null
            const doneCount = items.filter((item) => isChecklistComplete(item, found, manual, game.markers)).length
            const openChapter = chaptersOpen[chapter.id] ?? false
            return (
              <section key={chapter.id} className="overflow-hidden border border-white/10 bg-[#12141A]">
                <button
                  type="button"
                  aria-expanded={openChapter}
                  aria-label={openChapter ? t.checklist.closeChapter : t.checklist.openChapter}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  onClick={() => setChaptersOpen((current) => ({ ...current, [chapter.id]: !openChapter }))}
                >
                  <div>
                    <div className="text-sm font-semibold">{chapter.title[locale]}</div>
                    <div className="mt-0.5 font-mono text-xs text-[#a39c90]">{t.checklist.chapterProgress(doneCount, items.length)}</div>
                  </div>
                  <span className="text-[#a39c90]">{openChapter ? '−' : '+'}</span>
                </button>
                {openChapter ? <ul className="space-y-2 border-t border-white/10 p-2">{items.map(renderRow)}</ul> : null}
              </section>
            )
          })}
        </div>
      ) : (
        <ul className="space-y-2">{rows.map(renderRow)}</ul>
      )}
    </ModuleFrame>
  )
}

function ObjectiveList({
  gameSlug,
  item,
  done,
  missionDone,
}: {
  gameSlug: string
  item: ChecklistItem
  done: ReadonlySet<string>
  missionDone: boolean
}) {
  const { locale } = useI18n()
  const tracks = medalTracks(item)
  return (
    <div className="space-y-3 border-t border-white/10 px-3 py-3">
      {tracks.map((track) => {
        const rank = trackMedal(item.id, track, done, missionDone)
        return (
          <div key={track.id}>
            {tracks.length > 1 ? (
              <div className="mb-2 flex items-center gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#f3efe6]">{track.title}</div>
                <MedalBadge rank={rank} />
              </div>
            ) : null}
            <ul className="space-y-1.5">
              {track.objectives.map((objective) => {
                const checked = done.has(objectiveKey(item.id, objective.id))
                return (
                  <li key={objective.id}>
                    <button type="button" aria-pressed={checked} className="flex w-full items-start gap-2 text-left text-sm" onClick={() => useCompanionStore.getState().toggleObjective(gameSlug, item.id, objective.id)}>
                      <span className={`mt-0.5 grid size-4 shrink-0 place-items-center border text-[10px] ${checked ? 'border-[#e4b341] bg-[#e4b341] text-[#14110a]' : 'border-white/25'}`}>{checked ? '✓' : ''}</span>
                      <span className={checked ? 'text-[#f3efe6]' : 'text-[#a39c90]'}>{checklistObjective(locale, objective.text)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
