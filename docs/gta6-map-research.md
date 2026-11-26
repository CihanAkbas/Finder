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

### Rare-vehicle follow-up

After comparing the nine-image Milcham post, three named variants received curated records: [Grotti Status RSX](https://www.gtabase.com/gta-6/vehicles/status-rsx), [Bravado DriveShaft Gauntlet](https://www.gtabase.com/gta-6/vehicles/driveshaft-gauntlet) and [Declasse Battler Picador](https://www.gtabase.com/gta-6/vehicles/battler-picador). The generic RSX pin retains its original ID and is corrected in place; Gauntlet and Picador add two pins. Current totals: 5,323 records, 129 categories, 2,171 community positions.

The Status location and Key Cloner requirement are also reported by [Insider Gaming](https://insider-gaming.com/where-to-find-the-grotti-status-rsx-in-gta-6/). Source world positions are Status `(-5533, 2239)` (record 290), Gauntlet `(-5385.9, 6977)` (156), and Battler `(-5109, 478)` (149), transformed with the existing calibration. The Picador source also has a conflicting record 170 at `(-2872.9, 4828)`, near Ambrosia. It is not plotted: the vehicle page and member record 149 instead identify the South Kelly barn with green doors. The retained pin explicitly flags this conflict; it is not independently verified in the game. Identification of the collage's blue pickup remains uncertain. Gauntlet security reports also disagree, so no definite unlock requirement is asserted.

`vehicleCorrections.ts` is applied after raw catalog imports, preserving the generic RSX ID and preventing subsequent source imports from undoing the curated variant names. Localized descriptions and search aliases include Dom's Charger, Itali RSX and Turkish location clues. The existing Standout Vehicle category and icon are reused.

- 42 of the 125 flamingo positions are absent from the imported snapshot; 83 available positions cannot satisfy the 100-position completion quota alone.
- 52 of 68 story missions have no verified waypoint in the existing checklist. No location is invented to fill this gap.
- Additional entries in existing categories were not blindly merged: source taxonomies differ, and duplicate cards, safes, stunts and storefronts could corrupt player progress.
- Spawn conditions, indoor access, chapter locks, quest prerequisites and safe codes require individual verification. The map exposes source links rather than fabricating these details.
- Source snapshots continue to change. This is a dated local copy, not a live feed or a claim of exhaustive game coverage.
