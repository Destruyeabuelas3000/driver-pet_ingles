import { Suspense } from 'react'
import type { Metadata } from 'next'
import { WalkersList } from '@/components/walkers/walkers-list'

export const metadata: Metadata = { title: 'Nuestros Paseadores | Driver Pet' }

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WalkersList />
    </Suspense>
  )
}
