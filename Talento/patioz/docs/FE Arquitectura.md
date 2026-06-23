---
title: Frontend Arquitectura — Patioz
description: "Arquitectura del monorepo: apps, packages, state management, data fetching"
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Frontend — Arquitectura

## Estructura del monorepo

```
mapui-monorepo/
├── apps/
│   ├── mapui/        # Next.js 16, App Router, next-intl
│   ├── operations/   # Vite + React 19, TanStack Router
│   ├── admin/        # Vite + React 19, TanStack Router
│   └── basement/     # Vite + React 19, showcase
├── packages/
│   ├── ui-core/      # Componentes presentacionales
│   ├── auth/         # Auth transversal
│   ├── api-client/   # HTTP client (axios)
│   ├── domain/       # Tipos y funciones puras
│   ├── i18n/         # i18n para apps Vite
│   └── utils/        # Utilidades puras
├── e2e/              # Playwright
├── supabase/         # Config Supabase
├── turbo.json        # Pipeline de build
└── pnpm-workspace.yaml
```

## State Management

| Tipo de estado | Herramienta | Dónde vive |
|---|---|---|
| Datos de API | TanStack React Query | Caché automática, re-fetch |
| UI y filtros | Zustand | Stores por dominio |

Regla: nunca datos de API en Zustand. Nunca estado de UI en React Query.

## Data Fetching — Contract Implicit

Cada feature tiene un `services.ts` que es el único punto de contacto con la API:

```typescript
// HOY: mock
export async function getProperties(): Promise<Property[]> {
  return Promise.resolve(MOCK_PROPERTIES);
}

// MAÑANA: API real (misma firma)
export async function getProperties(): Promise<Property[]> {
  return api.get<Property[]>("/api/v1/properties").then(r => r.data);
}
```

Los componentes nunca llaman a `api.get()` directamente.

## Path Aliases

Todas las apps y packages usan `@/` → `src/` para imports internos.

## Módulo de Auth

`@mapui/auth` centraliza la lógica de autenticación. Cada app configura:
- URL de auth (`AUTH_API_URL`)
- Grupo de usuario (público, agente, staff)

Las sesiones están aisladas por app.
