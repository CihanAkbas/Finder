import { dayOfYear } from '@/lib/resets'

/** Spots 6, 8, 11, and 14 kept their original ids when the published list was merged. */
const LEGACY_SLOT: Record<number, string> = {
  6: 'gta5-gunvan-terminal',
  8: 'gta5-gunvan-paleto',
  11: 'gta5-gunvan-sandy',
  14: 'gta5-gunvan-lamesa',
}

/** 1–30. A remainder of 0 is spot 30, so all 30 published places are used. */
export function gunVanSlot(day: number) {
  const mod = ((day % 30) + 30) % 30
  return mod === 0 ? 30 : mod
}

export function gunVanMarkerId(day = dayOfYear()) {
  const slot = gunVanSlot(day)
  return LEGACY_SLOT[slot] ?? `gta5-gun-van-${String(slot).padStart(2, '0')}`
}
