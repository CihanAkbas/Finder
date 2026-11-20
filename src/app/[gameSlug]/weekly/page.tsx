import { Suspense } from 'react'
import { WeeklyRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WeeklyRoute />
    </Suspense>
  )
}
