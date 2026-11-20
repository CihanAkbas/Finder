import { Suspense } from 'react'
import { CompareRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CompareRoute />
    </Suspense>
  )
}
