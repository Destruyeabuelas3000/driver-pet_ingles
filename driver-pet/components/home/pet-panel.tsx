'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Dog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/store'
import type { Pet } from '@/lib/types'

export function PetPanel({ pet }: { pet: Pet }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-primary sm:size-32">
          <Image src={pet.photo} alt={`Foto de ${pet.name}`} fill sizes="128px" className="object-cover" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">Perfil de la Mascota</p>
          <h2 className="text-3xl font-bold text-primary">{pet.name}</h2>
          <p className="mt-2 font-bold">Raza</p>
          <p className="pl-6 text-sm">{pet.breed}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Tamaño</p>
          <p className="mt-1 flex items-center gap-2 text-sm">
            <Dog className="size-5" aria-hidden /> {pet.size}
          </p>
        </div>
        <div>
          <p className="font-bold">Edad</p>
          <p className="mt-1 text-sm">{pet.age}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xl font-medium">Horarios de Paseos</h3>
        <div className="overflow-hidden rounded-xl border bg-secondary">
          <p className="border-b px-3 py-2 font-medium">Horarios de Paseo Semanales</p>
          {pet.schedules.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Sin horarios. Agrega uno desde tu perfil.</p>
          ) : (
            <ul className="grid grid-cols-2">
              {pet.schedules.map((s, i) => (
                <li
                  key={s.id}
                  className={`px-3 py-2.5 text-sm leading-snug ${i % 2 === 0 ? 'border-r' : ''} ${i >= 2 ? 'border-t' : ''}`}
                >
                  <span className="block">{s.days}</span>
                  <span className="block">
                    {formatTime(s.start)} - {formatTime(s.end)}
                  </span>
                  <span className="block">{s.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-11 rounded-full border-2 border-primary text-base text-primary"
          nativeButton={false}
          render={<Link href="/mi-perfil" />}
        >
          Editar Perfil
        </Button>
        <Button className="h-11 rounded-full text-base" nativeButton={false} render={<Link href="/mi-perfil#horarios" />}>
          Agendar Paseo
        </Button>
      </div>
    </div>
  )
}
