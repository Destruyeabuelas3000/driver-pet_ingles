import type { Metadata } from 'next'
import { ReportView } from '@/components/report/report-view'

export const metadata: Metadata = { title: 'Finalizar y Reportar Paseo | Driver Pet' }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ paseador?: string; mascota?: string }>
}) {
  const { paseador, mascota } = await searchParams
  return <ReportView walkerParam={paseador} petParam={mascota} />
}
