'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PillSelect } from '@/components/form-fields'
import { WalkerCard } from '@/components/walkers/walker-card'
import { APP_SUBTITLE, APP_TAGLINE, ROUTE_TYPES, ZONES } from '@/lib/data'
import { getWalkerRating, useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import { WalkerPanel } from './walker-panel'
import { PetPanel } from './pet-panel'

export function HomeView() {
  const { walkers, reviews, pets } = useApp()
  const [zone, setZone] = useState('')
  const [type, setType] = useState('')
  const [capacity, setCapacity] = useState('')
  const [selectedId, setSelectedId] = useState(walkers[0]?.id)
  const [tab, setTab] = useState<'walker' | 'pet'>('walker')

  const filtered = useMemo(
    () =>
      walkers.filter((w) => {
        if (zone && w.zone !== zone) return false
        if (type && !w.routes.some((r) => r.type === type)) return false
        if (capacity && w.capacity - w.currentDogIds.length < Number(capacity)) return false
        return true
      }),
    [walkers, zone, type, capacity],
  )

  const totalDogs = filtered.reduce((sum, w) => sum + w.currentDogIds.length, 0)
  const selected = walkers.find((w) => w.id === selectedId) ?? walkers[0]
  const pet = pets[0]

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1fr_380px] lg:py-10">
      <section aria-labelledby="hero-title" className="flex flex-col gap-8">
        <div className="text-center">
          <h1 id="hero-title" className="text-3xl font-bold text-balance md:text-4xl">
            {APP_TAGLINE}
          </h1>
          <p className="mt-2 text-muted-foreground italic">{`"${APP_SUBTITLE}"`}</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <PillSelect aria-label="Ubicación" icon={<MapPin className="size-4" />} value={zone} onChange={(e) => setZone(e.target.value)} className="md:flex-1">
            <option value="">Ubicación</option>
            {ZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </PillSelect>
          <PillSelect aria-label="Tipo de Ruta" value={type} onChange={(e) => setType(e.target.value)} className="md:flex-1">
            <option value="">Tipo de Ruta</option>
            {ROUTE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </PillSelect>
          <PillSelect aria-label="Capacidad disponible" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="md:flex-1">
            <option value="">Capacidad</option>
            <option value="1">1+ lugar libre</option>
            <option value="3">3+ lugares libres</option>
            <option value="5">5+ lugares libres</option>
          </PillSelect>
          <div className="flex items-center justify-between gap-3">
            <p className="text-right text-xs leading-tight" aria-live="polite">
              Actualmente: {filtered.length}
              <br />
              {totalDogs} perros
            </p>
            <Button
              className="h-9 rounded-full px-5"
              onClick={() => document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Solicitar
            </Button>
          </div>
        </div>

        <div id="destacados" className="scroll-mt-24">
          <h2 className="mb-5 text-center text-2xl font-bold">Nuestros Paseadores Destacados</h2>
          {filtered.length === 0 ? (
            <p className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
              No hay paseadores con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((w) => (
                <WalkerCard
                  key={w.id}
                  walker={w}
                  rating={getWalkerRating(reviews, w.id).average}
                  selected={w.id === selected?.id && tab === 'walker'}
                  onSelect={() => {
                    setSelectedId(w.id)
                    setTab('walker')
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <aside aria-label="Detalle" className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-[-6px] ml-auto flex w-[85%] gap-1" role="tablist" aria-label="Tipo de perfil">
          <PanelTab
            active={tab === 'walker'}
            onClick={() => setTab('walker')}
            title="Perfil del Paseador"
            subtitle={selected ? `Calificado por ${getWalkerRating(reviews, selected.id).count} dueños` : ''}
            photo={selected?.photo}
          />
          {pet && (
            <PanelTab
              active={tab === 'pet'}
              onClick={() => setTab('pet')}
              title="Perfil de la Mascota"
              subtitle={`${pet.name} · ${pet.breed}`}
              photo={pet.photo}
            />
          )}
        </div>
        <div className="relative rounded-2xl border bg-card p-5 shadow-lg" role="tabpanel">
          {tab === 'pet' && pet ? (
            <PetPanel pet={pet} />
          ) : (
            selected && <WalkerPanel walker={selected} rating={getWalkerRating(reviews, selected.id).average} />
          )}
        </div>
      </aside>
    </main>
  )
}

function PanelTab({
  active,
  onClick,
  title,
  subtitle,
  photo,
}: {
  active: boolean
  onClick: () => void
  title: string
  subtitle: string
  photo?: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex min-w-0 flex-1 items-center gap-2 rounded-t-xl border border-b-0 px-3 pt-2 pb-3 text-left shadow-sm transition-colors',
        active ? 'bg-card' : 'bg-secondary text-muted-foreground hover:bg-accent',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-bold text-foreground">{title}</span>
        <span className="block truncate text-[11px]">{subtitle}</span>
      </span>
      {photo && (
        <span className="relative size-7 shrink-0 overflow-hidden rounded-full border border-border">
          <Image src={photo} alt="" fill sizes="28px" className="object-cover" />
        </span>
      )}
    </button>
  )
}
