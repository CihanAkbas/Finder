import { Suspense } from 'react'
import { ReferenceRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReferenceRoute />
    </Suspense>
  )
}
