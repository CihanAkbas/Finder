import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import gta5Checklist from '../config/games/gta5/checklist.json'
import gta6Checklist from '../config/games/gta6/checklist.json'
import { markerDescription, markerTitle } from '../i18n/markerText'
import { weightedCompletion } from './checklist'
import { parseBackup } from './backup'
import { chooseProgressCopy } from './idbStorage'
import { splitPot } from './heist'
import { applyOwnership } from './ownership'
import { CATALOG_REVISION } from './provenance'
import { thisWeek, SCHEDULE_WEEKS } from './weekly'
import { emptySlice, normalizeSlice, type ChecklistItem } from '../store/slice'
import { GTA6_NOISE_LAYERS, seedGta6Layers, hiddenCategoryIds } from '../config/games/gta6/playLayers'
import { applyMapSearch } from './mapUrl'
import { coordText, roundCoord } from './utils'

const minimal = JSON.stringify({
  app: 'finder',
  version: 1,
  games: { gta5: { found: ['gta5-chiliad'] } },
})

test('GTA VI defaults are seeded once and explicit filters survive reload and backup', () => {
  const fresh = emptySlice()
  assert.deepEqual(hiddenCategoryIds('gta6', fresh), GTA6_NOISE_LAYERS)
  const seeded = seedGta6Layers('gta6', fresh)
  assert.equal(seeded.layerSetup, true)
  assert.deepEqual(seeded.hiddenCategories, GTA6_NOISE_LAYERS)
  const shown = { ...seeded, hiddenCategories: [] }
  assert.equal(seedGta6Layers('gta6', shown), shown)
  const restored = parseBackup(JSON.stringify({ app: 'finder', version: 1, games: { gta6: shown } })).gta6
  assert.deepEqual(hiddenCategoryIds('gta6', seedGta6Layers('gta6', restored)), [])
  const chosen = { ...fresh, hiddenCategories: ['mg-29041'] }
  assert.deepEqual(seedGta6Layers('gta6', chosen).hiddenCategories, chosen.hiddenCategories)
  assert.equal(seedGta6Layers('gta5', fresh), fresh)
  assert.throws(() => parseBackup(JSON.stringify({ games: { gta6: { layerSetup: 'yes' } } })))
})

test('GTA VI shared views retain geographic precision while GTA V keeps world coordinates', () => {
  const view = { x: -0.6578412, y: 0.7123456, z: 15.25 }
  const url = new URL('https://finder.test/gta6/map')
  applyMapSearch(url, 'gta6', view)
  assert.ok(Math.abs(Number(url.searchParams.get('x')) - view.x) < 0.000001)
  assert.ok(Math.abs(Number(url.searchParams.get('y')) - view.y) < 0.000001)
  assert.equal(url.searchParams.get('z'), '15.25')
  applyMapSearch(url, 'gta5', { x: 1234.567, y: -987.654, z: 5 })
  assert.equal(url.searchParams.get('x'), '1234.57')
  assert.equal(url.searchParams.get('y'), '-987.65')
})

test('geographic pin coordinates survive saving and copying without moving to a rounded grid', () => {
  const x = -0.6578412
  const y = 0.7123456
  assert.equal(coordText({ x, y }, 6), '-0.657841, 0.712346')
  assert.ok(Math.abs(roundCoord(x, 6) - x) < 0.000001)
  assert.ok(Math.abs(roundCoord(y, 6) - y) < 0.000001)
  assert.equal(coordText({ x: 1234.567, y: -987.654 }), '1234.57, -987.65')
})

test('a readable save survives a blank or broken copy', () => {
  const saved = JSON.stringify({ state: { byGame: { gta5: { found: ['a', 'b'], checklistDone: ['c'] } } } })
  assert.equal(chooseProgressCopy({ value: null, clock: 9 }, { value: saved, clock: 1 }), saved)
  assert.equal(chooseProgressCopy({ value: '{', clock: 9 }, { value: saved, clock: 1 }), saved)
  assert.equal(chooseProgressCopy({ value: saved, clock: 3 }, { value: null, clock: 8 }), saved)
})

test('the newer clock wins, and an equal clock keeps the fuller save', () => {
  const small = JSON.stringify({ state: { byGame: { gta5: { found: ['a'] } } } })
  const large = JSON.stringify({ state: { byGame: { gta5: { found: ['a', 'b', 'c'] } } } })
  assert.equal(chooseProgressCopy({ value: small, clock: 5 }, { value: large, clock: 4 }), small)
  assert.equal(chooseProgressCopy({ value: small, clock: 2 }, { value: large, clock: 2 }), large)
})

test('a backup with a bad list is rejected and nothing is returned', () => {
  assert.throws(() => parseBackup(''), /empty/i)
  assert.throws(() => parseBackup(JSON.stringify({ app: 'finder', version: 1, games: { gta5: { found: 'nope' } } })))
  assert.throws(() => parseBackup(JSON.stringify({ app: 'finder', version: 9, games: { gta5: {} } })))
})

test('missing progress fields stay empty and new lists do not require a persist version bump', () => {
  const games = parseBackup(minimal)
  assert.deepEqual(games.gta5.found, ['gta5-chiliad'])
  assert.deepEqual(games.gta5.favorites, [])
  assert.deepEqual(games.gta5.route, [])
  assert.deepEqual(games.gta5.savedFilters, [])
  assert.deepEqual(games.gta5.ownedAssets, [])
  const fresh = normalizeSlice(null)
  assert.deepEqual(fresh.favorites, emptySlice().favorites)
  assert.equal(fresh.mapMode, 'story')
})

test('a saved view with the wrong shape rejects the whole backup', () => {
  const bad = JSON.stringify({
    app: 'finder',
    version: 1,
    games: { gta5: { savedFilters: [{ id: 'view-1', name: 'Night', hideFound: 'yes', hiddenCategories: [] }] } },
  })
  assert.throws(() => parseBackup(bad))
  const good = JSON.stringify({
    app: 'finder',
    version: 1,
    games: { gta5: { savedFilters: [{ id: 'view-1', name: 'Night', hideFound: true, hiddenCategories: ['peyote-plants'] }] } },
  })
  assert.equal(parseBackup(good).gta5.savedFilters[0]?.name, 'Night')
})

test('heist cuts stay inside the pot', () => {
  const shares = splitPot(1_000_000, [55, 15, 15, 15])
  assert.equal(shares.reduce((sum, share) => sum + share.cut, 0), 100)
  assert.equal(shares.reduce((sum, share) => sum + share.take, 0), 1_000_000)
  assert.ok(shares.every((share) => share.cut >= 15 && share.cut <= 70))
})

test('empire and garage share one ownership record, and parked cars block removal', () => {
  const owned = applyOwnership(emptySlice(), 'office', true)
  if (owned === 'blocked') throw new Error('owning an empty office should not block')
  assert.ok(owned.ownedAssets.includes('office'))
  assert.equal(owned.properties[0]?.templateId, 'office')
  assert.equal(owned.properties[0]?.slots.length, 20)

  const parked = {
    ...owned,
    properties: owned.properties.map((property, index) => index === 0 ? { ...property, slots: ['adder', ...property.slots.slice(1)] } : property),
  }
  assert.equal(applyOwnership(parked, 'office', false), 'blocked')
  assert.deepEqual(parked.ownedAssets, ['office'])

  const cleared = applyOwnership(owned, 'office', false)
  if (cleared === 'blocked') throw new Error('an empty office should leave')
  assert.deepEqual(cleared.ownedAssets, [])
  assert.deepEqual(cleared.properties, [])

  const penthouse = applyOwnership(emptySlice(), 'penthouse', true)
  if (penthouse === 'blocked') throw new Error('penthouse')
  assert.equal(penthouse.properties[0]?.templateId, 'casino')
})

test('the weekly archive repeats every four Thursday resets', () => {
  const first = thisWeek(new Date('2026-11-05T10:00:00Z'))
  const again = thisWeek(new Date('2026-12-03T10:00:00Z'))
  assert.equal(SCHEDULE_WEEKS, 4)
  assert.deepEqual(again.bonuses, first.bonuses)
  assert.equal(again.podium.name, first.podium.name)
})

test('the catalog revision is a date, not a claim of live data', () => {
  assert.match(CATALOG_REVISION, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(!Number.isNaN(Date.parse(`${CATALOG_REVISION}T00:00:00Z`)))
})

test('GTA VI checklist uses the published weights and leaves the GTA V formula alone', () => {
  const vi = gta6Checklist as ChecklistItem[]
  const shares = vi.filter((item) => item.requiredFor100).reduce((sum, item) => sum + (item.share ?? 0), 0)
  assert.equal(shares, 99)
  assert.equal(weightedCompletion(vi, new Set(), new Set(), []).percent, 0)
  assert.equal(weightedCompletion(vi, new Set(), new Set(['gta6-main-story']), []).percent, 50)
  const five = weightedCompletion(gta5Checklist as ChecklistItem[], new Set(), new Set(), [])
  assert.equal(five.rows.find((row) => row.group === 'story')?.weight, 55)
})

test('patterned marker cards translate and place names stay', () => {
  const markers = JSON.parse(readFileSync(new URL('../config/games/gta5/markers.json', import.meta.url), 'utf8')) as Array<{ title: string; description: string }>
  const stunt = markers.find((marker) => marker.title.startsWith('Stunt Jump 01'))
  const part = markers.find((marker) => marker.title === 'Spaceship Part 23')
  const knife = markers.find((marker) => marker.title === 'Knife Flight 8')
  assert.ok(stunt && part && knife)
  assert.equal(markerTitle('en', stunt.title), stunt.title)
  assert.match(markerTitle('tr', stunt.title), /^Stunt atlayışı 01 — .+Hills$/)
  assert.equal(markerTitle('tr', part.title), 'Uzay gemisi parçası 23')
  assert.equal(markerTitle('tr', knife.title), 'Bıçak uçuşu 8')
  assert.match(markerDescription('tr', stunt.description), /^Hikaye modu rampası,/)
  assert.doesNotMatch(markerDescription('tr', stunt.description), /Hit it|target zone/)
  assert.match(markerDescription('tr', part.description), /uzay gemisi parçasından biri/)
  assert.doesNotMatch(markerDescription('tr', part.description), /Pick it up/)
  assert.match(markerDescription('tr', knife.description), /^Bir bıçak uçuşu kapısı/)
  assert.match(markerDescription('tr', knife.description), /%100/)

  const keepHead = new Set(['Humane Labs and Research', 'GWC and Golfing Society'])
  const english = /\b(the|with|from|after|this|that|where|when|into|onto|under|over|before|toward|towards|count|counts|purchasable|possible|known|start point|storefront)\b/i
  const missed = new Set<string>()
  for (const marker of markers) {
    const translated = markerDescription('tr', marker.description)
    const splitAt = marker.description.indexOf('. ')
    if (splitAt === -1) {
      if (translated === marker.description && !keepHead.has(marker.description) && (english.test(marker.description) || /\s[a-z]{2,}/.test(marker.description))) missed.add(marker.description)
      continue
    }
    const tail = marker.description.slice(splitAt + 2)
    if (translated.endsWith(tail) && english.test(tail)) missed.add(tail)
    const head = marker.description.slice(0, splitAt)
    const translatedHead = translated.slice(0, translated.indexOf('. '))
    if (translatedHead === head && !keepHead.has(head) && (english.test(head) || /\s[a-z]{2,}/.test(head))) missed.add(head)
  }
  assert.equal([...missed].join('\n'), '')
})
