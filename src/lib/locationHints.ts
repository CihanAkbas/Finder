/** Conservative extraction of atomic facts; source prose is never copied into the catalog. */
export const PLACEMENT_PATTERNS = {
  garage: /\b(?:inside|in) (?:the |a |an )?(?:open |locked |small |large |downstairs |underground )?garage\b/i,
  roof: /\b(?:on|at|onto) (?:the |a )?(?:roof|rooftop)\b/i,
  underwater: /\bunderwater\b|\bunder (?:the )?sea\b/i,
  container: /\b(?:inside|in) (?:the |a |an )?(?:yellow |orange |blue |shipping |locked |SCOOP )*container\b/i,
  bedroom: /\b(?:in|inside) (?:the |a )?(?:second-floor |upstairs )?bedroom\b/i,
  basement: /\b(?:in|inside) (?:the |a )?basement\b/i,
  warehouse: /\b(?:in|inside) (?:the |a )?(?:open |abandoned )?warehouse\b/i,
  barn: /\b(?:in|inside) (?:the |a |an )?(?:old |abandoned )?barn\b/i,
  behind: /\bbehind (?:the |a )?(?:house|building|shop|store)\b/i,
  dock: /\b(?:on|at|under|below) (?:the |a )?(?:dock|pier|jetty)\b/i,
  beach: /\b(?:on|at|along) (?:the |a )?(?:beach|shore)\b/i,
  trunk: /\b(?:in|inside) (?:the |a |an )?(?:car |vehicle |open )?trunk\b/i,
  bathroom: /\b(?:in|inside) (?:the |a )?(?:bathroom|bathtub)\b/i,
  upstairs: /\b(?:on|in) (?:the |a )?(?:second[- ]floor|third[- ]floor|upper floor)\b/i,
} as const

const PLACE_NAMES = ['Key Lento', 'Port Gellhorn', 'Gellhorn International Raceway', 'Capri', 'Hamlet', 'Ambrosia', 'Grayson', 'Rockridge', 'Ocean Beach', 'Washington Beach', 'Peacock Estates', 'Starfish Island', 'Vespucci Island', 'Casanova Island', 'Rialto Islands', 'Watson Bay', 'Wild Hog Point', 'Bobcat Key', 'Belpoint', 'Belville', 'Moreau', 'Bonanza', 'Tallaloko', 'Millport', 'Little Cuba', 'Southside', 'La Perle', 'Grassrivers', 'Pelican Valley', 'Permit Keys', 'Shoeless Keys', 'Buckskin Swamp', 'South Kelly County', 'North Leonard County', 'Mount Kalaga']

export type LocationHints = {
  placements: (keyof typeof PLACEMENT_PATTERNS)[]
  tools: ('cutter' | 'key-cloner')[]
  places: string[]
  chapter?: number
  sourceUrl: string
  reviewedAt: string
}

export function extractLocationHints(text: string, sourceUrl: string): LocationHints | null {
  const placements = (Object.keys(PLACEMENT_PATTERNS) as (keyof typeof PLACEMENT_PATTERNS)[]).filter((key) => text.split(/[.!?\n]/).some((sentence) => {
    const match = PLACEMENT_PATTERNS[key].exec(sentence)
    return match && !/\b(?:not|no|without)\b/i.test(sentence.slice(Math.max(0, match.index - 35), match.index))
  }))
  const places = PLACE_NAMES.filter((place) => text.includes(place))
  const tools: LocationHints['tools'] = []
  // Accept affirmative statements only. "May need", "no tool" and bare mentions are not requirements.
  if (/\b(?:requires?|needs?|need (?:the|a)|open (?:it|this|the container) with (?:the|a)) (?:a |the )?(?:cut[- ]off tool|cutter tool|cutting tool)\b/i.test(text) && !/\b(?:no|not|without|may)\b[^.!?]{0,35}(?:cut[- ]off|cutter|cutting)\b/i.test(text)) tools.push('cutter')
  if (/\b(?:requires?|needs?|need (?:the|a)) (?:a |the )?key cloner\b/i.test(text) && !/\b(?:no|not|without|may)\b[^.!?]{0,35}key cloner\b/i.test(text)) tools.push('key-cloner')
  // A chapter number elsewhere in a description is not an unlock condition.
  const chapter = /\b(?:unlocks?|available|opens?) (?:in|from|after) chapter ([1-5])\b/i.exec(text)
  if (!placements.length && !places.length && !tools.length && !chapter) return null
  return { placements, tools, places, ...(chapter ? { chapter: Number(chapter[1]) } : {}), sourceUrl, reviewedAt: '2026-11-26' }
}
