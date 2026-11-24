'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, PillSelect, inputClass, textareaClass } from '@/components/form-fields'
import { formatTime, useApp } from '@/lib/store'
import type { Pet, PetSize, WalkSchedule } from '@/lib/types'

/* NOTA EDITABLE: opciones de tamaño y días disponibles para los horarios */
const SIZES: PetSize[] = ['Pequeño', 'Mediano', 'Grande']
const DAY_OPTIONS = ['Lunes - Viernes', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Fines de semana']

export function PetEditor({ pet }: { pet: Pet }) {
  const { updatePet, removePet, walkers } = useApp()
  const [form, setForm] = useState(pet)
  const [saved, setSaved] = useState(false)
  const [schedule, setSchedule] = useState<Omit<WalkSchedule, 'id'>>({
    days: 'Lunes - Viernes',
    start: '08:00',
    end: '09:00',
    label: 'Paseo Matutino',
  })

  useEffect(() => {
    setForm(pet)
  }, [pet])

  function patch(p: Partial<Pet>) {
    setForm((f) => ({ ...f, ...p }))
    setSaved(false)
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) patch({ photo: URL.createObjectURL(file) })
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    updatePet(pet.id, form)
    setSaved(true)
  }

  function addSchedule() {
    if (!schedule.label.trim() || schedule.end <= schedule.start) return
    const schedules = [...form.schedules, { ...schedule, id: crypto.randomUUID() }]
    patch({ schedules })
    updatePet(pet.id, { schedules })
  }

  function removeSchedule(id: string) {
    const schedules = form.schedules.filter((s) => s.id !== id)
    patch({ schedules })
    updatePet(pet.id, { schedules })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSave} className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-primary">
            <Image src={form.photo} alt={`Foto de ${form.name}`} fill sizes="96px" className="object-cover" unoptimized={form.photo.startsWith('blob:')} />
          </div>
          <div>
            <p className="text-sm font-bold">Perfil de la Mascota</p>
            <p className="text-2xl font-bold text-primary">{form.name}</p>
            <label className="mt-1 inline-block cursor-pointer text-sm text-primary underline">
              Cambiar foto
              <input type="file" accept="image/*" className="sr-only" onChange={onPhoto} />
            </label>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="p-name">
            <input id="p-name" className={inputClass} value={form.name} onChange={(e) => patch({ name: e.target.value })} required />
          </Field>
          <Field label="Edad" htmlFor="p-age">
            <input id="p-age" className={inputClass} value={form.age} onChange={(e) => patch({ age: e.target.value })} placeholder="Ej. 3 años" />
          </Field>
          <Field label="Raza" htmlFor="p-breed">
            <input id="p-breed" className={inputClass} value={form.breed} onChange={(e) => patch({ breed: e.target.value })} />
          </Field>
          <Field label="Tamaño" htmlFor="p-size">
            <PillSelect id="p-size" value={form.size} onChange={(e) => patch({ size: e.target.value as PetSize })}>
              {SIZES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </PillSelect>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Descripción y cuidados (alergias, carácter, necesidades)" htmlFor="p-notes">
              <textarea id="p-notes" rows={3} className={textareaClass} value={form.notes} onChange={(e) => patch({ notes: e.target.value })} />
            </Field>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" className="h-10 rounded-full px-6">
            Guardar mascota
          </Button>
          <Button type="button" variant="destructive" className="h-10 rounded-full px-4" onClick={() => removePet(pet.id)}>
            <Trash2 aria-hidden /> Eliminar
          </Button>
          {saved && <span role="status" className="text-sm text-primary">Mascota guardada</span>}
        </div>
      </form>

      <section id="horarios" aria-labelledby="sched-title" className="flex scroll-mt-24 flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <h3 id="sched-title" className="text-xl font-medium">
          Horarios de Paseos de {form.name}
        </h3>
        <div className="overflow-hidden rounded-xl border bg-secondary">
          <p className="border-b px-3 py-2 font-medium">Horarios de Paseo Semanales</p>
          {form.schedules.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Sin horarios todavía.</p>
          ) : (
            <ul className="grid sm:grid-cols-2">
              {form.schedules.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-2 border-b px-3 py-2.5 text-sm leading-snug sm:odd:border-r">
                  <span>
                    <span className="block">{s.days}</span>
                    <span className="block">
                      {formatTime(s.start)} - {formatTime(s.end)}
                    </span>
                    <span className="block">{s.label}</span>
                  </span>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeSchedule(s.id)} aria-label={`Eliminar ${s.label}`}>
                    <Trash2 aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-3 rounded-xl border p-3 sm:grid-cols-2">
          <Field label="Días" htmlFor="s-days">
            <PillSelect id="s-days" value={schedule.days} onChange={(e) => setSchedule({ ...schedule, days: e.target.value })}>
              {DAY_OPTIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </PillSelect>
          </Field>
          <Field label="Tipo de paseo" htmlFor="s-label">
            <input id="s-label" className={inputClass} value={schedule.label} onChange={(e) => setSchedule({ ...schedule, label: e.target.value })} />
          </Field>
          <Field label="Inicio" htmlFor="s-start">
            <input id="s-start" type="time" className={inputClass} value={schedule.start} onChange={(e) => setSchedule({ ...schedule, start: e.target.value })} />
          </Field>
          <Field label="Fin" htmlFor="s-end">
            <input id="s-end" type="time" className={inputClass} value={schedule.end} onChange={(e) => setSchedule({ ...schedule, end: e.target.value })} />
          </Field>
          <Button type="button" className="h-10 rounded-full sm:col-span-2" onClick={addSchedule}>
            <Plus aria-hidden /> Agendar horario
          </Button>
        </div>
      </section>

      <section aria-labelledby="walkers-title" className="rounded-2xl border bg-card p-5 shadow-sm">
        <h3 id="walkers-title" className="text-xl font-medium">
          Perfiles de paseadores
        </h3>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">
          Consulta sus perfiles para elegir quién paseará a {form.name}.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {walkers.map((walker) => (
            <li key={walker.id}>
              <Link
                href={`/paseadores/${walker.id}`}
                className="flex items-center gap-3 rounded-xl border p-2 transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={walker.photo} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{walker.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{walker.zone}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-primary" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
