import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import sharp from 'sharp'
import { gta6Atlas, gta6CategoryIcons, gta6IconDefinitions } from '../src/config/games/gta6/markerIcons'

const cells = gta6IconDefinitions.map((entry) => {
  const sprite = gta6CategoryIcons[entry.id]
  if (sprite.y + sprite.h > gta6Atlas.height) throw new Error('Atlas dimensions must grow to fit the catalog')
  const Icon = (icons as unknown as Record<string, LucideIcon>)[entry.symbol]
  if (!Icon) throw new Error(`Unknown icon: ${entry.symbol}`)
  const glyph = renderToStaticMarkup(createElement(Icon, { x: 12, y: 12, width: 36, height: 36, color: '#ffffff', strokeWidth: 2.2 }))
  return `<g transform="translate(${sprite.x} ${sprite.y})"><circle cx="30" cy="30" r="27" fill="#10151e" stroke="${entry.color}" stroke-width="4"/>${glyph}</g>`
})
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gta6Atlas.width}" height="${gta6Atlas.height}">${cells.join('')}</svg>`
const directory = fileURLToPath(new URL('../public/maps/gta6/', import.meta.url))
await mkdir(directory, { recursive: true })
await writeFile(`${directory}${gta6Atlas.url.split('/').pop()}`, await sharp(Buffer.from(svg)).png().toBuffer())
console.log(`Generated ${gta6IconDefinitions.length} local category icons`)
