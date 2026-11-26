'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SideNavigation } from './SideNavigation'
import { useI18n } from '@/i18n/provider'
import { useCompanionStore } from '@/store/useCompanionStore'
import { GlobalCommandPalette } from '@/components/shared/GlobalCommandPalette'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { TopNavbar } from '@/components/layout/TopNavbar'

export function CompanionShell({
  gameSlug,
  children,
}: {
  gameSlug: string
  children: React.ReactNode
}) {
  const toast = useCompanionStore((state) => state.toast)
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)
  const onMap = pathname?.endsWith('/map')

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        useCompanionStore.getState().setSearchOpen(true)
        return
      }
      if (typing) return
      if (event.key === '/') {
        event.preventDefault()
        useCompanionStore.getState().setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-dvh flex-col bg-[#0A0B0E] text-[#f3efe6]">
      <TopNavbar gameSlug={gameSlug} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNavigation
          gameSlug={gameSlug}
          collapsed={onMap ? !mapExpanded : collapsed}
          onToggle={() =>
            onMap ? setMapExpanded(!mapExpanded) : setCollapsed(!collapsed)
          }
        />
        <main
          id="main-content"
          className="relative min-w-0 flex-1 overflow-hidden"
        >
          <div className="absolute inset-0">{children}</div>
        </main>
      </div>
      <MobileBottomNav gameSlug={gameSlug} />
      <GlobalCommandPalette gameSlug={gameSlug} />
      {toast ? (
        <div className="pointer-events-none fixed left-1/2 top-16 z-[80] -translate-x-1/2 border border-[#10B981]/50 bg-black/85 px-4 py-2 text-sm">
          {toast}
        </div>
      ) : null}
    </div>
  )
}

export function ModuleFrame({
  title,
  kicker,
  children,
}: {
  title: string
  kicker: string
  children: React.ReactNode
}) {
  return (
    <div className="module-scroll h-full overflow-y-auto">
      <div className="module-content mx-auto max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#10B981]">
          {kicker}
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <div className="module-body mt-6 space-y-5 pb-8">{children}</div>
      </div>
    </div>
  )
}

export function LaunchingSoon({ slug }: { slug: string }) {
  const { t } = useI18n()
  return (
    <p className="border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-2 text-sm text-amber-100">
      {slug === 'gta6' ? t.launch.gta6 : t.launch.more} {t.launch.body}
    </p>
  )
}
