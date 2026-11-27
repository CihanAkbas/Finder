# GTA VI style catalog

Finder's `/gta6/style` section offers a public catalog selection, item ownership, saved reference looks, private outfit building, and links to existing map locations. Wardrobe fields use the existing per-account Firebase progress synchronization and offline storage. They do not change map completion.

Snapshot reviewed 2026-11-27: 60 public looks, 343 distinct pieces, 114 stores. This is a selection, not a claim of complete GTAFits or game coverage. Public JSON-LD, metadata and store links supply factual names and references; no authenticated API is used. Original creator names and source links are retained. Images are remote GTAFits CDN thumbnails with source attribution and a local icon fallback; no images or source site application code are rehosted. Original in-game item names remain untranslated. No unpublished prices or acquisition requirements are invented.

Map links reuse canonical Finder pins. A store name may have multiple existing branches; all matching branches are shown rather than inventing coordinates. Unmatched stores retain their public source link. Incomplete piece metadata is explicitly shown as unavailable.

`scripts/import-style-catalog.mts` reads cached public HTML from the OS temporary directory by default. `STYLE_FETCH_PUBLIC=1` explicitly enables public-page maintenance requests. A rate-limit response stops additional network fetching; uncached item/store details remain unavailable. Public outfit/index pages must be available before a new snapshot can be written. Stable URL hashes preserve saved IDs. Review the resulting catalog diff and run the reference-integrity tests before committing an update.
