'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MapPinned, Route } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouteMap } from '@/components/map/route-map'
import { StarRating } from '@/components/star-rating'
import { dogAvatars } from '@/lib/data'
import { useApp } from '@/lib/store'
import type { Walker } from '@/lib/types'

export function WalkerPanel({ walker, rating }: { walker: Walker; rating: number }) {
  const { pets, requestWalk } = useApp()
  const [status, setStatus] = useState<'idle' | 'ok' | 'full'>('idle')
  const route = walker.routes.find((r) => r.id === walker.currentRouteId) ?? walker.routes[0]
  const used = walker.currentDogIds.length
  const percent = Math.min(100, (used / walker.capacity) * 100)

  function onRequest() {
    const pet = pets[0]
    if (!pet) return
    setStatus(requestWalk(walker.id, pet.id) ? 'ok' : 'full')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-primary sm:size-32">
          <Image src={walker.photo} alt={`Foto de ${walker.name}`} fill sizes="128px" className="object-cover" />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-2xl font-bold">{walker.name}</h2>
          <div className="flex items-center gap-2">
            <StarRating value={rating} size="size-5" />
            <span className="font-medium">{rating.toFixed(1)}/5</span>
          </div>
          <p className="text-sm">{walker.featuredBreed}</p>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full border border-primary text-primary">
              <MapPinned className="size-4" aria-hidden />
              <span className="sr-only">Zona: {walker.zone}</span>
            </span>
            <Button
              size="lg"
              className="h-9 rounded-full px-5"
              nativeButton={false}
              render={<Link href={`/paseadores/${walker.id}`} />}
            >
              Ver Perfil Completo
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="flex items-start gap-3 bg-secondary px-3 py-2.5">
          <Route className="mt-0.5 size-6 text-primary" aria-hidden />
          <div>
            <p className="text-sm font-medium">Ruta de Paseo Actual</p>
            <p className="text-sm font-bold text-primary">{route.name}</p>
            <p className="text-sm">
              {route.distanceKm}km · {route.durationMin}min
            </p>
          </div>
        </div>
        <div className="h-40">
          <RouteMap route={route} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">Capacidad Máxima: {walker.capacity} Perros</span>
          <span>
            {used}/{walker.capacity} Perros
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={walker.capacity}
          aria-label="Capacidad ocupada"
        >
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">Actualmente: {used} perros con correa</p>
        <ul className="flex flex-wrap gap-2">
          {walker.currentDogIds.map((id) => {
            const dog = dogAvatars[id] ?? pets.find((p) => p.id === id)
            if (!dog) return null
            return (
              <li key={id} className="flex flex-col items-center gap-1">
                <div className="relative size-10 overflow-hidden rounded-full border-2 border-accent">
                  <Image src={dog.photo} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <span className="text-xs">{dog.name}</span>
              </li>
            )
          })}
        </ul>
      </div>

      {status !== 'idle' && (
        <p role="status" className={status === 'ok' ? 'text-sm text-primary' : 'text-sm text-destructive'}>
          {status === 'ok'
            ? `¡Solicitud enviada! ${pets[0]?.name} quedó agendada con ${walker.name}.`
            : 'Este paseador ya alcanzó su capacidad máxima.'}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-11 rounded-full border-2 border-primary text-base text-primary"
          nativeButton={false}
          render={<Link href={`/paseadores/${walker.id}`} />}
        >
          Ver Perfil Completo
        </Button>
        <Button className="h-11 rounded-full text-base" onClick={onRequest}>
          Solicitar Paseo
        </Button>
      </div>
    </div>
  )
}
