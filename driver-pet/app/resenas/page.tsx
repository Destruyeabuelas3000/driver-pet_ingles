import type { Metadata } from 'next'
import { ReviewsView } from '@/components/reviews-view'

export const metadata: Metadata = { title: 'Reseñas | Driver Pet' }

export default function Page() {
  return <ReviewsView />
}
