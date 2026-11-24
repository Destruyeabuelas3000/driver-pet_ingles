'use client'

/*
  ===========================================================
  NOTA EDITABLE: ESTADO GLOBAL
  Aquí viven los datos mientras usas la app (paseadores, reseñas,
  dueño, mascotas y reportes). Cada función (addReview, updatePet...)
  es el punto exacto donde conectarías una base de datos real:
  reemplaza el `setState` por una llamada a tu API o Server Action.
  ===========================================================
*/
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  initialOwner,
  initialPets,
  initialReports,
  initialReviews,
  initialWalkers,
} from './data'
import type { Owner, Pet, Review, WalkReport, WalkRoute, Walker } from './types'

interface AppState {
  walkers: Walker[]
  reviews: Review[]
  owner: Owner
  pets: Pet[]
  reports: WalkReport[]
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
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [walkers, setWalkers] = useState(initialWalkers)
  const [reviews, setReviews] = useState(initialReviews)
  const [owner, setOwner] = useState(initialOwner)
  const [pets, setPets] = useState(initialPets)
  const [reports, setReports] = useState(initialReports)

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
      if (!walker) return false
      if (walker.currentDogIds.includes(petId)) return true
      if (walker.currentDogIds.length >= walker.capacity) return false
      setWalkers((prev) =>
        prev.map((w) =>
          w.id === walkerId ? { ...w, currentDogIds: [...w.currentDogIds, petId] } : w,
        ),
      )
      return true
    },
    [walkers],
  )

  const value = useMemo<AppState>(
    () => ({
      walkers,
      reviews,
      owner,
      pets,
      reports,
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
    }),
    [walkers, reviews, owner, pets, reports, updateWalker, addRoute, removeRoute, addReview, addPet, updatePet, removePet, addReport, requestWalk],
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
