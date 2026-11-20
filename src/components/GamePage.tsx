'use client'

import dynamic from 'next/dynamic'
import { Splash } from '@/components/Splash'

const GameApp = dynamic(() => import('@/components/GameApp'), {
  ssr: false,
  loading: () => <Splash />,
})

export function GamePage({ gameSlug }: { gameSlug: string }) {
  if (!gameSlug) return null
  return <GameApp gameSlug={gameSlug} />
}
