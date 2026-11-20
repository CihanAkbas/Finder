import { Suspense } from 'react'
import { EconomyRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EconomyRoute />
    </Suspense>
  )
}
