'use client'

/*
  NOTA EDITABLE: FINALIZAR Y REPORTAR PASEO
  - Los estados de ánimo se editan en MOODS.
  - Las fotos subidas se muestran en memoria. Para guardarlas de forma
    permanente conecta Vercel Blob y sube el archivo en `onUpload`.
*/
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, Check, Frown, Meh, MapPin, Plus, Smile, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PillSelect, textareaClass } from '@/components/form-fields'
import { GoogleMapsLink, RouteMap } from '@/components/map/route-map'
import { SAMPLE_WALK_PHOTOS } from '@/lib/data'
import { formatTime, useApp } from '@/lib/store'
import type { Mood } from '@/lib/types'
import { cn } from '@/lib/utils'

const MOODS: { value: Mood; icon: LucideIcon }[] = [
  { value: 'Feliz', icon: Smile },
  { value: 'Activo', icon: Activity },
  { value: 'Cansado', icon: Frown },
  { value: 'Distraído', icon: Meh },
  { value: 'Ansioso', icon: AlertTriangle },
]

function energyLabel(v: number) {
  if (v < 25) return 'Baja'
  if (v < 50) return 'Media-Baja'
  if (v < 75) return 'Media-Alta'
  return 'Alta'
}

function durationBetween(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const mins = Math.max(0, eh * 60 + em - (sh * 60 + sm))
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`
}

export function ReportView() {
  const { walkers, pets, owner, addReport } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const walkerParam = searchParams.get('paseador') ?? undefined
  const petParam = searchParams.get('mascota') ?? undefined
  const [walkerId, setWalkerId] = useState(walkers.find((w) => w.id === walkerParam)?.id ?? walkers[0].id)
  const [petId, setPetId] = useState(pets.find((p) => p.id === petParam)?.id ?? pets[0]?.id ?? '')
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('09:05')
  const [moods, setMoods] = useState<Mood[]>(['Feliz', 'Activo'])
  const [didBathroom, setDidBathroom] = useState(true)
  const [drankWater, setDrankWater] = useState(true)
  const [energy, setEnergy] = useState(70)
  const [notes, setNotes] = useState(
    '¡Se portó increíble hoy! Corrió bastante en el parque, jugó con otros perritos y bebió agua a mitad del camino. Hizo sus necesidades sin problema. Es muy obediente al llamado. Al final del paseo se notaba un poco cansada pero muy feliz.',
  )
  const [deliveredTo, setDeliveredTo] = useState(owner.name)
  const [photos, setPhotos] = useState<string[]>(SAMPLE_WALK_PHOTOS)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    setDeliveredTo(owner.name)
  }, [owner.name])

  const walker = walkers.find((w) => w.id === walkerId)!
  const pet = pets.find((p) => p.id === petId)
  const route = walker.routes.find((r) => r.id === walker.currentRouteId) ?? walker.routes[0]
  const duration = durationBetween(start, end)

  function toggleMood(m: Mood) {
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 8))
    e.target.value = ''
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pet) return
    addReport({
      petId: pet.id,
      walkerId,
      routeId: route.id,
      start,
      end,
      duration,
      moods,
      didBathroom,
      drankWater,
      energy,
      notes: notes.trim(),
      photos,
      deliveredTo: deliveredTo.trim(),
      handoffConfirmed: true,
    })
    setSent(true)
  }

  if (!pet) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p>No hay mascotas registradas para reportar.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold md:text-4xl">Finalizar y Reportar Paseo</h1>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section aria-labelledby="walk-summary" className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm lg:self-start">
          <div className="flex items-center gap-2 border-b bg-secondary px-4 py-3">
            <MapPin className="size-5 text-primary" aria-hidden />
            <h2 id="walk-summary" className="font-medium">
              Paseo de {pet.name} - {sent ? 'Completado' : 'En curso'}
            </h2>
          </div>
          <div className="h-60">
            <RouteMap route={route} showLabel={false} />
          </div>
          <div className="flex flex-col gap-3 p-4">
            <h3 className="font-bold">Datos rápidos</h3>
            <dl className="grid grid-cols-[90px_1fr] items-center gap-x-2 gap-y-2.5 text-sm">
              <dt>Paseador:</dt>
              <dd>
                <PillSelect aria-label="Paseador" value={walkerId} onChange={(e) => setWalkerId(e.target.value)}>
                  {walkers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </PillSelect>
              </dd>
              <dt>Mascota:</dt>
              <dd>
                <PillSelect aria-label="Mascota" value={petId} onChange={(e) => setPetId(e.target.value)}>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed})
                    </option>
                  ))}
                </PillSelect>
              </dd>
              <dt>Hora:</dt>
              <dd className="flex items-center gap-1">
                <input aria-label="Hora de inicio" type="time" value={start} onChange={(e) => setStart(e.target.value)} className="h-9 w-full rounded-lg border px-2" />
                <span aria-hidden>-</span>
                <input aria-label="Hora de fin" type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="h-9 w-full rounded-lg border px-2" />
              </dd>
              <dt>Duración:</dt>
              <dd>{duration}</dd>
              <dt>Ruta:</dt>
              <dd className="flex flex-col gap-1">
                {route.name}
                <GoogleMapsLink route={route} className="text-xs text-primary underline" />
              </dd>
            </dl>
          </div>
        </section>

        <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-[3px] border-primary">
              <Image src={pet.photo} alt="" fill sizes="64px" className="object-cover" />
            </div>
            <h2 className="text-xl font-medium leading-tight">
              Observaciones del Paseo para
              <span className="block text-2xl font-bold text-primary">{pet.name}</span>
            </h2>
          </div>

          <fieldset>
            <legend className="mb-2 font-medium">1. Estado de Ánimo</legend>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(({ value, icon: Icon }) => {
                const active = moods.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleMood(value)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors',
                      active ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/50 bg-secondary hover:bg-accent',
                    )}
                  >
                    <Icon className="size-4" aria-hidden /> {value}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-medium">2. Necesidades y Salud</legend>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <Checkbox checked={didBathroom} onChange={setDidBathroom} label="Hizo del baño (Pee & Poop)" />
              <Checkbox checked={drankWater} onChange={setDrankWater} label="Tomó agua" />
              <div className="flex flex-1 flex-col gap-1">
                <label htmlFor="energy" className="text-sm">
                  Energía: {energyLabel(energy)}
                </label>
                <input
                  id="energy"
                  type="range"
                  min={0}
                  max={100}
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label htmlFor="notes" className="mb-2 block font-medium">
              3. Observaciones del Paseador
            </label>
            <textarea id="notes" rows={4} className={textareaClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="¿Cómo se comportó?" required />
          </div>

          <fieldset className="flex flex-col gap-3 rounded-xl border bg-secondary/60 p-4">
            <legend className="px-1 font-medium">4. Entrega de la mascota</legend>
            <p className="text-sm text-muted-foreground">
              Indica quién recibió a {pet.name}. Al enviar el reporte confirmarás la entrega y avisarás al dueño.
            </p>
            <label htmlFor="delivered-to" className="text-sm font-medium">
              Nombre de quien recibe
            </label>
            <input
              id="delivered-to"
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={deliveredTo}
              onChange={(e) => setDeliveredTo(e.target.value)}
              required
            />
          </fieldset>

          <div>
            <p className="mb-2 font-medium">5. Fotos del Paseo</p>
            <div className="flex flex-wrap gap-2">
              {photos.map((src) => (
                <div key={src} className="group relative size-20 overflow-hidden rounded-lg">
                  <Image src={src} alt="Foto del paseo" fill sizes="80px" className="object-cover" unoptimized={src.startsWith('blob:')} />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((p) => p !== src))}
                    className="absolute top-1 right-1 rounded-full bg-card/90 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label="Quitar foto"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
              ))}
              <label className="flex size-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary text-center text-[10px] leading-tight hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
                <Plus className="size-6 text-primary" aria-hidden />
                Subir más fotos/videos
                <input type="file" accept="image/*" multiple className="sr-only" onChange={onUpload} />
              </label>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">Este reporte se enviará inmediatamente al dueño de la mascota</p>

          {sent ? (
            <div role="status" className="flex flex-col items-center gap-3 rounded-xl bg-secondary p-4 text-center">
              <p className="font-medium text-primary">
                ¡Reporte enviado! Paseo de {pet.name}: {formatTime(start)} - {formatTime(end)}.
              </p>
              <p className="text-sm">Entrega confirmada a {deliveredTo}.</p>
              <Button type="button" className="h-10 rounded-full px-6" onClick={() => router.push('/mi-perfil')}>
                Ver en el perfil del dueño
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-11 rounded-full border-2 border-primary text-base text-primary" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" className="h-11 rounded-full text-base">
                Confirmar entrega y avisar al dueño
              </Button>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="flex size-5 items-center justify-center rounded border-2 border-primary bg-card text-primary-foreground peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
        {checked && <Check className="size-3.5" aria-hidden />}
      </span>
      {label}
    </label>
  )
}
