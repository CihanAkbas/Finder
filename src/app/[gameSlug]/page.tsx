import { Suspense } from 'react'
import { DashboardRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardRoute />
    </Suspense>
  )
}
