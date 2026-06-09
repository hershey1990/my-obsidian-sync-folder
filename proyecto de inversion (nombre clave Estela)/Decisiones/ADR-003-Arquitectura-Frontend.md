---
title: "ADR-003: Arquitectura Frontend"
status: "aceptado"
date: "2026-06-09"
tags:
  - decision
  - arquitectura
  - frontend
  - nextjs
---

# ADR-003: Arquitectura Frontend

## Contexto

Se requiere definir la arquitectura frontend para el Marketplace de Autos (Proyecto Estela). El frontend debe cubrir 3 experiencias distintas:

1. **Web Pública** — Landing, búsqueda, detalle de auto, comparación, dealers, dashboard de usuario, auth
2. **Admin Panel** — Moderar listings/users/dealers, gestionar catálogo de modelos, analytics
3. **Dealer Dashboard** — Inventario, planes, suscripción

El stack base fue definido en ADR-002: Next.js 14+ App Router, Tailwind CSS, shadcn/ui, Vercel, auth vía BFF proxy con Laravel Sanctum.

## Decisión: Monorepo con 2 aplicaciones Next.js

### Estructura del repositorio

```
estela/
  apps/
    web/                          # Next.js 14+ — Web pública + dealer + auth
    admin/                        # Next.js 14+ — Backoffice (admin.estela.com)
  packages/
    ui/                           # @estela/ui — Componentes base (shadcn/ui + custom)
    types/                        # @estela/types — Interfaces TypeScript compartidas
    utils/                        # @estela/utils — Formateo, validación, constantes
    config/                       # @estela/config — ESLint, TypeScript, Tailwind presets
```

### ¿Por qué 2 apps en vez de una?

| Criterio | Misma app | Apps separadas |
|----------|-----------|----------------|
| Bundle público | Admin libs contaminan | Cero contaminación |
| Deploy | Un deploy para todo | Independiente por app |
| Seguridad | Mismo dominio | Dominio aislado |
| Ciclo de desarrollo | Acoplado | Paralelo |
| Stack futuro | Atado a Next.js | Admin puede migrar a Vite |

Para un equipo de 7 personas, la separación reduce riesgo: un deploy de admin no afecta la web pública y viceversa. El costo es bajo porque el monorepo ya provee los packages compartidos.

### Routing

```
estela.com                (apps/web — Next.js con RSC)

/                         → Landing (RSC, ISR)
/search                   → SearchPage (RSC con filtros vía searchParams)
/cars/[id]                → CarDetailPage (RSC, ISR)
/compare                  → ComparePage (Client Component)
/dealers                  → DealersListPage (RSC)
/dealers/[id]             → DealerProfilePage (RSC)
/auth/login               → LoginPage (Client)
/auth/register            → RegisterPage (Client)
/account                  → UserDashboard (Client, auth)
/account/favorites        → FavoritesPage (Client)
/account/profile          → ProfilePage (Client)
/dealer                   → DealerDashboard (Client, role=dealer)
/dealer/inventory         → InventoryList (Client)
/dealer/inventory/new     → PublishCarWizard (Client, multi-step)
/dealer/inventory/[id]/edit → EditCar (Client)
/dealer/plans             → PlansPage (Client)

admin.estela.com          (apps/admin — Next.js, client-heavy)

/admin                    → Dashboard (Client, role=admin)
/admin/listings           → ModerateListings (Client)
/admin/users              → ManageUsers (Client)
/admin/dealers            → ManageDealers (Client)
/admin/models             → ModelCatalog (Client)
/admin/analytics          → AnalyticsPage (Client)
```

### Middleware (auth + roles)

```
apps/web/middleware.ts:
  /account/*     → redirect a /auth/login si !auth
  /dealer/*      → redirect si role ∉ {dealer, admin}
  /auth/*        → redirect a / si ya auth

apps/admin/middleware.ts:
  /*             → redirect a estela.com/auth/login si !auth
  /*             → 403 si role !== admin
```

Ambos apps leen la misma httpOnly cookie en dominio `.estela.com`.

### Capa de datos

```
┌──────────────────────────────────────────────┐
│         React Server Components              │
│  (Landing, Search, CarDetail, Dealers)       │
│  → fetch() directo a Laravel API             │
│  → Cookie se envía automáticamente (server)   │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│      Client Components (dashboards)          │
│  → TanStack Query (server state)             │
│  → Mutations via api-client.ts               │
│  → Optimistic updates                        │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│         API Client (lib/api-client.ts)       │
│  → Fetch wrapper con:                        │
│    - Base URL desde NEXT_PUBLIC_API_URL      │
│    - Cookie forwarding (credentials: include)│
│    - Error handling consistente              │
│    - Tipado con @estela/types                │
└──────────────────────────────────────────────┘
```

### Estado cliente (Zustand — solo estado no-server)

| Store | Propósito |
|-------|-----------|
| `useAuthStore` | User, role, token status |
| `useSearchStore` | Filtros activos, paginación |
| `useCompareStore` | Autos en cola de comparación |
| `useUIStore` | Sidebar, modals, toasts |

TanStack Query maneja todo el estado del servidor (listados, detalles, inventario, etc.).

### Publish flow (dealer — multi-step wizard)

| Paso | Contenido | Componente |
|------|-----------|------------|
| 1. Datos básicos | Brand, model, year, version, transmisión, fuel, engine, km, price | `BasicInfoStep` |
| 2. Fotos | Upload múltiple (↗ Laravel → Supabase Storage) | `PhotosStep` |
| 3. Condition checklist | 4 categorías con items y score 1-5 | `ChecklistStep` |
| 4. Review | Resumen completo + publicar | `ReviewStep` |

Cada paso persiste en estado local (Zustand o React context). Al paso 4 se envía todo via TanStack Query mutation.

### Packages compartidos

**@estela/ui** — shadcn/ui components + custom:
- `Button`, `Input`, `Select`, `Card`, `Badge`
- `DataTable` (tanstack-table wrapper)
- `CarCard`, `SearchBar`, `Gallery`, `ImageUpload`
- `Chart` (Recharts wrapper, solo en admin)
- `Form` primitives (react-hook-form + zod)

**@estela/types** — interfaces TS:
- `Car`, `CarPhoto`, `ConditionChecklist`, `ConditionScore`
- `User`, `Dealer`, `Comparison`
- `APIResponse<T>`, `PaginatedResponse<T>`
- Enums: `CarStatus`, `UserRole`, `TransmissionType`, `FuelType`

**@estela/utils** — funciones puras:
- `formatPrice(amount: number): string`
- `formatKilometers(km: number): string`
- `validators`: `isValidPhone`, `isValidPrice`
- `constants`: `BRANDS`, `FUEL_TYPES`, `TRANSMISSION_TYPES`
- `cn()` — clsx + tailwind-merge

### Componentes por dominio

```
apps/web/src/components/
  ui/                     # shadcn/ui base
  shared/                 # Header, Footer, SEO Head
  public/                 # HeroSection, SearchFilters, CarCard, CompareTable
  dealer/                 # InventoryTable, PublishWizard, PlanCard
  account/                # ProfileForm, FavoritesList
  auth/                   # LoginForm, RegisterForm

apps/admin/src/components/
  ui/                     # shadcn/ui base (puede diferir en versión)
  shared/                 # AdminLayout, Sidebar, DataTable
  listings/               # ModerateTable, ListingReviewCard
  users/                  # UserTable, UserDetailModal
  dealers/                # DealerTable, DealerDetail
  models/                 # ModelForm, ModelTable
  analytics/              # RevenueChart, UserGrowthChart, ListingsChart
```

## Consecuencias

1. **Dos deploys en Vercel** — `apps/web` → estela.com, `apps/admin` → admin.estela.com. CI/CD independientes.
2. **Auth compartida** — httpOnly cookie en `.estela.com`. Ambos apps leen la misma cookie y validan contra Laravel.
3. **Paquetes compartidos** — Los 4 packages (`ui`, `types`, `utils`, `config`) se publican en el monorepo y se referencian via workspace protocol (`"@estela/ui": "workspace:*"`).
4. **Admin no tiene SSR** — Todo es `'use client'`. Next.js se usa por consistencia de stack, no por SSR. Build más rápido, sin ISR/SSG.
5. **Multi-step wizard** — Más overhead inicial que un form simple, pero UX superior para el dealer. Los steps pueden reutilizarse para edición.
6. **Upload via Laravel** — Mayor seguridad (validación en backend) a costa de latencia extra. Se puede optimizar post-MVP con presigned URLs.

## Costo adicional de infraestructura

| Item | Costo |
|------|-------|
| Vercel Pro (ya incluido) | $20/mo (cubre ambos proyectos) |
| Dominio admin.estela.com | $0 (subdominio) |
| **Total adicional** | **$0/mo** |

