'use client'

/*
  NOTA EDITABLE: PERFIL DEL PASEADOR
  - El panel del paseador permite cambiar nombre, biografía, zona y capacidad.
  - Desde ese panel también se pueden crear y editar rutas.
  - Los dueños dejan su calificación en el perfil público.
*/
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ClipboardCheck, MapPin, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleMapsLink, RouteMap } from '@/components/map/route-map'
import { StarInput, StarRating } from '@/components/star-rating'
import { Field, PillSelect, inputClass, textareaClass } from '@/components/form-fields'
import { ROUTE_TYPES, ZONES } from '@/lib/data'
import { getWalkerRating, useApp } from '@/lib/store'
import type { RouteType, WalkSchedule, Walker } from '@/lib/types'
import { cn } from '@/lib/utils'

const ROUTE_DAYS = [
  'Lunes - Viernes',
  'Lunes - Sábado',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
  'Sábado - Domingo',
  'Fines de semana',
]

export function WalkerProfile({
  id,
  editable = false,
  showReviews = true,
  embedded = false,
}: {
  id: string
  editable?: boolean
  showReviews?: boolean
  embedded?: boolean
}) {
  const { walkers, reviews } = useApp()
  const walker = walkers.find((w) => w.id === id)

  if (!walker) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Paseador no encontrado</h1>
        <Link href="/paseadores" className="mt-4 inline-block text-primary underline">
          Ver todos los paseadores
        </Link>
      </div>
    )
  }

  const { average, count } = getWalkerRating(reviews, walker.id)
  const walkerReviews = reviews.filter((r) => r.walkerId === walker.id)
  const Container = embedded ? 'div' : 'main'

  return (
    <Container className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
      <ProfileHeader walker={walker} average={average} count={count} editable={editable} />
      <div className={showReviews ? 'grid gap-6 lg:grid-cols-[1.2fr_1fr]' : ''}>
        <RoutesSection walker={walker} editable={editable} />
        {showReviews && (
          <section aria-labelledby="reviews-title" className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
            <h2 id="reviews-title" className="text-xl font-bold">
              Calificaciones de los dueños
            </h2>
            <ReviewForm walkerId={walker.id} />
            <ul className="flex flex-col gap-3">
              {walkerReviews.map((r) => (
                <li key={r.id} className="rounded-xl border bg-secondary/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold">
                      {r.ownerName} <span className="font-normal text-muted-foreground">· dueño de {r.petName}</span>
                    </p>
                    <StarRating value={r.rating} size="size-3.5" />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed">{r.comment}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.date}</p>
                </li>
              ))}
              {walkerReviews.length === 0 && (
                <li className="text-sm text-muted-foreground">Aún no tiene reseñas. ¡Sé el primero!</li>
              )}
            </ul>
          </section>
        )}
      </div>
    </Container>
  )
}

function ProfileHeader({
  walker,
  average,
  count,
  editable,
}: {
  walker: Walker
  average: number
  count: number
  editable: boolean
}) {
  const { updateWalker } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: walker.name, bio: walker.bio, zone: walker.zone, capacity: walker.capacity })

  useEffect(() => {
    setForm({ name: walker.name, bio: walker.bio, zone: walker.zone, capacity: walker.capacity })
  }, [walker])

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    updateWalker(walker.id, { ...form, name: form.name.trim(), capacity: Math.max(1, Number(form.capacity)) })
    setEditing(false)
  }

  return (
    <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
      <div className="relative size-36 shrink-0 self-center overflow-hidden rounded-full border-4 border-primary">
        <Image src={walker.photo} alt={`Foto de ${walker.name}`} fill sizes="144px" className="object-cover" priority />
      </div>

      {editing ? (
        <form onSubmit={onSave} className="grid flex-1 gap-3 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="w-name">
            <input id="w-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Zona" htmlFor="w-zone">
            <PillSelect id="w-zone" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}>
              {ZONES.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </PillSelect>
          </Field>
          <Field label="Capacidad máxima de perros" htmlFor="w-cap">
            <input id="w-cap" type="number" min={1} max={20} className={inputClass} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Biografía" htmlFor="w-bio">
              <textarea id="w-bio" rows={3} className={textareaClass} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </Field>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="button" variant="outline" className="h-10 rounded-full border-2 border-primary px-5 text-primary" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="h-10 rounded-full px-6">
              Guardar cambios
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-3xl font-bold">{walker.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-2">
              <StarRating value={average} size="size-5" />
              <span className="font-medium">{average.toFixed(1)}/5</span>
              <span className="text-muted-foreground">({count} reseñas)</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-4 text-primary" aria-hidden /> {walker.walksCount} paseos
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-4 text-primary" aria-hidden /> {walker.zone}
            </span>
          </div>
          <p className="max-w-2xl leading-relaxed text-muted-foreground">{walker.bio}</p>
          <p className="text-sm">
            Capacidad: <strong>{walker.currentDogIds.length}/{walker.capacity}</strong> perros
          </p>
          {editable && (
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="outline" className="h-10 rounded-full border-2 border-primary px-5 text-primary" onClick={() => setEditing(true)}>
                <Pencil aria-hidden /> Editar perfil
              </Button>
              <Button className="h-10 rounded-full px-5" nativeButton={false} render={<Link href={`/reportar?paseador=${walker.id}`} />}>
                <ClipboardCheck aria-hidden /> Finalizar y reportar paseo
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
function RoutesSection({ walker, editable }: { walker: Walker; editable: boolean }) {
  const { updateWalker, addRoute, removeRoute } = useApp()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'Parque' as RouteType,
    distanceKm: 1.5,
    durationMin: 40,
    days: 'Lunes - Viernes',
    start: '08:00',
    end: '09:00',
  })
  const current = walker.routes.find((r) => r.id === walker.currentRouteId) ?? walker.routes[0]

  function onAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || form.end <= form.start) return
    const shift = 0.005 * walker.routes.length
    const center: [number, number] = [current.center[0] + shift, current.center[1] - shift]
    const d = [0.0025, 0.0032]
    addRoute(walker.id, {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      type: form.type,
      zone: walker.zone,
      distanceKm: Number(form.distanceKm),
      durationMin: Number(form.durationMin),
      schedules: [{
        id: crypto.randomUUID(),
        days: form.days,
        start: form.start,
        end: form.end,
        label: form.name.trim(),
      }],
      center,
      path: [
        [center[0] + d[0], center[1] - d[1]],
        [center[0] + d[0], center[1] + d[1]],
        [center[0] - d[0], center[1] + d[1]],
        [center[0] - d[0], center[1] - d[1]],
        [center[0] + d[0], center[1] - d[1]],
      ],
    })
    setForm({
      name: '',
      type: 'Parque',
      distanceKm: 1.5,
      durationMin: 40,
      days: 'Lunes - Viernes',
      start: '08:00',
      end: '09:00',
    })
    setAdding(false)
  }

  return (
    <section aria-labelledby="routes-title" className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 id="routes-title" className="text-xl font-bold">
          Rutas de paseo
        </h2>
        {editable && (
          <Button variant="outline" className="h-9 rounded-full border-primary text-primary" onClick={() => setAdding((v) => !v)}>
            <Plus aria-hidden /> Agregar ruta
          </Button>
        )}
      </div>

      {adding && (
        <form onSubmit={onAdd} className="grid gap-3 rounded-xl border bg-secondary/60 p-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nombre de la ruta" htmlFor="r-name">
              <input id="r-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Parque de los Novios - Circuito C" required />
            </Field>
          </div>
          <Field label="Tipo" htmlFor="r-type">
            <PillSelect id="r-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RouteType })}>
              {ROUTE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </PillSelect>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Km" htmlFor="r-km">
              <input id="r-km" type="number" step="0.1" min={0.1} className={inputClass} value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: Number(e.target.value) })} />
            </Field>
            <Field label="Minutos" htmlFor="r-min">
              <input id="r-min" type="number" min={5} className={inputClass} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Días" htmlFor="r-days">
            <PillSelect id="r-days" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })}>
              {ROUTE_DAYS.map((day) => <option key={day}>{day}</option>)}
            </PillSelect>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Hora de inicio" htmlFor="r-start">
              <input id="r-start" type="time" className={inputClass} value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required />
            </Field>
            <Field label="Hora de fin" htmlFor="r-end">
              <input id="r-end" type="time" min={form.start} className={inputClass} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} required />
            </Field>
          </div>
          <Button type="submit" className="h-10 rounded-full sm:col-span-2">
            Guardar ruta
          </Button>
        </form>
      )}

      <div className="h-64 overflow-hidden rounded-xl border">
        <RouteMap route={current} />
      </div>
      <GoogleMapsLink route={current} className="self-start text-sm text-primary underline" />

      <ul className="flex flex-col gap-2">
        {walker.routes.map((r) => {
          const active = r.id === current.id
          return (
            <li
              key={r.id}
              className={cn('relative flex items-center gap-3 rounded-xl border p-3', active ? 'border-primary bg-secondary' : 'bg-card')}
            >
              {editable ? (
                <button type="button" onClick={() => updateWalker(walker.id, { currentRouteId: r.id })} className="flex-1 text-left">
                  <span className="block font-bold text-primary">{r.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {r.type} · {r.distanceKm}km · {r.durationMin}min {active && '· Ruta actual'}
                  </span>
                  {r.schedules.map((schedule) => (
                    <span key={schedule.id} className="block text-xs text-muted-foreground">
                      {schedule.days}: {schedule.start} - {schedule.end}
                    </span>
                  ))}
                </button>
              ) : (
                <div className="flex-1">
                  <span className="block font-bold text-primary">{r.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {r.type} · {r.distanceKm}km · {r.durationMin}min {active && '· Ruta actual'}
                  </span>
                  {r.schedules.map((schedule) => (
                    <span key={schedule.id} className="block text-xs text-muted-foreground">
                      {schedule.days}: {schedule.start} - {schedule.end}
                    </span>
                  ))}
                </div>
              )}
              {editable && <RouteScheduleEditor walker={walker} route={r} />}
              {editable && walker.routes.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeRoute(walker.id, r.id)} aria-label={`Eliminar ruta ${r.name}`}>
                  <Trash2 aria-hidden />
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function RouteScheduleEditor({ walker, route }: { walker: Walker; route: Walker['routes'][number] }) {
  const { updateWalker } = useApp()
  const [editing, setEditing] = useState(false)
  const [schedules, setSchedules] = useState(route.schedules)
  const invalidSchedules = schedules.some(
    (schedule) => !schedule.days || !schedule.label.trim() || schedule.end <= schedule.start,
  )

  useEffect(() => {
    setSchedules(route.schedules)
  }, [route.schedules])

  function updateSchedule(id: string, patch: Partial<WalkSchedule>) {
    setSchedules((current) => current.map((schedule) => (
      schedule.id === id ? { ...schedule, ...patch } : schedule
    )))
  }

  function saveSchedules() {
    if (invalidSchedules) return
    updateWalker(walker.id, {
      routes: walker.routes.map((item) => item.id === route.id ? { ...item, schedules } : item),
    })
    setEditing(false)
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-full border-primary px-3 text-primary"
        aria-expanded={editing}
        onClick={() => setEditing((current) => !current)}
      >
        {editing ? 'Cerrar' : 'Editar horarios'}
      </Button>
      {editing && (
        <div className="absolute top-10 right-0 z-10 w-[min(90vw,24rem)] rounded-xl border bg-card p-3 shadow-lg">
          <div className="flex flex-col gap-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="grid grid-cols-2 gap-2 rounded-lg border p-2">
                <Field label="Días" htmlFor={`schedule-days-${schedule.id}`}>
                  <PillSelect
                    id={`schedule-days-${schedule.id}`}
                    value={schedule.days}
                    onChange={(e) => updateSchedule(schedule.id, { days: e.target.value })}
                  >
                    {ROUTE_DAYS.map((day) => <option key={day}>{day}</option>)}
                  </PillSelect>
                </Field>
                <Field label="Actividad" htmlFor={`schedule-label-${schedule.id}`}>
                  <input
                    id={`schedule-label-${schedule.id}`}
                    className={inputClass}
                    value={schedule.label}
                    onChange={(e) => updateSchedule(schedule.id, { label: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Desde" htmlFor={`schedule-start-${schedule.id}`}>
                  <input
                    id={`schedule-start-${schedule.id}`}
                    type="time"
                    className={inputClass}
                    value={schedule.start}
                    onChange={(e) => updateSchedule(schedule.id, { start: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Hasta" htmlFor={`schedule-end-${schedule.id}`}>
                  <input
                    id={`schedule-end-${schedule.id}`}
                    type="time"
                    className={inputClass}
                    value={schedule.end}
                    min={schedule.start}
                    onChange={(e) => updateSchedule(schedule.id, { end: e.target.value })}
                    required
                  />
                </Field>
                <Button
                  type="button"
                  variant="destructive"
                  className="h-8 rounded-full sm:col-span-2"
                  onClick={() => setSchedules((current) => current.filter((item) => item.id !== schedule.id))}
                >
                  <Trash2 aria-hidden /> Quitar horario
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 flex-1 rounded-full"
                onClick={() => setSchedules((current) => [
                  ...current,
                  {
                    id: crypto.randomUUID(),
                    days: 'Lunes - Viernes',
                    start: '08:00',
                    end: '09:00',
                    label: 'Paseo programado',
                  },
                ])}
              >
                <Plus aria-hidden /> Agregar horario
              </Button>
              <Button type="button" className="h-9 flex-1 rounded-full" onClick={saveSchedules}>
                Guardar
              </Button>
            </div>
            {invalidSchedules && (
              <p role="alert" className="text-sm text-destructive">
                Revisa los horarios: la hora de fin debe ser posterior al inicio.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ReviewForm({ walkerId }: { walkerId: string }) {
  const { addReview, owner, pets } = useApp()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [petName, setPetName] = useState(pets[0]?.name ?? '')
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return
    addReview({ walkerId, ownerName: owner.name, petName: petName || 'Mi mascota', rating, comment: comment.trim() })
    setComment('')
    setRating(5)
    setSent(true)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-xl border bg-secondary/60 p-3">
      <p className="text-sm font-medium">Deja tu calificación como dueño</p>
      <StarInput value={rating} onChange={setRating} />
      <div className="grid gap-2 sm:grid-cols-[160px_1fr]">
        <PillSelect aria-label="Mascota" value={petName} onChange={(e) => setPetName(e.target.value)}>
          {pets.map((p) => (
            <option key={p.id}>{p.name}</option>
          ))}
        </PillSelect>
        <label htmlFor="review-comment" className="sr-only">
          Comentario
        </label>
        <input
          id="review-comment"
          className={inputClass}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
            setSent(false)
          }}
          placeholder="¿Cómo fue el paseo?"
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" className="h-9 rounded-full px-5">
          Publicar reseña
        </Button>
        {sent && (
          <span role="status" className="text-sm text-primary">
            ¡Gracias por tu reseña!
          </span>
        )}
      </div>
    </form>
  )
}
