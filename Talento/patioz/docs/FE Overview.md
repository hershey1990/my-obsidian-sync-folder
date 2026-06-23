---
title: "Frontend Overview — Patioz"
description: "Visión general del frontend: monorepo con 4 apps, 6 packages, Next.js + Vite"
actualizado: 2026-06-22
outline_status: pendiente
outline_url: null
---
# Frontend — MapUI Monorepo

## Qué es

Monorepo con **4 aplicaciones** y **6 packages compartidos** para la plataforma Patioz.

## Apps

| App | Framework | Usuarios | Estado |
|---|---|---|---|
| **mapui** | Next.js 16 (App Router) | Público y propietarios | Más desarrollada |
| **operations** | Vite + React 19 | Agentes de agencia | Wizard de 14 pasos |
| **admin** | Vite + React 19 | Staff administrativo | Mínimo (auth) |
| **basement** | Vite + React 19 | Design system showcase | Demo |

## Packages compartidos

| Package | Propósito |
|---|---|
| `@mapui/ui-core` | 35 componentes presentacionales |
| `@mapui/auth` | Autenticación con aislamiento por app |
| `@mapui/api-client` | Cliente HTTP estandarizado (axios) |
| `@mapui/domain` | Tipos y servicios de dominio |
| `@mapui/i18n` | Internacionalización (apps Vite) |
| `@mapui/utils` | Utilidades puras |

## Stack

| Capa | Tecnología |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Frameworks | Next.js 16, Vite 6 |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Routing | App Router, TanStack Router |
| Server state | TanStack React Query |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| i18n | next-intl (mapui), @mapui/i18n (Vite) |
| Testing | Playwright (e2e), Vitest (unitario) |
| Auth | Supabase Auth (aislado por app) |

## Auth Isolation

| App | Grupo | Login |
|---|---|---|
| mapui | Público / Propietarios | Standard |
| operations | Agentes | Multi-tenant (tenantSlug requerido) |
| admin | Staff | Staff-only |

Un token de una app no funciona en otra.

## Relación con el Backend

API base: `https://develop.patioz.co/api/v1`

El frontend usa el patrón "contract implicit": `services.ts` devuelve mocks durante desarrollo y se migra a `api.get()` cuando el endpoint está listo, sin cambiar la firma.
