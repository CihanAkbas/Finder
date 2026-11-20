'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MoreHorizontal, Download, Upload } from 'lucide-react'
import { groupLabel, itemLabel, shortLabel } from '@/i18n/nav'
import { useI18n } from '@/i18n/provider'
import { MORE_NAV, PRIMARY_NAV, NAV_GROUPS, MODULES } from './modules'
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { backupPayload } from '@/lib/backup'
import { downloadJson } from '@/lib/utils'
import { useCompanionStore } from '@/store/useCompanionStore'

export function MobileBottomNav({ gameSlug }: { gameSlug: string }) {
  const pathname = usePathname()
  const [more, setMore] = useState(false)
  const { t } = useI18n()
  const moreActive = MORE_NAV.some((item) =>
    pathname?.startsWith(`/${gameSlug}${item.href}`)
  )
  return (
    <>
      <nav
        className="z-40 grid shrink-0 grid-cols-5 border-t border-white/10 bg-[#0e131a] pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label={t.nav.mobile}
      >
        {PRIMARY_NAV.map((item) => {
          const href = `/${gameSlug}${item.href}`
          const active =
            item.href === '' ? pathname === href : pathname?.startsWith(href)
          const Icon = item.icon
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] ${active ? 'text-emerald-300' : 'text-slate-400'}`}
            >
              <Icon size={19} />
              {shortLabel(item.href, t)}
            </Link>
          )
        })}
        <button
          type="button"
          aria-expanded={more}
          aria-haspopup="dialog"
          className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] ${moreActive ? 'text-emerald-300' : 'text-slate-400'}`}
          onClick={() => setMore(true)}
        >
          <MoreHorizontal size={20} />
          {t.more}
        </button>
      </nav>
      <DialogRoot open={more} onOpenChange={setMore}>
        <DialogContent className="rounded-2xl lg:hidden">
          <DialogTitle className="font-display text-3xl font-semibold">
            {t.nav.moreTitle}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-slate-400">
            {t.nav.moreBody}
          </DialogDescription>
          <div className="mt-5 space-y-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs text-slate-500">{groupLabel(group.label, t)}</p>
                <div className="grid grid-cols-2 gap-2">
                  {group.paths.map((path) => {
                    const item = MODULES.find((entry) => entry.href === path)!
                    const Icon = item.icon
                    const href = `/${gameSlug}${path}`
                    return (
                      <Link
                        key={path}
                        href={href}
                        onClick={() => setMore(false)}
                        className="flex min-h-12 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm"
                      >
                        <Icon size={17} className="text-emerald-300" />
                        {itemLabel(path, t)}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              className="action-secondary flex-1"
              onClick={() =>
                downloadJson(
                  'finder-companion.json',
                  backupPayload(useCompanionStore.getState().byGame)
                )
              }
            >
              <Download size={16} />
              {t.export}
            </button>
            <button
              type="button"
              className="action-secondary flex-1"
              onClick={() => {
                setMore(false)
                useCompanionStore.getState().setImportOpen(true)
              }}
            >
              <Upload size={16} />
              {t.import}
            </button>
          </div>
        </DialogContent>
      </DialogRoot>
    </>
  )
}
