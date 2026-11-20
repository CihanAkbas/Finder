'use client'
import { useMemo, useState } from 'react'
import { Warehouse, Car, Search } from 'lucide-react'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { HudSelect } from '@/components/ui/hud-select'
import { OWNED_ASSETS, assetById } from '@/lib/ownership'
import { normalizeSlice, type SavedProperty } from '@/store/slice'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'
export function GarageBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const slice = useMemo(() => normalizeSlice(raw), [raw])
  const { t, money } = useI18n()
  const [query, setQuery] = useState('')
  const [undo, setUndo] = useState<SavedProperty | null>(null)
  if (!game || !data) return null
  const vehicles = new Map(
    data.vehicles.map((vehicle) => [vehicle.id, vehicle])
  )
  const owned = slice.properties.flatMap((property) =>
    property.slots.filter((id): id is string => Boolean(id))
  )
  const worth = owned.reduce(
    (sum, id) => sum + (vehicles.get(id)?.price ?? 0),
    0
  )
  const dupes = owned.filter((id, index) => owned.indexOf(id) !== index)
  return (
    <ModuleFrame title={t.garage.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <p className="text-sm text-[#a39c90]">{t.garage.intro}</p>
      <div className="border border-white/10 bg-[#12141A] p-4">
        <div className="font-display text-3xl text-[#10B981]">{money(worth)}</div>
        <p className="text-xs text-[#a39c90]">
          {t.garage.parked(owned.length)}
          {dupes.length
            ? ` · ${t.garage.duplicates}: ${[...new Set(dupes)].map((id) => vehicles.get(id)?.name).join(', ')}`
            : ''}
        </p>
      </div>
      <ul className="divide-y divide-white/10 border border-white/10">
        {OWNED_ASSETS.map((asset) => {
          const on = slice.ownedAssets.includes(asset.id)
          return (
            <li key={asset.id} className="flex items-center gap-3 bg-[#12141A] px-3 py-2">
              <button
                type="button"
                aria-pressed={on}
                aria-label={t.empire.own(asset.name)}
                className={`grid size-6 shrink-0 place-items-center border ${on ? 'border-[#10B981] bg-[#10B981] text-[#04140e]' : 'border-white/20'}`}
                onClick={() => {
                  const kept = useCompanionStore.getState().toggleOwnedAsset(game.slug, asset.id)
                  if (!kept) useCompanionStore.getState().showToast(t.garage.blocked)
                }}
              >
                {on ? '✓' : ''}
              </button>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{asset.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#a39c90]">
                  {asset.slots > 0 ? t.garage.bays(asset.slots) : t.garage.noBays}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {slice.properties.length === 0 && data.properties.length > 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-400/20 bg-emerald-400/[0.03] px-6 py-10 text-center">
          <Warehouse className="mx-auto text-emerald-300" size={40} />
          <h2 className="mt-4 font-display text-3xl font-semibold">
            {t.garage.emptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            {t.garage.emptyBody}
          </p>
        </div>
      ) : null}
      {slice.properties.length > 0 && (
        <details className="rounded-xl border border-white/10 p-4">
          <summary className="flex items-center gap-2 text-sm text-slate-400">
            <Car size={18} />
            {t.garage.browse}
          </summary>
          <label className="my-4 flex items-center gap-2">
            <Search size={17} />
            <input
              aria-label={t.garage.search}
              placeholder={t.garage.find}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full border border-white/10 bg-black/20 px-3 text-sm"
            />
          </label>
          <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pb-2">
            {data.vehicles
              .filter((v) => v.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 60)
              .map((vehicle) => (
                <div
                  key={vehicle.id}
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData('text/plain', vehicle.id)
                  }
                  className="shrink-0 cursor-grab border border-white/10 bg-[#12141A] px-3 py-2 text-xs"
                >
                  {vehicle.name}
                </div>
              ))}
          </div>
        </details>
      )}
      {undo ? (
        <div className="flex items-center justify-between gap-3 border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-2 text-sm">
          <span>{t.garage.removed}</span>
          <button
            type="button"
            className="h-8 bg-[#F59E0B] px-3 text-xs font-semibold uppercase text-[#1a1203]"
            onClick={() => {
              useCompanionStore.getState().restoreProperty(game.slug, undo)
              setUndo(null)
              useCompanionStore.getState().showToast(t.garage.restored)
            }}
          >
            {t.garage.undo}
          </button>
        </div>
      ) : null}
      {slice.properties.map((property) => (
        <section
          key={property.id}
          className="border border-white/10 bg-[#12141A] p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl">{property.name}</h2>
              {assetById(property.templateId) && slice.ownedAssets.includes(assetById(property.templateId)?.id ?? '') ? (
                <p className="text-xs text-[#10B981]">{t.garage.inEmpire}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="text-xs text-red-300"
              onClick={() => {
                const removed = useCompanionStore.getState().removeProperty(game.slug, property.id)
                if (!removed) {
                  useCompanionStore.getState().showToast(t.garage.blocked)
                  return
                }
                setUndo(property)
              }}
            >
              {t.remove}
            </button>
          </div>
          <label className="mt-2 block text-xs text-[#a39c90]">
            {t.garage.note}
            <input
              defaultValue={property.note ?? ''}
              aria-label={`${property.name} ${t.garage.note}`}
              maxLength={280}
              onBlur={(event) => useCompanionStore.getState().setPropertyNote(game.slug, property.id, event.target.value)}
              className="mt-1 h-8 w-full border border-white/15 bg-black/40 px-2 text-sm text-[#f3efe6]"
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {property.slots.map((vehicleId, index) => (
              <div
                key={`${property.id}-${index}`}
                className="min-h-24 rounded-xl border border-dashed border-white/15 bg-black/10 p-3"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  const id = event.dataTransfer.getData('text/plain')
                  if (vehicles.has(id))
                    useCompanionStore
                      .getState()
                      .assignSlot(game.slug, property.id, index, id)
                }}
              >
                <div className="text-[10px] text-[#a39c90]">
                  {t.garage.slot(index + 1)}
                </div>
                <div className="mt-1">
                  <HudSelect
                    compact
                    label={t.garage.slotLabel(property.name, index + 1)}
                    value={vehicleId ?? ''}
                    onChange={(value) =>
                      useCompanionStore
                        .getState()
                        .assignSlot(
                          game.slug,
                          property.id,
                          index,
                          value || null
                        )
                    }
                    options={[
                      { value: '', label: t.compare.empty },
                      ...data.vehicles.map((vehicle) => ({
                        value: vehicle.id,
                        label: vehicle.name,
                      })),
                    ]}
                  />
                </div>
                <input
                  defaultValue={property.slotNotes?.[index] ?? ''}
                  aria-label={t.garage.noteLabel(index + 1)}
                  placeholder={t.garage.note}
                  maxLength={280}
                  onBlur={(event) => useCompanionStore.getState().setSlotNote(game.slug, property.id, index, event.target.value)}
                  className="mt-2 h-8 w-full border border-white/10 bg-black/30 px-2 text-xs"
                />
                {vehicleId ? (
                  <label className="mt-2 block text-[10px] text-[#a39c90]">
                    {t.garage.move}
                    <select
                      aria-label={`${t.garage.move} ${vehicles.get(vehicleId)?.name ?? ''}`}
                      defaultValue=""
                      onChange={(event) => {
                        const [toId, toIndex] = event.target.value.split(':')
                        if (!toId) return
                        useCompanionStore.getState().moveVehicle(game.slug, property.id, index, toId, Number(toIndex))
                        useCompanionStore.getState().showToast(t.garage.moved)
                        event.target.value = ''
                      }}
                      className="mt-1 h-8 w-full border border-white/10 bg-[#0A0B0E] text-xs text-[#f3efe6]"
                    >
                      <option value="">{t.garage.move}</option>
                      {slice.properties.flatMap((target) =>
                        target.slots.flatMap((slot, slotIndex) => {
                          if (target.id === property.id && slotIndex === index) return []
                          if (slot) return []
                          return [
                            <option key={`${target.id}:${slotIndex}`} value={`${target.id}:${slotIndex}`}>
                              {target.name} · {t.garage.slot(slotIndex + 1)}
                            </option>,
                          ]
                        }),
                      )}
                    </select>
                  </label>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </ModuleFrame>
  )
}
