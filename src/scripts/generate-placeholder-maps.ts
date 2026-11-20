import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gameList } from '../config/games'
import { MAP_SVG_SIZE, buildMapScene, sceneToSvg } from '../lib/mapArtwork'

const root = process.cwd()

for (const game of gameList) {
  const dir = join(root, 'public', 'maps', game.slug)
  mkdirSync(dir, { recursive: true })
  for (const style of game.styles) {
    const svg = sceneToSvg(buildMapScene(game, style.id), MAP_SVG_SIZE, 8192)
    const file = join(dir, `${style.id}.svg`)
    writeFileSync(file, svg)
    console.log(`wrote ${file}`)
  }
}
