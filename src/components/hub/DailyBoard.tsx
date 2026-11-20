'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { CommunityScheduleBadge } from '@/components/shared/ScheduleBadge'
import { useResetClock } from '@/lib/clock'
import {
  dayOfYear,
  nextDailyReset,
  nextWeeklyReset,
  pickOf,
  todaysBoard,
} from '@/lib/resets'
import { gunVanMarkerId, gunVanSlot } from '@/lib/gunVan'
import { HUNTS, huntActive } from '@/lib/seasons'
import { normalizeSlice } from '@/store/slice'
import { dailyNote, huntCopy, weeklyBonus } from '@/i18n/catalog'
import { SampleBanner } from '@/components/shared/SourceNote'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'

export function DailyBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const slice = useMemo(() => normalizeSlice(raw), [raw])
  const clock = useResetClock(data?.daily.resets)
  const { t, locale } = useI18n()
  if (!game || !data) return null
  const resets = data.daily.resets
  const byId = (category: string) =>
    game.markers
      .filter((marker) => marker.category === category)
      .sort((a, b) => a.id.localeCompare(b.id))
  const rotating = {
    exotic: pickOf(byId('exotic-exports'), clock.date, clock.dailyHour),
    stashHouse: pickOf(byId('stash-houses'), clock.date, clock.dailyHour),
  }
  const gunVan =
    game.slug === 'gta5'
      ? (game.markers.find(
          (marker) =>
            marker.id === gunVanMarkerId(dayOfYear(clock.date, clock.dailyHour))
        ) ?? null)
      : null
  const period = clock.dailyPeriod
  const done = new Set(slice.daily.periodKey === period ? slice.daily.ids : [])
  const today = todaysBoard(data.daily, clock.date)

  return (
    <ModuleFrame title={t.archive?.title ?? t.daily.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <SampleBanner />
      <section className="border border-white/10 bg-[#12141A] p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {t.daily.today}
          </h2>
          <span className="text-sm text-emerald-300">
            {t.daily.done(data.daily.tasks.filter((task) => done.has(task.id)).length, data.daily.tasks.length)}
          </span>
        </div>{' '}
        <ul className="space-y-2">
          {data.daily.tasks.map((task) => {
            const checked = done.has(task.id)
            return (
              <li key={task.id}>
                <button
                  type="button"
                  aria-pressed={checked}
                  className="flex w-full items-center gap-3 border border-white/10 bg-[#12141A] px-3 py-3 text-left"
                  onClick={() =>
                    useCompanionStore
                      .getState()
                      .toggleDaily(game.slug, task.id, period)
                  }
                >
                  <span
                    className={`grid size-5 place-items-center border ${checked ? 'border-[#10B981] bg-[#10B981] text-[#04140e]' : 'border-white/20'}`}
                  >
                    {checked ? '✓' : ''}
                  </span>
                  {t.daily.tasks[task.id as keyof typeof t.daily.tasks] ?? task.title}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <p className="text-sm text-[#a39c90]">
        {t.daily.intro(String(resets.dailyHourUtc).padStart(2, '0'))}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <CountdownTimer
          target={nextDailyReset(clock.date, resets.dailyHourUtc)}
          label={t.daily.dailyLocations}
        />
        <CountdownTimer
          target={nextWeeklyReset(
            clock.date,
            resets.weeklyWeekday,
            resets.weeklyHourUtc
          )}
          label={t.daily.weeklyBonuses}
        />
      </div>
      {game.slug === 'gta5' ? (
        <section className="border border-white/10 bg-[#12141A] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl">{t.daily.hunts}</h2>
            <CommunityScheduleBadge />
          </div>
          <p className="mt-1 text-sm text-[#a39c90]">{t.daily.huntsBody}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {HUNTS.map((hunt) => {
              const active = huntActive(hunt.id)
              const copy = huntCopy(locale, hunt)
              return (
                <li
                  key={hunt.id}
                  className="flex items-start justify-between gap-3 border border-white/10 px-3 py-2"
                >
                  <span>
                    <span className="block text-sm font-semibold">
                      {copy.title}
                    </span>
                    <span className="block text-xs text-[#a39c90]">
                      {copy.window}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${active ? 'border-[#10B981]/50 bg-[#10B981]/15 text-[#10B981]' : 'border-white/15 text-[#a39c90]'}`}
                  >
                    {active ? t.daily.inSeason : t.daily.offSeason}
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {rotating.exotic ? (
              <article className="border border-white/10 px-3 py-2">
                <h3 className="text-sm font-semibold">
                  {t.daily.exotic}
                </h3>
                <p className="text-sm text-[#d9d3c8]">
                  {rotating.exotic.title}
                </p>
                <MapLink
                  slug={game.slug}
                  id={rotating.exotic.id}
                  x={rotating.exotic.x}
                  y={rotating.exotic.y}
                />
              </article>
            ) : null}
            {rotating.stashHouse ? (
              <article className="border border-white/10 px-3 py-2">
                <h3 className="text-sm font-semibold">{t.daily.stashToday}</h3>
                <p className="text-sm text-[#d9d3c8]">
                  {rotating.stashHouse.title}
                </p>
                <MapLink
                  slug={game.slug}
                  id={rotating.stashHouse.id}
                  x={rotating.stashHouse.x}
                  y={rotating.stashHouse.y}
                />
              </article>
            ) : null}
          </div>
        </section>
      ) : null}
      {today ? (
        <>
          <section className="border border-white/10 bg-[#12141A] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl text-[#F59E0B]">
                {t.daily.gunVan(gunVan?.title ?? today.gunVan.title)}
              </h2>
              <CommunityScheduleBadge />
            </div>
            <p className="mt-1 text-sm text-[#a39c90]">
              {t.daily.gunVanSpot(gunVanSlot(dayOfYear(clock.date, resets.dailyHourUtc)))}
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {today.gunVan.stock.map((item) => (
                <li key={item.name}>
                  {item.name} · {t.daily.off(Math.round(item.discount * 100))}
                </li>
              ))}
            </ul>
            {gunVan ? (
              <MapLink
                slug={game.slug}
                id={gunVan.id}
                x={gunVan.x}
                y={gunVan.y}
              />
            ) : null}
          </section>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl">{t.daily.dealers}</h2>
            <CommunityScheduleBadge />
          </div>
          <section className="grid gap-3 md:grid-cols-3">
            {today.dealers.map((dealer) => (
              <article
                key={dealer.title}
                className="border border-white/10 bg-[#12141A] p-3"
              >
                <h3 className="font-semibold">{t.daily.dealer(dealer.title)}</h3>
                <p className="text-xs text-[#a39c90]">{dailyNote(locale, dealer.note)}</p>
                {dealer.markerId ? (
                  <MapLink slug={game.slug} id={dealer.markerId} />
                ) : null}
              </article>
            ))}
          </section>
          <section className="border border-white/10 bg-[#12141A] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl">
                {t.daily.stash(today.stash.title)}
              </h2>
              <CommunityScheduleBadge />
            </div>
            <p className="text-sm text-[#a39c90]">{dailyNote(locale, today.stash.note)}</p>
            {today.stash.markerId ? (
              <MapLink slug={game.slug} id={today.stash.markerId} />
            ) : null}
            <ul className="mt-3 space-y-1 text-sm">
              {today.trials.map((trial) => (
                <li key={trial.title}>
                  {trial.title} — {dailyNote(locale, trial.note)}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[#3B82F6]">
              {today.bonuses.map((bonus) => weeklyBonus(locale, bonus)).join(' · ')}
            </p>
          </section>
        </>
      ) : (
        <p className="text-sm text-[#a39c90]">{t.daily.empty}</p>
      )}
    </ModuleFrame>
  )
}

function MapLink({
  slug,
  id,
  x,
  y,
}: {
  slug: string
  id: string
  x?: number
  y?: number
}) {
  const { t } = useI18n()
  const query =
    x !== undefined && y !== undefined
      ? `x=${x}&y=${y}&z=5&pin=${id}&region=los-santos&mode=online`
      : `pin=${id}&region=los-santos&mode=online`
  return (
    <Link
      href={`/${slug}/map?${query}`}
      className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wider text-[#3B82F6]"
    >
      {t.viewOnMap}
    </Link>
  )
}
