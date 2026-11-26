# Finder

All-in-one GTA companion for a second screen. GTA V and GTA VI have populated maps and companion pages. GTA VI includes the local Leonida catalog, tips, story-help pins, and English/Turkish text.

Modules under `/gta5`: hub, map, 100% checklist, daily/weekly resets, vehicle and weapon database, garage, and heist/business/stock calculators. Found pins and checklist rows share one save. Progress stays available locally (IndexedDB with a localStorage fallback). Google or email/password sign-in also syncs progress between devices through Firebase. Guest and account saves are separate.

## Run

```bash
npm install
npm run dev
```

Open `/gta5` or `/gta6/map`.

The 26 November 2026 map review and rare-vehicle corrections provide 2,177 sourced community positions in addition to the original catalog. These positions are explicitly approximate, with source links and review dates. The map has 5,329 records in 129 categories; this is not a claim of exhaustive in-game coverage. Location cards put the description first and collapse documented directions, access conditions, coordinates, and sources. The 26 story-help pins have Turkish titles and descriptions. See [the research and coverage notes](docs/gta6-map-research.md). Use `npm run icons:generate` after changing categories.

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

## Accounts and cloud progress

Firebase project: `finder-leonida-companion` (Spark). Public web configuration is in `src/config/firebase.public.json`; it contains browser identifiers, not an Admin SDK credential. Never add service account keys or OAuth client secrets to this repository.

Google and email/password providers are enabled in Firebase Authentication. Add the production hostname in Authentication → Settings → Authorized domains before deploying under a new domain. `localhost` and `finder-gules-phi.vercel.app` are already authorized. Google popup sign-in requires browser popups; passwords can be reset from the account dialog.

Firestore is in `europe-west3`. Deploy per-user access rules with `firebase deploy --only firestore:rules --project finder-leonida-companion`. Rules allow users to access only their own `users/{uid}/games/{gta5|gta6}` documents. There is no public progress collection.

Pending changes are saved locally and rebased onto the latest cloud save in a Firestore transaction. Concurrent checklist additions are retained, and an explicitly unchecked item stays unchecked. Ordered routes use the last committed local edit; simultaneous edits of the same scalar field also use the last commit. Custom pins, saved filters and properties merge by ID. Offline changes retry after reconnecting. Account switching keeps separate local caches; signing out restores the guest save. Clearing browser data before offline changes reach the server can still remove those pending changes.

The GTA VI home has two cards (tracked story progress and found locations). The checklist opens in chapter order; game 100% targets are a separate tab. Story progress currently covers the 68 cataloged missions in the first three chapters, not a complete game's verified progress.
