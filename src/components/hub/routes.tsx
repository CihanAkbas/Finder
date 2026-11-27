'use client'

import dynamic from 'next/dynamic'
import { redirect, useParams } from 'next/navigation'
import { CalculatorBoard } from '@/components/hub/CalculatorBoard'
import { ChecklistBoard } from '@/components/hub/ChecklistBoard'
import { DailyBoard } from '@/components/hub/DailyBoard'
import { Dashboard } from '@/components/hub/Dashboard'
import { DatabaseBoard } from '@/components/hub/DatabaseBoard'
import { EconomyBoard } from '@/components/hub/EconomyBoard'
import { GarageBoard } from '@/components/hub/GarageBoard'
import { ReferenceBoard } from '@/components/hub/ReferenceBoard'
import { CareerBoard } from '@/components/hub/CareerBoard'
import { CompareBoard } from '@/components/hub/CompareBoard'
import { EmpireBoard } from '@/components/hub/EmpireBoard'
import { WeeklyBoard } from '@/components/hub/WeeklyBoard'
import { GamePage } from '@/components/GamePage'
import { modulesFor } from '@/components/layout/modules'

const StyleBoard = dynamic(() => import('@/components/hub/StyleBoard').then(module => module.StyleBoard))

function useSlug() {
  const params = useParams<{ gameSlug: string }>()
  return params.gameSlug
}

function storyOnly(slug: string, path: string) {
  if (!modulesFor(slug).some(item => item.href === path)) redirect(`/${slug}`)
}

export function DashboardRoute() {
  const gameSlug = useSlug()
  return <Dashboard gameSlug={gameSlug} />
}
export function MapRoute() {
  const gameSlug = useSlug()
  return (
    <div className="h-full min-h-0">
      <GamePage gameSlug={gameSlug} />
    </div>
  )
}
export function ChecklistRoute() {
  const gameSlug = useSlug()
  return <ChecklistBoard gameSlug={gameSlug} />
}
export function DailyRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/daily')
  return <DailyBoard gameSlug={gameSlug} />
}
export function DatabaseRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/database')
  return <DatabaseBoard gameSlug={gameSlug} />
}
export function GarageRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/garage')
  return <GarageBoard gameSlug={gameSlug} />
}
export function CalculatorRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/calculators')
  return <CalculatorBoard gameSlug={gameSlug} />
}
export function WeeklyRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/weekly')
  return <WeeklyBoard gameSlug={gameSlug} />
}
export function EconomyRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/economy')
  return <EconomyBoard gameSlug={gameSlug} />
}
export function ReferenceRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/reference')
  return <ReferenceBoard gameSlug={gameSlug} />
}
export function CompareRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/compare')
  return <CompareBoard gameSlug={gameSlug} />
}
export function CareerRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/career')
  return <CareerBoard gameSlug={gameSlug} />
}
export function EmpireRoute() {
  const gameSlug = useSlug()
  storyOnly(gameSlug, '/empire')
  return <EmpireBoard gameSlug={gameSlug} />
}

export function StyleRoute() { const slug = useSlug(); if (slug !== 'gta6') redirect(`/${slug}`); return <StyleBoard /> }
