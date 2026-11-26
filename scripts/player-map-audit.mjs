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
import checklist from '../src/config/games/gta6/checklist.json' with { type: 'json' }

const leafNames = leafCategories([...GTA6_STORY_CATEGORIES, ...gta6Categories])
const allMarkers = [...markers, ...GTA6_STORY_PINS]
const markerIds = new Set(allMarkers.map((marker) => marker.id))
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
assert.equal(leafIds.size, leafNames.length, 'Duplicate category IDs')
for (const marker of allMarkers) {
  assert.ok(leafIds.has(marker.category), `Unknown category for ${marker.id}`)
  assert.ok(Number.isFinite(marker.x) && Number.isFinite(marker.y), `Invalid coordinates for ${marker.id}`)
}
for (const item of checklist) {
  if (item.mapId) assert.ok(markerIds.has(item.mapId), `Broken checklist link: ${item.id}`)
}
for (const tip of GTA6_TIPS) {
  for (const id of tip.mapPins ?? []) assert.ok(markerIds.has(id), `Broken tip link: ${tip.id} -> ${id}`)
}
for (const id of GTA6_NOISE_LAYERS) assert.ok(leafIds.has(id), `Unknown default layer: ${id}`)
for (const view of GTA6_PLAYER_VIEWS) {
  const hidden = new Set(playerViewHidden(view.id))
  assert.ok(hidden.size > 0 && hidden.size < leafIds.size, `Empty player view: ${view.id}`)
  assert.ok(!hidden.has('finder-story') && !hidden.has('finder-tips'), 'Player views must keep help visible')
}
const byCat = new Map()
for (const m of [...markers, ...GTA6_STORY_PINS]) byCat.set(m.category, (byCat.get(m.category) || 0) + 1)

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
    pins: markers.filter((m) => re.test(`${m.title} ${m.description || ''}`)).length,
  }
}

const missions = checklist.filter((i) => i.id.startsWith('gta6-mission-'))
const withMap = missions.filter((i) => i.mapId)
const tipsWithPins = GTA6_TIPS.filter((t) => (t.mapPins || []).length)

const searches = {
  jasonHouse: markers.filter((m) => /Jason.?s (waterfront )?house|Key Lento.*Safehouse|Safehouse.*Key Lento/i.test(`${m.title} ${m.description}`)).map((m) => m.title),
  lucia: markers.filter((m) => /Lucia|Hamlet|safehouse/i.test(`${m.title}`)).slice(0, 20).map((m) => m.title),
  impound: markers.filter((m) => /impound|tow yard|pound/i.test(`${m.title} ${m.description}`)).map((m) => `${m.id} ${m.title}`),
  hospital: markers.filter((m) => /hospital|clinic|trauma/i.test(`${m.title} ${m.description}`)).map((m) => `${m.id} ${m.title}`),
  police: markers.filter((m) => /police|sheriff|lspd|vcpd|station/i.test(`${m.title}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  flamingoDestroy: markers.filter((m) => /flamingo|cocaine flamingo/i.test(`${m.title} ${m.description}`)).slice(0, 15).map((m) => `${m.category} ${m.title}`),
  ahol: markers.filter((m) => /ahol|trash|dezomb/i.test(`${m.title} ${m.description}`)).slice(0, 15).map((m) => `${m.category} ${m.title}`),
  underwater: markers.filter((m) => /underwater|wreck|kenton|treasure|scuba|dive/i.test(`${m.title} ${m.category} ${m.description}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  weaponPickup: markers.filter((m) => /weapon pickup|SM-69|unique weapon|gun pickup/i.test(`${m.title} ${m.description}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  stranger: markers.filter((m) => /stranger|freak|side mission|random event/i.test(`${m.title} ${m.description}`)).slice(0, 20).map((m) => `${m.category} ${m.title}`),
  barber: markers.filter((m) => /barber|salon|hair/i.test(`${m.title}`)).map((m) => m.title),
  clothes: leafNames.filter((c) => /cloth|thrift|outfit|style|tattoo|barber|salon/i.test(c.name)),
}

if (process.argv.includes('--report')) writeFileSync(
  'scripts/player-audit.json',
  JSON.stringify(
    {
      totals: { mapgenie: markers.length, storyHelp: GTA6_STORY_PINS.length, leaves: leafNames.length, tips: GTA6_TIPS.length, tipsWithPins: tipsWithPins.length },
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
if (process.argv.includes('--report')) console.log('wrote scripts/player-audit.json')
console.log('missions with map', withMap.length, '/', missions.length)
console.log('tips with pins', tipsWithPins.length, '/', GTA6_TIPS.length)
