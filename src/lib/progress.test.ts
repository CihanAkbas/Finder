import { canonicalMarkerId, canonicalMarkerIds } from './markerAliases'
import { findDuplicatePinPairs, areDuplicatePins } from './pinDeduplication'
import { gta6Catalog } from '../config/games/gta6/config'
import { GTA6_STORY_PINS } from '../config/games/gta6/storyPins'
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
import { gta6 } from '../config/games/gta6/config'
import { applyVehicleCorrections } from '../config/games/gta6/vehicleCorrections'
import { buildSearchDocs, searchDocs } from './search'
import { markerGuide } from './markerGuides'
import { extractLocationHints } from './locationHints'
import { addReviewedVariants, GTA6_EXTRA_VARIANTS } from '../config/games/gta6/extraVariants'
import type { GameMarker } from '../types/game'

const minimal = JSON.stringify({
  app: 'finder',
  version: 1,
  games: { gta5: { found: ['gta5-chiliad'] } },
})

test('location extraction does not turn uncertain or negated tool mentions into prerequisites', () => {
  const source = 'https://www.gtabase.com/gta-6/map/'
  assert.equal(extractLocationHints('May need a key cloner.', source), null)
  assert.equal(extractLocationHints('No key cloner required.', source), null)
  assert.equal(extractLocationHints('Does not require a key cloner.', source), null)
  assert.equal(extractLocationHints('Not inside the garage.', source), null)
  assert.deepEqual(extractLocationHints('Inside the garage. Requires the Cut-Off Tool.', source)?.tools, ['cutter'])
  assert.deepEqual(extractLocationHints('On the roof. You need the key cloner.', source)?.placements, ['roof'])
  assert.equal(extractLocationHints('A character mentions Chapter 3.', source), null)
  assert.equal(extractLocationHints('Unlocks in Chapter 3.', source)?.chapter, 3)
})

test('guides distinguish a sourced tool requirement from missing entrance and access information', () => {
  const marker: GameMarker = { id: 'test', title: 'Test pickup', category: 'community-weapon-spawn', x: 0, y: 0, description: '' }
  assert.equal(markerGuide(marker, 'tr').unknownAccess, true)
  assert.equal(markerGuide(marker, 'tr').locationSpecific, false)
  const locked = markerGuide({ ...marker, description: 'Location: Inside the garage.\nAccess: Key Cloner\nTracker: Advanced' }, 'tr')
  assert.ok(locked.requirements.some((text) => text.includes('Clonin’ Keys')))
  assert.ok(locked.facts.some((fact) => fact.value === 'Gelişmiş'))
  assert.equal(locked.unknownAccess, false)
  const unknown = markerGuide({ ...marker, description: 'Access: ??\nTracker: ??' }, 'en')
  assert.deepEqual(unknown.facts, [])
  assert.equal(unknown.unknownAccess, true)
})

test('reviewed variants have bilingual directions, remain unique, and do not overwrite old player IDs', () => {
  const reapplied = addReviewedVariants(gta6.markers)
  assert.equal(reapplied.length, gta6.markers.length)
  assert.equal(new Set(reapplied.map((marker) => marker.id)).size, reapplied.length)
  for (const marker of GTA6_EXTRA_VARIANTS) {
    assert.equal(reapplied.filter((item) => item.id === marker.id).length, 1)
    for (const locale of ['en', 'tr'] as const) assert.ok(markerGuide(marker, locale).directions.length > 0)
  }
  const ruins = gta6.markers.find((marker) => marker.title === 'Imponte Turbo Ruiner')!
  assert.equal(markerGuide(ruins, 'tr').unknownAccess, true)
  const hotel = gta6.markers.find((marker) => marker.id === 'gta6-community-safehouse-005')!
  assert.ok(markerGuide(hotel, 'tr').directions.some((text) => text.includes('701')))
})

test('curated rare vehicles replace the generic RSX once and survive source correction reapplication', () => {
  const reapplied = applyVehicleCorrections(gta6.markers)
  assert.equal(reapplied.length, gta6.markers.length)
  assert.equal(new Set(reapplied.map((marker) => marker.id)).size, reapplied.length)
  const rsx = reapplied.filter((marker) => marker.id === 'gta6-community-vehicle-spawn-029')
  assert.equal(rsx.length, 1)
  assert.equal(rsx[0].title, 'Grotti Status RSX')
  assert.equal(rsx[0].category, 'mg-29095')
  assert.ok(!reapplied.some((marker) => marker.title === 'Grotti RSX'))
  for (const title of ['Bravado DriveShaft Gauntlet', 'Declasse Battler Picador']) {
    const matches = reapplied.filter((marker) => marker.title === title)
    assert.equal(matches.length, 1)
    assert.equal(matches[0].source, 'approximate')
    assert.ok(matches[0].descriptionTr)
  }
  const picador = reapplied.find((marker) => marker.title === 'Declasse Battler Picador')!
  assert.match(picador.descriptionTr!, /Konum çelişkisi/)
  assert.ok(!reapplied.some((marker) => marker.id === 'gta6-community-standout-vehicle-170'))
})

test('rare vehicle aliases and Turkish location clues lead to the curated map records', () => {
  const docs = buildSearchDocs(gta6, [])
  for (const [query, id] of [["Dom's Charger", 'gta6-community-standout-vehicle-156'], ['Status RSX', 'gta6-community-vehicle-spawn-029'], ['yeşil kapılı ahır', 'gta6-community-standout-vehicle-149']]) {
    assert.ok(searchDocs(docs, query).some((hit) => hit.id === id), `Missing search result: ${query}`)
  }
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
import { mergeProgress } from './progressMerge'
import { storyProgress } from './storyProgress'

test('cloud merge preserves both devices and respects unchecked items', () => {
  const base = { found: ['old', 'remove'], checklistDone: ['mission1'] }
  const local = { found: ['old', 'new-local'], checklistDone: [] }
  const remote = { found: ['old', 'remove', 'new-phone'], checklistDone: ['mission1', 'mission2'] }
  assert.deepEqual(mergeProgress(base, local, remote), { found: ['old', 'new-phone', 'new-local'], checklistDone: ['mission2'] })
  assert.deepEqual(mergeProgress({}, { found: ['guest'] }, { found: ['cloud'] }), { found: ['cloud', 'guest'] })
})

test('cloud merge retains remote custom pins and applies local deletion and edits', () => {
  const base = { customPins: [{ id: 'delete', title: 'Old' }, { id: 'edit', title: 'Before', note: '' }] }
  const local = { customPins: [{ id: 'edit', title: 'After', note: '' }] }
  const remote = { customPins: [...base.customPins.map(p => p.id === 'edit' ? { ...p, note: 'Phone note' } : p), { id: 'phone', title: 'New' }] }
  assert.deepEqual(mergeProgress(base, local, remote), { customPins: [{ id: 'edit', title: 'After', note: 'Phone note' }, { id: 'phone', title: 'New' }] })
  assert.deepEqual(mergeProgress({customPins:[{id:'a'}]}, {customPins:[]}, {customPins:[{id:'a'},{id:'b'}]}), {customPins:[{id:'b'}]})
  assert.deepEqual(mergeProgress({route:['a','b']}, {route:['b','a']}, {route:['a','b','c']}), {route:['b','a']})
})

test('story progression counts missions equally, follows chapter order, and ignores unrelated rows', () => {
  const data = gta6Checklist as ChecklistItem[]
  const initial = storyProgress(data, [])
  assert.equal(initial.total, 68)
  assert.equal(initial.next?.title, 'Prologue')
  const done = storyProgress(data, [initial.ordered[0].id, initial.ordered[1].id, 'unrelated'])
  assert.equal(done.done, 2)
  assert.equal(done.next?.title, 'Gear Up')
  assert.equal(done.percent, 2 / 68 * 100)
  assert.equal(storyProgress(data, initial.ordered.map(item => item.id)).next, undefined)
  assert.equal(new Set(initial.ordered.map(item => item.id)).size, initial.total)
})

test('all story help pins have useful Turkish descriptions and titles', () => {
  const pins = GTA6_STORY_PINS
  assert.equal(pins.length, 26)
  for (const pin of pins) {
    assert.ok(gta6.markers.find(marker=>marker.id===canonicalMarkerId(pin.id))?.descriptionTr?.includes(pin.descriptionTr!), pin.id)
    assert.ok(pin.descriptionTr && pin.descriptionTr.length > 40, pin.id)
    assert.equal(markerDescription('tr', pin.description), pin.descriptionTr)
    assert.ok(markerTitle('tr', pin.title).length > 4, pin.id)
  }
})
import refreshMeta from '../config/games/gta6/catalogRefresh.meta.json'
import originalPins from '../config/games/gta6/markers.json'
import { communityMarkers } from '../config/games/gta6/community'
import { applyCatalogRefresh } from '../config/games/gta6/catalogRefresh'
import { addReviewedDiscoveries } from '../config/games/gta6/reviewedDiscoveries'
import { KITTY_LOCATIONS } from '../config/games/gta6/reviewedGuides'

test('catalog refresh preserves saved marker IDs, is idempotent, and resolves source bindings', () => {
  const ids = new Set(gta6.markers.map(marker => marker.id))
  for (const marker of [...originalPins, ...communityMarkers]) assert.ok(ids.has(canonicalMarkerId(marker.id)), `Lost save ID ${marker.id}`)
  for (const id of [...Object.values(refreshMeta.sourceBindings), ...Object.values(refreshMeta.gpsBindings)]) assert.ok(ids.has(canonicalMarkerId(id)), `Unresolved source binding ${id}`)
  assert.equal(ids.size, gta6.markers.length)
  const once = applyCatalogRefresh(originalPins as GameMarker[])
  assert.deepEqual(applyCatalogRefresh(once), once)
  assert.deepEqual(addReviewedDiscoveries(gta6.markers), gta6.markers)
  assert.ok(!ids.has('gta6-community-standout-vehicle-170'))
  assert.equal(gta6.markers.filter(marker=>['mg-29022','mg-29023'].includes(marker.category)).length,22)
})

test('refreshed categories retain collection progress and reviewed discovery context', () => {
  const flamingo = gta6.markers.find(marker=>marker.id==='gta6-community-hidden-package-182')!
  assert.equal(flamingo.category,'community-cocaine-flamingo')
  assert.equal(gta6.markers.find(marker=>marker.id==='gta6-community-weapon-spawn-092')?.category,'community-scoop-container')
  assert.ok(gta6.markers.filter(marker=>marker.category==='mg-29083').length>=126)
  assert.ok(gta6.markers.filter(marker=>marker.category==='mg-29095').length>=267)
  const leviathan=gta6.markers.filter(marker=>/Leviathan/.test(marker.title))
  assert.equal(leviathan.length,1)
  assert.equal(leviathan[0].category,'community-underwater')
  assert.ok(leviathan[0].descriptionTr?.includes('iskeleti'))
  assert.ok(gta6.markers.find(marker=>marker.id==='gta6-loc-1091986')?.guide?.warnings?.[0].tr.includes('bağımsız doğrulanmadı'))
})

test('Kitty Litter walkthrough shares the existing twenty map IDs and supplies bilingual directions', () => {
  assert.equal(KITTY_LOCATIONS.length,20)
  assert.equal(new Set(KITTY_LOCATIONS.map(location=>location.id)).size,20)
  for(const location of KITTY_LOCATIONS) {
    assert.equal(gta6.markers.find(marker=>marker.id===location.id)?.category,'mg-29216')
    assert.ok(location.directions.en.length>15&&location.directions.tr.length>15)
  }
  assert.equal(KITTY_LOCATIONS[0].id,'gta6-loc-1097639')
})
import aliases from '../config/games/gta6/pinAliases.json'
import { deduplicateGta6Pins } from '../config/games/gta6/deduplication'

test('named duplicate pins are consolidated while distinct interactions and positions remain', () => {
  assert.equal(findDuplicatePinPairs(gta6.markers).length,0)
  assert.equal(gta6.markers.filter(marker=>marker.title==='Vapid Rumpo').length,1)
  assert.equal(canonicalMarkerId('gta6-community-standout-vehicle-069'),'gta6-loc-1091125')
  const make=(id:string,category:string,title:string,x:number):GameMarker=>({id,category,title,x,y:0,description:''})
  assert.equal(areDuplicatePins(make('a','mg-29095','Vapid Rumpo',0),make('b','mg-29095','Vapid Rumpo',.01)),false)
  assert.equal(areDuplicatePins(make('a','mg-29021','ATM',0),make('b','mg-29021','ATM',.00001)),false)
  assert.equal(areDuplicatePins(make('a','mg-29083','Safe (first floor)',0),make('b','mg-29083','Safe (second floor)',0)),false)
  assert.equal(areDuplicatePins(make('a','mg-29095','Vapid Rumpo',0),make('b','community-unique-weapon','Vapid Rumpo',0)),false)
  assert.equal(areDuplicatePins(make('a','mg-29095','Coquette Spiderweb',0),make('b','community-vehicle-spawn','Coquette Standard',0)),false)
  assert.deepEqual(deduplicateGta6Pins(deduplicateGta6Pins(gta6Catalog)),deduplicateGta6Pins(gta6Catalog))
  for(const [alias,id]of Object.entries(aliases)){assert.notEqual(alias,id);assert.equal(canonicalMarkerId(id),id);assert.ok(gta6.markers.some(marker=>marker.id===id))}
})

test('duplicate-pin aliases migrate found, favorites and route saves without losing unrelated progress', () => {
  const old='gta6-community-standout-vehicle-069', kept='gta6-loc-1091125'
  const migrated=normalizeSlice({found:[old,kept,'other'],favorites:[old],route:['other',old,kept]})
  assert.deepEqual(migrated.found,[kept,'other'])
  assert.deepEqual(migrated.favorites,[kept])
  assert.deepEqual(migrated.route,['other',kept])
  assert.deepEqual(normalizeSlice(migrated),migrated)
  assert.deepEqual(canonicalMarkerIds(['gta5-chiliad','gta5-chiliad']),['gta5-chiliad'])
  const parsed=parseBackup(JSON.stringify({app:'finder',version:1,games:{gta6:{found:[old],favorites:[old],route:[old]}}}))
  assert.deepEqual(parsed.gta6.found,[kept])
  const afterUncheck=mergeProgress(migrated,{...migrated,found:['other']},normalizeSlice({found:[old,kept,'other']})) as typeof migrated
  assert.deepEqual(afterUncheck.found,['other'])
})
import catalog from '../config/games/gta6/style/catalog.json'

test('wardrobe survives cloud validation and rejects malformed outfits', () => {
 const outfit = { id: 'my-outfit', name: 'Vice', itemIds: [catalog.items[0].id], createdAt: '2026-11-27T08:00:00Z' }
 const parsed = parseBackup(JSON.stringify({ games: { gta6: { ownedClothes: outfit.itemIds, savedOutfits: [catalog.outfits[0].id], customOutfits: [outfit] } } }))
 assert.deepEqual(parsed.gta6.customOutfits, [outfit])
 assert.deepEqual(parsed.gta6.ownedClothes, outfit.itemIds)
 assert.throws(() => parseBackup(JSON.stringify({ games: { gta6: { customOutfits: [{ ...outfit, itemIds: [42] }] } } })))
})
test('wardrobe merges independent device edits including unchecking', () => {
 assert.deepEqual(mergeProgress(['a'], [], ['a', 'b'], 'ownedClothes'), ['b'])
 const a = { id: 'a', name: 'A', itemIds: ['one'] }, b = { id: 'b', name: 'B', itemIds: ['two'] }
 assert.deepEqual(mergeProgress([], [a], [b], 'customOutfits'), [a, b])
})
test('style snapshot references existing items, stores and canonical map pins', () => {
 const itemIds = new Set(catalog.items.map(row => row.id)), storeIds = new Set(catalog.stores.map(row => row.id)), pinIds = new Set(gta6.markers.map(row => row.id))
 assert.equal(itemIds.size, catalog.items.length)
 for (const row of catalog.outfits) for (const id of row.itemIds) assert.ok(itemIds.has(id), id)
 for (const row of catalog.items) for (const id of row.storeIds) assert.ok(storeIds.has(id), id)
 for (const row of catalog.stores) for (const id of row.markerIds) assert.ok(pinIds.has(id), id)
})
import { calibrateStyleMap, matchStyleStore } from './styleStoreMatching'
import { styleAcquisition, styleCategory } from '../i18n/style'
test('full style snapshot covers the public catalog and preserves original saved IDs', () => {
 assert.equal(catalog.items.filter(row => !('archived' in row && row.archived)).length, catalog.coverage.items.imported)
 assert.equal(catalog.coverage.items.imported, catalog.coverage.items.discovered)
 assert.equal(catalog.coverage.items.detailed, catalog.coverage.items.discovered)
 assert.equal(catalog.outfits.filter(row => !('archived' in row && row.archived)).length, catalog.coverage.outfits.imported)
 assert.equal(catalog.coverage.outfits.imported, catalog.coverage.outfits.discovered)
 assert.equal(catalog.stores.length, catalog.coverage.stores.discovered)
 assert.equal(new Set(catalog.stores.map(row => row.id)).size, catalog.stores.length)
 assert.equal(new Set(catalog.items.map(row => row.sourceUrl)).size, catalog.items.length)
 assert.ok(catalog.items.some(row => row.id === 'fits-item-0c648f1071727e9a' && row.name === '1 Hole Ski Mask (Black Rib Knit)'))
 for (const row of catalog.items) {
  for (const key of row.acquisition) assert.ok(styleAcquisition(key, 'tr') && styleAcquisition(key, 'en'))
  assert.ok(styleCategory(row.category, 'tr'))
  assert.ok(!('user_id' in row) && !('ip' in row) && !('email' in row))
 }
})
test('style store links use many calibration anchors and reject far or ambiguous pins', () => {
 const sources = catalog.stores.map(row => ({ name: row.name, ...('sourcePoint' in row ? row.sourcePoint : {}) }))
 const transform = calibrateStyleMap(sources, gta6.markers)
 assert.ok(transform && transform.anchors >= 100 && transform.p95Error < .0005)
 for (const store of catalog.stores) {
  if (store.kind !== 'magazine') assert.ok('mapLocation' in store && store.mapLocation, store.name)
  if (!('sourcePoint' in store) || !store.sourcePoint) continue
  const ids = matchStyleStore({ name: store.name, ...store.sourcePoint }, gta6.markers, transform)
  assert.deepEqual(ids, store.markerIds)
  for (const id of ids) {
   const pin = gta6.markers.find(row => row.id === id)!
   const point = store.mapLocation!
   assert.ok(Math.hypot(pin.x-point.x, pin.y-point.y) <= .0015, store.name)
  }
 }
 const source = sources.find(row => row.name === 'Barnacle Beauties')!
 const pin = gta6.markers.find(row => row.title === source.name)!
 assert.deepEqual(matchStyleStore(source, [{ ...pin, x: pin.x + .1 }], transform), [])
 assert.deepEqual(matchStyleStore(source, [pin, { ...pin, id: 'ambiguous-other' }], transform), [])
 assert.equal(calibrateStyleMap([source], [pin]), null)
})
