# Finder

All-in-one GTA companion for a second screen. GTA V and GTA VI have populated maps and companion pages. GTA VI includes the local Leonida catalog, tips, story-help pins, and English/Turkish text.

Modules under `/gta5`: hub, map, 100% checklist, daily/weekly resets, vehicle and weapon database, garage, and heist/business/stock calculators. Found pins and checklist rows share one save. Progress, garage slots, and daily checks stay in this browser (IndexedDB, with a localStorage fallback) and can be exported from the top bar.

## Run

```bash
npm install
npm run dev
```

Open `/gta5` or `/gta6/map`.

The 26 November 2026 map review and rare-vehicle corrections provide 2,171 sourced community positions in addition to the original catalog. These positions are explicitly approximate, with source links and review dates. The map has 5,323 records in 129 categories; this is not a claim of exhaustive in-game coverage. See [the research and coverage notes](docs/gta6-map-research.md). The sidebar includes source credits and coverage gaps. Use `npm run icons:generate` after changing categories.

GTA VI starts with dense layers hidden. Use Play to restore this view, or choose Essentials, Money, Collectibles, or Activities in the sidebar. Individual categories and saved views remain customizable. A selected pin stays visible even when its category or found pins are hidden.

Run `npm run audit:map` to validate category IDs, coordinates, checklist links, tip links, and player views. Add `-- --report` to write `scripts/player-audit.json`. The catalog currently links 16 of 68 story missions to published locations; missions without a catalog location have no invented waypoint. Catalog checks validate local consistency, not the accuracy or freshness of external guides.

## Add a game

1. Copy `src/config/games/gta6` to a new folder.
2. Set bounds, categories, markers, and palette.
3. Register it in `src/config/games/index.ts`.

Bounds are a square world window. In-game X grows east and Y grows north. The edges of a tile image are `minX/maxX/minY/maxY`.

## Tiles

The app draws a schematic atlas until real tiles exist. Generate that schematic, or slice your own image:

```bash
npm run maps:generate
npm run maps:slice -- --input public/maps/gta5/atlas.svg --game gta5 --style atlas
```

Tiles are written to `public/tiles/{game}/{style}/{z}/{x}/{y}.png` for zoom 0–5. Zoom 5 is 8192 pixels across.
