'use client'

import dynamic from 'next/dynamic'
import { ExternalLink } from 'lucide-react'
import type { WalkRoute } from '@/lib/types'

export const RouteMap = dynamic(() => import('./route-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Cargando mapa...
    </div>
  ),
})

export function GoogleMapsLink({ route, className }: { route: WalkRoute; className?: string }) {
  const destination = encodeURIComponent(route.center.join(','))

  return (
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      Abrir en Google Maps <ExternalLink className="ml-1 inline size-3.5" aria-hidden />
    </a>
  )
}
