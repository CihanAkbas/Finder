'use client'

import { useParams } from 'next/navigation'
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

function useSlug() {
  const params = useParams<{ gameSlug: string }>()
  return params.gameSlug
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
  return <DailyBoard gameSlug={gameSlug} />
}
export function DatabaseRoute() {
  const gameSlug = useSlug()
  return <DatabaseBoard gameSlug={gameSlug} />
}
export function GarageRoute() {
  const gameSlug = useSlug()
  return <GarageBoard gameSlug={gameSlug} />
}
export function CalculatorRoute() {
  const gameSlug = useSlug()
  return <CalculatorBoard gameSlug={gameSlug} />
}
export function WeeklyRoute() {
  const gameSlug = useSlug()
  return <WeeklyBoard gameSlug={gameSlug} />
}
export function EconomyRoute() {
  const gameSlug = useSlug()
  return <EconomyBoard gameSlug={gameSlug} />
}
export function ReferenceRoute() {
  const gameSlug = useSlug()
  return <ReferenceBoard gameSlug={gameSlug} />
}
export function CompareRoute() {
  const gameSlug = useSlug()
  return <CompareBoard gameSlug={gameSlug} />
}
export function CareerRoute() {
  const gameSlug = useSlug()
  return <CareerBoard gameSlug={gameSlug} />
}
export function EmpireRoute() {
  const gameSlug = useSlug()
  return <EmpireBoard gameSlug={gameSlug} />
}
