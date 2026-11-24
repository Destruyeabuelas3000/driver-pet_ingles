'use client'

import dynamic from 'next/dynamic'

export const RouteMap = dynamic(() => import('./route-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Cargando mapa...
    </div>
  ),
})
