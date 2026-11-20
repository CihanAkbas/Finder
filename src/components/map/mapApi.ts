'use client'

import { createContext, useContext } from 'react'

export type MapApi = {
  flyTo: (x: number, y: number, zoom?: number) => void
  zoomIn: () => void
  zoomOut: () => void
  fit: () => void
  getView: () => { x: number; y: number; z: number }
}

export const MapApiContext = createContext<MapApi | null>(null)

export function useMapApi() {
  return useContext(MapApiContext)
}

export const SIDEBAR_WIDTH = 380
