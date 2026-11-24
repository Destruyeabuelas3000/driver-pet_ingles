import { WalkerProfile } from '@/components/walkers/walker-profile'
import { initialWalkers } from '@/lib/data'

export function generateStaticParams() {
  return initialWalkers.map(({ id }) => ({ id }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <WalkerProfile id={id} />
}
