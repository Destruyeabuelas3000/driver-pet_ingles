/*
  ===========================================================
  NOTA EDITABLE: DATOS INICIALES DE LA APLICACIÓN
  Este archivo contiene todo el contenido de ejemplo:
  paseadores, rutas, reseñas, dueño, mascotas y reportes.

  - Para agregar un paseador: copia un objeto dentro de `walkers`,
    cambia su `id` (único, sin espacios) y sus datos.
  - Las fotos van en /public/images/... y se referencian como
    '/images/carpeta/archivo.png'.
  - Las rutas usan coordenadas [latitud, longitud] de parques de Bogotá;
    los recorridos dibujados son aproximados, no trazados GPS verificados.
  - El perfil y las mascotas se guardan en localStorage desde lib/store.tsx.
  ===========================================================
*/
import type { Owner, Pet, Review, WalkReport, WalkRoute, Walker, WalkSchedule } from './types'

export const APP_NAME = 'Driver Pet'
export const APP_TAGLINE = 'Encuentra el Paseador Ideal para tu Mascota'
export const APP_SUBTITLE =
  'Paseadores verificados, rutas seguras y reportes de cada paseo directo a tu celular.'

export const ZONES = ['Chapinero', 'Santa Fe', 'Teusaquillo', 'Tunjuelito', 'Usaquén']
export const ROUTE_TYPES = ['Parque', 'Urbana', 'Sendero'] as const

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
  center: [number, number],
  schedule: Omit<WalkSchedule, 'id'> = {
    days: 'Lunes - Viernes',
    start: '08:00',
    end: '09:00',
    label: 'Paseo programado',
  },
): WalkRoute {
  return {
    id,
    name,
    type,
    zone,
    distanceKm,
    durationMin,
    schedules: [{ ...schedule, id: `${id}-schedule` }],
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
    zone: 'Teusaquillo',
    walksCount: 342,
    capacity: 10,
    currentDogIds: ['canela', 'bruno', 'coco', 'luna', 'maya', 'milo', 'toby'],
    currentRouteId: 'elena-a',
    featuredBreed: 'Golden Retriever',
    routes: [
      route('elena-a', 'Parque de los Novios', 'Parque', 'Teusaquillo', 1.2, 45, [4.6632, -74.0784], {
        days: 'Lunes - Viernes',
        start: '07:00',
        end: '07:45',
        label: 'Paseo matutino',
      }),
      route('elena-b', 'Parque Metropolitano Simón Bolívar', 'Parque', 'Teusaquillo', 2.0, 60, [4.6585, -74.0935], {
        days: 'Lunes - Viernes',
        start: '18:00',
        end: '19:00',
        label: 'Paseo vespertino',
      }),
    ],
  },
  {
    id: 'ricardo',
    name: 'Ricardo Bravo',
    photo: '/images/paseadores/ricardo.png',
    bio: 'Entrenador canino certificado. Ideal para perros con mucha energía que necesitan paseos largos y disciplina.',
    zone: 'Chapinero',
    walksCount: 298,
    capacity: 6,
    currentDogIds: ['bruno', 'maya'],
    currentRouteId: 'ricardo-a',
    featuredBreed: 'Pastor Alemán',
    routes: [
      route('ricardo-a', 'Parque El Virrey', 'Parque', 'Chapinero', 3.5, 75, [4.6743, -74.0517], {
        days: 'Fines de semana',
        start: '09:00',
        end: '10:15',
        label: 'Paseo de fin de semana',
      }),
    ],
  },
  {
    id: 'adela',
    name: 'Adela Ramos',
    photo: '/images/paseadores/adela.png',
    bio: 'Veterinaria en formación. Me encanta acompañar a perros mayores y cachorros con mucha paciencia.',
    zone: 'Tunjuelito',
    walksCount: 215,
    capacity: 5,
    currentDogIds: ['coco'],
    currentRouteId: 'adela-a',
    featuredBreed: 'Beagle',
    routes: [route('adela-a', 'Parque El Tunal', 'Parque', 'Tunjuelito', 1.0, 35, [4.5747, -74.1304], {
      days: 'Lunes - Viernes',
      start: '08:30',
      end: '09:05',
      label: 'Paseo tranquilo',
    })],
  },
  {
    id: 'gerardo',
    name: 'Gerardo Rojas',
    photo: '/images/paseadores/gerardo.png',
    bio: 'Paseos grupales divertidos. Experiencia con razas de todos los tamaños y perros rescatados.',
    zone: 'Santa Fe',
    walksCount: 410,
    capacity: 8,
    currentDogIds: ['luna', 'toby', 'milo'],
    currentRouteId: 'gerardo-a',
    featuredBreed: 'Husky Siberiano',
    routes: [
      route('gerardo-a', 'Parque Nacional Enrique Olaya Herrera', 'Parque', 'Santa Fe', 2.4, 50, [4.6256, -74.0564], {
        days: 'Lunes - Sábado',
        start: '16:00',
        end: '16:50',
        label: 'Paseo grupal',
      }),
    ],
  },
  {
    id: 'carolina',
    name: 'Carolina Luna',
    photo: '/images/paseadores/carolina.png',
    bio: 'Paseos tranquilos y seguros. Perfecta para perros tímidos o que se están adaptando a su nuevo hogar.',
    zone: 'Teusaquillo',
    walksCount: 187,
    capacity: 4,
    currentDogIds: ['canela'],
    currentRouteId: 'carolina-a',
    featuredBreed: 'Labrador',
    routes: [
      route('carolina-a', 'Parque Metropolitano Simón Bolívar', 'Parque', 'Teusaquillo', 0.9, 30, [4.6585, -74.0935], {
        days: 'Lunes - Viernes',
        start: '10:00',
        end: '10:30',
        label: 'Paseo corto',
      }),
    ],
  },
  {
    id: 'paola',
    name: 'Paola Torres',
    photo: '/images/paseadores/paola.png',
    bio: 'Especialista en razas pequeñas. Paseos cortos, juegos de olfato y mucho cariño en cada salida.',
    zone: 'Usaquén',
    walksCount: 264,
    capacity: 6,
    currentDogIds: ['coco', 'toby'],
    currentRouteId: 'paola-a',
    featuredBreed: 'Terrier',
    routes: [route('paola-a', 'Parque de Usaquén', 'Parque', 'Usaquén', 1.5, 40, [4.6955, -74.0302], {
      days: 'Lunes - Viernes',
      start: '07:30',
      end: '08:10',
      label: 'Paseo matutino',
    })],
  },
  {
    id: 'ulises',
    name: 'Ulises Lillo',
    photo: '/images/paseadores/ulises.png',
    bio: 'Corredor y amante de la naturaleza. Llevo a tu perro a senderos donde puede explorar y gastar energía.',
    zone: 'Tunjuelito',
    walksCount: 331,
    capacity: 7,
    currentDogIds: ['maya', 'luna', 'bruno'],
    currentRouteId: 'ulises-a',
    featuredBreed: 'Samoyedo',
    routes: [route('ulises-a', 'Parque El Tunal - Sendero', 'Sendero', 'Tunjuelito', 4.0, 90, [4.5747, -74.1304], {
      days: 'Sábado - Domingo',
      start: '07:00',
      end: '08:30',
      label: 'Ruta de sendero',
    })],
  },
  {
    id: 'clara',
    name: 'Clara Milo',
    photo: '/images/paseadores/clara.png',
    bio: 'Paseos activos con hidratación y fotos en cada salida. Te mantengo informado durante todo el recorrido.',
    zone: 'Chapinero',
    walksCount: 276,
    capacity: 6,
    currentDogIds: ['canela', 'milo'],
    currentRouteId: 'clara-a',
    featuredBreed: 'Shiba Inu',
    routes: [route('clara-a', 'Parque de los Hippies', 'Parque', 'Chapinero', 1.8, 45, [4.6409, -74.0634], {
      days: 'Martes - Sábado',
      start: '17:00',
      end: '17:45',
      label: 'Paseo vespertino',
    })],
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
  address: 'Chapinero, Bogotá, Colombia',
  phone: '',
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
