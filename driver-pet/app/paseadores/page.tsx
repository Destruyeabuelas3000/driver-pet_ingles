import type { Metadata } from 'next'
import { WalkersList } from '@/components/walkers/walkers-list'

export const metadata: Metadata = { title: 'Nuestros Paseadores | Driver Pet' }

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return <WalkersList query={q ?? ''} />
}
