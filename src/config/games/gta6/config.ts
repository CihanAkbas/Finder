import type { GameMarker } from '@/types/game'
import { defineGame } from '@/config/games/defineGame'
import { gta6Categories } from '@/config/games/gta6/categories'
import { gta6Geography, gta6Palettes } from '@/config/games/gta6/geography'
import { GTA6_STORY_CATEGORIES, GTA6_STORY_PINS } from '@/config/games/gta6/storyPins'
import markers from '@/config/games/gta6/markers.json'
import { communityCategories, communityMarkers } from './community'
import { applyVehicleCorrections } from './vehicleCorrections'
import { addReviewedDiscoveries } from './reviewedDiscoveries'
import { applyCatalogRefresh } from './catalogRefresh'
import { deduplicateGta6Pins } from './deduplication'
import { addReviewedVariants } from './extraVariants'

export const gta6Catalog = addReviewedDiscoveries(applyCatalogRefresh(addReviewedVariants(applyVehicleCorrections([...GTA6_STORY_PINS, ...communityMarkers, ...(markers as GameMarker[])]))))

/**
 * Bounds match the published Leonida marker extent, padded so the map stays square.
 * X is longitude and Y is latitude from that map, not in-game meters.
 */
const bounds = {
  "minX": -1.0737702086651435,
  "maxX": -0.2782257709894464,
  "minY": 0.2826283173759064,
  "maxY": 1.0781727550516036
}

export const gta6 = defineGame({
  slug: 'gta6',
  title: 'Grand Theft Auto VI',
  shortTitle: 'GTA VI',
  region: 'Leonida',
  subtitle: 'Leonida',
  accent: '#ff4f8b',
  status: 'ready',
  projection: 'geographic',
  bounds,
  minZoom: 8,
  maxZoom: 17,
  maxNativeZoom: 16,
  categories: [...GTA6_STORY_CATEGORIES, ...communityCategories, ...gta6Categories],
  markers: deduplicateGta6Pins(gta6Catalog),
  geography: gta6Geography,
  styles: [
    {
      id: 'day',
      name: 'Day',
      tileUrl: 'https://tiles.mapgenie.io/games/grand-theft-auto-6/leonida/day-v2/{z}/{y}/{x}.jpg',
      fallbackMode: 'vector',
      palette: gta6Palettes.atlas,
    },
    {
      id: 'night',
      name: 'Night',
      tileUrl: 'https://tiles.mapgenie.io/games/grand-theft-auto-6/leonida/night-v3/{z}/{y}/{x}.jpg',
      fallbackMode: 'vector',
      palette: gta6Palettes.satellite,
    },
  ],
})
