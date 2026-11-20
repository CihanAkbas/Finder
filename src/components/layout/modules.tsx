import type { LucideIcon } from 'lucide-react'
import { Calculator, CalendarClock, CalendarDays, Car, CircleDollarSign, Columns2, Keyboard, Landmark, LayoutDashboard, ListChecks, Map, Trophy, Warehouse } from 'lucide-react'

export type ModuleLink = { href: string; label: string; short: string; icon: LucideIcon }

export const MODULES: ModuleLink[] = [
  { href: '', label: 'Hub', short: 'Hub', icon: LayoutDashboard },
  { href: '/map', label: 'Map', short: 'Map', icon: Map },
  { href: '/checklist', label: '100%', short: '100%', icon: ListChecks },
  { href: '/daily', label: 'Daily', short: 'Daily', icon: CalendarClock },
  { href: '/database', label: 'Database', short: 'Cars', icon: Car },
  { href: '/compare', label: 'Compare', short: 'Compare', icon: Columns2 },
  { href: '/garage', label: 'Garage', short: 'Garage', icon: Warehouse },
  { href: '/empire', label: 'Empire', short: 'Empire', icon: Landmark },
  { href: '/calculators', label: 'Calculators', short: 'Heists', icon: Calculator },
  { href: '/weekly', label: 'Weekly', short: 'Week', icon: CalendarDays },
  { href: '/economy', label: 'Hourly', short: 'Money', icon: CircleDollarSign },
  { href: '/career', label: 'Career', short: 'Career', icon: Trophy },
  { href: '/reference', label: 'Cheats', short: 'Cheats', icon: Keyboard },
]

export const PRIMARY_NAV = MODULES.slice(0, 4)
export const MORE_NAV = MODULES.slice(4)

export const NAV_GROUPS = [
  { label: 'Explore', paths: ['', '/map', '/daily', '/weekly'] },
  { label: 'My progress', paths: ['/checklist', '/career'] },
  { label: 'Collection', paths: ['/database', '/compare', '/garage'] },
  { label: 'Money & tools', paths: ['/empire', '/calculators', '/economy', '/reference'] },
]

/** GTA Online systems. GTA VI has no Online, so these routes stay on GTA V. */
export const ONLINE_PATHS = new Set([
  '/daily',
  '/weekly',
  '/garage',
  '/empire',
  '/calculators',
  '/economy',
  '/career',
])

export function modulesFor(slug: string) {
  if (slug !== 'gta6') return MODULES
  return MODULES.filter((item) => !ONLINE_PATHS.has(item.href))
}

export function groupsFor(slug: string) {
  return NAV_GROUPS.map((group) => ({
    ...group,
    paths: group.paths.filter((path) => slug !== 'gta6' || !ONLINE_PATHS.has(path)),
  })).filter((group) => group.paths.length > 0)
}

export function primaryNavFor(slug: string) {
  return modulesFor(slug).slice(0, 4)
}
