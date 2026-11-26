import Fuse from 'fuse.js'
import { categoryName } from '@/config/games/defineGame'
import { markerSearchText, markerTitle } from '@/i18n/markerText'
import type { CustomPin } from '@/store/useMapStore'
import type { GameConfig, MarkerGuide } from '@/types/game'

function guideSearchText(guide?: MarkerGuide) {
  if (!guide) return ''
  return [guide.summary, ...(guide.directions ?? []), ...(guide.requirements ?? []), ...(guide.warnings ?? [])]
    .flatMap((text) => text ? [text.en, text.tr] : []).join(' ')
}

export type SearchHit = {
  id: string
  title: string
  category: string
  categoryLabel: string
  x: number
  y: number
  kind: 'marker' | 'pin'
  description: string
  tags: string
  localized: string
}

export function buildSearchDocs(game: GameConfig, pins: CustomPin[]): SearchHit[] {
  return [
    ...game.markers.map((marker) => ({
      id: marker.id,
      title: marker.title,
      category: marker.category,
      categoryLabel: categoryName(game.categories, marker.category),
      x: marker.x,
      y: marker.y,
      kind: 'marker' as const,
      description: marker.description,
      tags: `${(marker.tags ?? []).join(' ')} ${markerSearchText(marker.title, marker.description)}`,
      localized: `${markerTitle('tr', marker.title)} ${marker.descriptionTr ?? ''} ${guideSearchText(marker.guide)}`,
    })),
    ...pins.map((pin) => ({
      id: pin.id,
      title: pin.title,
      category: 'pin',
      categoryLabel: 'Personal pin',
      x: pin.x,
      y: pin.y,
      kind: 'pin' as const,
      description: pin.note,
      tags: 'custom pin kişisel iğne',
      localized: pin.title,
    })),
  ]
}

export function searchDocs(docs: SearchHit[], query: string) {
  const trimmed = query.trim()
  if (!trimmed) {
    return docs.filter((doc) => doc.category === 'landmarks' || doc.category === 'districts').slice(0, 8)
  }
  const fuse = new Fuse(docs, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'localized', weight: 0.5 },
      { name: 'categoryLabel', weight: 0.16 },
      { name: 'tags', weight: 0.16 },
      { name: 'description', weight: 0.1 },
    ],
    threshold: 0.38,
    ignoreLocation: true,
  })
  return fuse.search(trimmed, { limit: 30 }).map((result) => result.item)
}
