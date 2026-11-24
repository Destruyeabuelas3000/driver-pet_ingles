'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bell, Check, UserRound } from 'lucide-react'
import { Field, PillSelect } from '@/components/form-fields'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { WalkerProfile } from './walker-profile'

export function WalkerDashboard() {
  const { walkers, pets, walkNotifications, markWalkNotificationRead } = useApp()
  const [walkerId, setWalkerId] = useState(walkers[0]?.id ?? '')
  const notifications = walkNotifications.filter((item) => item.walkerId === walkerId)
  const unreadCount = notifications.filter((item) => !item.read).length

  useEffect(() => {
    if (!walkers.some((walker) => walker.id === walkerId)) {
      setWalkerId(walkers[0]?.id ?? '')
    }
  }, [walkers, walkerId])

  if (!walkerId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">No hay perfiles de paseador disponibles</h1>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Perfil del paseador</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Aquí puedes gestionar tus rutas y tu perfil, y revisar las solicitudes de paseo.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-full border-primary text-primary"
          nativeButton={false}
          render={<Link href="/mi-perfil" />}
        >
          <UserRound aria-hidden /> Cambiar a perfil de dueño
        </Button>
      </div>

      <Field label="Perfil de paseador" htmlFor="walker-account">
        <PillSelect id="walker-account" value={walkerId} onChange={(event) => setWalkerId(event.target.value)}>
          {walkers.map((walker) => (
            <option key={walker.id} value={walker.id}>
              {walker.name}
            </option>
          ))}
        </PillSelect>
      </Field>

      <section aria-labelledby="walk-notifications-title" className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Bell className="size-5 text-primary" aria-hidden />
          <h2 id="walk-notifications-title" className="text-xl font-bold">
            Avisos de paseos agendados
          </h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground" aria-label={`${unreadCount} avisos sin leer`}>
              {unreadCount}
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no tienes solicitudes. Cuando un dueño agende un paseo, aparecerá aquí.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {notifications.map((notification) => {
              const pet = pets.find((item) => item.id === notification.petId)
              return (
                <li key={notification.id} className="flex items-start justify-between gap-3 rounded-xl border bg-secondary/50 p-4">
                  <div>
                    <p className="font-bold">
                      Nuevo paseo para {pet?.name ?? 'una mascota'}
                    </p>
                    <p className="mt-1 text-sm">{notification.ownerName} · {notification.days}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.start} - {notification.end}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString('es-CO')}
                    </p>
                    {notification.read && <p className="mt-1 text-xs text-primary">Aviso leído</p>}
                  </div>
                  {!notification.read && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 shrink-0 rounded-full border-primary px-3 text-primary"
                      onClick={() => markWalkNotificationRead(notification.id)}
                    >
                      <Check aria-hidden /> Leído
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <WalkerProfile id={walkerId} editable showReviews={false} embedded />
    </main>
  )
}
