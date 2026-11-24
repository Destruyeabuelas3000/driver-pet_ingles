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
- Los datos de demostración están en `lib/data.ts`:
  - `initialWalkers`: nombre, foto, bio, zona, capacidad, perros actuales y rutas.
  - `initialReviews`: calificaciones de los dueños.
  - `initialOwner` y `initialPets`: perfil del dueño, mascotas y horarios.
  - `ZONES` y `ROUTE_TYPES`: localidades y tipos de ruta para los filtros.
  - `APP_TAGLINE` / `APP_SUBTITLE`: textos principales del inicio.
- Las rutas apuntan a parques conocidos de Bogotá y usan coordenadas `[latitud, longitud]`.
  Los polígonos son aproximados y no representan recorridos GPS verificados.
- Los días y horas de cada ruta se editan en el perfil del paseador.
- El mapa usa Leaflet con teselas de OpenStreetMap y no requiere una clave de API.
  Los enlaces permiten abrir cada ruta en Google Maps.

## 4. Menú y contacto
- Enlaces del menú: `NAV_LINKS` en `components/site-header.tsx`.
- Correo y ciudad: `CONTACT` en `components/site-footer.tsx`.

## 5. Páginas
| Ruta | Archivo | Qué hace |
|---|---|---|
| `/` | `components/home/*` | Inicio con filtros, paseadores y panel Paseador / Mascota |
| `/paseadores` | `components/walkers/walkers-list.tsx` | Lista y búsqueda |
| `/paseadores/[id]` | `components/walkers/walker-profile.tsx` | Perfil público del paseador y reseñas |
| `/mi-perfil` | `components/owner/*` | Perfil del dueño, mascotas, horarios, perfiles de paseadores y reportes recibidos |
| `/perfil-paseador` | `components/walkers/walker-dashboard.tsx` | Panel del paseador con avisos de nuevas solicitudes, perfil y rutas editables |
| `/reportar` | `components/report/report-view.tsx` | El paseador registra el paseo y confirma la entrega al dueño |
| `/rutas` | `components/routes-view.tsx` | Mapa de todas las rutas |
| `/resenas` | `components/reviews-view.tsx` | Todas las reseñas |

## 6. Perfil y almacenamiento local
El perfil del usuario, sus mascotas, los cambios de paseadores/rutas y los avisos de
solicitudes se guardan en `localStorage` desde `lib/store.tsx`, por lo que permanecen
al recargar en el mismo navegador. El cambio entre perfiles es una demostración local:
no crea cuentas ni sincroniza entre dispositivos. Los avisos se muestran dentro del
panel del paseador; para notificaciones push o correo, conecta un servicio y una base
de datos. Las reseñas y reportes solo viven en memoria.

Los mapas muestran recorridos de ejemplo con Leaflet y teselas de OpenStreetMap; no
requieren una clave de Google Maps. Los enlaces para abrir una ruta en Google Maps
siguen disponibles. Las fotos subidas pueden guardarse con Vercel Blob.
