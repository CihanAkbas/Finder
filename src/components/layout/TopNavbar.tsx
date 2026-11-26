'use client'
import Link from 'next/link'
import { AccountButton } from '@/components/auth/AccountButton'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Download, Search, Upload } from 'lucide-react'
import { gameList, getGame } from '@/config/games'
import { getCompanion } from '@/config/companion'
import { backupPayload } from '@/lib/backup'
import { downloadJson } from '@/lib/utils'
import { LanguageSwitch } from '@/i18n/LanguageSwitch'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'
export function TopNavbar({ gameSlug }: { gameSlug: string }) {
  const game = getGame(gameSlug)
  const setSearchOpen = useCompanionStore((state) => state.setSearchOpen)
  const { t } = useI18n()
  if (!game) return null
  return (
    <header className="app-header z-40 flex h-16 shrink-0 items-center gap-2 border-b border-white/[0.07] px-2 sm:gap-4 sm:px-6">
      <a href="#main-content" className="skip-link">
        {t.skip}
      </a>
      <Link
        href={`/${game.slug}`}
        className="font-display text-lg tracking-[0.15em] text-[#10B981]"
      >
        FINDER
      </Link>
      <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-black/20 p-1">
        {gameList.map((entry) => (
          <Link
            key={entry.slug}
            href={`/${entry.slug}`}
            aria-current={entry.slug === game.slug ? 'page' : undefined}
            className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${entry.slug === game.slug ? 'rounded-md bg-emerald-400/15 text-emerald-300' : 'text-[#d9d3c8] hover:bg-white/5'}`}
          >
            {entry.shortTitle}
          </Link>
        ))}
      </div>
      <button
        type="button"
        aria-label={t.searchLabel}
        className="ml-auto flex h-10 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-400 sm:w-56"
        onClick={() => setSearchOpen(true)}
      >
        <Search className="size-3.5" />
        <span className="hidden sm:inline">{t.search}</span>
        <kbd className="ml-auto hidden rounded border border-white/10 px-1.5 text-xs sm:inline">
          /
        </kbd>
      </button>
      <LanguageSwitch />
      <AccountButton />
      <BackupButtons />
    </header>
  )
}
function BackupButtons() {
  const { t } = useI18n()
  return (
    <>
      <button
        type="button"
        aria-label={t.export}
        className="hidden size-10 place-items-center rounded-lg border border-white/10 text-slate-400 hover:border-emerald-400 hover:text-white sm:grid"
        onClick={() => {
          downloadJson(
            'finder-companion.json',
            backupPayload(useCompanionStore.getState().byGame)
          )
          useCompanionStore.getState().showToast(t.backupDownloaded)
        }}
      >
        <Download className="size-4" />
      </button>
      <button
        type="button"
        aria-label={t.import}
        className="hidden size-10 place-items-center rounded-lg border border-white/10 text-slate-400 hover:border-emerald-400 hover:text-white sm:grid"
        onClick={() => useCompanionStore.getState().setImportOpen(true)}
      >
        <Upload className="size-4" />
      </button>
    </>
  )
}
export function useCompanionData(gameSlug: string) {
  return useMemo(() => getCompanion(gameSlug), [gameSlug])
}
export function useHubRouter() {
  return useRouter()
}
