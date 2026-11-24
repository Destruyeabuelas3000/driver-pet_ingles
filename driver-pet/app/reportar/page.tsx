import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ReportView } from '@/components/report/report-view'

export const metadata: Metadata = { title: 'Finalizar y Reportar Paseo | Driver Pet' }

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReportView />
    </Suspense>
  )
}
