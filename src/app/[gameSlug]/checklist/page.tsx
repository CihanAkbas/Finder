import { Suspense } from 'react'
import { ChecklistRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ChecklistRoute />
    </Suspense>
  )
}
