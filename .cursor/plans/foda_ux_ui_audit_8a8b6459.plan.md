---
name: FODA UX/UI audit
overview: Analisis FODA integral del proyecto Medallo Spa enfocado en diseno UX/UI, cubriendo accesibilidad, consistencia visual, responsive, performance, idioma, interactividad y arquitectura de componentes.
todos:
  - id: a11y-quick
    content: "Fixes rapidos de accesibilidad: lang=es, bento cards keyboard, aria-labels, dialog Close→Cerrar"
    status: completed
  - id: colors-tokens
    content: Consolidar ~30 hex hardcodeados en componentes a var(--color-*) tokens
    status: completed
  - id: language-fix
    content: Corregir acentos espanoles faltantes y inconsistencias EN/ES en textos visibles
    status: completed
  - id: data-fix
    content: Corregir datos inconsistentes en spa.ts (6→3 especialistas, Lasser, direccion)
    status: completed
  - id: modal-unify
    content: Migrar CategoryServicesModal de Motion custom a Radix Dialog (focus trap, ESC, SR)
    status: completed
  - id: forms-labels
    content: Agregar label/aria-label a todos los inputs de formulario (Login, Booking, Admin)
    status: completed
  - id: images-optimize
    content: Lazy loading, srcset, alt text en imagenes (hero, bento, modals)
    status: completed
  - id: loading-states
    content: Implementar skeletons y eliminar seed-data-como-fallback
    status: completed
  - id: page-404
    content: Crear pagina 404 con diseno coherente al tema
    status: completed
  - id: font-perf
    content: Optimizar carga de fuentes (preload + font-display swap)
    status: completed
  - id: seo-basics
    content: Agregar meta description, OG tags, robots.txt, sitemap.xml
    status: completed
isProject: false
---

# FODA integral UX/UI — Medallo Spa

---

## FORTALEZAS

### 1. Identidad visual consistente y premium

- Paleta dark/gold bien definida en tokens CSS (`--color-primary: #d4af37`, `--color-background: #131313`, `--color-surface: #1c1b1b`) centralizada en [src/styles/theme.css](src/styles/theme.css)
- Tipografia display/body bien separada: Cormorant Garamond para titulos, Inter para cuerpo
- Clases utilitarias propias (`.ux-btn-primary`, `.ux-card`, `.ux-h1`, `.ux-overline`, `.ux-section`, `.ux-shell`) que mantienen coherencia entre paginas

### 2. Animaciones con proposito

- Framer Motion (`motion/react`) usado consistentemente: fade-in al scroll con `whileInView`, stagger entre cards, transiciones de paso en booking wizard
- Efecto grayscale-to-color en bento grid da identidad unica al landing
- `AnimatePresence` en FAQ accordion y paginacion de servicios para transiciones suaves

### 3. Arquitectura de layout solida

- Separacion clara: `RootLayout` → `MarketingLayout` / `BookingLayout` / `AdminLayout`
- `ScrollToTop` en [src/app/layouts/RootLayout.tsx](src/app/layouts/RootLayout.tsx) resuelve el problema de scroll en SPA
- Context de modales (`ModalProvider` / `ModalHost`) centralizado en [src/app/layouts/MarketingLayout.tsx](src/app/layouts/MarketingLayout.tsx)

### 4. Booking wizard bien estructurado

- 4 pasos lineales claros (Servicio → Horario → Datos → Pago) con indicadores visuales
- Aside de resumen persistente que refleja selecciones en tiempo real
- Validacion con Zod + React Hook Form en paso 3
- Paginacion recien implementada que controla la longitud de listas

### 5. Responsive funcional

- Breakpoints `sm:` / `md:` / `lg:` / `xl:` usados en todas las paginas
- Header pasa a hamburger menu en mobile
- Admin sidebar se oculta y aparece como overlay
- Grids adaptativos en dashboard, servicios, equipo, testimonios

### 6. PWA y browser theming

- `manifest.json`, `theme-color`, `apple-mobile-web-app-capable` en [index.html](index.html) para que la barra del navegador refleje el tema oscuro

---

## DEBILIDADES

### 1. Accesibilidad (critico)

**Bento grid cards no son accesibles por teclado**

- En [src/app/components/sections/ServicesGrid.tsx](src/app/components/sections/ServicesGrid.tsx), las tarjetas son `<motion.div onClick={...}>` sin `role="button"`, sin `tabIndex={0}`, sin `onKeyDown` handler
- Un usuario de teclado o lector de pantalla no puede interactuar con ellas

**CategoryServicesModal sin focus trap**

- [src/app/components/modals/CategoryServicesModal.tsx](src/app/components/modals/CategoryServicesModal.tsx) usa overlay + panel custom con Framer Motion
- Mientras que [ServiceDetailModal.tsx](src/app/components/modals/ServiceDetailModal.tsx) usa Radix Dialog (con focus trap, ESC, y anuncio a screen readers), el modal de categoria NO tiene focus trap — el usuario puede tabular detras del modal
- Inconsistencia arquitectural: **dos patrones de modal distintos** en la misma app

`**lang="en"` en HTML con contenido en espanol**

- [index.html](index.html) linea 2: `<html lang="en" class="dark">` — deberia ser `lang="es"`
- Esto afecta lectores de pantalla (pronuncian texto espanol con fonetica inglesa)

**Formularios sin labels asociados**

- En BookingPage, LoginPage, CitasPage, ClientesPage, ConfiguracionPage: inputs usan `placeholder` como unico indicador, sin `<label htmlFor>` o `aria-label`
- Los iconos decorativos dentro de inputs no tienen `aria-hidden="true"`

**Elementos interactivos sin labels**

- Password toggle en LoginPage: boton sin `aria-label`
- Chevrones de navegacion de fecha en CitasPage: sin `aria-label`
- Tab sidebar en ConfiguracionPage: sin `role="tablist"` / `role="tab"` / `aria-selected`
- Toggle de notificaciones: sin `role="switch"` / `aria-checked`
- Estrellas en testimonios: sin `aria-label` tipo "5 estrellas"

**Sin skip navigation link**

- Ninguna pagina tiene un "Skip to main content" para usuarios de teclado

**Dialog close button en ingles**

- [src/app/components/ui/dialog.tsx](src/app/components/ui/dialog.tsx): el boton close tiene `<span className="sr-only">Close</span>` — deberia ser "Cerrar"

### 2. Inconsistencia de idioma

**Mezcla ingles/espanol en textos visibles al usuario:**

- Hero overline: "Aesthetics & IV Vitamins" (ingles)
- ServicesGrid heading: "Curated treatments" (ingles)
- Hero scroll indicator: "Scroll" (ingles)
- Categorias: "IV Therapy", "Facials", "Aesthetic Treatments", "Body Treatments" entre parentesis
- Fuentes de leads: "Walk-in" (ingles, visible en admin y booking)
- Link "Ver la cita en admin" — "admin" en ingles

**Acentos espanoles faltantes (strings visibles al usuario):**

- "Atras" → "Atras" (falta tilde en booking/payment)
- "Duracion" → "Duracion" (booking aside)
- "Politica simple" → "Politica" (booking aside)
- "Reprogramacion" → "Reprogramacion" (booking aside)
- "telefono" → "telefono" (zod messages, forms)
- "valido" → "valido" (zod messages)
- "Busqueda" → "Busqueda" (admin clientes)
- "Proxima cita" → "Proxima" (admin clientes)
- "Lectura rapida" → "rapida" (dashboard)
- "Servicios con mas demanda" → "mas" (dashboard)
- "Configuracion", "Operacion" (tabs admin)

### 3. Colores hardcodeados fuera de tokens

**Componentes que usan hex directo en vez de CSS variables:**

- **Header.tsx**: `#0E0E0E`, `rgba(77,70,53,0.25)`, `#D0C5AF`, `#99907c`, inline gradient + boxShadow
- **Footer.tsx**: `bg-[#0e0e0e]`, `#4D4635` (link color)
- **BookingLayout.tsx**: `bg-[rgba(14,14,14,0.85)]`, inline shadow
- **AdminLayout.tsx**: avatar gradient `#d4af37`/`#f2ca50`, text `#554300`
- **QuoteSection.tsx**: `bg-[#0e0e0e]`
- **HeroSection.tsx**: gradient overlay `#131313`
- **ServicesGrid.tsx**: gradient overlay `#131313`
- **TeamSection.tsx**: avatar gradient hardcoded
- **BookingPage.tsx**: success card gradient, pagination active `#1a1400`
- **CategoryServicesModal.tsx**: overlay `bg-black/80`, active page `#1a1400`
- **LoginPage.tsx**: tab gradient, gold values

Estos valores son **los mismos tokens** definidos en `theme.css` pero escritos como hex en vez de `var(--color-*)`. Si el tema cambia, habria que buscar y reemplazar en 12+ archivos.

### 4. Inconsistencia en patron de modales


| Modal                 | Implementacion          | Focus trap | ESC                      | Anuncio a SR |
| --------------------- | ----------------------- | ---------- | ------------------------ | ------------ |
| ServiceDetailModal    | Radix Dialog            | Si         | Si (nativo)              | Si           |
| CategoryServicesModal | Custom Motion + overlay | **No**     | Solo via onClick overlay | **No**       |


Esto crea una experiencia inconsistente: uno se comporta como un modal accesible, el otro no.

### 5. Imagenes sin optimizar

- **Hero**: URL Unsplash `w=1920` cargada en todos los dispositivos (mobile tambien recibe 1920px)
- **Bento grid**: 5 imagenes Unsplash `w=800` como CSS `background-image` — no `loading="lazy"`, no `<picture>` con srcset
- **CategoryServicesModal**: mismas imagenes pero `w=1200`
- **Sin alt text**: todas son CSS backgrounds, invisibles para screen readers
- **Sin lazy loading**: todo se carga en el initial render

### 6. Carga de fuentes bloqueante

- [src/styles/fonts.css](src/styles/fonts.css) usa `@import url('https://fonts.googleapis.com/...')` — esto es render-blocking
- Deberia usar `<link rel="preload">` o `font-display: swap` explicito

### 7. Datos inconsistentes en spa.ts

- [src/app/data/spa.ts](src/app/data/spa.ts): `landingHighlights` dice **"6 Especialistas activos"** pero `teamMembers` tiene **3 personas**
- Typo en categoria: **"Laser (Lasser)"** → deberia ser "Laser" o "Laser (Laser)"
- Direccion parece placeholder: **"40-52 Junction Blvd NY 11368 (Oficina 1R / Oficina /R)"** — el "/R" parece error
- `package.json` name es `**@figma/my-make-file`** — no refleja el proyecto

### 8. Sin estados de carga explicitos

- `useSpaSnapshot()` en [src/app/lib/spaStore.ts](src/app/lib/spaStore.ts) no expone `isLoading`
- Mientras Convex hydrata, appointments/settings muestran **seed data** silenciosamente y luego "saltan" al dato real
- Clientes autenticados ven **lista vacia** momentaneamente antes de que llegue la data

### 9. Sin pagina 404

- [src/app/routes.ts](src/app/routes.ts) no define una ruta catch-all — URLs invalidas muestran pagina en blanco

---

## OPORTUNIDADES

### 1. Mejorar accesibilidad con cambios acotados

- Convertir bento cards a `<button>` o agregar `role="button"` + `tabIndex={0}` + `onKeyDown`
- Migrar CategoryServicesModal a Radix Dialog (como ServiceDetailModal)
- Cambiar `lang="en"` a `lang="es"`
- Agregar `aria-label` a todos los botones de solo icono
- Agregar `<label>` a todos los inputs de formulario

### 2. Consolidar colores en tokens

- Reemplazar los ~30 valores hex hardcodeados en componentes por `var(--color-*)` existentes
- Resultado: cualquier rebranding o light-theme futuro solo toca `theme.css`

### 3. Unificar idioma

- Decidir una politica: todo en espanol o bilingue con criterio
- Corregir todos los acentos faltantes en un solo pass
- Cambiar "Close" a "Cerrar" en dialog.tsx

### 4. Optimizar imagenes

- Usar `<img loading="lazy">` con srcset para responsiveness (300/600/1200px)
- Agregar `alt` descriptivos
- Considerar blur placeholders (LQIP) para hero

### 5. Agregar loading skeletons

- Crear componentes skeleton para cards de servicios, appointments, clientes
- Eliminar el patron de seed-data-como-fallback que confunde dato real con placeholder

### 6. Crear pagina 404

- Ruta catch-all con diseno coherente al tema dark/gold

### 7. Transiciones entre rutas

- Agregar page transition animations con `AnimatePresence` a nivel de layout

### 8. Mejorar mobile UX

- Hero image responsiva (diferentes resoluciones por breakpoint)
- Mejorar touch targets en paginacion (actualmente `h-8 w-8` / `h-9 w-9` — minimo recomendado 44x44px)
- FAQ accordion: area de toque mas generosa

### 9. SEO basico

- Agregar `<meta name="description">`, OG tags para compartir en redes
- Considerar SSR/SSG si SEO es prioridad (actualmente es SPA pura)

---

## AMENAZAS

### 1. Performance en mobile

- Hero carga imagen de 1920px en 4G — puede tardar 3-5s
- 5 imagenes de bento grid + 5 del modal = 10 imagenes Unsplash sin lazy load
- Google Fonts blocking CSS import agrega ~200-400ms al first paint
- Sin code splitting: todo el admin se carga aunque el usuario solo visite el landing

### 2. Accesibilidad legal

- Sin cumplimiento WCAG 2.1 AA: inputs sin labels, modales sin focus trap, imagenes sin alt, lang incorrecto
- Esto puede ser un riesgo legal en mercados como USA (ADA) o UE (EAA 2025)

### 3. Mantenimiento de colores

- 30+ valores hex dispersos significan que un rebranding requiere tocar 12+ archivos en vez de solo `theme.css`

### 4. SEO nulo

- SPA sin SSR, sin meta tags, sin sitemap — Google puede no indexar correctamente
- `robots.txt` y `sitemap.xml` no existen

### 5. Sin error boundaries

- Un error en cualquier componente React rompe toda la app — no hay `ErrorBoundary` ni pagina de fallback

### 6. Dependencia de CDN externo

- Imagenes dependen de Unsplash CDN; si Unsplash esta lento o caido, el landing se rompe visualmente
- Google Fonts depende de CDN de Google

---

## Matriz de prioridad (impacto vs esfuerzo)

### Alto impacto, bajo esfuerzo (hacer primero)

- Cambiar `lang="en"` a `lang="es"` en index.html
- Agregar `role="button"` + `tabIndex` + `onKeyDown` a bento cards
- Corregir acentos espanoles en ~15 strings
- Reemplazar hex hardcoded por `var()` en Header, Footer, modals
- Agregar `aria-label` a ~8 botones de solo icono
- Cambiar "Close" a "Cerrar" en dialog.tsx
- Corregir "6 Especialistas" → "3 Especialistas" en spa.ts
- Corregir "Lasser" → "Laser" en spa.ts

### Alto impacto, esfuerzo medio

- Migrar CategoryServicesModal a Radix Dialog
- Agregar `<label>` / `aria-label` a todos los forms (Login, Booking, Admin x3)
- Implementar lazy loading de imagenes
- Crear pagina 404
- Agregar loading skeletons
- Optimizar font loading (preload + swap)

### Impacto medio, esfuerzo medio

- Unificar idioma (politica EN/ES + pass completo)
- Agregar SEO meta tags
- Agregar skip navigation link
- Aumentar touch targets en paginacion
- Page transitions entre rutas
- Error boundaries

### Impacto alto, esfuerzo alto (planificar)

- Responsive images con srcset/picture
- Code splitting por ruta
- SSR/SSG para SEO
- Light theme como opcion
- Self-hosting de fuentes (eliminar dependencia Google Fonts CDN)

