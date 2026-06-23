---
title: Frontend Setup Local — Patioz
description: Cómo levantar el monorepo MapUI en desarrollo local
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Frontend — Setup Local

## Requisitos

- Node.js >= 20
- pnpm 10

## Instalación

```bash
git clone <repo-url> mapui
cd mapui
pnpm install
```

## Variables de entorno

```bash
cp .env.example .env.local
```

Variables para desarrollo local:

```env
# Auth API (backend NestJS)
NEXT_PUBLIC_AUTH_API_URL=http://localhost:4000
VITE_AUTH_API_URL=http://localhost:4000
```

## Iniciar apps

```bash
# Todas las apps en paralelo
pnpm dev

# O una app específica
pnpm --filter mapui dev          # http://localhost:3000
pnpm --filter operations dev      # http://localhost:5173
pnpm --filter admin dev           # http://localhost:5174
pnpm --filter basement dev        # http://localhost:5175
```

## Turborepo tasks

```bash
pnpm lint         # Biome en todas las apps y packages
pnpm typecheck    # TypeScript en todas las apps y packages
pnpm test         # Vitest unitarios
pnpm test:e2e     # Playwright e2e
pnpm build        # Build de producción
```

## Puertos por defecto

| App | Puerto |
|---|---|
| mapui | 3000 |
| operations | 5173 |
| admin | 5174 |
| basement | 5175 |
| Backend (NestJS) | 4000 |

## Git hooks

Husky + lint-staged corre `biome check --fix` en cada commit. Commitlint valida conventional commits.
