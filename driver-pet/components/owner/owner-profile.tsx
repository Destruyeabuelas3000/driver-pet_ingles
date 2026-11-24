'use client'

/*
  NOTA EDITABLE: PERFIL DEL DUEÑO
  - Datos del dueño: nombre, dirección, teléfono y correo.
  - Mascotas: nombre, edad, raza, tamaño, notas y horarios de paseo.
  - Reportes: aquí aparecen los reportes que envían los paseadores.
*/
import Image from 'next/image'
import { useState } from 'react'
import { Dog, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, inputClass } from '@/components/form-fields'
import { useApp } from '@/lib/store'
import type { Pet, PetSize } from '@/lib/types'
import { PetEditor } from './pet-editor'
import { ReportsList } from './reports-list'

export function OwnerProfile() {
  const { owner, updateOwner, pets, addPet } = useApp()
  const [form, setForm] = useState(owner)
  const [saved, setSaved] = useState(false)
  const [selectedId, setSelectedId] = useState(pets[0]?.id ?? '')
  const selected = pets.find((p) => p.id === selectedId) ?? pets[0]

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    updateOwner(form)
    setSaved(true)
  }

  function onAddPet() {
    const pet: Pet = {
      id: crypto.randomUUID(),
      name: 'Nueva mascota',
      photo: '/images/mascotas/coco.png',
      age: '1 año',
      breed: 'Mestizo',
      size: 'Mediano' as PetSize,
      notes: '',
      schedules: [],
    }
    addPet(pet)
    setSelectedId(pet.id)
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold md:text-4xl">Mi Perfil</h1>

      <section aria-labelledby="owner-title" className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 id="owner-title" className="mb-4 text-xl font-bold">
          Datos del dueño
        </h2>
        <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="o-name">
            <input id="o-name" className={inputClass} value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setSaved(false) }} required />
          </Field>
          <Field label="Dirección" htmlFor="o-address">
            <input id="o-address" className={inputClass} value={form.address} onChange={(e) => { setForm({ ...form, address: e.target.value }); setSaved(false) }} required />
          </Field>
          <Field label="Teléfono" htmlFor="o-phone">
            <input id="o-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setSaved(false) }} />
          </Field>
          <Field label="Correo" htmlFor="o-email">
            <input id="o-email" type="email" className={inputClass} value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setSaved(false) }} />
          </Field>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" className="h-10 rounded-full px-6">
              Guardar datos
            </Button>
            {saved && <span role="status" className="text-sm text-primary">Datos guardados</span>}
          </div>
        </form>
      </section>

      <section aria-labelledby="pets-title" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="pets-title" className="text-xl font-bold">
            Mis mascotas
          </h2>
          <Button variant="outline" className="h-9 rounded-full border-primary text-primary" onClick={onAddPet}>
            <Plus aria-hidden /> Agregar mascota
          </Button>
        </div>
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Mascotas">
          {pets.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === selected?.id}
              onClick={() => setSelectedId(p.id)}
              className={`flex items-center gap-2 rounded-full border-2 py-1 pr-4 pl-1 text-sm font-medium transition-colors ${p.id === selected?.id ? 'border-primary bg-secondary text-primary' : 'border-border bg-card'}`}
            >
              <span className="relative size-8 overflow-hidden rounded-full">
                <Image src={p.photo} alt="" fill sizes="32px" className="object-cover" />
              </span>
              {p.name}
            </button>
          ))}
        </div>
        {selected ? (
          <PetEditor key={selected.id} pet={selected} />
        ) : (
          <p className="flex items-center gap-2 rounded-xl border bg-card p-5 text-muted-foreground">
            <Dog aria-hidden /> Aún no tienes mascotas registradas.
          </p>
        )}
      </section>

      <ReportsList />
    </main>
  )
}
