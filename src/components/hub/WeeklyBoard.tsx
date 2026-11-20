'use client'

import Link from 'next/link'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { CommunityScheduleBadge } from '@/components/shared/ScheduleBadge'
import { useResetClock } from '@/lib/clock'
import { weeklyBonus, weeklySlot } from '@/i18n/catalog'
import { thisWeek } from '@/lib/weekly'
import { SampleBanner } from '@/components/shared/SourceNote'
import { useI18n } from '@/i18n/provider'
import { nextWeeklyReset } from '@/lib/resets'

export function WeeklyBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const clock = useResetClock(data?.daily.resets)
  const { t, locale } = useI18n()
  if (!game || !data) return null
  const resets = data.daily.resets
  const week = game.slug === 'gta5' ? thisWeek(clock.date, resets.weeklyWeekday, resets.weeklyHourUtc) : null
  const vehicles = data.vehicles

  return (
    <ModuleFrame title={t.archive?.title ?? t.weekly.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <SampleBanner />
      <p className="text-sm text-[#a39c90]">
        {t.weekly.intro(String(resets.weeklyHourUtc).padStart(2, '0'))}
      </p>
      {week ? (
        <>
          <CountdownTimer target={nextWeeklyReset(clock.date, resets.weeklyWeekday, resets.weeklyHourUtc)} label={t.weekly.countdown} />
          <section className="border border-white/10 bg-[#12141A] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl">{t.weekly.bonuses}</h2>
              <CommunityScheduleBadge />
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {week.bonuses.map((bonus) => (
                <li key={bonus}>{weeklyBonus(locale, bonus)}</li>
              ))}
            </ul>
          </section>
          <div className="grid gap-3 md:grid-cols-2">
            {[week.podium, week.prizeRide, week.luxury, week.simeon].map((slot) => {
              const vehicle = vehicles.find((item) => item.name === slot.name)
              const copy = weeklySlot(locale, slot.label, slot.note)
              return (
                <article key={slot.label} className="border border-white/10 bg-[#12141A] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#a39c90]">{copy.label}</p>
                    <CommunityScheduleBadge />
                  </div>
                  <h2 className="mt-1 font-display text-2xl">{slot.name}</h2>
                  <p className="mt-1 text-sm text-[#a39c90]">{copy.note}</p>
                  {vehicle ? (
                    <Link href={`/${game.slug}/database?kind=vehicle&id=${vehicle.id}`} className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
                      {t.openInDatabase}
                    </Link>
                  ) : null}
                </article>
              )
            })}
          </div>
        </>
      ) : (
        <p className="text-sm text-[#a39c90]">{t.weekly.empty}</p>
      )}
    </ModuleFrame>
  )
}
