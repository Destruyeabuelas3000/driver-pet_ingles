import type { Metadata } from 'next'
import { WalkerDashboard } from '@/components/walkers/walker-dashboard'

export const metadata: Metadata = { title: 'Perfil del Paseador | Driver Pet' }

export default function Page() {
  return <WalkerDashboard />
}
