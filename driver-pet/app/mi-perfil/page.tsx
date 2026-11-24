import type { Metadata } from 'next'
import { OwnerProfile } from '@/components/owner/owner-profile'

export const metadata: Metadata = { title: 'Mi Perfil | Driver Pet' }

export default function Page() {
  return <OwnerProfile />
}
