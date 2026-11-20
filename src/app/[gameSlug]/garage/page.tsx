import { Suspense } from 'react'
import { GarageRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GarageRoute />
    </Suspense>
  )
}
