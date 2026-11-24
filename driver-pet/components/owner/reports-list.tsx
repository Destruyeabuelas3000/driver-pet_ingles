'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Droplets } from 'lucide-react'
import { formatTime, useApp } from '@/lib/store'

export function ReportsList() {
  const { reports, pets, walkers } = useApp()

  return (
    <section aria-labelledby="reports-title" className="flex flex-col gap-4">
      <h2 id="reports-title" className="text-xl font-bold">
        Reportes de paseos recibidos
      </h2>
      {reports.length === 0 ? (
        <p className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          Aún no hay reportes. Cuando un paseador finalice un paseo verás aquí sus observaciones.{' '}
          <Link href="/reportar" className="text-primary underline">
            Probar el formulario del paseador
          </Link>
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {reports.map((r) => {
            const pet = pets.find((p) => p.id === r.petId)
            const walker = walkers.find((w) => w.id === r.walkerId)
            return (
              <li key={r.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">
                    Paseo de <span className="text-primary">{pet?.name ?? 'mascota'}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {walker?.name} · {formatTime(r.start)} - {formatTime(r.end)} · {r.duration}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {r.moods.map((m) => (
                    <li key={m} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="flex flex-wrap gap-4 text-sm">
                  {r.didBathroom && (
                    <span className="flex items-center gap-1"><Check className="size-4 text-primary" aria-hidden /> Hizo del baño</span>
                  )}
                  {r.drankWater && (
                    <span className="flex items-center gap-1"><Droplets className="size-4 text-primary" aria-hidden /> Tomó agua</span>
                  )}
                  <span>Energía: {r.energy}%</span>
                </p>
                <p className="text-sm leading-relaxed">{r.notes}</p>
                <p className="flex items-center gap-1 text-sm font-medium text-primary">
                  <Check className="size-4" aria-hidden />
                  {r.handoffConfirmed ? `Entrega confirmada a ${r.deliveredTo}` : `Entrega pendiente para ${r.deliveredTo}`}
                </p>
                {r.photos.length > 0 && (
                  <div className="flex gap-2">
                    {r.photos.map((src) => (
                      <div key={src} className="relative size-16 overflow-hidden rounded-lg">
                        <Image src={src} alt="Foto del paseo" fill sizes="64px" className="object-cover" unoptimized={src.startsWith('blob:')} />
                      </div>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
