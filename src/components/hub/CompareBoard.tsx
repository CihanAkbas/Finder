'use client'

import { useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import {
  bestInClass,
  COMPARE_STATS,
  hswEligible,
  statText,
  winningIds,
} from '@/lib/compare'
import { compareStat, vehicleClass } from '@/i18n/catalog'
import { CatalogMark } from '@/components/shared/CatalogMark'
import { SourceNote } from '@/components/shared/SourceNote'
import { copyText } from '@/lib/utils'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'
import type { Vehicle } from '@/store/slice'

const EMPTY_VEHICLES: Vehicle[] = []

export function CompareBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const { t, locale } = useI18n()
  const data = getCompanion(gameSlug)
  const searchRef = useRef<HTMLInputElement>(null)
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const idsParam = params.get('ids')
  const [trackedIds, setTrackedIds] = useState(idsParam)
  const [slots, setSlots] = useState<(string | null)[]>(() => {
    const ids = (idsParam ?? '').split(',').filter(Boolean).slice(0, 3)
    return [ids[0] ?? null, ids[1] ?? null, ids[2] ?? null]
  })
  if (idsParam !== trackedIds) {
    setTrackedIds(idsParam)
    const ids = (idsParam ?? '').split(',').filter(Boolean).slice(0, 3)
    setSlots([ids[0] ?? null, ids[1] ?? null, ids[2] ?? null])
  }
  const [query, setQuery] = useState('')
  const vehicles = data?.vehicles ?? EMPTY_VEHICLES
  const byId = useMemo(
    () => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle])),
    [vehicles]
  )
  const picked = slots
    .map((id) => (id ? byId.get(id) : undefined))
    .filter((vehicle): vehicle is Vehicle => Boolean(vehicle))
  const ranks = useMemo(() => bestInClass(vehicles), [vehicles])
  if (!game || !data) return null

  const needle = query.trim().toLowerCase()
  const matches = needle
    ? vehicles
        .filter((vehicle) =>
          `${vehicle.name} ${vehicle.manufacturer ?? ''} ${vehicle.class}`
            .toLowerCase()
            .includes(needle)
        )
        .slice(0, 8)
    : []

  function addVehicle(id: string) {
    setSlots((current) => {
      if (current.includes(id)) return current
      const empty = current.indexOf(null)
      if (empty === -1) return current
      const next = [...current]
      next[empty] = id
      const queryIds = next.filter(Boolean).join(',')
      router.replace(queryIds ? `${pathname}?ids=${queryIds}` : pathname, { scroll: false })
      return next
    })
    setQuery('')
  }

  function writeSlots(next: (string | null)[]) {
    setSlots(next)
    const queryIds = next.filter(Boolean).join(',')
    router.replace(queryIds ? `${pathname}?ids=${queryIds}` : pathname, { scroll: false })
  }

  return (
    <ModuleFrame title={t.compare.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <SourceNote kind="vehicles" />
      <p className="text-sm text-[#a39c90]">{t.compare.intro}</p>
      <button
        type="button"
        className="h-8 border border-white/15 px-3 text-xs uppercase"
        onClick={() => {
          const ids = slots.filter(Boolean).join(',')
          const url = `${window.location.origin}${pathname}${ids ? `?ids=${ids}` : ''}`
          void copyText(url).then(
            () => useCompanionStore.getState().showToast(t.compare.shared),
            () => useCompanionStore.getState().showToast(t.map.linkFailed),
          )
        }}
      >
        {t.compare.share}
      </button>
      <div id="compare-slots" className="grid gap-2 sm:grid-cols-3">
        {slots.map((id, index) => {
          const vehicle = id ? byId.get(id) : undefined
          return (
            <div
              key={index}
              className="flex items-center justify-between gap-2 border border-white/10 bg-[#12141A] px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-[#a39c90]">
                  {t.compare.vehicle(index + 1)}
                </div>
                <div className="flex items-center gap-2 truncate text-sm font-semibold">
                  {vehicle ? <CatalogMark kind={vehicle.class} label={vehicleClass(locale, vehicle.class)} /> : null}
                  {vehicle ? (
                    vehicle.name
                  ) : (
                    <button
                      type="button"
                      className="min-h-11 text-emerald-300"
                      onClick={() => searchRef.current?.focus()}
                    >
                      + {t.compare.add}
                    </button>
                  )}
                </div>
              </div>
              {vehicle ? (
                <button
                  type="button"
                  className="text-xs uppercase text-[#fb7185]"
                  onClick={() =>
                    writeSlots(slots.map((item, itemIndex) => (itemIndex === index ? null : item)))
                  }
                >
                  {t.remove}
                </button>
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="relative max-w-md">
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.compare.search}
          aria-label={t.compare.searchLabel}
          className="h-10 w-full border border-white/15 bg-black/40 px-3 text-sm"
        />
        {matches.length ? (
          <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto border border-white/15 bg-[#12141A]">
            {matches.map((vehicle) => (
              <li key={vehicle.id}>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                  onClick={() => addVehicle(vehicle.id)}
                >
                  {vehicle.name}
                  <span className="ml-2 text-[#a39c90]">{vehicleClass(locale, vehicle.class)}</span>
                  {hswEligible(vehicle) ? (
                    <span className="ml-2 text-[#F59E0B]">HSW</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {picked.length >= 2 ? (
        <div className="overflow-x-auto border border-white/10">
          <p className="border-b border-white/10 px-3 py-2 text-xs text-[#a39c90]">
            {t.compare.favorable}
          </p>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#12141A] text-[11px] uppercase tracking-wider text-[#a39c90]">
              <tr>
                <th className="px-3 py-2">{t.compare.stat}</th>
                {picked.map((vehicle) => (
                  <th key={vehicle.id} className="px-3 py-2">
                    {vehicle.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_STATS.map((stat) => {
                const wins = winningIds(picked, stat.id, stat.better)
                return (
                  <tr key={stat.id} className="border-t border-white/10">
                    <th className="px-3 py-2 text-left font-medium text-[#a39c90]">
                      {compareStat(locale, stat.id, stat.label)}
                    </th>
                    {picked.map((vehicle) => (
                      <td
                        key={vehicle.id}
                        className={`px-3 py-2 ${wins.has(vehicle.id) ? 'font-semibold text-[#10B981]' : ''}`}
                      >
                        {statText(vehicle, stat.id, locale) === '—' ? (
                          <span className="text-[#F59E0B]">{t.compare.missing}</span>
                        ) : (
                          statText(vehicle, stat.id, locale)
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-[#a39c90]">
          {t.compare.needTwo}
        </p>
      )}
      <section>
        <h2 className="font-display text-2xl">{t.compare.best}</h2>
        <p className="mt-1 text-sm text-[#a39c90]">{t.compare.bestNote}</p>
        <div className="mt-3 overflow-x-auto border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#12141A] text-[11px] uppercase tracking-wider text-[#a39c90]">
              <tr>
                <th className="px-3 py-2">{t.compare.class}</th>
                <th className="px-3 py-2">{t.compare.bestLap}</th>
                <th className="px-3 py-2">{t.compare.lap}</th>
                <th className="px-3 py-2">{t.compare.topSpeed}</th>
                <th className="px-3 py-2">{t.compare.also}</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((rank) => {
                const leader = rank.byLap[0]
                const speedLeader = rank.bySpeed[0]
                const rest = (
                  leader ? rank.byLap.slice(1) : rank.bySpeed.slice(1)
                ).map((vehicle) => vehicle.name)
                return (
                  <tr key={rank.className} className="border-t border-white/10">
                    <td className="px-3 py-2">
                      <div className="font-semibold">{vehicleClass(locale, rank.className)}</div>
                      <div className="text-xs text-[#a39c90]">
                        {t.compare.inClass(rank.total, rank.measured)}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {leader
                        ? leader.name
                        : speedLeader
                          ? t.compare.bySpeed(speedLeader.name)
                          : t.compare.unmeasured}
                    </td>
                    <td className="px-3 py-2">
                      {leader ? `${leader.lapTime.toFixed(1)} s` : '—'}
                    </td>
                    <td className="px-3 py-2">
                      {leader && leader.topSpeedMph > 0
                        ? `${leader.topSpeedMph} mph`
                        : speedLeader
                          ? `${speedLeader.topSpeedMph} mph`
                          : '—'}
                    </td>
                    <td className="px-3 py-2 text-[#a39c90]">
                      {leader ? (
                        <button
                          type="button"
                          className="mr-3 text-[#3B82F6]"
                          onClick={() => {
                            const next: (string | null)[] = [null, null, null]
                            rank.byLap.slice(0, 3).forEach((vehicle, index) => {
                              next[index] = vehicle.id
                            })
                            writeSlots(next)
                            document
                              .getElementById('compare-slots')
                              ?.scrollIntoView({ block: 'start' })
                          }}
                        >
                          {t.compare.compare}
                        </button>
                      ) : null}
                      {rest.join(' · ') || '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </ModuleFrame>
  )
}
