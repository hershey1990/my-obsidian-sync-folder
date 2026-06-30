---
tags:
  - estela/adr
---
# 📐 Architecture Decision Records — Estela

> Ver [[Tracker]] o [[bd/ADRs|ADRs.base]] para tracking de implementación.

## 📝 Cómo crear un nuevo ADR

1. Usa la plantilla [[adr/plantilla|adr/plantilla.md]]
2. Nómbralo con el formato `###-titulo-descripitivo.md`
3. Completa las secciones: contexto, decisión, alternativas, consecuencias
4. Asigna `estado: propuesto`, `proyecto` (`estela-be` o `estela-fe`), `implementado: pendiente`

## ADRs existentes

### Core / Negocio

- [[adr/001-seleccion-idea|001 — Marketplace de Autos como idea principal]]

### Backend (estela-be)

- [[adr/002-arquitectura-stack|002 — Laravel 11 + Supabase PostgreSQL + Clean Architecture Light]]
- [[adr/004-auth-rbac|004 — Auth & RBAC con Laravel Sanctum + spatie/laravel-permission]]

### Frontend (estela-fe)

- [[adr/003-arquitectura-frontend|003 — Monorepo con 2 apps Next.js 14+ + 4 packages]]
