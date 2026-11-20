'use client'
import { useState } from 'react'
import { Copy } from 'lucide-react'
import { copyText } from '@/lib/utils'
import { useCompanionStore } from '@/store/useCompanionStore'
import { cheatEffect, cheatName, consoleNote, controlText, controlTitle } from '@/i18n/catalog'
import { useI18n } from '@/i18n/provider'
import { getGame } from '@/config/games'
import { briefBlocks } from '@/config/games/gta6/briefing'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import {
  CHEAT_GROUPS,
  CHEATS,
  CONSOLE_NOTE,
  CONTROL_SECTIONS,
} from '@/lib/reference'
export function ReferenceBoard({ gameSlug }: { gameSlug: string }) {
  const [query, setQuery] = useState('')
  const game = getGame(gameSlug)
  const { t, locale } = useI18n()
  if (!game) return null
  const showCheats = game.slug === 'gta5'
  const haystack = (cheat: (typeof CHEATS)[number]) =>
    `${cheat.name} ${cheatName(locale, cheat.name)} ${cheat.code} ${cheat.effect} ${cheatEffect(locale, cheat.effect)}`.toLowerCase()
  return (
    <ModuleFrame title={t.reference.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      {showCheats ? <p className="text-sm text-[#a39c90]">{t.reference.intro}</p> : null}
      {showCheats ? (
        <>
          <p className="text-sm text-[#a39c90]">{consoleNote(locale, CONSOLE_NOTE)}</p>
          <input
            aria-label={t.reference.searchLabel}
            placeholder={t.reference.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full max-w-lg border border-white/15 bg-black/20 px-3 text-sm"
          />
          {!CHEATS.some((cheat) =>
            haystack(cheat).includes(query.toLowerCase())
          ) && (
            <p className="text-sm text-slate-400" role="status">
              {t.reference.none}
            </p>
          )}
          {CHEAT_GROUPS.filter((group) =>
            CHEATS.some(
              (cheat) =>
                cheat.group === group &&
                haystack(cheat).includes(query.toLowerCase())
            )
          ).map((group) => (
            <section
              key={group}
              className="border border-white/10 bg-[#12141A] p-4"
            >
              <h2 className="font-display text-2xl">{t.reference.groups[group]}</h2>
              <ul className="mt-3 space-y-2">
                {CHEATS.filter(
                  (cheat) =>
                    cheat.group === group &&
                    haystack(cheat).includes(query.toLowerCase())
                ).map((cheat) => (
                  <li
                    key={cheat.code}
                    className="grid gap-1 sm:grid-cols-[180px_1fr]"
                  >
                    <button
                      type="button"
                      aria-label={`${t.reference.copy} ${cheat.code}`}
                      className="flex min-h-10 items-center gap-2 text-left font-mono text-sm text-emerald-300"
                      onClick={() =>
                        void copyText(cheat.code).then(
                          () =>
                            useCompanionStore
                              .getState()
                              .showToast(t.reference.copied),
                          () =>
                            useCompanionStore
                              .getState()
                              .showToast(t.reference.clipboard)
                        )
                      }
                    >
                      {cheat.code}
                      <Copy size={13} />
                    </button>
                    <span className="text-sm">
                      <span className="font-semibold">{cheatName(locale, cheat.name)}. </span>
                      <span className="text-[#a39c90]">{cheatEffect(locale, cheat.effect)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      ) : (
        <div className="space-y-3">
          {briefBlocks(locale).map((block) => (
            <section key={block.id} className="border border-white/10 bg-[#12141A] p-4">
              <h2 className="font-display text-2xl">{block.title}</h2>
              {block.body.map((line) => (
                <p key={line} className="mt-2 text-sm leading-6 text-[#d9d3c8]">{line}</p>
              ))}
            </section>
          ))}
        </div>
      )}
      {showCheats ? <div className="grid gap-3 md:grid-cols-2">
        {CONTROL_SECTIONS.map((section) => (
          <section
            key={section.title}
            className="border border-white/10 bg-[#12141A] p-4"
          >
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
      </div> : null}
    </ModuleFrame>
  )
}
