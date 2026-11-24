'use client'

import Image from 'next/image'
import Link from 'next/link'
import { StarRating } from '@/components/star-rating'
import { useApp } from '@/lib/store'

export function ReviewsView() {
  const { reviews, walkers } = useApp()

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold md:text-4xl">Reseñas de los Dueños</h1>
      <p className="mt-2 text-muted-foreground">Lo que opinan las familias sobre nuestros paseadores.</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {reviews.map((r) => {
          const walker = walkers.find((w) => w.id === r.walkerId)
          return (
            <li key={r.id} className="flex gap-3 rounded-2xl border bg-card p-4 shadow-sm">
              {walker && (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-primary">
                  <Image src={walker.photo} alt="" fill sizes="48px" className="object-cover" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <StarRating value={r.rating} size="size-4" />
                <p className="text-sm leading-relaxed">{`"${r.comment}"`}</p>
                <p className="text-xs text-muted-foreground">
                  {r.ownerName} ({r.petName}) sobre{' '}
                  {walker ? (
                    <Link href={`/paseadores/${walker.id}`} className="text-primary underline">
                      {walker.name}
                    </Link>
                  ) : (
                    'paseador'
                  )}{' '}
                  · {r.date}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
