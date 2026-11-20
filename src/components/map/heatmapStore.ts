'use client'

import { create } from 'zustand'

type HeatStatus = 'idle' | 'loading' | 'ready' | 'error'

type HeatState = {
  id: number | null
  status: HeatStatus
  shown: number
  setId: (id: number | null) => void
  setResult: (status: HeatStatus, shown: number) => void
}

export const useHeatmapStore = create<HeatState>((set) => ({
  id: null,
  status: 'idle',
  shown: 0,
  setId: (id) => set({ id, status: id == null ? 'idle' : 'loading', shown: 0 }),
  setResult: (status, shown) => set({ status, shown }),
}))
