'use client'

import { useEffect } from 'react'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { SafeBoard } from '@/components/hub/SafeBoard'
import { SourceNote } from '@/components/shared/SourceNote'
import { useI18n } from '@/i18n/provider'
import { dollars } from '@/lib/money'
import { moneyRanking } from '@/lib/economy'

export function EconomyBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const { t, locale } = useI18n()
  useEffect(() => {
    if (window.location.hash !== '#safes') return
    document.getElementById('safes')?.scrollIntoView({ block: 'start' })
  }, [])
  if (!game) return null
  const rows = game.slug === 'gta5' ? moneyRanking() : []

  return (
    <ModuleFrame title={t.economy.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <SourceNote kind="payouts" />
      <p className="text-xs text-[#8d877c]">{t.catalog.offline}</p>
      <p className="text-sm text-[#a39c90]">
        {t.economy.intro}
      </p>
      {rows.length ? (
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#12141A] text-[11px] uppercase tracking-wider text-[#a39c90]">
              <tr>
                <th className="px-3 py-2">{t.economy.rank}</th>
                <th className="px-3 py-2">{t.economy.method}</th>
                <th className="px-3 py-2">{t.economy.style}</th>
                <th className="px-3 py-2">{t.economy.perHour}</th>
                <th className="px-3 py-2">{t.economy.setup}</th>
                <th className="px-3 py-2">{t.economy.basis}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-3 py-2 font-mono">{index + 1}</td>
                  <td className="px-3 py-2 font-semibold">{locale === 'tr' && row.nameTr ? row.nameTr : row.name}</td>
                  <td className="px-3 py-2">{row.style === 'Active' ? t.economy.active : t.economy.passive}</td>
                  <td className="px-3 py-2">{dollars(row.hourly, locale)}</td>
                  <td className="px-3 py-2">{t.economy.minutes(row.setupMinutes)}</td>
                  <td className="px-3 py-2 text-[#a39c90]">{locale === 'tr' && row.noteTr ? row.noteTr : row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-[#a39c90]">{t.economy.empty}</p>
      )}
      <SafeBoard gameSlug={game.slug} />
    </ModuleFrame>
  )
}
