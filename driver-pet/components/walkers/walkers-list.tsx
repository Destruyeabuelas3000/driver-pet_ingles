'use client'

import { useRouter } from 'next/navigation'
import { getWalkerRating, useApp } from '@/lib/store'
import { WalkerCard } from './walker-card'

export function WalkersList({ query }: { query: string }) {
  const { walkers, reviews } = useApp()
  const router = useRouter()
  const q = query.trim().toLowerCase()
  const list = q
    ? walkers.filter((w) => `${w.name} ${w.zone} ${w.bio}`.toLowerCase().includes(q))
    : walkers

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold md:text-4xl">Nuestros Paseadores</h1>
      <p className="mt-2 text-muted-foreground">
        {q ? `Resultados para "${query}": ${list.length}` : 'Conoce a todo nuestro equipo de paseadores verificados.'}
      </p>
      {list.length === 0 ? (
        <p className="mt-8 rounded-xl border bg-card p-6 text-center text-muted-foreground">
          No encontramos paseadores con esa búsqueda.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((w) => (
            <WalkerCard
              key={w.id}
              walker={w}
              rating={getWalkerRating(reviews, w.id).average}
              onSelect={() => router.push(`/paseadores/${w.id}`)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
