import type { GameMarker } from '@/types/game'
import { defineGame } from '@/config/games/defineGame'
import { gta5Categories } from '@/config/games/gta5/categories'
import { gta5Geography, gta5Palettes } from '@/config/games/gta5/geography'
import markers from '@/config/games/gta5/markers.json'

/**
 * Edges of the 8192px styleAtlas / styleSatelite / styleGrid pyramid.
 * At zoom 0 the whole image is one 256px tile, and a game position lands on
 * px = 0.02072 * x + 117.3, py = -0.0205 * y + 172.8. X and Y use those
 * separate scales, so the window is almost square but not exactly.
 */
const bounds = {
  minX: -117.3 / 0.02072,
  maxX: (256 - 117.3) / 0.02072,
  minY: (172.8 - 256) / 0.0205,
  maxY: 172.8 / 0.0205,
}

export const gta5 = defineGame({
  slug: 'gta5',
  title: 'Grand Theft Auto V',
  shortTitle: 'GTA V',
  region: 'Los Santos',
  subtitle: 'San Andreas',
  accent: '#10B981',
  status: 'ready',
  bounds,
  minZoom: 0,
  maxZoom: 6,
  maxNativeZoom: 5,
  categories: gta5Categories,
  markers: markers as GameMarker[],
  geography: gta5Geography,
  styles: [
    {
      id: 'atlas',
      name: 'Atlas',
      tileUrl: '/tiles/gta5/atlas/{z}/{x}/{y}.jpg',
      fallbackImage: '/maps/gta5/atlas.svg',
      fallbackMode: 'vector',
      palette: gta5Palettes.atlas,
    },
    {
      id: 'satellite',
      name: 'Satellite',
      tileUrl: '/tiles/gta5/satellite/{z}/{x}/{y}.jpg',
      fallbackImage: '/maps/gta5/satellite.svg',
      fallbackMode: 'vector',
      palette: gta5Palettes.satellite,
    },
    {
      id: 'grid',
      name: 'Grid',
      tileUrl: '/tiles/gta5/grid/{z}/{x}/{y}.png',
      fallbackImage: '/maps/gta5/road.svg',
      fallbackMode: 'vector',
      palette: gta5Palettes.road,
    },
  ],
})
