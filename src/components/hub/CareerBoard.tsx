'use client'

import { useMemo, useState } from 'react'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { CAREER, careerScore, tierKey, type CareerGroup } from '@/lib/career'
import { careerChallenge, careerNote } from '@/i18n/catalog'
import { normalizeSlice } from '@/store/slice'
import { SourceNote } from '@/components/shared/SourceNote'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'

const FILTERS: Array<CareerGroup | 'All'> = ['All', 'Businesses', 'Heists', 'Recreation']

export function CareerBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const toggleCareer = useCompanionStore((state) => state.toggleCareer)
  const slice = useMemo(() => normalizeSlice(raw), [raw])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [open, setOpen] = useState('gunrunning')
  const { t, locale, money } = useI18n()
  const filterLabel: Record<(typeof FILTERS)[number], string> = {
    All: t.career.all,
    Businesses: t.career.businesses,
    Heists: t.career.heists,
    Recreation: t.career.recreation,
  }
  if (!game) return null
  const done = new Set(slice.careerDone)
  const score = careerScore(slice.careerDone)
  const rows = CAREER.filter((item) => filter === 'All' || item.group === filter)

  return (
    <ModuleFrame title={t.career.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <SourceNote kind="career" />
      {game.slug !== 'gta5' ? (
        <p className="text-sm text-[#a39c90]">{t.career.empty}</p>
      ) : (
        <>
          <p className="text-sm text-[#a39c90]">{t.career.intro(score.have, score.total)}</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button key={item} type="button" aria-pressed={filter === item} className={`h-8 px-3 text-xs uppercase tracking-wider ${filter === item ? 'bg-[#10B981] text-[#04140e]' : 'border border-white/15'}`} onClick={() => setFilter(item)}>
                {filterLabel[item]}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {rows.map((item) => {
              const checked = item.tiers.filter((tier) => done.has(tierKey(item.id, tier.tier))).length
              const expanded = open === item.id
              return (
                <section key={item.id} className="border border-white/10 bg-[#12141A]">
                  <button type="button" className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left" aria-expanded={expanded} onClick={() => setOpen((current) => (current === item.id ? '' : item.id))}>
                    <span>
                      <span className="block text-sm font-semibold">{item.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#F59E0B]">{filterLabel[item.group]}</span>
                    </span>
                    <span className="font-mono text-sm text-[#10B981]">{checked}/4</span>
                  </button>
                  {expanded ? (
                    <div className="space-y-3 border-t border-white/10 px-3 py-3">
                      {item.note ? <p className="text-xs text-[#a39c90]">{careerNote(locale, item.id, item.note)}</p> : null}
                      {item.tiers.map((tier) => {
                        const key = tierKey(item.id, tier.tier)
                        const on = done.has(key)
                        return (
                          <article key={key} className="border border-white/10 p-3">
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                aria-pressed={on}
                                aria-label={t.career.tierOf(tier.tier, item.name)}
                                className={`grid size-6 shrink-0 place-items-center border ${on ? 'border-[#10B981] bg-[#10B981] text-[#04140e]' : 'border-white/20'}`}
                                onClick={() => toggleCareer(game.slug, key)}
                              >
                                {on ? '✓' : ''}
                              </button>
                              <div className="min-w-0">
                                <h3 className="text-sm font-semibold">{t.career.tier(tier.tier)}</h3>
                                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-[#d9d3c8]">
                                  {tier.challenges.map((challenge) => (
                                    <li key={challenge}>{careerChallenge(locale, challenge)}</li>
                                  ))}
                                </ul>
                                <p className="mt-2 text-sm text-[#F59E0B]">
                                  {tier.reward}
                                  {tier.cash ? ` · ${money(tier.cash)}` : ''}
                                  {tier.rp ? ` · ${t.career.rp(tier.rp.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US'))}` : ''}
                                </p>
                              </div>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  ) : null}
                </section>
              )
            })}
          </div>
        </>
      )}
    </ModuleFrame>
  )
}
