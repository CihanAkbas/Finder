import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundCoord(value: number, digits = 2) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function formatCoord(value: number, digits = 1) {
  return value.toFixed(digits)
}

export function coordText(point: { x: number; y: number; z?: number }, precision = 2) {
  const plane = `${point.x.toFixed(precision)}, ${point.y.toFixed(precision)}`
  return point.z == null ? plane : `${plane}, ${point.z.toFixed(2)}`
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'pin'
}

export function guideUrl(title: string, gameTitle: string, videoUrl?: string) {
  if (videoUrl) return videoUrl
  const query = encodeURIComponent(`${title} ${gameTitle} location`)
  return `https://www.youtube.com/results?search_query=${query}`
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function copyText(value: string) {
  await navigator.clipboard.writeText(value)
}
