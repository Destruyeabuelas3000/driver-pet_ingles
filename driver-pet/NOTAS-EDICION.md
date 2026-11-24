# Notas para editar Driver Pet

Busca el texto `NOTA EDITABLE` dentro del proyecto para ver cada punto que puedes cambiar.

## 1. Colores y tipografía
- `app/globals.css`: variables `--primary` (verde principal), `--secondary` (verde claro del encabezado), `--accent`, `--star` (estrellas).
- `app/layout.tsx`: fuente (Roboto), título y descripción de la página (SEO).

## 2. Logo e imágenes
- Logos en `public/images/`: `logo-icon.png` (encabezado), `logo-color.png` (pie de página), `logo-white.png` (para fondos oscuros), `logo-driver-pet.png` (original).
- Fotos de paseadores: `public/images/paseadores/`. Fotos de mascotas: `public/images/mascotas/`. Fotos de paseos: `public/images/paseos/`.
- Para reemplazar una foto, guarda la nueva con el mismo nombre o cambia la ruta en `lib/data.ts`.
- El fondo de huellas está en `public/images/paw-pattern.svg`.

## 3. Contenido (paseadores, rutas, reseñas, mascotas)
- Todo está en `lib/data.ts`:
  - `initialWalkers`: nombre, foto, bio, zona, capacidad, perros actuales y rutas.
  - `initialReviews`: calificaciones de los dueños.
  - `initialOwner` y `initialPets`: perfil del dueño, mascotas y horarios.
  - `ZONES` y `ROUTE_TYPES`: opciones de los filtros de la página de inicio.
  - `APP_TAGLINE` / `APP_SUBTITLE`: textos principales del inicio.
- Las rutas usan coordenadas `[latitud, longitud]` (clic derecho en Google Maps para copiarlas).

## 4. Menú y contacto
- Enlaces del menú: `NAV_LINKS` en `components/site-header.tsx`.
- Correo, teléfono y dirección: `CONTACT` en `components/site-footer.tsx`.

## 5. Páginas
| Ruta | Archivo | Qué hace |
|---|---|---|
| `/` | `components/home/*` | Inicio con filtros, paseadores y panel Paseador / Mascota |
| `/paseadores` | `components/walkers/walkers-list.tsx` | Lista y búsqueda |
| `/paseadores/[id]` | `components/walkers/walker-profile.tsx` | Perfil del paseador: editar nombre/bio, rutas y reseñas |
| `/mi-perfil` | `components/owner/*` | Perfil del dueño, mascotas, horarios y reportes recibidos |
| `/reportar` | `components/report/report-view.tsx` | El paseador entrega la mascota y sube observaciones |
| `/rutas` | `components/routes-view.tsx` | Mapa de todas las rutas |
| `/resenas` | `components/reviews-view.tsx` | Todas las reseñas |

## 6. Guardar datos de forma permanente
Hoy los cambios se guardan en memoria (se reinician al recargar). En `lib/store.tsx`
cada función (`addReview`, `updatePet`, `addReport`, etc.) es el lugar donde conectar
una base de datos (por ejemplo Neon) y un sistema de inicio de sesión para separar
cuentas de dueños y paseadores. Las fotos subidas pueden guardarse con Vercel Blob.
