'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react'
import { groupLabel, itemLabel } from '@/i18n/nav'
import { useI18n } from '@/i18n/provider'
import { MODULES, groupsFor } from './modules'

export function SideNavigation({
  gameSlug,
  collapsed,
  onToggle,
}: {
  gameSlug: string
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const { t } = useI18n()
  return (
    <aside
      className={`side-navigation hidden shrink-0 flex-col lg:flex ${collapsed ? 'w-[76px]' : 'w-[220px]'}`}
    >
      <div className="flex h-16 items-center justify-between px-5">
        {!collapsed && (
          <span className="text-xs font-semibold text-slate-500">
            {t.nav.companion}
          </span>
        )}
        <button
          type="button"
          aria-label={collapsed ? t.nav.expand : t.nav.collapse}
          onClick={onToggle}
          className="nav-toggle"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav
        aria-label={t.nav.modules}
        className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4"
      >
        {groupsFor(gameSlug).map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-medium text-slate-500">
                {groupLabel(group.label, t)}
              </p>
            )}
            <div className="space-y-1">
              {group.paths.map((path) => {
                const item = MODULES.find((entry) => entry.href === path)!
                const href = `/${gameSlug}${path}`
                const active =
                  path === '' ? pathname === href : pathname?.startsWith(href)
                const Icon = item.icon
                const label = itemLabel(path, t)
                return (
                  <Link
                    key={path}
                    href={href}
                    title={collapsed ? label : undefined}
                    aria-label={label}
                    aria-current={active ? 'page' : undefined}
                    className={`side-link ${active ? 'is-active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      {!collapsed && (
        <div className="mx-4 mb-5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-500">
          <Compass className="mb-2 text-emerald-400" size={18} />
          {t.nav.deviceNote}
        </div>
      )}
    </aside>
  )
}
