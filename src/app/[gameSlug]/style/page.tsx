import { Suspense } from 'react'
import { StyleRoute } from '@/components/hub/routes'
export default function Page() { return <Suspense fallback={null}><StyleRoute /></Suspense> }
