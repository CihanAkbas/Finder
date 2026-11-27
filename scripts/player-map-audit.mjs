import { canonicalMarkerId } from '../src/lib/markerAliases.ts'
import { findDuplicatePinPairs } from '../src/lib/pinDeduplication.ts'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { gta6Atlas, gta6CategoryIcons } from '../src/config/games/gta6/markerIcons.ts'
import { writeFileSync } from 'node:fs'
import { gta6Categories } from '../src/config/games/gta6/categories.ts'
import { GTA6_NOISE_LAYERS, GTA6_PLAYER_VIEWS, playerViewHidden } from '../src/config/games/gta6/playLayers.ts'
import { leafCategories } from '../src/lib/categories.ts'
import markers from '../src/config/games/gta6/markers.json' with { type: 'json' }
import { GTA6_STORY_CATEGORIES, GTA6_STORY_PINS } from '../src/config/games/gta6/storyPins.ts'
import { GTA6_TIPS } from '../src/config/games/gta6/tips.ts'
import { GTA6_CHAPTERS } from '../src/lib/gta6Chapters.ts'
import { communityCategories, communityMarkers } from '../src/config/games/gta6/community.ts'
import calibration from '../src/config/games/gta6/communityCalibration.json' with { type: 'json' }
import { communityToMap } from '../src/lib/communityProjection.ts'
import { gta6 } from '../src/config/games/gta6/config.ts'
import { markerGuide } from '../src/lib/markerGuides.ts'
import locationHints from '../src/config/games/gta6/locationHints.json' with { type: 'json' }
import checklist from '../src/config/games/gta6/checklist.json' with { type: 'json' }

const leafNames = leafCategories([...GTA6_STORY_CATEGORIES, ...communityCategories, ...gta6Categories])
const allMarkers = gta6.markers
const markerIds = new Set(allMarkers.map((marker) => marker.id))
const refreshHints = JSON.parse(readFileSync('src/config/games/gta6/catalogHints.json', 'utf8'))
for (const id of Object.keys(refreshHints)) assert.ok(markerIds.has(canonicalMarkerId(id)), `Orphaned refreshed hint: ${id}`)
for (const id of Object.keys(locationHints)) assert.ok(markerIds.has(canonicalMarkerId(id)), `Orphaned location hint: ${id}`)
let guidedLocations = 0
for (const marker of allMarkers) {
  for (const locale of ['en', 'tr']) {
    const guide = markerGuide(marker, locale)
    assert.ok(guide.summary && !guide.summary.includes('undefined'), `Invalid guide summary: ${marker.id}`)
    for (const source of guide.sources) assert.equal(new URL(source.url).protocol, 'https:', `Unsafe guide link: ${marker.id}`)
    for (const line of [...guide.directions, ...guide.requirements]) assert.ok(line.trim() && !line.includes('undefined'), `Invalid guide text: ${marker.id}`)
    if (locale === 'en' && guide.locationSpecific) guidedLocations++
  }
}
const leafIds = new Set(leafNames.map((leaf) => leaf.id))
assert.ok(gta6Atlas.url.startsWith('/maps/'), 'Icons must be served locally')
const atlas = await sharp(`public${gta6Atlas.url}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
assert.equal(atlas.info.width, gta6Atlas.width)
assert.equal(atlas.info.height, gta6Atlas.height)
for (const leaf of leafNames) {
  const sprite = gta6CategoryIcons[leaf.id]
  assert.ok(sprite, `Missing category icon: ${leaf.id}`)
  assert.ok(sprite.x >= 0 && sprite.y >= 0 && sprite.x + sprite.w <= atlas.info.width && sprite.y + sprite.h <= atlas.info.height, `Icon outside atlas: ${leaf.id}`)
  let visible = false
  for (let y = sprite.y; y < sprite.y + sprite.h && !visible; y++) {
    for (let x = sprite.x; x < sprite.x + sprite.w; x++) {
      if (atlas.data[(y * atlas.info.width + x) * 4 + 3] > 0) { visible = true; break }
    }
  }
  assert.ok(visible, `Blank category icon: ${leaf.id}`)
}
assert.equal(markerIds.size, allMarkers.length, 'Duplicate marker IDs')
assert.equal(findDuplicatePinPairs(allMarkers).length, 0, 'Unresolved duplicate named pins')
assert.equal(leafIds.size, leafNames.length, 'Duplicate category IDs')
for (const marker of allMarkers) {
  assert.ok(leafIds.has(marker.category), `Unknown category for ${marker.id}`)
  assert.ok(Number.isFinite(marker.x) && Number.isFinite(marker.y), `Invalid coordinates for ${marker.id}`)
  assert.ok(marker.x >= gta6.bounds.minX && marker.x <= gta6.bounds.maxX && marker.y >= gta6.bounds.minY && marker.y <= gta6.bounds.maxY, `Outside map bounds: ${marker.id}`)
}
for (const marker of communityMarkers) {
  assert.equal(marker.source, 'approximate', `Community estimate mislabeled: ${marker.id}`)
  assert.equal(marker.reviewedAt, calibration.reviewedAt)
  assert.equal(marker.sourceUrl, calibration.source)
}
assert.ok(calibration.anchors.length >= 100, 'Insufficient calibration anchors')
for (const anchor of calibration.anchors) {
  const marker = markers.find((marker) => marker.id === anchor.id)
  assert.ok(marker, `Missing calibration anchor: ${anchor.id}`)
  const point = communityToMap(anchor.x, anchor.y)
  assert.ok(Math.hypot(marker.x - point.x, marker.y - point.y) < 0.0002, `Calibration drift: ${anchor.name}`)
}
for (const item of checklist) {
  if (item.mapId) assert.ok(markerIds.has(canonicalMarkerId(item.mapId)), `Broken checklist link: ${item.id}`)
}
for (const tip of GTA6_TIPS) {
  for (const id of tip.mapPins ?? []) assert.ok(markerIds.has(canonicalMarkerId(id)), `Broken tip link: ${tip.id} -> ${id}`)
}
for (const id of GTA6_NOISE_LAYERS) assert.ok(leafIds.has(id), `Unknown default layer: ${id}`)
for (const view of GTA6_PLAYER_VIEWS) {
  const hidden = new Set(playerViewHidden(view.id))
  assert.ok(hidden.size > 0 && hidden.size < leafIds.size, `Empty player view: ${view.id}`)
  assert.ok(!hidden.has('finder-story') && !hidden.has('finder-tips'), 'Player views must keep help visible')
}
const byCat = new Map()
for (const m of allMarkers) byCat.set(m.category, (byCat.get(m.category) || 0) + 1)

const want = [
  'Safehouse',
  'ATM',
  'Ammu',
  'Pay',
  'Gas',
  'Garage',
  'Fence',
  'Contact',
  'Mission',
  'Stranger',
  'Stunt',
  'Bridge',
  'Flamingo',
  'Card',
  'WAiNK',
  'Magazine',
  'Mural',
  'Meditation',
  'Fishing',
  'Shooting',
  'Basketball',
  'Weapon',
  'Pickup',
  'Parachute',
  'Scuba',
  'Treasure',
  'Underwater',
  'Police',
  'Impound',
  'Hospital',
  'Barber',
  'Tattoo',
  'Clothes',
  'Cloth',
  'Thrift',
  'Boutique',
  'Bank',
  'Jewelry',
  'Safe',
  'Illegal',
  'Heat',
  'Animal',
  'Heatmap',
]

const foundWant = {}
for (const w of want) {
  const re = new RegExp(w, 'i')
  foundWant[w] = {
    cats: leafNames.filter((c) => re.test(c.name)).map((c) => `${c.id}:${c.name}:${byCat.get(c.id) || 0}`),
    pins: allMarkers.filter((m) => re.test(`${m.title} ${m.description || ''}`)).length,
  }
}

const missions = checklist.filter((i) => i.id.startsWith('gta6-mission-'))
const withMap = missions.filter((i) => i.mapId)
const tipsWithPins = GTA6_TIPS.filter((t) => (t.mapPins || []).length)

const searches = {
  jasonHouse: allMarkers.filter((m) => /Jason.?s (waterfront )?house|Key Lento.*Safehouse|Safehouse.*Key Lento/i.test(`${m.title} ${m.description}`)).map((m) => m.title),
  lucia: allMarkers.filter((m) => /Lucia|Hamlet|safehouse/i.test(`${m.title}`)).slice(0, 20).map((m) => m.title),
  impound: allMarkers.filter((m) => /impound|tow yard|pound/i.test(`${m.title} ${m.description}`)).map((m) => `${m.id} ${m.title}`),
  hospital: allMarkers.filter((m) => /hospital|clinic|trauma/i.test(`${m.title} ${m.description}`)).map((m) => `${m.id} ${m.title}`),
  police: allMarkers.filter((m) => /police|sheriff|lspd|vcpd|station/i.test(`${m.title}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  flamingoDestroy: allMarkers.filter((m) => /flamingo|cocaine flamingo/i.test(`${m.title} ${m.description}`)).slice(0, 15).map((m) => `${m.category} ${m.title}`),
  ahol: allMarkers.filter((m) => /ahol|trash|dezomb/i.test(`${m.title} ${m.description}`)).slice(0, 15).map((m) => `${m.category} ${m.title}`),
  underwater: allMarkers.filter((m) => /underwater|wreck|kenton|treasure|scuba|dive/i.test(`${m.title} ${m.category} ${m.description}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  weaponPickup: allMarkers.filter((m) => /weapon pickup|SM-69|unique weapon|gun pickup/i.test(`${m.title} ${m.description}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  stranger: allMarkers.filter((m) => /stranger|freak|side mission|random event/i.test(`${m.title} ${m.description}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  barber: allMarkers.filter((m) => /barber|salon|hair/i.test(`${m.title}`)).map((m) => m.title),
  clothes: leafNames.filter((c) => /cloth|thrift|outfit|style|tattoo|barber|salon/i.test(c.name)),
}

if (process.argv.includes('--report')) writeFileSync(
  'scripts/player-audit.json',
  JSON.stringify(
    {
      totals: { mapgenie: markers.length, community: communityMarkers.length, storyHelp: GTA6_STORY_PINS.length, leaves: leafNames.length, tips: GTA6_TIPS.length, tipsWithPins: tipsWithPins.length },
      missions: { total: missions.length, withMap: withMap.length, missingMap: missions.filter((i) => !i.mapId).map((i) => i.title) },
      chapters: GTA6_CHAPTERS.map((c) => c.title.en),
      foundWant,
      searches,
      storyPins: GTA6_STORY_PINS.map((p) => p.id),
    },
    null,
    2,
  ),
)
console.log('Catalog integrity passed:', allMarkers.length, 'pins,', leafNames.length, 'categories')
console.log('Guides:', guidedLocations, 'with a location-specific note;', Object.keys(locationHints).length, 'enriched community records')
if (process.argv.includes('--report')) console.log('wrote scripts/player-audit.json')
console.log('missions with map', withMap.length, '/', missions.length)
console.log('tips with pins', tipsWithPins.length, '/', GTA6_TIPS.length)
