---
title: Frontend Coding Conventions — Patioz
description: "Convenciones de código del monorepo: Tailwind, Biome, naming, imports, commits"
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Frontend — Coding Conventions

## Estilos

- **Tailwind CSS v4** es la única fuente de estilos
- Prohibido: CSS modules, styled-components, Sass, inline styles
- `globals.css` solo para estilos base con `@apply`

## Lint & Format

- **Biome** para lint y format (JS/TS/CSS/JSON)
- Configuración en `biome.json` en raíz del monorepo
- Husky + lint-staged corre `biome check --fix` en cada commit

## TypeScript

- **Strict mode** (`strict: true`)
- `interface` para objetos públicos, `type` para unions/primitivos
- Path alias: `@/` → `src/` en todas las apps y packages

## Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos | kebab-case | `property-card.tsx` |
| Componentes | PascalCase | `PropertyCard` |
| Hooks | camelCase, `use` prefijo | `useProperties` |
| Stores (Zustand) | camelCase, `use` prefijo, `Store` sufijo | `useFilterStore` |
| Services | camelCase, `Service` sufijo | `propertyService.ts` |
| Schemas (Zod) | camelCase, `Schema` sufijo | `propertySchema` |

## Imports

- No barrel files (`index.ts`) en packages — imports explícitos
- `@/` para imports internos de la app/package
- `@mapui/package-name` para imports cross-package

## State Management

- Datos de API → TanStack React Query
- Estado de UI → Zustand
- Nunca mezclar

## Data Fetching

- Cada feature tiene su `services.ts`
- Las funciones devuelven `Promise<T>`
- Componentes nunca llaman a `api.get()` directamente

## Commits

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- PRs pequeños, un concern por PR
- Commits en inglés

## Path Aliases

Todas las apps y packages configuran `@/` → `src/` en `tsconfig.json`.
