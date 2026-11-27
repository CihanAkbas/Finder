import type { Messages } from '@/i18n/messages'

export function groupLabel(label: string, t: Messages) {
  if (label === 'Explore') return t.nav.explore
  if (label === 'My progress') return t.nav.progress
  if (label === 'Collection') return t.nav.collection
  return t.nav.money
}

export function itemLabel(path: string, t: Messages) {
  if (path === '') return t.nav.hub
  if (path === '/map') return t.nav.map
  if (path === '/checklist') return t.nav.completion
  if (path === '/daily') return t.nav.daily
  if (path === '/weekly') return t.nav.weekly
  if (path === '/database') return t.nav.database
  if (path === '/compare') return t.nav.compare
  if (path === '/style') return t.nav.style
  if (path === '/garage') return t.nav.garage
  if (path === '/empire') return t.nav.empire
  if (path === '/calculators') return t.nav.calculators
  if (path === '/economy') return t.nav.moneyGuide
  if (path === '/career') return t.nav.career
  return t.nav.cheats
}

export function shortLabel(path: string, t: Messages) {
  if (path === '/style') return t.nav.style
  if (path === '') return t.nav.shortHub
  if (path === '/map') return t.nav.shortMap
  if (path === '/checklist') return '100%'
  if (path === '/daily') return t.nav.shortDaily
  if (path === '/database') return t.nav.shortDatabase
  return path
}
