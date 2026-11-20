import { Suspense } from 'react'
import { CareerRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CareerRoute />
    </Suspense>
  )
}
