import { Suspense } from 'react'
import { DatabaseRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DatabaseRoute />
    </Suspense>
  )
}
