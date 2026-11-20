'use client'

import { useMemo, useState } from 'react'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { HudSelect } from '@/components/ui/hud-select'
import { empireCopy, vehicleClass } from '@/i18n/catalog'
import { CatalogMark } from '@/components/shared/CatalogMark'
import { empireTotals } from '@/lib/empire'
import { OWNED_ASSETS } from '@/lib/ownership'
import { normalizeSlice } from '@/store/slice'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'

export function EmpireBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const toggleOwnedAsset = useCompanionStore((state) => state.toggleOwnedAsset)
  const toggleOwnedVehicle = useCompanionStore((state) => state.toggleOwnedVehicle)
  const slice = useMemo(() => normalizeSlice(raw), [raw])
  const { t, locale, money, millions } = useI18n()
  const [includeRegistered, setIncludeRegistered] = useState(false)
  const [query, setQuery] = useState('')
  const [className, setClassName] = useState('all')
  const [ownedOnly, setOwnedOnly] = useState(false)
  const [page, setPage] = useState(1)
  if (!game || !data) return null

  const totals = empireTotals({
    assets: OWNED_ASSETS,
    vehicles: data.vehicles,
    ownedAssets: slice.ownedAssets,
    ownedVehicles: slice.ownedVehicles,
    includeRegistered,
  })
  const ownedAssets = new Set(slice.ownedAssets)
  const ownedVehicles = new Set(slice.ownedVehicles)
  const classes = ['all', ...[...new Set(data.vehicles.map((vehicle) => vehicle.class))].sort()]
  const needle = query.trim().toLowerCase()
  const visibleVehicles = data.vehicles.filter((vehicle) => {
    if (ownedOnly && !ownedVehicles.has(vehicle.id)) return false
    if (className !== 'all' && vehicle.class !== className) return false
    if (needle && !`${vehicle.name} ${vehicle.manufacturer ?? ''}`.toLowerCase().includes(needle)) return false
    return true
  })
  const pageSize = 40
  const pageCount = Math.max(1, Math.ceil(visibleVehicles.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const pageRows = visibleVehicles.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <ModuleFrame title={t.empire.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      {game.slug !== 'gta5' ? (
        <p className="text-sm text-[#a39c90]">{t.empire.empty}</p>
      ) : (
        <>
          <p className="text-sm text-[#a39c90]">{t.empire.intro}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-[#12141A] p-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#10B981]">{t.empire.worth}</div>
              <div className="mt-1 font-mono text-3xl">{millions(totals.worth)}</div>
              <p className="mt-1 text-xs text-[#a39c90]">{t.empire.worthMeta(money(totals.worth), totals.ownedProperties, totals.ownedCars, totals.unpriced)}</p>
            </div>
            <div className="border border-white/10 bg-[#12141A] p-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#F59E0B]">{t.empire.fees}</div>
              <div className="mt-1 font-mono text-3xl">{money(totals.fees)}</div>
              <p className="mt-1 text-xs text-[#a39c90]">{t.empire.feesMeta(money(totals.propertyWorth), money(totals.vehicleWorth))}</p>
            </div>
            <div className="border border-white/10 bg-[#12141A] p-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#a39c90]">{t.empire.registered}</div>
              <div className="mt-1 font-mono text-3xl">{money(totals.registeredFees)}</div>
              <button type="button" aria-pressed={includeRegistered} className={`mt-3 h-8 px-3 text-xs uppercase ${includeRegistered ? 'bg-[#F59E0B] text-[#1a1203]' : 'border border-white/15'}`} onClick={() => setIncludeRegistered((value) => !value)}>
                {includeRegistered ? t.empire.includeFees : t.empire.addFees}
              </button>
            </div>
          </div>
          <section>
            <h2 className="font-display text-2xl">{t.empire.properties}</h2>
            <ul className="mt-3 divide-y divide-white/10 border border-white/10">
              {OWNED_ASSETS.map((asset) => {
                const on = ownedAssets.has(asset.id)
                const copy = empireCopy(locale, asset.id, asset.name, asset.note)
                return (
                  <li key={asset.id} className="flex items-start gap-3 bg-[#12141A] px-3 py-3">
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={t.empire.own(copy.name)}
                      className={`mt-0.5 grid size-6 shrink-0 place-items-center border ${on ? 'border-[#10B981] bg-[#10B981] text-[#04140e]' : 'border-white/20'}`}
                      onClick={() => {
                        const kept = toggleOwnedAsset(game.slug, asset.id)
                        if (!kept) useCompanionStore.getState().showToast(t.garage.blocked)
                      }}
                    >
                      {on ? '✓' : ''}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <CatalogMark kind={asset.kind === 'property' ? 'property' : 'business'} label={copy.name} />
                        {copy.name}
                      </div>
                      <p className="text-xs leading-5 text-[#a39c90]">{asset.id === 'eclipse' ? t.garage.eclipseNote : copy.note}</p>
                      {on && asset.slots > 0 ? <p className="text-xs text-[#10B981]">{t.empire.linked}</p> : null}
                    </div>
                    <div className="text-right text-xs">
                      <div>{money(asset.price)}</div>
                      <div className="text-[#F59E0B]">{asset.dailyFee > 0 ? `${money(asset.dailyFee)}${asset.registeredOnly ? ` ${t.empire.whileRegistered}` : ''}` : t.empire.noFee}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-2xl">{t.empire.garage}</h2>
            <p className="mt-1 text-sm text-[#a39c90]">{t.empire.garageNote}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder={t.empire.filter} aria-label={t.empire.filterLabel} className="h-8 border border-white/15 bg-black/40 px-2 text-sm" />
              <HudSelect compact label={t.empire.class} value={className} onChange={(value) => { setClassName(value); setPage(1) }} options={classes.map((value) => ({ value, label: value === 'all' ? t.empire.allClasses : vehicleClass(locale, value) }))} />
              <button type="button" aria-pressed={ownedOnly} className={`h-8 px-3 text-xs uppercase ${ownedOnly ? 'bg-[#10B981] text-[#04140e]' : 'border border-white/15'}`} onClick={() => { setOwnedOnly((value) => !value); setPage(1) }}>
                {t.empire.ownedOnly}
              </button>
            </div>
            <p className="text-xs text-[#a39c90]">{t.empire.shown(visibleVehicles.length, safePage, pageCount)}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="h-8 border border-white/15 px-3 text-xs uppercase disabled:opacity-40" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>{t.previous}</button>
              <button type="button" className="h-8 border border-white/15 px-3 text-xs uppercase disabled:opacity-40" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>{t.next}</button>
            </div>
            <ul className="divide-y divide-white/10 border border-white/10">
              {pageRows.map((vehicle) => {
                const on = ownedVehicles.has(vehicle.id)
                return (
                  <li key={vehicle.id} className="flex items-center gap-3 bg-[#12141A] px-3 py-2">
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={t.empire.own(vehicle.name)}
                      className={`grid size-6 shrink-0 place-items-center border ${on ? 'border-[#10B981] bg-[#10B981] text-[#04140e]' : 'border-white/20'}`}
                      onClick={() => toggleOwnedVehicle(game.slug, vehicle.id)}
                    >
                      {on ? '✓' : ''}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{vehicle.name}</div>
                      <div className="text-[10px] uppercase tracking-wider text-[#a39c90]">{vehicleClass(locale, vehicle.class)}</div>
                    </div>
                    <div className="text-sm">{vehicle.price > 0 ? money(vehicle.price) : '—'}</div>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}
    </ModuleFrame>
  )
}
