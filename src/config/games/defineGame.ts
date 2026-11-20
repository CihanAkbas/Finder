import type { CategoryNode, GameConfig, GameMarker } from '@/types/game'
import { leafCategories } from '@/lib/categories'
import { CAYO_BOUNDS } from '@/lib/mapMode'

export function defineGame(config: GameConfig): GameConfig {
  if (config.styles.length === 0) {
    throw new Error(`[${config.slug}] needs at least one map style`)
  }

  const spanX = config.bounds.maxX - config.bounds.minX
  const spanY = config.bounds.maxY - config.bounds.minY
  if (spanX <= 0 || spanY <= 0) {
    throw new Error(`[${config.slug}] bounds are inverted`)
  }
  if (Math.abs(spanX - spanY) / Math.max(spanX, spanY) > 0.05) {
    console.warn(
      `[${config.slug}] bounds are ${spanX.toFixed(0)} by ${spanY.toFixed(0)}. A square tile image will squash the longer axis.`,
    )
  }

  const leaves = new Set(leafCategories(config.categories).map((category) => category.id))
  const ids = new Set<string>()
  const outside: string[] = []

  for (const marker of config.markers) {
    if (ids.has(marker.id)) throw new Error(`[${config.slug}] duplicate marker id ${marker.id}`)
    ids.add(marker.id)
    if (!leaves.has(marker.category)) {
      throw new Error(`[${config.slug}] marker ${marker.id} uses unknown category "${marker.category}"`)
    }
    const frame = marker.category.startsWith('cayo-') ? CAYO_BOUNDS : config.bounds
    if (marker.x < frame.minX || marker.x > frame.maxX || marker.y < frame.minY || marker.y > frame.maxY) {
      outside.push(marker.id)
    }
  }

  if (outside.length > 0) {
    console.warn(`[${config.slug}] markers outside the atlas window: ${outside.join(', ')}`)
  }

  return config
}

export function getStyle(game: GameConfig, styleId?: string) {
  return game.styles.find((style) => style.id === styleId) ?? game.styles[0]
}

export function categoryName(categories: CategoryNode[], id: string) {
  return leafCategories(categories).find((category) => category.id === id)?.name ?? id
}

export function markerById(markers: GameMarker[], id: string) {
  return markers.find((marker) => marker.id === id)
}
