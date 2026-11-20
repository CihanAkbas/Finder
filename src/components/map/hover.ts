import { useSyncExternalStore } from 'react'

export type MarkerHover = { id: string; title: string; x: number; y: number; color: string; icon?: { x: number; y: number; w: number; h: number } }

let hover: MarkerHover | null = null
const listeners = new Set<() => void>()
let frame = 0
let pending: MarkerHover | null | undefined

export function setMarkerHover(next: MarkerHover | null) {
  pending = next
  if (frame) return
  frame = window.requestAnimationFrame(() => {
    frame = 0
    const value = pending ?? null
    pending = undefined
    if (hover?.id === value?.id && hover?.x === value?.x && hover?.y === value?.y) return
    hover = value
    listeners.forEach((listener) => listener())
  })
}

export function useMarkerHover() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => hover,
    () => null,
  )
}

let suppressClick = false

export function suppressNextMapClick() {
  suppressClick = true
}

export function consumeSuppressedMapClick() {
  if (!suppressClick) return false
  suppressClick = false
  return true
}
