import type { GameConfig, GeoPoint, MapPalette, RegionKind, WorldBounds } from '@/types/game'
import { projectToSvg } from '@/lib/projection'

export const MAP_SVG_SIZE = 2048

export type SceneNode =
  | { type: 'rect'; x: number; y: number; w: number; h: number; fill: string; opacity?: number }
  | { type: 'circle'; cx: number; cy: number; r: number; fill: string; opacity?: number }
  | {
      type: 'path'
      d: string
      fill?: string
      stroke?: string
      strokeWidth?: number
      opacity?: number
      fillRule?: 'evenodd' | 'nonzero'
    }
  | {
      type: 'text'
      x: number
      y: number
      text: string
      size: number
      fill: string
      halo: string
      anchor?: 'start' | 'middle'
      weight?: number
      tracking?: number
    }

const regionFill: Record<RegionKind, keyof MapPalette> = {
  urban: 'urban',
  desert: 'desert',
  hills: 'hills',
  forest: 'forest',
  mountain: 'mountain',
  wetland: 'wetland',
}

function ring(points: GeoPoint[], bounds: WorldBounds, size: number) {
  return points
    .map(([x, y], index) => {
      const [sx, sy] = projectToSvg(x, y, bounds, size)
      return `${index === 0 ? 'M' : 'L'}${sx.toFixed(1)} ${sy.toFixed(1)}`
    })
    .join(' ')
}

function closed(points: GeoPoint[], bounds: WorldBounds, size: number) {
  return `${ring(points, bounds, size)} Z`
}

function peakPath(x: number, y: number, bounds: WorldBounds, size: number) {
  const [sx, sy] = projectToSvg(x, y, bounds, size)
  return `M ${sx.toFixed(1)} ${(sy - 46).toFixed(1)} L ${(sx + 28).toFixed(1)} ${sy.toFixed(1)} L ${(sx - 28).toFixed(1)} ${sy.toFixed(1)} Z`
}

export function buildMapScene(game: GameConfig, styleId: string): SceneNode[] {
  const style = game.styles.find((entry) => entry.id === styleId) ?? game.styles[0]
  const palette = style.palette
  const { geography, bounds } = game
  const size = MAP_SVG_SIZE
  const nodes: SceneNode[] = []

  nodes.push({ type: 'rect', x: 0, y: 0, w: size, h: size, fill: palette.oceanDeep })
  nodes.push({
    type: 'circle',
    cx: size * 0.5,
    cy: size * 0.48,
    r: size * 0.42,
    fill: palette.ocean,
    opacity: 0.9,
  })

  for (let step = 1; step < 8; step += 1) {
    const position = (size / 8) * step
    nodes.push({
      type: 'path',
      d: `M ${position} 0 L ${position} ${size} M 0 ${position} L ${size} ${position}`,
      stroke: palette.grid,
      strokeWidth: 2,
    })
  }

  const landPath = geography.land.map((points) => closed(points, bounds, size)).join(' ')
  const lakePath = geography.lakes.map((points) => closed(points, bounds, size)).join(' ')

  nodes.push({
    type: 'path',
    d: landPath,
    fill: 'none',
    stroke: palette.beach,
    strokeWidth: 28,
  })
  nodes.push({
    type: 'path',
    d: `${landPath} ${lakePath}`,
    fill: palette.land,
    fillRule: 'evenodd',
    stroke: palette.ink,
    strokeWidth: 3,
  })

  for (const region of geography.regions) {
    nodes.push({
      type: 'path',
      d: closed(region.points, bounds, size),
      fill: palette[regionFill[region.kind]],
      opacity: 0.92,
    })
  }

  for (const lake of geography.lakes) {
    nodes.push({
      type: 'path',
      d: closed(lake, bounds, size),
      fill: palette.lake,
      stroke: palette.oceanDeep,
      strokeWidth: 3,
    })
  }

  for (const road of geography.roads) {
    nodes.push({
      type: 'path',
      d: ring(road.points, bounds, size),
      fill: 'none',
      stroke: road.rank === 'highway' ? palette.highway : palette.road,
      strokeWidth: road.rank === 'highway' ? 8 : 4,
    })
  }

  for (const [x, y] of geography.peaks) {
    nodes.push({
      type: 'path',
      d: peakPath(x, y, bounds, size),
      fill: palette.mountain,
      stroke: palette.label,
      strokeWidth: 2,
    })
  }

  for (const label of geography.labels) {
    const [x, y] = projectToSvg(label.x, label.y, bounds, size)
    nodes.push({
      type: 'text',
      x,
      y,
      text: label.text,
      size: label.size,
      fill: palette.label,
      halo: palette.halo,
      anchor: 'middle',
      weight: 700,
    })
  }

  nodes.push({
    type: 'text',
    x: 48,
    y: 72,
    text: geography.note,
    size: 28,
    fill: palette.label,
    halo: palette.halo,
    anchor: 'start',
    tracking: 6,
    weight: 700,
  })
  nodes.push({
    type: 'text',
    x: 48,
    y: 108,
    text: geography.hint,
    size: 18,
    fill: palette.label,
    halo: palette.halo,
    anchor: 'start',
    tracking: 3,
    weight: 500,
  })

  const arrowX = size - 130
  const arrowY = 150
  nodes.push({
    type: 'path',
    d: `M ${arrowX} ${arrowY + 54} L ${arrowX} ${arrowY} L ${arrowX - 14} ${arrowY + 18} M ${arrowX} ${arrowY} L ${arrowX + 14} ${arrowY + 18}`,
    fill: 'none',
    stroke: palette.label,
    strokeWidth: 4,
  })
  nodes.push({
    type: 'text',
    x: arrowX,
    y: arrowY + 84,
    text: 'N',
    size: 22,
    fill: palette.label,
    halo: palette.halo,
    anchor: 'middle',
    weight: 700,
  })

  return nodes
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function nodeToSvg(node: SceneNode) {
  if (node.type === 'rect') {
    const opacity = node.opacity == null ? '' : ` opacity="${node.opacity}"`
    return `<rect x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" fill="${node.fill}"${opacity}/>`
  }
  if (node.type === 'circle') {
    const opacity = node.opacity == null ? '' : ` opacity="${node.opacity}"`
    return `<circle cx="${node.cx}" cy="${node.cy}" r="${node.r}" fill="${node.fill}"${opacity}/>`
  }
  if (node.type === 'path') {
    const attrs = [
      `d="${node.d}"`,
      node.fill ? `fill="${node.fill}"` : 'fill="none"',
      node.stroke ? `stroke="${node.stroke}"` : '',
      node.strokeWidth ? `stroke-width="${node.strokeWidth}"` : '',
      node.opacity == null ? '' : `opacity="${node.opacity}"`,
      node.fillRule ? `fill-rule="${node.fillRule}"` : '',
      'stroke-linecap="round"',
      'stroke-linejoin="round"',
    ]
      .filter(Boolean)
      .join(' ')
    return `<path ${attrs}/>`
  }
  const tracking = node.tracking ?? node.size * 0.08
  return `<text x="${node.x.toFixed(1)}" y="${node.y.toFixed(1)}" fill="${node.fill}" font-size="${node.size}" font-family="Rajdhani, Barlow, Impact, sans-serif" font-weight="${node.weight ?? 600}" text-anchor="${node.anchor ?? 'middle'}" stroke="${node.halo}" stroke-width="${Math.max(4, node.size / 7).toFixed(1)}" paint-order="stroke" stroke-linejoin="round" letter-spacing="${tracking.toFixed(1)}">${escapeXml(node.text)}</text>`
}

export function sceneToSvg(nodes: SceneNode[], size = MAP_SVG_SIZE, pixelSize = size) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${pixelSize}" height="${pixelSize}" pointer-events="none">\n${nodes.map(nodeToSvg).join('\n')}\n</svg>\n`
}

export function svgElementFromMarkup(markup: string) {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml')
  if (doc.querySelector('parsererror')) {
    throw new Error('Map artwork SVG failed to parse')
  }
  const svg = doc.documentElement
  if (!(svg instanceof SVGElement)) throw new Error('Map artwork was not an SVG element')
  svg.style.pointerEvents = 'none'
  return svg
}
