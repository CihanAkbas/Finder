import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

type Options = {
  input: string
  game: string
  style: string
  minZoom: number
  maxZoom: number
  tileSize: number
}

const help = `Slice a square map image into a Leaflet XYZ pyramid.

Usage:
  npm run maps:slice -- --input public/maps/gta5/atlas.svg --game gta5 --style atlas

Options:
  --input     Source image (png, jpg, webp, or svg)
  --game      Game folder under public/tiles
  --style     Style folder, default atlas
  --minZoom   First zoom level, default 0
  --maxZoom   Last zoom level, default 5 (8192px when tile size is 256)
  --tileSize  Tile edge in pixels, default 256

Zoom 0 is one tile of the whole map. Each level doubles the resolution.
The image is stretched to a square. Its edges must match the game bounds in config.ts.
`

function arg(name: string) {
  const index = process.argv.indexOf(`--${name}`)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

function readOptions(): Options | null {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(help)
    return null
  }
  const input = arg('input')
  const game = arg('game')
  if (!input || !game) {
    console.error(help)
    process.exitCode = 1
    return null
  }
  const minZoom = Number(arg('minZoom') ?? 0)
  const maxZoom = Number(arg('maxZoom') ?? 5)
  const tileSize = Number(arg('tileSize') ?? 256)
  if (![minZoom, maxZoom, tileSize].every((value) => Number.isInteger(value) && value >= 0)) {
    throw new Error('Zoom levels and tile size must be non-negative integers.')
  }
  if (maxZoom < minZoom) throw new Error('--maxZoom must be greater than or equal to --minZoom.')
  if (maxZoom > 8) throw new Error('--maxZoom above 8 would create an enormous pyramid.')
  return {
    input,
    game,
    style: arg('style') ?? 'atlas',
    minZoom,
    maxZoom,
    tileSize,
  }
}

async function writeTile(source: Buffer, tileSize: number, x: number, y: number, file: string) {
  const tile = await sharp(source)
    .extract({ left: x * tileSize, top: y * tileSize, width: tileSize, height: tileSize })
    .png({ compressionLevel: 9 })
    .toBuffer()
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, tile)
}

async function main() {
  const options = readOptions()
  if (!options) return
  const meta = await sharp(options.input).metadata()
  if (meta.width && meta.height && meta.width !== meta.height) {
    console.warn(`Input is ${meta.width}x${meta.height}. It will be stretched to a square so the pyramid stays XYZ-aligned.`)
  }

  for (let zoom = options.minZoom; zoom <= options.maxZoom; zoom += 1) {
    const tiles = 2 ** zoom
    const size = options.tileSize * tiles
    console.log(`zoom ${zoom}: ${size}px, ${tiles * tiles} tiles`)
    const source = await sharp(options.input).resize(size, size, { fit: 'fill' }).png().toBuffer()
    const jobs: Promise<void>[] = []
    for (let x = 0; x < tiles; x += 1) {
      for (let y = 0; y < tiles; y += 1) {
        const file = path.join('public', 'tiles', options.game, options.style, String(zoom), String(x), `${y}.png`)
        jobs.push(writeTile(source, options.tileSize, x, y, file))
        if (jobs.length >= 8) {
          await Promise.all(jobs)
          jobs.length = 0
        }
      }
    }
    await Promise.all(jobs)
  }
  console.log(`Tiles written to public/tiles/${options.game}/${options.style}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
