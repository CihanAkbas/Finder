import { Suspense } from 'react'
import { EmpireRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EmpireRoute />
    </Suspense>
  )
}
