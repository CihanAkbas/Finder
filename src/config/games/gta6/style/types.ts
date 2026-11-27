export type StyleCharacter = 'lucia' | 'jason' | 'unisex'
export type StyleItem = { id: string; name: string; sourceUrl: string; imageUrl?: string; character: StyleCharacter; category: string; storeIds: string[]; detailed: boolean }
export type StyleOutfit = { id: string; name: string; author: string; sourceUrl: string; imageUrl?: string; character: StyleCharacter; itemIds: string[] }
export type StyleStore = { id: string; name: string; sourceUrl: string; district: string; category: string; markerIds: string[] }
export type StyleCatalog = { reviewedAt: string; source: string; items: StyleItem[]; outfits: StyleOutfit[]; stores: StyleStore[] }
