'use client'
import Link from 'next/link'
import { useMemo } from 'react'
import {
  ArrowUpRight,
  Map,
  ListChecks,
  CalendarClock,
  Car,
  Warehouse,
  CircleDollarSign,
  Trophy,
  Timer,
} from 'lucide-react'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { CommunityScheduleBadge } from '@/components/shared/ScheduleBadge'
import { useResetClock } from '@/lib/clock'
import { weightedCompletion } from '@/lib/checklist'
import {
  dayOfYear,
  nextDailyReset,
  nextWeeklyReset,
  todaysBoard,
} from '@/lib/resets'
import { thisWeek } from '@/lib/weekly'
import { gunVanMarkerId } from '@/lib/gunVan'
import { normalizeSlice } from '@/store/slice'
import { weeklyBonus } from '@/i18n/catalog'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'
export function Dashboard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const slice = useMemo(() => normalizeSlice(raw), [raw])
  const clock = useResetClock(data?.daily.resets)
  const { t, locale } = useI18n()
  if (!game || !data) return null
  const found = new Set(slice.found)
  const manual = new Set(slice.checklistDone)
  const score = weightedCompletion(data.checklist, found, manual, game.markers)
  const mapPercent = game.markers.length
    ? (slice.found.length / game.markers.length) * 100
    : 0
  const resets = data.daily.resets
  const today = todaysBoard(data.daily, clock.date)
  const gunVan =
    game.slug === 'gta5'
      ? game.markers.find(
          (marker) =>
            marker.id ===
            gunVanMarkerId(dayOfYear(clock.date, resets.dailyHourUtc))
        )
      : null
  const week =
    game.slug === 'gta5'
      ? thisWeek(clock.date, resets.weeklyWeekday, resets.weeklyHourUtc)
      : null
  const tools = [
    {
      href: '/database',
      title: t.dashboard.ride,
      detail: t.dashboard.rideDetail(data.vehicles.length, data.weapons.length),
      icon: Car,
    },
    {
      href: '/garage',
      title: t.dashboard.garage,
      detail: t.dashboard.garageDetail(slice.properties.length),
      icon: Warehouse,
    },
    {
      href: '/economy',
      title: t.dashboard.hour,
      detail: t.dashboard.hourDetail,
      icon: CircleDollarSign,
    },
    {
      href: '/career',
      title: t.dashboard.milestone,
      detail: t.dashboard.milestoneDetail,
      icon: Trophy,
    },
  ]
  return (
    <ModuleFrame
      title={game.slug === 'gta6' ? t.dashboard.discover : game.status === 'preview' ? t.dashboard.discover : t.dashboard.hq}
      kicker={t.dashboard.kicker(game.shortTitle)}
    >
      <div className="dashboard-hero">
        <div className="hero-cartography" aria-hidden="true" />
        <div className="relative max-w-2xl px-6 py-7 sm:p-9">
          <p className="eyebrow">
            {game.slug === 'gta6' ? game.region : game.status === 'preview' ? t.dashboard.nextChapter : t.dashboard.yours}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {game.status === 'preview' ? t.dashboard.newWorld : t.dashboard.lessSearching}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
            {game.slug === 'gta6' ? t.dashboard.heroLeonida : game.status === 'preview' ? t.dashboard.heroPreview : t.dashboard.heroBody}{' '}
            {t.catalog.offline}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="action-primary" href={`/${game.slug}/map`}>
              <Map size={17} />
              {t.dashboard.exploreMap}
              <ArrowUpRight size={16} />
            </Link>
            {game.status !== 'preview' && (
              <Link className="action-secondary" href={`/${game.slug}/daily`}>
                <CalendarClock size={17} />
                {t.dashboard.planToday}
              </Link>
            )}
          </div>
        </div>
      </div>
      {game.status === 'preview' ? (
        <LaunchingSoon slug={game.slug} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Link href={`/${game.slug}/checklist`} className="stat-card">
              <ListChecks className="mb-3 text-emerald-400" size={19} />
              <p className="text-xs text-slate-400">{t.dashboard.storyCompletion}</p>
              <p className="mt-1 font-display text-3xl font-semibold">
                {score.percent.toFixed(0)}
                <span className="text-lg text-slate-500">%</span>
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded bg-white/5">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${score.percent}%` }}
                />
              </div>
            </Link>
            <Link href={`/${game.slug}/map`} className="stat-card">
              <Map className="mb-3 text-sky-400" size={19} />
              <p className="text-xs text-slate-400">{t.dashboard.locationsFound}</p>
              <p className="mt-1 font-display text-3xl font-semibold">
                {slice.found.length}
                <span className="text-base text-slate-500">
                  {' '}
                  / {game.markers.length}
                </span>
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded bg-white/5">
                <div
                  className="h-full bg-sky-400"
                  style={{ width: `${Math.min(mapPercent, 100)}%` }}
                />
              </div>
            </Link>
            <Link href={`/${game.slug}/garage`} className="stat-card">
              <Warehouse className="mb-3 text-violet-400" size={19} />
              <p className="text-xs text-slate-400">{t.dashboard.yourCollection}</p>
              <p className="mt-1 font-display text-3xl font-semibold">
                {slice.properties.reduce(
                  (n, p) => n + p.slots.filter(Boolean).length,
                  0
                )}
                <span className="text-base text-slate-500"> {t.dashboard.vehicles}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t.dashboard.across(slice.properties.length)}
              </p>
            </Link>
            <Link href={`/${game.slug}/calculators`} className="stat-card">
              <Timer className="mb-3 text-amber-400" size={19} />
              <p className="text-xs text-slate-400">{t.dashboard.businessTimers}</p>
              <p className="mt-1 font-display text-3xl font-semibold">
                {
                  Object.values(slice.businesses).filter((b) => b.startedAt)
                    .length
                }
                <span className="text-base text-slate-500"> {t.dashboard.active}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t.dashboard.nextSale}
              </p>
            </Link>
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
            <section className="border border-white/10 bg-[#12141A] p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">
                  {t.dashboard.nextMove}
                </h2>
                <span className="text-xs text-slate-500">{t.dashboard.jumpBack}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={`/${game.slug}${tool.href}`}
                    className="tool-card"
                  >
                    <tool.icon
                      className="shrink-0 text-emerald-300"
                      size={22}
                    />
                    <div>
                      <h3 className="text-sm font-semibold">{tool.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {tool.detail}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <section className="border border-white/10 bg-[#12141A] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold">
                  {t.dashboard.radar}
                </h2>
                <CommunityScheduleBadge />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {t.dashboard.sample}
              </p>
              {week && (
                <div className="mt-5">
                  <p className="eyebrow">{t.dashboard.thisWeekShort}</p>
                  <p className="mt-2 text-lg font-semibold">
                    {weeklyBonus(locale, week.bonuses[0])}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {t.dashboard.podium(week.podium.name)}
                  </p>
                  <Link
                    href={`/${game.slug}/weekly`}
                    className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-300"
                  >
                    {t.dashboard.seeWeekly} <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
              {today && gunVan && (
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="eyebrow">{t.dashboard.gunVan}</p>
                  <p className="mt-2 text-sm">{gunVan.title}</p>
                  <Link
                    className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-300"
                    href={`/${game.slug}/map?x=${gunVan.x}&y=${gunVan.y}&z=5&pin=${gunVan.id}&region=los-santos&mode=online`}
                  >
                    {t.viewOnMap} <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
            </section>
          </div>
          <details className="rounded-xl border border-white/10 p-4">
            <summary className="text-sm text-slate-400">
              {t.dashboard.resetSchedule}{' '}
              <span className="ml-2 text-xs text-slate-500">UTC</span>
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CountdownTimer
                target={nextDailyReset(clock.date, resets.dailyHourUtc)}
                label={t.dashboard.dailyReset}
              />
              <CountdownTimer
                target={nextWeeklyReset(
                  clock.date,
                  resets.weeklyWeekday,
                  resets.weeklyHourUtc
                )}
                label={t.dashboard.weeklyReset}
              />
            </div>
          </details>
        </>
      )}
    </ModuleFrame>
  )
}
