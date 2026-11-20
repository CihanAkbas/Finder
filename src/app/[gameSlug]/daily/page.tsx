import { Suspense } from 'react'
import { DailyRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DailyRoute />
    </Suspense>
  )
}
