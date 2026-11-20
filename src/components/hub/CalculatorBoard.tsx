'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { LaunchingSoon, ModuleFrame } from '@/components/layout/CompanionShell'
import { HudSelect } from '@/components/ui/hud-select'
import { crewCutLimits, heistPayout, splitPot } from '@/lib/heist'
import { normalizeSlice } from '@/store/slice'
import { businessCopy, stockInstruction } from '@/i18n/catalog'
import { sharesBusiness } from '@/lib/ownership'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'
export function CalculatorBoard({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const data = getCompanion(gameSlug)
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const heistParam = params.get('heist')
  const raw = useCompanionStore((state) => state.byGame[gameSlug])
  const slice = useMemo(() => normalizeSlice(raw), [raw])
  const [tab, setTab] = useState<'heists' | 'businesses' | 'stocks'>('heists')
  const [heistId, setHeistId] = useState(
    heistParam ?? data?.heists[0]?.id ?? ''
  )
  const [trackedHeist, setTrackedHeist] = useState(heistParam)
  const [primary, setPrimary] = useState(
    data?.heists?.find(
      (item) => item.id === (heistParam ?? data?.heists[0]?.id)
    )?.targets[0]?.id ?? ''
  )
  const [secondaries, setSecondaries] = useState<string[]>([])
  const [hard, setHard] = useState(false)
  const [cuts, setCuts] = useState([0, 15, 15, 15])
  const [players, setPlayers] = useState(2)
  const [now, setNow] = useState(() => Date.now())
  const alerted = useRef(new Set<string>())
  const { t, locale, money: formatMoney } = useI18n()
  if (heistParam && heistParam !== trackedHeist) {
    setTrackedHeist(heistParam)
    const next = data?.heists.find((item) => item.id === heistParam)
    if (next) {
      setHeistId(next.id)
      setPrimary(next.targets[0]?.id ?? '')
      setSecondaries([])
      setPlayers(next.maxPlayers ?? next.minPlayers ?? 2)
    }
  }
  const heist =
    data?.heists.find((item) => item.id === heistId) ?? data?.heists[0]
  useEffect(() => {
    if (!data) return
    const timer = window.setInterval(() => {
      const now = Date.now()
      setNow(now)
      for (const business of data.businesses) {
        const started =
          useCompanionStore.getState().byGame[gameSlug]?.businesses?.[
            business.id
          ]?.startedAt
        if (!started) continue
        const ready =
          now - Date.parse(started) >= business.hoursToFill * 3_600_000
        if (!ready || alerted.current.has(business.id)) continue
        alerted.current.add(business.id)
        useCompanionStore
          .getState()
          .showToast(t.calc.ready(business.name))
        try {
          const context = new AudioContext()
          const osc = context.createOscillator()
          const gain = context.createGain()
          osc.frequency.value = 880
          gain.gain.value = 0.04
          osc.connect(gain)
          gain.connect(context.destination)
          osc.start()
          osc.stop(context.currentTime + 0.15)
        } catch {
          // Autoplay can block the beep. The toast still fires.
        }
      }
    }, 5000)
    return () => window.clearInterval(timer)
  }, [data, gameSlug, t])
  if (!game || !data || !heist) {
    return game ? (
      <ModuleFrame title={t.nav.calculators} kicker={game.shortTitle}>
        <LaunchingSoon slug={game.slug} />
      </ModuleFrame>
    ) : null
  }
  const minPlayers = heist.minPlayers ?? 1
  const maxPlayers = heist.maxPlayers ?? 4
  const crew = Math.min(maxPlayers, Math.max(minPlayers, players))
  const money = heistPayout(heist, primary, secondaries, hard)
  const activeCuts = cuts.slice(0, crew)
  const shares = splitPot(money.pot, activeCuts)
  const limits = crewCutLimits(crew)
  const hostCut = shares[0]?.cut ?? 0
  return (
    <ModuleFrame title={t.calc.title} kicker={game.shortTitle}>
      {game.status === 'preview' ? <LaunchingSoon slug={game.slug} /> : null}
      <div
        className="flex gap-2 overflow-x-auto"
        role="tablist"
        aria-label={t.calc.tools}
      >
        {(['heists', 'businesses', 'stocks'] as const).map((item) => (
          <button
            key={item}
            id={`tab-${item}`}
            role="tab"
            tabIndex={tab === item ? 0 : -1}
            onKeyDown={(event) => {
              const items = ['heists', 'businesses', 'stocks'] as const
              const index = items.indexOf(item)
              const next =
                event.key === 'ArrowRight'
                  ? items[(index + 1) % 3]
                  : event.key === 'ArrowLeft'
                    ? items[(index + 2) % 3]
                    : event.key === 'Home'
                      ? items[0]
                      : event.key === 'End'
                        ? items[2]
                        : null
              if (next) {
                event.preventDefault()
                setTab(next)
                document.getElementById(`tab-${next}`)?.focus()
              }
            }}
            aria-controls={`panel-${item}`}
            aria-selected={tab === item}
            type="button"
            onClick={() => setTab(item)}
            className={`min-h-11 rounded-lg px-5 text-sm font-medium ${tab === item ? 'bg-emerald-400/15 text-emerald-300' : 'border border-white/10 text-slate-400'}`}
          >
            {t.calc.tabs[item]}
          </button>
        ))}
      </div>
      <section
        hidden={tab !== 'heists'}
        role="tabpanel"
        id="panel-heists"
        aria-labelledby="tab-heists"
        className="border border-white/10 bg-[#12141A] p-4 sm:p-6"
      >
        <div className="mb-6 rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-5">
          <p className="eyebrow">{t.calc.hostTake}</p>
          <p className="mt-2 font-display text-4xl font-semibold text-emerald-300">
            {formatMoney(shares[0]?.take ?? 0)}
          </p>
          <p className="mt-1 text-sm text-slate-400">{t.calc.potShare(hostCut, crew)}</p>
        </div>
        <h2 className="font-display text-2xl text-[#10B981]">{t.calc.heist}</h2>
        <p className="mt-1 text-xs text-[#a39c90]">{t.calc.heistNote}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <HudSelect
            label={t.calc.heistLabel}
            value={heist.id}
            options={data.heists.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onChange={(id) => {
              const next = data.heists.find((item) => item.id === id)
              setHeistId(id)
              setPrimary(next?.targets[0]?.id ?? '')
              setSecondaries([])
              if (next) setPlayers(next.maxPlayers ?? next.minPlayers ?? 2)
              router.replace(`${pathname}?heist=${id}`, { scroll: false })
            }}
          />
          <HudSelect
            label={t.calc.primary}
            value={primary}
            options={heist.targets.map((target) => ({
              value: target.id,
              label: `${target.name} · ${formatMoney(target.value)}`,
            }))}
            onChange={setPrimary}
          />
          {heist.hardModeBonus > 0 ? (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hard}
                onChange={(event) => setHard(event.target.checked)}
              />{' '}
              {t.calc.hard(Math.round(heist.hardModeBonus * 100))}
            </label>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {heist.secondaries.map((item) => (
            <label key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={secondaries.includes(item.id)}
                onChange={() =>
                  setSecondaries((current) =>
                    current.includes(item.id)
                      ? current.filter((id) => id !== item.id)
                      : [...current, item.id]
                  )
                }
              />
              {item.name}
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm">
          {t.calc.gross(formatMoney(money.gross), formatMoney(money.fee), formatMoney(money.pot))}
        </p>
        <label className="mt-2 block text-xs text-[#a39c90]">
          {t.calc.players(crew)}
          <input
            type="range"
            min={minPlayers}
            max={maxPlayers}
            value={crew}
            disabled={minPlayers === maxPlayers}
            onChange={(event) => setPlayers(Number(event.target.value))}
          />
        </label>
        {shares.slice(1).map((share, index) => (
          <label key={index} className="mt-2 block text-xs text-[#a39c90]">
            {t.calc.playerCut(index + 2, share.cut)}
            <input
              type="range"
              min={limits.min}
              max={limits.max}
              value={share.cut}
              onChange={(event) =>
                setCuts((current) =>
                  current.map((value, slot) =>
                    slot === index + 1 ? Number(event.target.value) : value
                  )
                )
              }
            />
          </label>
        ))}
        <p className="mt-2 text-xs text-[#a39c90]">
          {t.calc.cutRule}
        </p>
        {hostCut < limits.min && crew > 1 ? (
          <p className="mt-2 text-sm text-[#F59E0B]">
            {t.calc.hostLow(limits.min)}
          </p>
        ) : null}
        <ul className="mt-3 space-y-1 text-sm">
          {shares.map((share, index) => (
            <li key={index}>
              {t.calc.share(index === 0 ? t.calc.host : t.calc.player(index + 1), share.cut, formatMoney(share.take))}
            </li>
          ))}
        </ul>
      </section>
      <section
        hidden={tab !== 'businesses'}
        role="tabpanel"
        id="panel-businesses"
        aria-labelledby="tab-businesses"
        className="grid gap-3 md:grid-cols-2"
      >
        {data.businesses.map((business) => {
          const started = slice.businesses[business.id]?.startedAt
          const elapsed = started ? (now - Date.parse(started)) / 3_600_000 : 0
          const progress = Math.max(
            0,
            Math.min(1, elapsed / business.hoursToFill)
          )
          const value = Math.round(business.maxValue * progress)
          return (
            <article
              key={business.id}
              className="border border-white/10 bg-[#12141A] p-4"
            >
              <h2 className="font-display text-2xl">{businessCopy(locale, business.id, business.name, business.note).name}</h2>
              {sharesBusiness(business.id) ? (
                <button
                  type="button"
                  aria-pressed={slice.ownedAssets.includes(business.id)}
                  className={`mt-2 h-8 px-3 text-xs uppercase ${slice.ownedAssets.includes(business.id) ? 'bg-[#10B981] text-[#04140e]' : 'border border-white/15'}`}
                  onClick={() => {
                    const kept = useCompanionStore.getState().toggleOwnedAsset(game.slug, business.id)
                    if (!kept) useCompanionStore.getState().showToast(t.garage.blocked)
                  }}
                >
                  {slice.ownedAssets.includes(business.id) ? t.calc.inEmpire : t.calc.notOwned}
                </button>
              ) : null}
              <p className="text-xs text-[#a39c90]">{businessCopy(locale, business.id, business.name, business.note).note}</p>
              <div className="mt-3 h-2 bg-white/10">
                <div
                  className="h-full bg-[#10B981]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-sm">
                {formatMoney(value)} / {formatMoney(business.maxValue)}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="h-8 bg-[#10B981] px-3 text-xs font-semibold text-[#04140e]"
                  onClick={() => {
                    alerted.current.delete(business.id)
                    useCompanionStore
                      .getState()
                      .setBusinessStart(
                        game.slug,
                        business.id,
                        new Date().toISOString()
                      )
                  }}
                >
                  {t.start}
                </button>
                <button
                  type="button"
                  className="h-8 border border-white/15 px-3 text-xs"
                  onClick={() =>
                    useCompanionStore
                      .getState()
                      .setBusinessStart(game.slug, business.id, null)
                  }
                >
                  {t.reset}
                </button>
              </div>
            </article>
          )
        })}
      </section>
      <section
        hidden={tab !== 'stocks'}
        role="tabpanel"
        id="panel-stocks"
        aria-labelledby="tab-stocks"
        className="border border-white/10 bg-[#12141A] p-4"
      >
        <h2 className="font-display text-2xl text-[#F59E0B]">
          {t.calc.stocks}
        </h2>
        <p className="mt-1 text-sm text-[#a39c90]">{t.calc.stocksNote}</p>
        <label className="mt-3 block text-sm">
          {t.calc.startingCash}
          <input
            type="number"
            min={0}
            value={slice.stockStart}
            onChange={(event) =>
              useCompanionStore
                .getState()
                .setStockStart(game.slug, Number(event.target.value) || 0)
            }
            className="mt-1 h-10 w-full border border-white/15 bg-black/40 px-2"
          />
        </label>
        <ol className="mt-4 space-y-3">
          {data.stocks.map((step, index) => {
            const before = data.stocks
              .slice(0, index)
              .reduce((cash, item) => cash * item.multiplier, slice.stockStart)
            const after = before * step.multiplier
            return (
              <li key={step.id} className="border border-white/10 p-3">
                <div className="text-sm font-semibold">
                  {step.order}. {step.mission}
                </div>
                <p className="text-xs text-[#3B82F6]">
                  {step.ticker} · {step.company} · {step.exchange} · ×
                  {step.multiplier.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-[#d9d3c8]">
                  {stockInstruction(locale, step.id, step.instruction)}
                </p>
                <p className="mt-1 font-mono text-xs">
                  {formatMoney(before)} → {formatMoney(after)}
                </p>
              </li>
            )
          })}
        </ol>
      </section>
    </ModuleFrame>
  )
}
