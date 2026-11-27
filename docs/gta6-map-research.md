# GTA VI map review — 26 November 2026

This review expands available coverage. It does not establish that every object in GTA VI has been mapped or independently verified in the game.

## Sources inspected

- [GTABase interactive map](https://www.gtabase.com/gta-6/map/): public snapshot updated 25 November 2026, 21:11:45 UTC; 5,661 source records. Its map code credits GTADB and contributors under CC BY 4.0. Only factual names, categories and positions are adapted; editorial descriptions, photographs and contributor identities are excluded.
- [GTADB](https://gtadb.org/) and its [public landmark catalog](https://github.com/rolux/gtadb.org/blob/main/map/data/6/landmarks.json): geographic reference. Community world coordinates must not be treated as geographic tile coordinates.
- [PowerPyx flamingo guide](https://www.powerpyx.com/gta-6-all-cocaine-flamingo-locations/): 125 total, any 100 for completion. Our imported snapshot has 83 positions, so neither the set nor its completion quota is presented as fully mapped.
- [PC Gamer Missing Persons guide](https://www.pcgamer.com/games/grand-theft-auto/gta-6-missing-persons-locations/) and [Windows Central walkthrough](https://www.windowscentral.com/gaming/how-to-start-and-complete-the-creepy-photos-missing-persons-side-mission-in-gta-6-chapter-2): useful evidence for a quest chain, but their textual landmarks alone do not justify exact new mission waypoints.
- [Reddit map feedback](https://www.reddit.com/r/GTAVI/comments/1y38vd5/mapgenie_release/), [Key Lento feedback](https://www.reddit.com/r/rockstar/comments/1y2va21/everything_in_key_lento/) and [collectible map feedback](https://www.reddit.com/r/grandtheftauto/comments/1y2vca6/100_maps_of_currently_discovered_collectibles/): used to prioritize missing watches, meteorites, weapon variants and services; individual comments were not imported as verified pins.
- IGN wiki and interactive map requests failed; domain search reports robots.txt blocking. No new record is attributed to IGN. X searches did not yield an independently usable coordinate source.

## Changes

2,169 additional records across 28 previously missing categories. Existing MapGenie IDs and player saves are retained. Thirteen matching named positions within 0.001 tile degrees of existing records were excluded. This is conservative duplicate screening, not a guarantee that all cross-source duplicates have been eliminated.

New categories cover homes, hospitals, police and fire stations, cocaine flamingos, AHOL art, loose loot, comics, watches, style magazines, bottles, meteorites, treasure, loot boxes, SCOOP containers, secrets, random encounters, car meets, hunting, weapon pickups, unique weapons, vehicle spawns, helipads, airports, cinemas, towns, landmarks and marinas. A cinema location does not assert a playable cinema activity; an icon does not establish an enterable interior.

Community records carry a source link, review date and approximate-position status. Random events and vehicle locations do not promise a guaranteed spawn. Existing guide prose, unlock claims and mechanics were not independently revalidated by this import.

## Calibration and validation

`communityCalibration.json` stores the source timestamp, conversion coefficients and 322 shared position anchors. Longitude is linear in source X; latitude is recovered from linear Web Mercator Y. Anchor residual RMS is approximately 0.000035 degrees; maximum below 0.0002 degrees. These values measure alignment between catalogs, not absolute accuracy in the game, and do not justify a metres-based precision claim.

`npm run audit:map` checks marker/category IDs, finite coordinates, atlas bounds, nonempty category sprites, tip/checklist links, player views, source metadata, map bounds and calibration residuals. `npm run icons:generate` rebuilds the local atlas. `scripts/import-community-map.mts` accepts a public decoded marker JSON and the saved calibration JSON, reimports only the curated categories, and fails on malformed/duplicate/out-of-bounds data.

Validation passed: production build, TypeScript, ESLint, 14 unit tests and the map audit. Headless Edge checks covered category presets, persistence after reload, the 83/125 coverage label, a community pin deep link while its category is hidden, source notice/link, and local atlas delivery with external MapGenie media blocked. No browser JavaScript exceptions occurred. Desktop (1440×1000) and mobile (390×844) screenshots were inspected.

## Coverage still missing

### Location and access guide enrichment

Location cards now separate what is present, how to reach it, and access requirements. General category advice is not presented as a verified entrance route. Missing chapter, key, door or floor information remains explicitly unknown.

353 existing community records gained atomic source hints: named places, indoor/outdoor placement, floor/water context, or explicitly required tools. `scripts/enrich-location-hints.mts` extracts allow-listed facts from the public marker JSON; it excludes guide prose, photographs, codes and speculative tool mentions. A named place in a source note is not automatically an unlock requirement. Source timestamps and URLs accompany the hints. The existing 101 vehicle access records now expose door access, security and tracker fields separately; `??` is not treated as a known value, and an unlocked car does not establish an unlocked garage.

Five safehouse records include their reported story chapter; room 201 at Bayside and room 701 on floor 7 at Y Hotel are distinguished from building-level markers. Story references are not promises of access in the player's current save.

Six individually reviewed variants were added with bilingual directions and sources: [Spiderweb Coquette](https://www.gtabase.com/gta-6/vehicles/spiderweb-coquette), [Vanessa's Growler](https://www.gtabase.com/gta-6/vehicles/vanessas-growler), [Drifter Elegy](https://www.gtabase.com/gta-6/vehicles/drifter-elegy), [Seaspray Emerus](https://www.gtabase.com/gta-6/vehicles/seaspray-emerus), [Twinstripe Vigero](https://www.gtabase.com/gta-6/vehicles/twinstripe-vigero), and [Turbo Ruiner](https://www.gtabase.com/gta-6/vehicles/turbo-ruiner). Their original GTABase record IDs (107, 112, 116, 130, 088 and 098) and calibrated positions are used. Current total: 5,329 pins, 129 categories; 2,177 community positions.

[GTABase's Key Cloner guide](https://www.gtabase.com/gta-6/articles/how-to-get-key-cloner-in-gta-6-to-steal-keyless-cars) supports Chapter 3 / Clonin' Keys, Makin' Gs. [PC Gamer's Kit Car guide](https://www.pcgamer.com/games/grand-theft-auto/gta-6-kit-car-locations/) supports Meet the Heders / Chapter 3 for the Cut-Off Tool. These explanations are shown only on records that explicitly require the tool; "may need" remains conditional. No universal garage or safe code is inferred. The Spiderweb guide tells the player to read the upstairs photo clue rather than supplying an unsupported number.

Enrichment validation: 19 tests, TypeScript, ESLint, production build and the full map/guide audit passed. The audit found 1,201 cards with a location-specific note, including pre-existing catalog notes; this is not 1,201 newly verified entrances. Headless Edge checked the three guide headings, Spiderweb's photo/code route, Seaspray's tool unlock, Turbo Ruiner's unknown access, a source-derived roof hint, and Y Hotel's floor/room. Desktop and mobile screenshots were inspected; no browser exceptions occurred. Many records still lack a sourced entrance or unlock condition, and the card explicitly says so rather than inventing one.

### Rare-vehicle follow-up

After comparing the nine-image Milcham post, three named variants received curated records: [Grotti Status RSX](https://www.gtabase.com/gta-6/vehicles/status-rsx), [Bravado DriveShaft Gauntlet](https://www.gtabase.com/gta-6/vehicles/driveshaft-gauntlet) and [Declasse Battler Picador](https://www.gtabase.com/gta-6/vehicles/battler-picador). The generic RSX pin retains its original ID and is corrected in place; Gauntlet and Picador add two pins. Current totals: 5,323 records, 129 categories, 2,171 community positions.

The Status location and Key Cloner requirement are also reported by [Insider Gaming](https://insider-gaming.com/where-to-find-the-grotti-status-rsx-in-gta-6/). Source world positions are Status `(-5533, 2239)` (record 290), Gauntlet `(-5385.9, 6977)` (156), and Battler `(-5109, 478)` (149), transformed with the existing calibration. The Picador source also has a conflicting record 170 at `(-2872.9, 4828)`, near Ambrosia. It is not plotted: the vehicle page and member record 149 instead identify the South Kelly barn with green doors. The retained pin explicitly flags this conflict; it is not independently verified in the game. Identification of the collage's blue pickup remains uncertain. Gauntlet security reports also disagree, so no definite unlock requirement is asserted.

`vehicleCorrections.ts` is applied after raw catalog imports, preserving the generic RSX ID and preventing subsequent source imports from undoing the curated variant names. Localized descriptions and search aliases include Dom's Charger, Itali RSX and Turkish location clues. The existing Standout Vehicle category and icon are reused.

- 42 of the 125 flamingo positions are absent from the imported snapshot; 83 available positions cannot satisfy the 100-position completion quota alone.
- 52 of 68 story missions have no verified waypoint in the existing checklist. No location is invented to fill this gap.
- Additional entries in existing categories were not blindly merged: source taxonomies differ, and duplicate cards, safes, stunts and storefronts could corrupt player progress.
- Spawn conditions, indoor access, chapter locks, quest prerequisites and safe codes require individual verification. The map exposes source links rather than fabricating these details.
- Source snapshots continue to change. This is a dated local copy, not a live feed or a claim of exhaustive game coverage.

## Additive refresh — 27 November 2026

Compared the public GTABase snapshot (6,007 records, updated 26 November 21:47:50 UTC) and GTA6 GPS data referenced by its [27 November changelog](https://gta6gps.com/map/whats-new) (3,711 records). The 115 additions in that site's changelog are not claimed to be 115 unique additions to Finder. Existing matches are reused. Only factual names, categories, positions and conservatively extracted placement/tool facts are adapted; downloaded JavaScript is parsed as data and never executed. GTABase's map code credits GTADB/contributors under CC BY 4.0. GPS positions are community reports, not independent in-game verification.

`refresh-pin-catalog.mts` accepts the two public JSON snapshots. Its category crosswalk handles the split Bank/Big Bank layers and existing Kitty Litter, Wyman and collectible-card layers. Same-source IDs are retained; existing native points are matched by category, normalized name and proximity. The GPS preview points use a conservative proximity match (0.0025 tile degrees); the threshold is a duplicate-screening heuristic, not a game-distance precision claim. Nearby distinct objects and differently named variants can require individual review. Unclassified additional GPS cards have a separate layer rather than being assigned an invented card set.

The generated `catalogRefresh.json` is additive. Its metadata binds 6,006 eligible GTABase records and the selected GPS category records to stable Finder IDs. It retains existing points removed from the external snapshot until their removal is independently resolved. `catalogHints.json` contains atomic placement/tool clues, not copied source guide prose. The previously reviewed Battler Picador conflicting record 170 remains excluded. Curated vehicle corrections remain authoritative. No saved found/favorite/route IDs are deleted or renumbered.

Snapshot additions: 966 positions; two individually reviewed GTADB buildings add two more. Total increase: 968 (5,329 → 6,297), with 140 leaf categories. The generated overlay refreshes 2,157 existing community records. Examples of resulting local layer counts: safes 132, standout vehicles 291, flamingos 120, AHOL art 111, SCOOP containers 120, meteorite markers 125, luxury watches 33. These counts include dated reports and are not a claim that all game objects have been mapped. Some markers represent a cluster or an alternate spawn.

The 22 robbery-bank records match the current GTABase list. GTADB landmark L501 is an office and L1555 is a named retail building; they are added as landmarks with explicit descriptions, not as new confirmed robberies. GTADB L2178 is marked demolished and L2612 (Hamlet Fleeca) closed/unconfirmed, so neither is presented as an active new bank.

[Leviathan](https://gta6map.city/secrets/leviathan-sea-monster-skeleton-off-bobcat-key/) is shown at the source index's world position (-7493.9, -2820), using the existing Aquatic Bones marker ID rather than creating a second discovery at the same site. It links to the creator's clip and labels the position approximate. [Mill Station](https://gta6map.city/secrets/grassrivers-secret-lab-permanent-health-syringe/) enriches the existing base marker: access and reported equipment, with an explicit caveat that the claimed health effect and repeat availability have not been independently verified.

Kitty Litter retains all 20 original map IDs. Its new checklist tab supplies a regional travel order and bilingual entry hints, and marking a lab uses the same found state as the map. The [PC Gamer mission guide](https://www.pcgamer.com/games/grand-theft-auto/gta-6-kitty-litter-lab-locations/) counts 19 objective labs, while the map catalog has 20 locations; the interface explains this discrepancy and defers mission completion to the in-game counter. It does not invent an objective requirement of 20 labs.

Validation: production build, ESLint, 26 unit tests and the full pin/icon/guide audit passed. Headless Edge checks at 1440px and 390px verified Kitty Litter → map → undo synchronization, translated lab and Leviathan titles, the Mill Station effect caveat and absence of horizontal overflow.

## Duplicate cleanup — 27 November 2026

A user report exposed the Apollo Aggregates Vapid Rumpo recorded under both Standout Vehicles and Vehicle Spawns. The cross-source importer previously compared only source-category matches. The raw catalog is now audited across compatible categories and 70 repeated named locations are consolidated (6,297 → 6,227 visible pins). This includes Rumpo and other vehicles, contacts, venues, WAiNK landmark duplicates, book swaps, wreck discoveries and four duplicated story-help overlays. Their useful story notes are retained on the canonical point.

`pinAliases.json` retains stable redirects from removed IDs; it is generated by `scripts/deduplicate-map-pins.mts` after source refreshes. The common slice normalizer migrates found, favorites and ordered route stops, including persisted browser saves and Firebase reads. Deep links and checklist/reference links resolve aliases before looking up a marker. GPS Sea Sparrow and Unidentified Building pairs received explicit reviewed aliases.

Automatic screening requires the same normalized full title, close coordinates and compatible interaction categories. Generic ATMs/safes are excluded, as are distinct floors, models/variants, distant occurrences, and nearby different interactions such as a shop and a sculpture. Name/proximity screening is not proof that every remaining pair is distinct, so ambiguous candidates remain separate for individual review. The complete map audit now rejects unresolved matches under these conservative rules.

Validation: 28 unit tests, ESLint, production build and the full 6,227-pin audit passed. Headless Edge verified a legacy local save and old Rumpo deep link, a single canonical favorite, and live Firebase legacy-ID migration in desktop/mobile sessions. Unchecking/unfavoriting on one device remained cleared on the other after reload; the route was stored with the canonical ID. The temporary test account was deleted.
