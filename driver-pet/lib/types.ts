export type LatLng = [number, number]

export type RouteType = 'Parque' | 'Urbana' | 'Sendero'

export interface WalkRoute {
  id: string
  name: string
  type: RouteType
  zone: string
  distanceKm: number
  durationMin: number
  center: LatLng
  path: LatLng[]
}

export interface Walker {
  id: string
  name: string
  photo: string
  bio: string
  zone: string
  walksCount: number
  capacity: number
  currentDogIds: string[]
  currentRouteId: string
  routes: WalkRoute[]
  featuredBreed: string
}

export interface Review {
  id: string
  walkerId: string
  ownerName: string
  petName: string
  rating: number
  comment: string
  date: string
}

export type PetSize = 'Pequeño' | 'Mediano' | 'Grande'

export interface WalkSchedule {
  id: string
  days: string
  start: string
  end: string
  label: string
}

export interface Pet {
  id: string
  name: string
  photo: string
  age: string
  breed: string
  size: PetSize
  notes: string
  schedules: WalkSchedule[]
}

export interface Owner {
  name: string
  address: string
  phone: string
  email: string
}

export type Mood = 'Feliz' | 'Activo' | 'Cansado' | 'Distraído' | 'Ansioso'

export interface WalkReport {
  id: string
  petId: string
  walkerId: string
  routeId: string
  date: string
  start: string
  end: string
  duration: string
  moods: Mood[]
  didBathroom: boolean
  drankWater: boolean
  energy: number
  notes: string
  photos: string[]
}
