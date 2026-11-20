import type { GameConfig } from '@/types/game'
import { gta5 } from '@/config/games/gta5/config'
import { gta6 } from '@/config/games/gta6/config'

/**
 * Register a game by adding its folder and one line here.
 * The map, sidebar, search, and progress store read this list and nothing else.
 */
export const gameList: GameConfig[] = [gta5, gta6]

const bySlug = new Map(gameList.map((game) => [game.slug, game]))

export function getGame(slug: string) {
  return bySlug.get(slug)
}

export function isGameSlug(slug: string) {
  return bySlug.has(slug)
}
