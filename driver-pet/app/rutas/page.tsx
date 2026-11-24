import type { Metadata } from 'next'
import { RoutesView } from '@/components/routes-view'

export const metadata: Metadata = { title: 'Rutas | Driver Pet' }

export default function Page() {
  return <RoutesView />
}
