'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { HudSelect } from '@/components/ui/hud-select'
import { catalogNote, vehicleClass, weaponClass } from '@/i18n/catalog'
import { CatalogMark } from '@/components/shared/CatalogMark'
import { SourceNote } from '@/components/shared/SourceNote'
import type { Locale } from '@/i18n/locale'
import type { Messages } from '@/i18n/messages'
import { useI18n } from '@/i18n/provider'
import { dollars } from '@/lib/money'
import type { Vehicle, Weapon } from '@/store/slice'
type Row = {
  id: string
  name: string
  kind: 'vehicle' | 'weapon'
  stats: [string, string][]
}
function hswEligible(vehicle: Vehicle) {
  return Boolean(vehicle.isHsw || vehicle.hsw)
}
function vehicleRow(vehicle: Vehicle, locale: Locale, eligible: string): Row {
  return {
    id: vehicle.id,
    name: vehicle.name,
    kind: 'vehicle',
    stats: [
      ['class', vehicleClass(locale, vehicle.class)],
      ['make', vehicle.manufacturer ?? '—'],
      ['price', vehicle.price > 0 ? dollars(vehicle.price, locale) : '—'],
      [
        'speed',
        vehicle.topSpeedMph > 0
          ? `${vehicle.topSpeedMph} mph · ${vehicle.topSpeedKmh} km/h`
          : '—',
      ],
      ['lap', vehicle.lapTime > 0 ? `${vehicle.lapTime.toFixed(1)} s` : '—'],
      ['source', vehicle.acquisitionSource ? catalogNote(locale, vehicle.acquisitionSource) : '—'],
      ['hsw', hswEligible(vehicle) ? eligible : '—'],
    ],
  }
}
function weaponRow(weapon: Weapon, locale: Locale): Row {
  return {
    id: weapon.id,
    name: weapon.name,
    kind: 'weapon',
    stats: [
      ['class', weaponClass(locale, weapon.class)],
      ['price', weapon.price > 0 ? dollars(weapon.price, locale) : '—'],
      ['damage', String(weapon.damage)],
      ['rpm', weapon.fireRate > 0 ? String(weapon.fireRate) : '—'],
      ['dps', weapon.dps > 0 ? String(weapon.dps) : '—'],
      ['rank', String(weapon.unlockRank)],
    ],
  }
}
function statLabel(key: string, copy: Messages['database']) {
  if (key === 'class') return copy.class
  if (key === 'make') return copy.make
  if (key === 'price') return copy.price
  if (key === 'speed') return copy.speed
  if (key === 'lap') return copy.lap
  if (key === 'source') return copy.source
  if (key === 'hsw') return copy.hsw
  if (key === 'damage') return copy.damage
  if (key === 'rpm') return 'RPM'
  if (key === 'dps') return copy.dps
  if (key === 'rank') return copy.rank
  return key
}
export function DatabaseBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const { t, locale } = useI18n()
  const data = getCompanion(gameSlug)
  const params = useSearchParams()
  const kindParam = params.get('kind')
  const idParam = params.get('id')
  const initial = kindParam === 'weapon' ? 'weapon' : 'vehicle'
  const [kind, setKind] = useState<'vehicle' | 'weapon'>(initial)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'name' | 'speed' | 'price' | 'dps'>('name')
  const [hswOnly, setHswOnly] = useState(false)
  const [source, setSource] = useState('all')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(idParam)
  const [picked, setPicked] = useState<string[]>(() =>
    idParam ? [idParam] : []
  )
  const [trackedKind, setTrackedKind] = useState(kindParam)
  const [trackedId, setTrackedId] = useState(idParam)
  if (kindParam !== trackedKind) {
    setTrackedKind(kindParam)
    if (kindParam === 'weapon' || kindParam === 'vehicle') {
      setKind(kindParam)
      setSort('name')
      setPage(1)
      setDetailId(null)
      setPicked([])
    }
  }
  if (idParam !== trackedId) {
    setTrackedId(idParam)
    if (idParam) {
      setDetailId(idParam)
      setPicked([idParam])
      setPage(1)
    }
  }
  const sources = useMemo(() => {
    const values = new Set(
      (data?.vehicles ?? [])
        .map((vehicle) => vehicle.acquisitionSource)
        .filter((value): value is string => Boolean(value))
    )
    return ['all', ...[...values].sort()]
  }, [data])
  if (!game || !data) return null
  const vehicles = data.vehicles.filter((vehicle) => {
    if (hswOnly && !hswEligible(vehicle)) return false
    if (source !== 'all' && vehicle.acquisitionSource !== source) return false
    return vehicle.name.toLowerCase().includes(query.toLowerCase())
  })
  const weapons = data.weapons.filter((weapon) =>
    weapon.name.toLowerCase().includes(query.toLowerCase())
  )
  const rows =
    kind === 'vehicle'
      ? vehicles.map((vehicle) => vehicleRow(vehicle, locale, t.database.eligible))
      : weapons.map((weapon) => weaponRow(weapon, locale))
  const sorted = [...rows].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name)
    const sourceRows = kind === 'vehicle' ? data.vehicles : data.weapons
    const left = sourceRows.find((item) => item.id === a.id)
    const right = sourceRows.find((item) => item.id === b.id)
    if (!left || !right) return 0
    if (sort === 'speed' && 'topSpeedMph' in left && 'topSpeedMph' in right)
      return right.topSpeedMph - left.topSpeedMph
    if (sort === 'price') return right.price - left.price
    if (sort === 'dps' && 'dps' in left && 'dps' in right)
      return right.dps - left.dps
    return 0
  })
  const pageSize = 40
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
  const compared = picked
    .map((id) => rows.find((row) => row.id === id))
    .filter((row): row is Row => Boolean(row))
    .slice(0, 3)
  const detailVehicle =
    kind === 'vehicle'
      ? data.vehicles.find((vehicle) => vehicle.id === detailId)
      : undefined
  const detailWeapon =
    kind === 'weapon'
      ? data.weapons.find((weapon) => weapon.id === detailId)
      : undefined
  return (
    <ModuleFrame title={t.database.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <SourceNote kind={kind === 'vehicle' ? 'vehicles' : 'weapons'} />
      <p className="text-sm text-[#a39c90]">{t.database.lead}</p>
      <details className="text-sm text-slate-400">
        <summary>{t.database.about}</summary>
        <div className="mt-2 max-w-3xl leading-relaxed">
          <p className="text-sm text-[#a39c90]">
            {t.database.intro}{' '}
            <Link href={`/${game.slug}/compare`} className="text-[#3B82F6]">
              {t.database.classList}
            </Link>
            .
          </p>
        </div>
      </details>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={kind === 'vehicle'}
          className={`h-8 px-3 text-xs uppercase ${kind === 'vehicle' ? 'bg-[#10B981] text-[#04140e]' : 'border border-white/15'}`}
          onClick={() => {
            setKind('vehicle')
            setSort('name')
            setPicked([])
            setDetailId(null)
            setPage(1)
          }}
        >
          {t.database.vehicles}
        </button>
        <button
          type="button"
          aria-pressed={kind === 'weapon'}
          className={`h-8 px-3 text-xs uppercase ${kind === 'weapon' ? 'bg-[#3B82F6] text-white' : 'border border-white/15'}`}
          onClick={() => {
            setKind('weapon')
            setSort('name')
            setPicked([])
            setDetailId(null)
            setHswOnly(false)
            setPage(1)
          }}
        >
          {t.database.weapons}
        </button>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          aria-label={t.database.search}
          placeholder={t.database.searchPlaceholder}
          className="h-8 border border-white/15 bg-black/40 px-2 text-sm"
        />
        <HudSelect
          compact
          label={t.database.sort}
          value={sort}
          onChange={(value) => setSort(value as typeof sort)}
          options={[
            { value: 'name', label: t.database.name },
            { value: 'price', label: t.database.price },
            kind === 'vehicle'
              ? { value: 'speed', label: t.database.speed }
              : { value: 'dps', label: t.database.dps },
          ]}
        />
        {kind === 'vehicle' ? (
          <>
            <HudSelect
              compact
              label={t.database.source}
              value={source}
              onChange={(value) => {
                setSource(value)
                setPage(1)
              }}
              options={sources.map((value) => ({
                value,
                label: value === 'all' ? t.database.allSources : catalogNote(locale, value),
              }))}
            />
            <button
              type="button"
              aria-pressed={hswOnly}
              className={`h-8 px-3 text-xs uppercase ${hswOnly ? 'bg-[#F59E0B] text-[#1a1203]' : 'border border-white/15'}`}
              onClick={() =>
                setHswOnly((value) => {
                  setPage(1)
                  return !value
                })
              }
            >
              {t.database.hsw}
            </button>
          </>
        ) : null}
      </div>
      {detailVehicle ? (
        <article className="border border-white/10 bg-[#12141A] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl">{detailVehicle.name}</h2>
            {detailVehicle.verifiedFootage ? (
              <span className="border border-[#ff4f8b]/50 bg-[#ff4f8b]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff8fb8]">
                {t.database.footage}
              </span>
            ) : null}
            {hswEligible(detailVehicle) ? (
              <span className="border border-[#F59E0B]/50 bg-[#F59E0B]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F59E0B]">
                {t.database.hsw}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-[#d9d3c8]">
            {detailVehicle.manufacturer
              ? `${detailVehicle.manufacturer}. `
              : ''}
            {detailVehicle.acquisitionSource ? catalogNote(locale, detailVehicle.acquisitionSource) : t.database.sourceMissing}
          </p>
          {detailVehicle.spawnLocations?.length ? (
            <p className="mt-1 text-sm text-[#a39c90]">
              {detailVehicle.spawnLocations.join(' ')}
            </p>
          ) : null}
          {detailVehicle.note ? (
            <p className="mt-1 text-sm text-[#a39c90]">{catalogNote(locale, detailVehicle.note)}</p>
          ) : null}
        </article>
      ) : null}
      {detailWeapon ? (
        <article className="border border-white/10 bg-[#12141A] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl">{detailWeapon.name}</h2>
            {detailWeapon.verifiedFootage ? (
              <span className="border border-[#ff4f8b]/50 bg-[#ff4f8b]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff8fb8]">
                {t.database.footage}
              </span>
            ) : null}
            {detailWeapon.mk2 ? (
              <span className="border border-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
                {t.database.mk2}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-[#d9d3c8]">
            {detailWeapon.storyUnlockCondition ? catalogNote(locale, detailWeapon.storyUnlockCondition) : t.database.unlockMissing}
          </p>
          <h3 className="mt-3 text-xs uppercase tracking-[0.14em] text-[#a39c90]">
            {t.database.attachments}
          </h3>
          <ul className="mt-1 space-y-1 text-sm">
            {detailWeapon.attachments?.length ? (
              detailWeapon.attachments.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>{t.database.noAttachments}</li>
            )}
          </ul>
          <h3 className="mt-3 text-xs uppercase tracking-[0.14em] text-[#a39c90]">
            {t.database.spawns}
          </h3>
          <ul className="mt-1 space-y-1 text-sm">
            {detailWeapon.worldSpawns?.length ? (
              detailWeapon.worldSpawns.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>{t.database.noSpawns}</li>
            )}
          </ul>
        </article>
      ) : null}
      {compared.length > 0 ? (
        <div className="grid gap-2 md:grid-cols-3">
          {compared.map((row) => (
            <article
              key={row.id}
              className="border border-[#3B82F6]/50 bg-[#12141A] p-3"
            >
              <h2 className="font-display text-2xl">{row.name}</h2>
              {row.stats.map(([label, value]) => (
                <p key={label} className="text-sm">
                  <span className="text-[#a39c90]">{statLabel(label, t.database)}. </span>
                  {value}
                </p>
              ))}
            </article>
          ))}
        </div>
      ) : null}
      <p className="text-xs text-[#a39c90]">
        {t.database.shown(sorted.length, safePage, pageCount)}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="h-8 border border-white/15 px-3 text-xs uppercase disabled:opacity-40"
          disabled={safePage <= 1}
          onClick={() => setPage(safePage - 1)}
        >
          {t.previous}
        </button>
        <button
          type="button"
          className="h-8 border border-white/15 px-3 text-xs uppercase disabled:opacity-40"
          disabled={safePage >= pageCount}
          onClick={() => setPage(safePage + 1)}
        >
          {t.next}
        </button>
      </div>
      <div className="grid gap-3 md:hidden">
        {visible.map((row) => (
          <article
            key={row.id}
            className="border border-white/10 bg-[#12141A] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                className="text-left"
                onClick={() =>
                  setDetailId((current) => (current === row.id ? null : row.id))
                }
              >
                <span className="text-xs text-emerald-300">
                  {row.stats[0][1]}
                </span>
                <h2 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold">
                  <CatalogMark kind={row.kind === 'weapon' ? 'weapon' : row.stats[0]?.[1] ?? 'car'} label={row.stats[0]?.[1] ?? row.name} />
                  {row.name}
                </h2>
              </button>
              <label className="flex min-h-11 items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={picked.includes(row.id)}
                  onChange={() =>
                    setPicked((current) =>
                      current.includes(row.id)
                        ? current.filter((id) => id !== row.id)
                        : [...current, row.id].slice(-3)
                    )
                  }
                />
                {t.compare.compare}
              </label>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
              {row.stats
                .filter(([label]) =>
                  ['price', 'speed', 'dps', 'damage'].includes(label)
                )
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-slate-500">{statLabel(label, t.database)}</dt>
                    <dd className="mt-1 text-sm font-semibold">{value}</dd>
                  </div>
                ))}
            </dl>
            {detailId === row.id && (
              <dl className="mt-4 space-y-2 border-t border-white/10 pt-3">
                {row.stats.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <dt className="text-slate-400">{statLabel(label, t.database)}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="stat-card text-center">
          <h2 className="font-display text-2xl">{t.database.noMatches}</h2>
          <p className="mt-2 text-sm text-slate-400">{t.database.noMatchesBody}</p>
          <button
            type="button"
            className="action-secondary mt-4"
            onClick={() => {
              setQuery('')
              setSource('all')
              setHswOnly(false)
            }}
          >
            {t.database.clear}
          </button>
        </div>
      )}
      <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#12141A] text-[11px] uppercase tracking-wider text-[#a39c90]">
            <tr>
              <th className="px-3 py-2">{t.compare.compare}</th>
              <th className="px-3 py-2">{t.database.name}</th>
              {sorted[0]?.stats.map(([label]) => (
                <th key={label} className="px-3 py-2">
                  {statLabel(label, t.database)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="border-t border-white/10">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={picked.includes(row.id)}
                    onChange={() =>
                      setPicked((current) =>
                        current.includes(row.id)
                          ? current.filter((id) => id !== row.id)
                          : [...current, row.id].slice(-3)
                      )
                    }
                    aria-label={t.database.compare(row.name)}
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className={`font-semibold ${detailId === row.id ? 'text-[#10B981]' : ''}`}
                    onClick={() =>
                      setDetailId((current) =>
                        current === row.id ? null : row.id
                      )
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <CatalogMark kind={row.kind === 'weapon' ? 'weapon' : row.stats[0]?.[1] ?? 'car'} label={row.stats[0]?.[1] ?? row.name} />
                      {row.name}
                    </span>
                  </button>
                </td>
                {row.stats.map(([label, value]) => (
                  <td key={label} className="px-3 py-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModuleFrame>
  )
}
