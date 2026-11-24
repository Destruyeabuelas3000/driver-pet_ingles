'use client'

/*
  ===========================================================
  NOTA EDITABLE: ESTADO GLOBAL
  Aquí viven los datos de la app. El perfil, las mascotas y los cambios de
  paseadores/rutas se guardan localmente en el navegador; reseñas y reportes
  solo viven en memoria. Para cuentas compartidas entre dispositivos, conecta
  una base de datos y un sistema de inicio de sesión.
  ===========================================================
*/
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  initialOwner,
  initialPets,
  initialReports,
  initialReviews,
  initialWalkers,
} from './data'
import type { Owner, Pet, Review, WalkNotification, WalkReport, WalkRoute, Walker } from './types'

interface AppState {
  walkers: Walker[]
  reviews: Review[]
  owner: Owner
  pets: Pet[]
  reports: WalkReport[]
  walkNotifications: WalkNotification[]
  updateWalker: (id: string, patch: Partial<Walker>) => void
  addRoute: (walkerId: string, route: WalkRoute) => void
  removeRoute: (walkerId: string, routeId: string) => void
  addReview: (review: Omit<Review, 'id' | 'date'>) => void
  updateOwner: (owner: Owner) => void
  addPet: (pet: Pet) => void
  updatePet: (id: string, patch: Partial<Pet>) => void
  removePet: (id: string) => void
  addReport: (report: Omit<WalkReport, 'id' | 'date'>) => void
  requestWalk: (walkerId: string, petId: string) => boolean
  markWalkNotificationRead: (id: string) => void
}

const AppContext = createContext<AppState | null>(null)
const PROFILE_STORAGE_KEY = 'driver-pet-profile-v1'

function isOwner(value: unknown): value is Owner {
  if (!value || typeof value !== 'object') return false
  const owner = value as Record<string, unknown>
  return ['name', 'address', 'phone', 'email'].every((key) => typeof owner[key] === 'string')
}

function isPet(value: unknown): value is Pet {
  if (!value || typeof value !== 'object') return false
  const pet = value as Record<string, unknown>
  return (
    typeof pet.id === 'string' &&
    typeof pet.name === 'string' &&
    typeof pet.photo === 'string' &&
    typeof pet.age === 'string' &&
    typeof pet.breed === 'string' &&
    ['Pequeño', 'Mediano', 'Grande'].includes(pet.size as string) &&
    typeof pet.notes === 'string' &&
    Array.isArray(pet.schedules)
  )
}

function isWalkSchedule(value: unknown): value is WalkRoute['schedules'][number] {
  if (!value || typeof value !== 'object') return false
  const schedule = value as Record<string, unknown>
  return ['id', 'days', 'start', 'end', 'label'].every((key) => typeof schedule[key] === 'string')
}

function isWalkRoute(value: unknown): value is WalkRoute {
  if (!value || typeof value !== 'object') return false
  const route = value as Record<string, unknown>
  return (
    typeof route.id === 'string' &&
    typeof route.name === 'string' &&
    ['Parque', 'Urbana', 'Sendero'].includes(route.type as string) &&
    typeof route.zone === 'string' &&
    typeof route.distanceKm === 'number' &&
    typeof route.durationMin === 'number' &&
    Array.isArray(route.schedules) &&
    route.schedules.every(isWalkSchedule) &&
    Array.isArray(route.center) &&
    route.center.length === 2 &&
    route.center.every((coordinate) => typeof coordinate === 'number') &&
    Array.isArray(route.path) &&
    route.path.every(
      (point) =>
        Array.isArray(point) &&
        point.length === 2 &&
        point.every((coordinate) => typeof coordinate === 'number'),
    )
  )
}

function isWalker(value: unknown): value is Walker {
  if (!value || typeof value !== 'object') return false
  const walker = value as Record<string, unknown>
  return (
    typeof walker.id === 'string' &&
    typeof walker.name === 'string' &&
    typeof walker.photo === 'string' &&
    typeof walker.bio === 'string' &&
    typeof walker.zone === 'string' &&
    typeof walker.walksCount === 'number' &&
    typeof walker.capacity === 'number' &&
    Array.isArray(walker.currentDogIds) &&
    walker.currentDogIds.every((id) => typeof id === 'string') &&
    typeof walker.currentRouteId === 'string' &&
    Array.isArray(walker.routes) &&
    walker.routes.every(isWalkRoute) &&
    typeof walker.featuredBreed === 'string'
  )
}

function isWalkNotification(value: unknown): value is WalkNotification {
  if (!value || typeof value !== 'object') return false
  const notification = value as Record<string, unknown>
  return (
    ['id', 'walkerId', 'petId', 'ownerName', 'days', 'start', 'end', 'createdAt'].every(
      (key) => typeof notification[key] === 'string',
    ) &&
    typeof notification.read === 'boolean'
  )
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [walkers, setWalkers] = useState(initialWalkers)
  const [reviews, setReviews] = useState(initialReviews)
  const [owner, setOwner] = useState(initialOwner)
  const [pets, setPets] = useState(initialPets)
  const [reports, setReports] = useState(initialReports)
  const [walkNotifications, setWalkNotifications] = useState<WalkNotification[]>([])
  const [profileReady, setProfileReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        const data = parsed as Record<string, unknown>
        if (
          parsed &&
          typeof parsed === 'object' &&
          isOwner(data.owner) &&
          Array.isArray(data.pets) &&
          data.pets.every(isPet) &&
          (data.walkers === undefined ||
            (Array.isArray(data.walkers) && data.walkers.every(isWalker))) &&
          (data.walkNotifications === undefined ||
            (Array.isArray(data.walkNotifications) && data.walkNotifications.every(isWalkNotification)))
        ) {
          setOwner(data.owner)
          setPets(data.pets)
          if (Array.isArray(data.walkers)) setWalkers(data.walkers)
          if (Array.isArray(data.walkNotifications)) setWalkNotifications(data.walkNotifications)
        } else {
          console.error('Los datos locales del perfil Driver Pet tienen un formato inválido.')
        }
      }
    } catch (error) {
      console.error('No se pudo cargar el perfil local de Driver Pet.', error)
    }
    setProfileReady(true)
  }, [])

  useEffect(() => {
    if (!profileReady) return
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ owner, pets, walkers, walkNotifications }))
    } catch (error) {
      console.error('No se pudo guardar el perfil local de Driver Pet.', error)
    }
  }, [owner, pets, walkers, walkNotifications, profileReady])

  const updateWalker = useCallback((id: string, patch: Partial<Walker>) => {
    setWalkers((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  }, [])

  const addRoute = useCallback((walkerId: string, route: WalkRoute) => {
    setWalkers((prev) =>
      prev.map((w) => (w.id === walkerId ? { ...w, routes: [...w.routes, route] } : w)),
    )
  }, [])

  const removeRoute = useCallback((walkerId: string, routeId: string) => {
    setWalkers((prev) =>
      prev.map((w) => {
        if (w.id !== walkerId || w.routes.length <= 1) return w
        const routes = w.routes.filter((r) => r.id !== routeId)
        return {
          ...w,
          routes,
          currentRouteId: w.currentRouteId === routeId ? routes[0].id : w.currentRouteId,
        }
      }),
    )
  }, [])

  const addReview = useCallback((review: Omit<Review, 'id' | 'date'>) => {
    setReviews((prev) => [
      { ...review, id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
  }, [])

  const addPet = useCallback((pet: Pet) => setPets((prev) => [...prev, pet]), [])

  const updatePet = useCallback((id: string, patch: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const removePet = useCallback((id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addReport = useCallback((report: Omit<WalkReport, 'id' | 'date'>) => {
    setReports((prev) => [
      { ...report, id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
  }, [])

  const requestWalk = useCallback(
    (walkerId: string, petId: string) => {
      const walker = walkers.find((w) => w.id === walkerId)
      const pet = pets.find((p) => p.id === petId)
      if (!walker || !pet) return false
      if (!walker.currentDogIds.includes(petId) && walker.currentDogIds.length >= walker.capacity) return false
      const schedule = pet.schedules[0] ?? {
        days: 'Por coordinar',
        start: '08:00',
        end: '09:00',
      }
      setWalkers((prev) =>
        prev.map((w) =>
          w.id === walkerId && !w.currentDogIds.includes(petId)
            ? { ...w, currentDogIds: [...w.currentDogIds, petId] }
            : w,
        ),
      )
      setWalkNotifications((prev) => {
        if (prev.some((notification) =>
          notification.walkerId === walkerId &&
          notification.petId === petId &&
          notification.days === schedule.days &&
          notification.start === schedule.start &&
          notification.end === schedule.end
        )) return prev
        return [
          {
            id: crypto.randomUUID(),
            walkerId,
            petId,
            ownerName: owner.name,
            days: schedule.days,
            start: schedule.start,
            end: schedule.end,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ]
      })
      return true
    },
    [walkers, pets, owner.name],
  )

  const markWalkNotificationRead = useCallback((id: string) => {
    setWalkNotifications((prev) =>
      prev.map((notification) => notification.id === id ? { ...notification, read: true } : notification),
    )
  }, [])

  const value = useMemo<AppState>(
    () => ({
      walkers,
      reviews,
      owner,
      pets,
      reports,
      walkNotifications,
      updateWalker,
      addRoute,
      removeRoute,
      addReview,
      updateOwner: setOwner,
      addPet,
      updatePet,
      removePet,
      addReport,
      requestWalk,
      markWalkNotificationRead,
    }),
    [walkers, reviews, owner, pets, reports, walkNotifications, updateWalker, addRoute, removeRoute, addReview, addPet, updatePet, removePet, addReport, requestWalk, markWalkNotificationRead],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}

export function getWalkerRating(reviews: Review[], walkerId: string) {
  const list = reviews.filter((r) => r.walkerId === walkerId)
  if (list.length === 0) return { average: 0, count: 0 }
  const average = list.reduce((sum, r) => sum + r.rating, 0) / list.length
  return { average: Math.round(average * 10) / 10, count: list.length }
}

export function formatTime(value: string) {
  const [h, m] = value.split(':').map(Number)
  if (Number.isNaN(h)) return value
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m ?? 0).padStart(2, '0')} ${suffix}`
}
