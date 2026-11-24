/*
  ===========================================================
  NOTA EDITABLE: DATOS INICIALES DE LA APLICACIÓN
  Este archivo contiene todo el contenido de ejemplo:
  paseadores, rutas, reseñas, dueño, mascotas y reportes.

  - Para agregar un paseador: copia un objeto dentro de `walkers`,
    cambia su `id` (único, sin espacios) y sus datos.
  - Las fotos van en /public/images/... y se referencian como
    '/images/carpeta/archivo.png'.
  - Las rutas usan coordenadas [latitud, longitud]. Puedes obtenerlas
    haciendo clic derecho en Google Maps sobre un punto.
  - Los cambios hechos desde la interfaz viven en memoria (se pierden al
    recargar). Para guardarlos de forma permanente conecta una base de
    datos (por ejemplo Neon) y reemplaza el estado de lib/store.tsx.
  ===========================================================
*/
import type { Owner, Pet, Review, WalkReport, WalkRoute, Walker } from './types'

export const APP_NAME = 'Driver Pet'
export const APP_TAGLINE = 'Encuentra el Paseador Ideal para tu Mascota'
export const APP_SUBTITLE =
  'Paseadores verificados, rutas seguras y reportes de cada paseo directo a tu celular.'

export const ZONES = ['Parque Central', 'Zona Norte', 'Zona Sur', 'Centro Histórico']
export const ROUTE_TYPES = ['Parque', 'Urbana', 'Sendero'] as const

const BASE: [number, number] = [19.4119, -99.17]

function rectangle(
  center: [number, number],
  dLat: number,
  dLng: number,
  tilt = 0.0015,
): [number, number][] {
  const [lat, lng] = center
  return [
    [lat + dLat, lng - dLng + tilt],
    [lat + dLat - tilt, lng + dLng],
    [lat - dLat, lng + dLng - tilt],
    [lat - dLat + tilt, lng - dLng],
    [lat + dLat, lng - dLng + tilt],
  ]
}

function route(
  id: string,
  name: string,
  type: WalkRoute['type'],
  zone: string,
  distanceKm: number,
  durationMin: number,
  offset: [number, number],
): WalkRoute {
  const center: [number, number] = [BASE[0] + offset[0], BASE[1] + offset[1]]
  return {
    id,
    name,
    type,
    zone,
    distanceKm,
    durationMin,
    center,
    path: rectangle(center, 0.0028, 0.0036),
  }
}

export const initialWalkers: Walker[] = [
  {
    id: 'elena',
    name: 'Elena Torres',
    photo: '/images/paseadores/elena.png',
    bio: 'Amante de los perros grandes. Paseos con mucho juego, socialización y cuidado especial en días calurosos.',
    zone: 'Parque Central',
    walksCount: 342,
    capacity: 10,
    currentDogIds: ['canela', 'bruno', 'coco', 'luna', 'maya', 'milo', 'toby'],
    currentRouteId: 'elena-a',
    featuredBreed: 'Golden Retriever',
    routes: [
      route('elena-a', 'Parque Central - Circuito A', 'Parque', 'Parque Central', 1.2, 45, [0, 0]),
      route('elena-b', 'Avenida de los Árboles', 'Urbana', 'Parque Central', 2.0, 60, [0.006, 0.004]),
    ],
  },
  {
    id: 'ricardo',
    name: 'Ricardo Bravo',
    photo: '/images/paseadores/ricardo.png',
    bio: 'Entrenador canino certificado. Ideal para perros con mucha energía que necesitan paseos largos y disciplina.',
    zone: 'Zona Norte',
    walksCount: 298,
    capacity: 6,
    currentDogIds: ['bruno', 'maya'],
    currentRouteId: 'ricardo-a',
    featuredBreed: 'Pastor Alemán',
    routes: [
      route('ricardo-a', 'Sendero del Bosque Norte', 'Sendero', 'Zona Norte', 3.5, 75, [0.012, -0.006]),
    ],
  },
  {
    id: 'adela',
    name: 'Adela Ramos',
    photo: '/images/paseadores/adela.png',
    bio: 'Veterinaria en formación. Me encanta acompañar a perros mayores y cachorros con mucha paciencia.',
    zone: 'Zona Sur',
    walksCount: 215,
    capacity: 5,
    currentDogIds: ['coco'],
    currentRouteId: 'adela-a',
    featuredBreed: 'Beagle',
    routes: [route('adela-a', 'Jardín del Sur', 'Parque', 'Zona Sur', 1.0, 35, [-0.01, 0.003])],
  },
  {
    id: 'gerardo',
    name: 'Gerardo Rojas',
    photo: '/images/paseadores/gerardo.png',
    bio: 'Paseos grupales divertidos. Experiencia con razas de todos los tamaños y perros rescatados.',
    zone: 'Centro Histórico',
    walksCount: 410,
    capacity: 8,
    currentDogIds: ['luna', 'toby', 'milo'],
    currentRouteId: 'gerardo-a',
    featuredBreed: 'Husky Siberiano',
    routes: [
      route('gerardo-a', 'Plazas del Centro', 'Urbana', 'Centro Histórico', 2.4, 50, [0.004, 0.012]),
    ],
  },
  {
    id: 'carolina',
    name: 'Carolina Luna',
    photo: '/images/paseadores/carolina.png',
    bio: 'Paseos tranquilos y seguros. Perfecta para perros tímidos o que se están adaptando a su nuevo hogar.',
    zone: 'Parque Central',
    walksCount: 187,
    capacity: 4,
    currentDogIds: ['canela'],
    currentRouteId: 'carolina-a',
    featuredBreed: 'Labrador',
    routes: [
      route('carolina-a', 'Parque Central - Circuito B', 'Parque', 'Parque Central', 0.9, 30, [-0.004, -0.005]),
    ],
  },
  {
    id: 'paola',
    name: 'Paola Torres',
    photo: '/images/paseadores/paola.png',
    bio: 'Especialista en razas pequeñas. Paseos cortos, juegos de olfato y mucho cariño en cada salida.',
    zone: 'Zona Norte',
    walksCount: 264,
    capacity: 6,
    currentDogIds: ['coco', 'toby'],
    currentRouteId: 'paola-a',
    featuredBreed: 'Terrier',
    routes: [route('paola-a', 'Paseo de las Flores', 'Urbana', 'Zona Norte', 1.5, 40, [0.01, 0.008])],
  },
  {
    id: 'ulises',
    name: 'Ulises Lillo',
    photo: '/images/paseadores/ulises.png',
    bio: 'Corredor y amante de la naturaleza. Llevo a tu perro a senderos donde puede explorar y gastar energía.',
    zone: 'Zona Sur',
    walksCount: 331,
    capacity: 7,
    currentDogIds: ['maya', 'luna', 'bruno'],
    currentRouteId: 'ulises-a',
    featuredBreed: 'Samoyedo',
    routes: [route('ulises-a', 'Sendero del Río', 'Sendero', 'Zona Sur', 4.0, 90, [-0.012, -0.01])],
  },
  {
    id: 'clara',
    name: 'Clara Milo',
    photo: '/images/paseadores/clara.png',
    bio: 'Paseos activos con hidratación y fotos en cada salida. Te mantengo informado durante todo el recorrido.',
    zone: 'Centro Histórico',
    walksCount: 276,
    capacity: 6,
    currentDogIds: ['canela', 'milo'],
    currentRouteId: 'clara-a',
    featuredBreed: 'Shiba Inu',
    routes: [route('clara-a', 'Alameda Central', 'Parque', 'Centro Histórico', 1.8, 45, [0.002, 0.018])],
  },
]

/* Perros que aparecen en "Actualmente: perros con correa" del panel del paseador */
export const dogAvatars: Record<string, { name: string; photo: string }> = {
  canela: { name: 'Lola', photo: '/images/mascotas/canela.png' },
  bruno: { name: 'Bruno', photo: '/images/mascotas/bruno.png' },
  coco: { name: 'Coco', photo: '/images/mascotas/coco.png' },
  luna: { name: 'Luna', photo: '/images/mascotas/luna.png' },
  maya: { name: 'Maya', photo: '/images/mascotas/maya.png' },
  milo: { name: 'Milo', photo: '/images/mascotas/canela.png' },
  toby: { name: 'Toby', photo: '/images/mascotas/toby.png' },
}

export const initialReviews: Review[] = [
  {
    id: 'r1',
    walkerId: 'elena',
    ownerName: 'Mariana G.',
    petName: 'Canela',
    rating: 5,
    comment: 'Elena es increíble, Canela regresa feliz y cansada. Las fotos del paseo me encantan.',
    date: '2026-11-10',
  },
  {
    id: 'r2',
    walkerId: 'elena',
    ownerName: 'Jorge P.',
    petName: 'Bruno',
    rating: 5,
    comment: 'Muy puntual y responsable. Bruno la adora.',
    date: '2026-11-04',
  },
  {
    id: 'r3',
    walkerId: 'elena',
    ownerName: 'Sofía L.',
    petName: 'Luna',
    rating: 4,
    comment: 'Excelente trato, solo una vez llegó unos minutos tarde.',
    date: '2026-10-28',
  },
  { id: 'r4', walkerId: 'ricardo', ownerName: 'Andrés M.', petName: 'Maya', rating: 5, comment: 'Maya volvió súper tranquila. Gran entrenador.', date: '2026-11-08' },
  { id: 'r5', walkerId: 'ricardo', ownerName: 'Lucía R.', petName: 'Rocky', rating: 5, comment: 'Recomendadísimo para perros energéticos.', date: '2026-10-30' },
  { id: 'r6', walkerId: 'adela', ownerName: 'Carlos T.', petName: 'Coco', rating: 5, comment: 'Muy paciente con mi cachorro.', date: '2026-11-02' },
  { id: 'r7', walkerId: 'adela', ownerName: 'Elisa V.', petName: 'Nube', rating: 4, comment: 'Atenta y cariñosa.', date: '2026-10-21' },
  { id: 'r8', walkerId: 'gerardo', ownerName: 'Patricia N.', petName: 'Toby', rating: 5, comment: 'A Toby le encantan los paseos en grupo.', date: '2026-11-12' },
  { id: 'r9', walkerId: 'carolina', ownerName: 'Raúl S.', petName: 'Kira', rating: 5, comment: 'Mi perrita tímida por fin disfruta salir.', date: '2026-11-06' },
  { id: 'r10', walkerId: 'paola', ownerName: 'Diana C.', petName: 'Pelusa', rating: 5, comment: 'Ideal para perros pequeños.', date: '2026-11-01' },
  { id: 'r11', walkerId: 'ulises', ownerName: 'Fernando A.', petName: 'Luna', rating: 4, comment: 'Paseos largos y muy completos.', date: '2026-10-25' },
  { id: 'r12', walkerId: 'clara', ownerName: 'Gabriela H.', petName: 'Milo', rating: 5, comment: 'Siempre me manda fotos, súper confiable.', date: '2026-11-09' },
]

export const initialOwner: Owner = {
  name: 'Mariana González',
  address: 'Av. Ámsterdam 120, Col. Condesa',
  phone: '55 1234 5678',
  email: 'mariana@correo.com',
}

export const initialPets: Pet[] = [
  {
    id: 'canela',
    name: 'Canela',
    photo: '/images/mascotas/canela.png',
    age: '4 años',
    breed: 'Golden Retriever',
    size: 'Grande',
    notes: 'Muy sociable. Alérgica al pollo. Le encanta jugar con pelota.',
    schedules: [
      { id: 's1', days: 'Lunes - Viernes', start: '08:00', end: '09:00', label: 'Paseo Matutino' },
      { id: 's2', days: 'Lunes - Viernes', start: '18:00', end: '19:00', label: 'Paseo Vespertino' },
      { id: 's3', days: 'Sábado', start: '10:00', end: '11:30', label: 'Paseo Largo' },
      { id: 's4', days: 'Domingo', start: '09:00', end: '10:00', label: 'Paseo de Juego' },
    ],
  },
  {
    id: 'toby',
    name: 'Toby',
    photo: '/images/mascotas/toby.png',
    age: '2 años',
    breed: 'Shiba Inu',
    size: 'Mediano',
    notes: 'Tira de la correa al ver gatos. Usar arnés.',
    schedules: [
      { id: 's5', days: 'Lunes - Viernes', start: '07:30', end: '08:15', label: 'Paseo Matutino' },
    ],
  },
]

export const initialReports: WalkReport[] = []

export const SAMPLE_WALK_PHOTOS = [
  '/images/paseos/paseo-1.png',
  '/images/paseos/paseo-2.png',
  '/images/paseadores/elena.png',
]
