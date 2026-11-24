'use client'

import Link from 'next/link'
import { useState } from 'react'
import { RouteMap } from '@/components/map/route-map'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

export function RoutesView() {
  const { walkers } = useApp()
  const all = walkers.flatMap((w) => w.routes.map((r) => ({ route: r, walker: w })))
  const [selectedId, setSelectedId] = useState(all[0]?.route.id)
  const selected = all.find((x) => x.route.id === selectedId) ?? all[0]

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold md:text-4xl">Rutas de Paseo</h1>
      <p className="mt-2 text-muted-foreground">Explora las rutas que recorren nuestros paseadores.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <ul className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
          {all.map(({ route, walker }) => (
            <li key={route.id}>
              <button
                type="button"
                onClick={() => setSelectedId(route.id)}
                aria-pressed={route.id === selected?.route.id}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition-colors',
                  route.id === selected?.route.id ? 'border-primary bg-secondary' : 'bg-card hover:bg-muted',
                )}
              >
                <span className="block font-bold text-primary">{route.name}</span>
                <span className="block text-sm text-muted-foreground">
                  {route.type} · {route.distanceKm}km · {route.durationMin}min · {walker.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {selected && (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-2 bg-secondary px-4 py-3">
              <p className="font-bold">{selected.route.name}</p>
              <Link href={`/paseadores/${selected.walker.id}`} className="text-sm text-primary underline">
                Ver a {selected.walker.name}
              </Link>
            </div>
            <div className="h-[460px]">
              <RouteMap route={selected.route} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
