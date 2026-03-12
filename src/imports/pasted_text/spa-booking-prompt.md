Aquí está el prompt actualizado con el stack moderno:

---

```
# ROL

Eres un diseñador UX/UI Senior con 15+ años de experiencia trabajando con marcas Fortune 500, 
S&P 500 y Forbes. Tu trabajo combina dirección de arte de lujo, arquitectura de información 
impecable y código frontend de producción. Has diseñado para marcas como Four Seasons, La Mer, 
Clinique La Prairie y Dior Beauty. Cada píxel que produces comunica exclusividad, confianza 
y conversión.

Además eres Senior Full-Stack Engineer especializado en el ecosistema Next.js/React moderno, 
con dominio absoluto de Server Components, App Router, y patrones de arquitectura enterprise.

---

# PROYECTO

Diseña e implementa el sitio web completo de un SPA DE BIENESTAR Y ESTÉTICA de alto nivel 
usando Next.js 15 con App Router, React 19, TypeScript estricto y las últimas tecnologías 
del ecosistema moderno.

---

# STACK TECNOLÓGICO OBLIGATORIO

**Core:**
- Next.js 15 (App Router, Server Components por defecto)
- React 19 (useActionState, useOptimistic, use())
- TypeScript 5.x con strict: true (zero "any", tipos explícitos en todo)

**Styling:**
- Tailwind CSS v4 (nueva sintaxis CSS-first con @theme)
- Framer Motion v11 para animaciones y micro-interacciones
- CSS Variables para design tokens

**UI Components:**
- shadcn/ui (componentes base accesibles, sin estilos genéricos)
- Radix UI primitives donde se necesite control total
- Lucide React para iconografía

**Formularios & Validación:**
- React Hook Form v7 con resolvers
- Zod v3 para schemas de validación end-to-end (compartidos client/server)

**Base de Datos & Backend:**
- Prisma ORM con PostgreSQL (schema completo incluido)
- Next.js Server Actions para mutaciones (sin API routes donde sea posible)
- Optimistic updates con useOptimistic de React 19

**Pagos:**
- Stripe (con @stripe/stripe-js + stripe en server)
- Webhook handler en /api/webhooks/stripe

**Estado Global:**
- Zustand para estado client-side ligero
- React Query (TanStack Query v5) para server state y cache

**Charts (CRM):**
- Recharts v2 para visualizaciones del dashboard

**Autenticación:**
- NextAuth.js v5 (Auth.js) para panel admin/CRM

**Email:**
- Resend + React Email para confirmaciones de cita

---

# ARQUITECTURA DE CARPETAS

Implementa esta estructura exacta:

```
src/
├── app/
│   ├── (marketing)/          # Route group público
│   │   ├── page.tsx          # Landing principal
│   │   ├── servicios/
│   │   ├── nosotros/
│   │   └── layout.tsx
│   ├── (booking)/            # Route group reservas
│   │   ├── agendar/
│   │   │   ├── page.tsx
│   │   │   └── [servicioId]/
│   │   └── confirmacion/
│   ├── (admin)/              # Route group CRM/admin
│   │   ├── dashboard/
│   │   ├── citas/
│   │   └── clientes/
│   └── api/
│       ├── webhooks/stripe/
│       └── cron/recordatorios/
├── components/
│   ├── ui/                   # shadcn base
│   ├── sections/             # Secciones del landing
│   │   ├── HeroSection.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── BookingSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CRMSourceCapture.tsx
│   ├── booking/              # Flujo de agendamiento
│   └── admin/                # Dashboard CRM
├── lib/
│   ├── actions/              # Server Actions
│   │   ├── booking.actions.ts
│   │   ├── payment.actions.ts
│   │   └── crm.actions.ts
│   ├── db/
│   │   └── schema.prisma
│   └── validations/
│       └── booking.schema.ts # Zod schemas compartidos
├── types/
│   └── index.ts              # Tipos globales
└── hooks/
    └── useBooking.ts
```

---

# SERVICIOS A IMPLEMENTAR

Crea un tipo TypeScript `Service` con las siguientes entidades:

```typescript
// Incluir TODAS estas categorías y servicios
SUEROTERAPIA: ["Alivio de dolores", "Refuerzo inmunológico", 
               "Recuperación de fatiga", "Sueros con vitaminas"]

FACIAL: ["Rejuvenecimiento", "Plasma & Vitaminas", "Limpieza profunda", 
         "Anti envejecimiento", "Limpiezas faciales", "Exosomas", "Botox"]

CORPORAL: ["Reducción de medidas", "Masajes terapéuticos", 
           "Moldeamiento corporal"]

LÁSER: ["Eliminación de tatuajes", "Cicatrices", "Estrías"]
```

---

# FUNCIONALIDADES REQUERIDAS

## 1. LANDING PAGE (Server Component)
- Hero con parallax via Framer Motion
- Grid de servicios con animaciones stagger al scroll (Intersection Observer + Framer)
- Galería del spa con lightbox
- Sección Quiénes somos, Misión, Visión
- Cards del equipo profesional
- Testimonios con schema.org markup
- FAQ con Accordion de Radix UI
- CTA flotante WhatsApp (Client Component)
- Botón sticky "Agendar cita"

## 2. FLUJO DE AGENDAMIENTO (3 pasos max)
Paso 1: Selección de servicio (con filtros por categoría)
Paso 2: Calendario interactivo + hora disponible
Paso 3: Datos personales + fuente de captación + pago

- Implementar con URL state (nuqs) para que cada paso sea compartible
- Validación con Zod en cliente y Server Action
- Optimistic UI con useOptimistic al confirmar
- Envío de email de confirmación con React Email + Resend

## 3. PAGOS CON STRIPE
- Checkout embebido (Stripe Elements) para pagar al agendar
- O pago parcial (seña) + resto en el spa
- Webhook que actualiza estado de la cita en DB
- Página de éxito/fallo con metadata de la sesión

## 4. CRM — TRACKING DE ORIGEN
Campo obligatorio en formulario de agendamiento:
```typescript
type CanalOrigen = 
  | "facebook" 
  | "instagram" 
  | "whatsapp" 
  | "google" 
  | "referido" 
  | "otro"
```

Dashboard admin (/admin/dashboard) con:
- Gráfica de dona: distribución por canal (Recharts)
- Gráfica de línea: citas por semana
- KPIs: total citas, ingresos del mes, tasa de conversión
- Tabla de clientes con fuente de origen filtrable

## 5. PANEL ADMIN
- Autenticado con Auth.js (credentials o Google OAuth)
- Lista de citas con estados: pendiente / confirmada / completada / cancelada
- Vista de cliente con historial de servicios y canal de origen
- Export CSV de clientes con su canal

---

# SCHEMA PRISMA (implementar completo)

```prisma
model Cliente {
  id           String   @id @default(cuid())
  nombre       String
  email        String   @unique
  telefono     String
  canalOrigen  CanalOrigen
  createdAt    DateTime @default(now())
  citas        Cita[]
}

model Cita {
  id          String      @id @default(cuid())
  clienteId   String
  servicioId  String
  fecha       DateTime
  estado      EstadoCita  @default(PENDIENTE)
  pagoId      String?
  notas       String?
  createdAt   DateTime    @default(now())
  cliente     Cliente     @relation(fields: [clienteId], references: [id])
  servicio    Servicio    @relation(fields: [servicioId], references: [id])
}

model Servicio {
  id          String    @id @default(cuid())
  nombre      String
  categoria   Categoria
  descripcion String
  precio      Float
  duracion    Int       // minutos
  activo      Boolean   @default(true)
  citas       Cita[]
}

enum CanalOrigen { FACEBOOK INSTAGRAM WHATSAPP GOOGLE REFERIDO OTRO }
enum EstadoCita { PENDIENTE CONFIRMADA COMPLETADA CANCELADA }
enum Categoria { SUEROTERAPIA FACIAL CORPORAL LASER }
```

---

# DISEÑO VISUAL

**Estética:** Luxury Wellness — editorial oscuro con dorados. 
Referencia: spa Aman, clínicas estéticas suizas, La Mer flagship stores.

**Design Tokens (Tailwind v4 @theme):**
```css
@theme {
  --color-obsidian: #0D0D0D;
  --color-champagne: #C9A96E;
  --color-ivory: #F5F0E8;
  --color-blush: #D4A0A0;
  --color-smoke: #1A1A1A;
  --font-display: "Cormorant Garamond", serif;
  --font-body: "Jost", sans-serif;
}
```

**Animaciones con Framer Motion:**
- Stagger reveal en servicios al entrar al viewport
- Parallax en hero (useScroll + useTransform)
- Hover en cards: scale + glow dorado + descripción slide-up
- Cursor personalizado: círculo dorado que sigue el mouse
- Page transitions con AnimatePresence
- Número KPIs con animación de conteo (useMotionValue)

**Layout:**
- Secciones asimétricas, grid roto
- Overlapping elements decorativos
- Líneas doradas separadoras animadas
- Glassmorphism en cards del equipo

---

# CALIDAD DE CÓDIGO

- Zero `any` en TypeScript — tipos explícitos en props, server actions, API responses
- Server Components por defecto, `"use client"` solo donde sea necesario
- Error boundaries en secciones críticas (booking, pago)
- Loading.tsx y error.tsx en cada route segment
- Metadata SEO completa en cada page.tsx (title, description, OG, Twitter cards)
- next/image para todas las imágenes con blur placeholder
- ISR (revalidate) en páginas de servicios
- Accesibilidad: aria-labels, roles semánticos, keyboard navigation

---

# ARCHIVOS A GENERAR

Entrega todos estos archivos con código completo y funcional:

1. `schema.prisma` — Schema completo de base de datos
2. `app/(marketing)/page.tsx` — Landing principal
3. `components/sections/HeroSection.tsx` — Hero con parallax
4. `components/sections/ServicesGrid.tsx` — Grid animado de servicios
5. `app/(booking)/agendar/page.tsx` — Flujo de agendamiento
6. `lib/actions/booking.actions.ts` — Server Actions de reservas
7. `lib/validations/booking.schema.ts` — Schemas Zod compartidos
8. `lib/actions/payment.actions.ts` — Integración Stripe
9. `app/api/webhooks/stripe/route.ts` — Webhook Stripe
10. `app/(admin)/dashboard/page.tsx` — Dashboard CRM con gráficas
11. `components/admin/CRMCharts.tsx` — Recharts visualizations
12. `emails/ConfirmacionCita.tsx` — Template React Email
13. `types/index.ts` — Todos los tipos TypeScript globales
14. `tailwind.config.ts` — Config Tailwind v4 con design tokens
15. `package.json` — Dependencias exactas con versiones

---

# CRITERIO DE ÉXITO

✅ TypeScript compila sin errores (tsc --noEmit limpio)
✅ Lighthouse Performance > 95 en desktop
✅ Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
✅ Flujo de agendamiento completo en ≤ 3 clics
✅ CRM captura y visualiza el canal de origen de cada cliente
✅ Pago con Stripe end-to-end funcional
✅ Se ve como un proyecto de $25,000 USD
✅ Código que cualquier dev senior aprobaría en code review
```

---

**Tips de uso:**

- Pégalo en una conversación nueva con Claude y pídele que empiece por los archivos más críticos: `schema.prisma` → `types/index.ts` → Server Actions → componentes
- Si Claude empieza a truncar, dile: *"Continúa con el siguiente archivo sin resumir"*
- Puedes pedirle que genere archivo por archivo en orden para máxima calidad

Sin base de datos, sólo mock front-end