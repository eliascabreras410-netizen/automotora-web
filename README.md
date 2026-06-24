# Proyecto: Alvaro Gervasini Automóviles

## Stack tecnológico
- Next.js + React + Tailwind CSS + Lucide React
- JavaScript, Node.js, npm
- Supabase (base de datos + auth + storage)

## Estado actual
✅ Navbar (con links a Reseñas y Ventas)
✅ Hero (página principal)
✅ Tarjetas de vehículos
✅ Páginas individuales por vehículo (ruta dinámica /vehiculos/[id])
✅ Botón WhatsApp
✅ Sección contacto (con link discreto "Acceso administrador")
✅ Scroll suave
✅ Diseño responsive completo (mobile, tablet, desktop)
✅ Galería de imágenes con flechas y miniaturas
✅ Badge "Nuevo ingreso" en tarjetas
✅ Página individual muestra: año, km, motor, transmisión, precio, beneficios, especificaciones
✅ Links clickeables de Instagram y WhatsApp en sección Contacto
✅ Scrollbar oculta en miniaturas de galería
✅ Bloque de especificaciones por vehículo
✅ Supabase conectado (.env.local configurado)
✅ Página /resenas con formulario (nombre, mensaje, estrellas 1-5)
✅ Reseñas se guardan en Supabase con moderación (aprobada = false por defecto)
✅ Panel de administración en /admin con login seguro (Supabase Auth)
✅ Panel permite aprobar/rechazar reseñas
✅ Panel permite agregar/editar/eliminar autos con subida de fotos real
✅ Supabase Storage configurado (bucket: autos-imagenes, público)
✅ Fotos se suben arrastrando o seleccionando desde galería/carpeta
✅ Página /ventas con galería de clientes que ya compraron
✅ Panel /admin tiene pestaña "Ventas realizadas" para gestionar ventas
✅ Bucket ventas-imagenes creado y configurado (público, con políticas)
✅ Tabla ventas en Supabase con: id, cliente_nombre, auto_descripcion, foto_url, fecha_compra, visible, created_at
✅ Ventas se muestran solo si visible = true
✅ Foto se amplía en modal al hacer click
✅ Página principal carga autos desde Supabase (ya no usa vehiculos.js)
✅ Página individual de vehículo carga desde Supabase
✅ 10 autos migrados a tabla autos de Supabase
✅ Fotos de todos los autos subidas a Supabase Storage (bucket: autos-imagenes)
✅ URLs de fotos actualizadas en tabla autos (ya no usan rutas locales)
✅ next.config.mjs configurado para permitir imágenes desde Supabase Storage
✅ Deploy en Vercel completado — proyecto en producción
✅ Código subido a GitHub (eliascabreras410-netizen/automotora-web)
✅ Variables de entorno de Supabase configuradas en Vercel
✅ Favicon personalizado (icon.png con logo de la automotora)
✅ OG Image configurada (se muestra al compartir el link por WhatsApp/redes)
✅ Metadata Open Graph configurada en layout.js
✅ Dominio gervasiniautomoviles.com.uy comprado en NIC.UY y conectado a Vercel
✅ DNS configurado correctamente (registro A → 76.76.21.21, CNAME www → Vercel)
✅ Sitio accesible desde gervasiniautomoviles.com.uy y www.gervasiniautomoviles.com.uy
✅ Fix overflow horizontal en mobile (franja blanca al costado)
✅ Lightbox en galería de vehículo (click en foto → abre pantalla completa)
✅ Zoom con cursor en lightbox (hover → zoom x2 siguiendo el mouse)
✅ Navegación con teclado en lightbox (flechas + Escape)
✅ Miniaturas dentro del lightbox
✅ Fix fotos verticales (iPhone) en página de ventas (object-contain + aspect-ratio 3/4)

## Estructura de carpetas
src/app/
│   icon.png          ← favicon personalizado
│   globals.css
│   layout.js
│   page.js
│
├───admin/
│       AdminClient.jsx
│       page.js
│
├───components/
│       VehicleGallery.jsx
│
├───data/
│       vehiculos.js  ← ya no se usa, pendiente eliminar
│
├───lib/
│       supabase.js
│
├───resenas/
│       ResenasClient.jsx
│       page.js
│
├───ventas/
│       VentasClient.jsx
│       page.js
│
└───vehiculos/
    └───[id]/
            page.js

public/
│   og-image.png      ← imagen Open Graph para compartir en redes/WhatsApp

## Supabase
- Proyecto: Alvaro Gervasini Automoviles
- URL: https://ufnbgyfrwnmmfqpxqhdm.supabase.co
- Tablas:
  - resenas: id, nombre, mensaje, estrellas, foto_url, aprobada, created_at
  - autos: id, marca, modelo, ano, km, motor, transmision, combustible, precio, nuevo_ingreso, especificaciones[], beneficios[], imagenes[], created_at
  - ventas: id, cliente_nombre, auto_descripcion, foto_url, fecha_compra, visible, created_at
- Storage buckets:
  - autos-imagenes (público) — fotos de autos ✅ poblado con fotos reales
  - ventas-imagenes (público) — fotos de clientes con sus autos
- Auth: usuario admin creado en Supabase Authentication
- RLS desactivado en tablas: autos, ventas (resenas pendiente verificar)

## Fotos por auto en Storage
- chevrolet-montana → 6 fotos
- chevrolet-s10 → 7 fotos
- chevrolet-spark → 6 fotos
- fiat-freedom → 8 fotos
- fiat-mobi → 3 fotos
- fiat-strada-trekking → 4 fotos
- fiat-strada-working → 1 foto
- hyundai-hb20 → 7 fotos
- suran → 2 fotos
- suzuki-celerio → 3 fotos

## Vercel / Deploy
- Proyecto en Vercel: gervasiniautomoviles
- URL producción: https://gervasiniautomoviles.com.uy
- URL alternativa: https://automotora-web.vercel.app
- Repositorio GitHub: https://github.com/eliascabreras410-netizen/automotora-web
- Para actualizar producción: git add . → git commit -m "mensaje" → git push

## Credenciales (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://ufnbgyfrwnmmfqpxqhdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_... (ver archivo .env.local)

## Ubicación del proyecto
C:\Users\Dell\automotora-web

## Pendiente / próximos pasos

### 🔴 Prioridad alta
- [ ] Filtros en el stock de vehículos (por marca, año, precio, km)
- [ ] Sección "¿Por qué elegirnos?" entre el hero y los vehículos (3-4 íconos con texto)
- [ ] Animaciones de entrada al hacer scroll (fade in, slide up)

### 🟡 Prioridad media
- [ ] WhatsApp con mensaje predefinido por vehículo ("Hola, me interesa el X, ¿está disponible?")
- [ ] Contador de vehículos vendidos en el hero o cerca ("+ X vehículos vendidos")
- [ ] Skeleton loaders mientras cargan los autos desde Supabase

### 🟢 Prioridad baja
- [ ] Google Search Console — registrar sitio con dominio definitivo
- [ ] SEO por vehículo — metadatos específicos (title y description) por página de auto
- [ ] Página 404 personalizada con estilo de la automotora
- [ ] Eliminar src/app/data/vehiculos.js (ya no se usa)
- [ ] Reemplazar imágenes de collage de Instagram por fotos limpias
- [ ] Confirmar transmisión del Chevrolet Aveo
- [ ] Agregar precios reales cuando el tío los confirme
- [ ] Agregar correo electrónico en sección Contacto

## Problemas conocidos
- El precio figura como "Consultar precio" (pendiente confirmar precios reales)
- La transmisión del Chevrolet Aveo figura como "A confirmar"
- El correo en sección Contacto está pendiente
- Algunas imágenes de autos son collages de Instagram (pendiente reemplazar)

## Notas y decisiones tomadas
- Se usa Next.js con App Router (carpeta app/)
- page.js y vehiculos/[id]/page.js son Server Components que llaman a Supabase directamente (sin useEffect)
- revalidate = 60 en page.js y vehiculos/[id]/page.js (refresca cada 60 segundos)
- VentasClient.jsx y ResenasClient.jsx son Client Components ('use client')
- AdminClient.jsx es Client Component con toda la lógica del panel
- Para limpiar caché de Next.js: Remove-Item -Recurse -Force .next
- Para limpiar caché DNS de Windows: ipconfig /flushdns
- Para limpiar caché DNS de Linux: sudo systemd-resolve --flush-caches
- El número de WhatsApp es +598 99 182 849
- La ubicación del negocio es Sarandí Grande, Florida, Uruguay
- El link "Acceso administrador" está en el footer de la sección Contacto
- Las reseñas necesitan aprobación manual desde el panel antes de publicarse
- Las ventas tienen toggle de visible/oculta desde el panel
- Las fotos de autos se suben a Supabase Storage (bucket: autos-imagenes)
- Las fotos de ventas se suben a Supabase Storage (bucket: ventas-imagenes)
- Script de migración de vehiculos.js a Supabase ya fue ejecutado (10 autos)
- Script subir-fotos.mjs ejecutado exitosamente — fotos subidas desde C:\Users\Dell\Downloads
- next.config.mjs configurado con remotePatterns para ufnbgyfrwnmmfqpxqhdm.supabase.co
- Favicon: icon.png en src/app/ (logo verde del auto sobre fondo oscuro)
- OG Image: og-image.png en public/ (1200x630, se muestra al compartir links)
- Dominio: gervasiniautomoviles.com.uy — registrado en NIC.UY, vence 08/06/2027
- DNS: registro A → 76.76.21.21 (Vercel), CNAME www → vercel-dns
- Lightbox: click en foto principal abre modal pantalla completa con zoom x2 al hover
- Fotos verticales iPhone en ventas: object-contain + aspect-ratio 3/4