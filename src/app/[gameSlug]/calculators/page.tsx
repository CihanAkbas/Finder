import { Suspense } from 'react'
import { CalculatorRoute } from '@/components/hub/routes'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CalculatorRoute />
    </Suspense>
  )
}
