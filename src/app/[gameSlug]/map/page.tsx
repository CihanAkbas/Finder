import { Suspense } from 'react'
import { MapRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MapRoute />
    </Suspense>
  )
}
