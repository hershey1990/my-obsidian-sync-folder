---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "Monorepo con pnpm workspaces + Turborepo para gestionar 4 apps y 6 packages"
tags:
  - adr
---
# ADR-017: Monorepo pnpm + Turborepo

## Contexto

El frontend de Patioz necesita servir a 3 grupos de usuarios distintos (público, agentes, admin) con experiencias y stacks diferentes. Además, requiere componentes y lógica compartida entre apps (auth, UI, API client, domain types, i18n, utils).

Tres enfoques posibles: repos separados, un solo app con role-based routing, o monorepo con apps independientes y packages compartidos.

## Decisión

**Monorepo con pnpm workspaces + Turborepo.**

Estructura:
```
mapui-monorepo/
├── apps/
│   ├── mapui/        # Next.js 16 — usuarios públicos y propietarios
│   ├── operations/   # Vite + React 19 — agentes de agencia
│   ├── admin/        # Vite + React 19 — staff administrativo
│   └── basement/     # Vite + React 19 — showcase del design system
├── packages/
│   ├── ui-core/      # 35 componentes presentacionales
│   ├── auth/         # Lógica de autenticación transversal
│   ├── api-client/   # Cliente HTTP estandarizado (axios)
│   ├── domain/       # Tipos y funciones puras compartidas
│   ├── i18n/         # Internacionalización para apps Vite
│   └── utils/        # Utilidades puras
└── e2e/              # Tests Playwright
```

**Turborepo** orquesta tasks (lint, typecheck, test, build) en paralelo con caché.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Monorepo + Turborepo (elegido)** | Código compartido sin publicar npm, builds paralelos con caché, un solo CI | Complejidad inicial de configuración |
| **Repos separados** | Aislamiento total, deploys independientes | Duplicación de código, versionado de packages, múltiples CI/CD |
| **Nx** | Features avanzadas (dependency graph, affected) | Más complejo que Turborepo, sobrekill para este equipo |
| **Single app con role-based routing** | Máxima simplicidad | Acoplamiento de stacks (Next.js forzado para admin). Bundle size para usuarios que solo usan 1 rol. |

## Consecuencias

### Positivas
- **Código compartido real:** `@mapui/ui-core` se usa en las 4 apps sin publicar a npm
- **Turborepo caché:** lint y build solo reprocesan lo que cambió
- **Independencia de deploy:** cada app se puede deployar por separado
- **Cada app elige su stack:** Next.js para SEO público, Vite para dashboards internos

### Negativas
- **Configuración inicial más compleja** que un solo repo
- **pnpm + Turborepo** requiere aprendizaje del equipo

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
