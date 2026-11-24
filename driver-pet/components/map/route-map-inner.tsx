'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Polygon, TileLayer, Tooltip } from 'react-leaflet'
import type { WalkRoute } from '@/lib/types'

const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="34" height="44" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0z" fill="#2f7a4b"/><circle cx="12" cy="12" r="4.5" fill="#fff"/></svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
})

export default function RouteMapInner({
  route,
  showLabel = true,
  interactive = true,
}: {
  route: WalkRoute
  showLabel?: boolean
  interactive?: boolean
}) {
  return (
    <MapContainer
      key={route.id}
      center={route.center}
      zoom={15}
      scrollWheelZoom={false}
      dragging={interactive}
      zoomControl={interactive}
      attributionControl
      className="h-full w-full"
    >
      {/* NOTA EDITABLE: proveedor de mapa. Puedes cambiar la URL por otro estilo de tiles. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Polygon
        positions={route.path}
        pathOptions={{ color: '#2f7a4b', weight: 5, fillColor: '#5fbf7f', fillOpacity: 0.35 }}
      />
      <Marker position={route.center} icon={pinIcon}>
        {showLabel && (
          <Tooltip permanent direction="right" offset={[14, -24]}>
            {route.name}
          </Tooltip>
        )}
      </Marker>
    </MapContainer>
  )
}
