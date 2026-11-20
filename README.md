# Finder

All-in-one GTA companion for a second screen. GTA V is populated. GTA VI is a data shell: the same pages render, and they fill in when JSON is dropped into `src/config/games/gta6`.

Modules under `/gta5`: hub, map, 100% checklist, daily/weekly resets, vehicle and weapon database, garage, and heist/business/stock calculators. Found pins and checklist rows share one save. Progress, garage slots, and daily checks stay in this browser (IndexedDB, with a localStorage fallback) and can be exported from the top bar.

## Run

```bash
npm install
npm run dev
```

Open `/gta5`.

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
