import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CompanionShell } from '@/components/layout/CompanionShell'
import { gameList, getGame } from '@/config/games'

export const instant = false

export function generateStaticParams() {
  return gameList.map((game) => ({ gameSlug: game.slug }))
}

export default function GameLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ gameSlug: string }>
}) {
  return (
    <Suspense fallback={<div className="h-dvh bg-[#0A0B0E]" />}>
      <ResolvedGame params={params}>{children}</ResolvedGame>
    </Suspense>
  )
}

async function ResolvedGame({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ gameSlug: string }>
}) {
  const { gameSlug } = await params
  if (!getGame(gameSlug)) notFound()
  return <CompanionShell gameSlug={gameSlug}>{children}</CompanionShell>
}
