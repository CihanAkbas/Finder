'use client'

import { canonicalMarkerId } from '@/lib/markerAliases'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText, cn } from '@/lib/utils'
import { useCompanionStore } from '@/store/useCompanionStore'
import { cheatEffect, cheatName, cheatUnlock, consoleNote, controlText, controlTitle } from '@/i18n/catalog'
import { useI18n } from '@/i18n/provider'
import { getGame } from '@/config/games'
import { briefBlocks } from '@/config/games/gta6/briefing'
import { GTA6_CHEAT_GROUPS, GTA6_CHEATS, GTA6_CONSOLE_NOTE } from '@/config/games/gta6/cheats'
import { tipBlocks } from '@/config/games/gta6/tips'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { CHEAT_GROUPS, CHEATS, CONSOLE_NOTE, CONTROL_SECTIONS } from '@/lib/reference'

function DPadCode({ code }: { code: string }) {
  const parts = code.split(',').map((part) => part.trim())
  const glyph = (part: string) => {
    if (/^up$/i.test(part)) return '↑'
    if (/^down$/i.test(part)) return '↓'
    if (/^left$/i.test(part)) return '←'
    if (/^right$/i.test(part)) return '→'
    return part
  }
  const isPad = parts.every((part) => /^(up|down|left|right)$/i.test(part))
  if (!isPad) return <span className="font-mono text-sm text-emerald-300">{code}</span>
  return (
    <span className="flex flex-wrap gap-1">
      {parts.map((part, index) => (
        <span key={`${part}-${index}`} className="grid size-7 place-items-center rounded border border-emerald-400/30 bg-emerald-400/10 font-mono text-sm text-emerald-300">
          {glyph(part)}
        </span>
      ))}
    </span>
  )
}

type Tab = 'tips' | 'guide' | 'cheats'

export function ReferenceBoard({ gameSlug }: { gameSlug: string }) {
  const [query, setQuery] = useState('')
  const [tipQuery, setTipQuery] = useState('')
  const [tab, setTab] = useState<Tab>('tips')
  const game = getGame(gameSlug)
  const { t, locale } = useI18n()
  const isGta5 = gameSlug === 'gta5'
  const isGta6 = gameSlug === 'gta6'
  const cheats = useMemo(() => isGta6 ? GTA6_CHEATS : isGta5 ? CHEATS : [], [isGta5, isGta6])
  const groups = isGta6 ? [...GTA6_CHEAT_GROUPS] : isGta5 ? [...CHEAT_GROUPS] : []
  const note = isGta6 ? GTA6_CONSOLE_NOTE : CONSOLE_NOTE
  const needle = query.toLowerCase()
  const tipNeedle = tipQuery.trim().toLocaleLowerCase(locale === 'tr' ? 'tr' : 'en')
  const filtered = useMemo(() => {
    return cheats.filter((cheat) => {
      const haystack = `${cheat.name} ${cheatName(locale, cheat.name)} ${cheat.code} ${cheat.effect} ${cheatEffect(locale, cheat.effect)} ${cheat.unlock ?? ''} ${cheatUnlock(locale, cheat.unlock ?? '')}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [cheats, needle, locale])
  const tipSections = useMemo(() => {
    const sections = tipBlocks(locale)
    if (!tipNeedle) return sections
    return sections
      .map((section) => ({
        ...section,
        tips: section.tips.filter((tip) => `${tip.title} ${tip.body}`.toLocaleLowerCase(locale === 'tr' ? 'tr' : 'en').includes(tipNeedle)),
      }))
      .filter((section) => section.tips.length > 0)
  }, [locale, tipNeedle])
  if (!game) return null

  return (
    <ModuleFrame title={isGta6 ? t.reference.titleVi : t.reference.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      {isGta6 ? (
        <div className="flex gap-2">
          {(
            [
              ['tips', t.reference.tabTips],
              ['guide', t.reference.tabGuide],
              ['cheats', t.reference.tabCheats],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              className={cn('h-9 flex-1 rounded-lg text-xs font-semibold uppercase tracking-wider', tab === id ? 'bg-[var(--game-accent,#ff4f8b)] text-white' : 'border border-white/15')}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      {isGta6 && tab === 'tips' ? (
        <div className="space-y-4">
          <p className="text-sm text-[#a39c90]">{t.reference.tipsIntro}</p>
          <input aria-label={t.reference.tipsSearchLabel} placeholder={t.reference.tipsSearch} value={tipQuery} onChange={(event) => setTipQuery(event.target.value)} className="h-11 w-full max-w-lg border border-white/15 bg-black/20 px-3 text-sm" />
          <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#0a0f15]/95 py-2 backdrop-blur">
            {tipSections.map((section) => (
              <a key={section.id} href={`#tip-${section.id}`} className="h-8 shrink-0 rounded-lg border border-white/15 px-3 text-xs uppercase tracking-wider text-[#d9d3c8] hover:border-white/30">
                {section.title}
              </a>
            ))}
          </div>
          {tipSections.length === 0 ? (
            <p className="text-sm text-slate-400" role="status">
              {t.reference.tipsNone}
            </p>
          ) : null}
          {tipSections.map((section) => (
            <section key={section.id} id={`tip-${section.id}`} className="space-y-2">
              <h2 className="font-display text-2xl">{section.title}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {section.tips.map((tip) => {
                  const pinLinks = (tip.mapPins ?? []).map(canonicalMarkerId)
                    .map((id) => game.markers.find((marker) => marker.id === id))
                    .filter((marker): marker is NonNullable<typeof marker> => Boolean(marker))
                  return (
                    <li key={tip.id} className="rounded-lg border border-white/10 bg-[#12141A] p-3">
                      <div className="text-sm font-semibold text-[#f3efe6]">{tip.title}</div>
                      <p className="mt-1.5 text-sm leading-6 text-[#a39c90]">{tip.body}</p>
                      {pinLinks.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {pinLinks.map((marker) => (
                            <Link
                              key={marker.id}
                              href={`/${game.slug}/map?x=${marker.x}&y=${marker.y}&z=${game.projection === 'geographic' ? 15 : 5}&pin=${marker.id}`}
                              className="text-[11px] font-semibold uppercase tracking-wider text-[#3B82F6]"
                            >
                              {t.viewOnMap}: {marker.title}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
      {isGta6 && tab === 'guide' ? (
        <div className="space-y-3">
          {briefBlocks(locale).map((block) => (
            <section key={block.id} className="border border-white/10 bg-[#12141A] p-4">
              <h2 className="font-display text-2xl">{block.title}</h2>
              {block.body.map((line) => (
                <p key={line} className="mt-2 text-sm leading-6 text-[#d9d3c8]">
                  {line}
                </p>
              ))}
            </section>
          ))}
        </div>
      ) : null}
      {(isGta5 || (isGta6 && tab === 'cheats')) && cheats.length > 0 ? (
        <>
          <p className="text-sm text-[#a39c90]">{isGta6 ? t.reference.introVi : t.reference.intro}</p>
          {isGta6 ? (
            <div className="border border-white/10 bg-[#12141A] p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8d877c]">{t.reference.howToEnter}</div>
              <p className="mt-2 text-sm leading-6 text-[#d9d3c8]">{consoleNote(locale, note)}</p>
              <p className="mt-2 text-xs text-[#a39c90]">{t.reference.publishedCount(GTA6_CHEATS.length, 61)}</p>
            </div>
          ) : (
            <p className="text-sm text-[#a39c90]">{consoleNote(locale, note)}</p>
          )}
          <input aria-label={t.reference.searchLabel} placeholder={t.reference.search} value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full max-w-lg border border-white/15 bg-black/20 px-3 text-sm" />
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400" role="status">
              {t.reference.none}
            </p>
          ) : null}
          {isGta6 ? (
            <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#0a0f15]/95 py-2 backdrop-blur">
              {groups
                .filter((group) => filtered.some((cheat) => cheat.group === group))
                .map((group) => (
                  <a key={group} href={`#cheat-${group}`} className="h-8 shrink-0 rounded-lg border border-white/15 px-3 text-xs uppercase tracking-wider text-[#d9d3c8] hover:border-white/30">
                    {t.reference.groups[group as keyof typeof t.reference.groups]}
                  </a>
                ))}
            </div>
          ) : null}
          {groups
            .filter((group) => filtered.some((cheat) => cheat.group === group))
            .map((group) => (
              <section key={group} id={`cheat-${group}`} className="border border-white/10 bg-[#12141A] p-4">
                <h2 className="font-display text-2xl">{t.reference.groups[group as keyof typeof t.reference.groups]}</h2>
                <ul className={cn('mt-3', isGta6 ? 'grid gap-3 sm:grid-cols-2' : 'space-y-2')}>
                  {filtered
                    .filter((cheat) => cheat.group === group)
                    .map((cheat) => (
                      <li key={cheat.code} className={cn(isGta6 ? 'rounded-lg border border-white/10 bg-black/20 p-3' : 'grid gap-1 sm:grid-cols-[180px_1fr]')}>
                        <div className={cn('flex items-start justify-between gap-2', !isGta6 && 'contents')}>
                          <button
                            type="button"
                            aria-label={`${t.reference.copy} ${cheat.code}`}
                            className="flex min-h-10 items-center gap-2 text-left"
                            onClick={() =>
                              void copyText(cheat.code).then(
                                () => useCompanionStore.getState().showToast(t.reference.copied),
                                () => useCompanionStore.getState().showToast(t.reference.clipboard),
                              )
                            }
                          >
                            <DPadCode code={cheat.code} />
                            <Copy size={13} className="shrink-0 text-emerald-300/80" />
                          </button>
                        </div>
                        <span className="text-sm">
                          <span className="font-semibold">{cheatName(locale, cheat.name)}. </span>
                          <span className="text-[#a39c90]">{cheatEffect(locale, cheat.effect)}</span>
                          {cheat.unlock ? (
                            <span className="mt-1 block text-xs text-[#8d877c]">
                              <span className="uppercase tracking-wider">{t.reference.unlockLabel}: </span>
                              {cheatUnlock(locale, cheat.unlock)}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
        </>
      ) : null}
      {!isGta5 && !isGta6 ? <p className="text-sm text-[#a39c90]">{t.reference.empty}</p> : null}
      {isGta5 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {CONTROL_SECTIONS.map((section) => (
            <section key={section.title} className="border border-white/10 bg-[#12141A] p-4">
              <h2 className="font-display text-2xl">{controlTitle(locale, section.title)}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {section.rows.map((row) => (
                  <li key={row.action} className="flex justify-between gap-3">
                    <span>{controlText(locale, row.action)}</span>
                    <span className="text-right text-[#a39c90]">{controlText(locale, row.input)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
    </ModuleFrame>
  )
}
