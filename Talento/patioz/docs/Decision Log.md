---
title: "Decision Log — Patioz"
description: "Historial de decisiones técnicas BE y FE y su impacto en el producto (para PM, PO y stakeholders)"
actualizado: 2026-06-22
outline_status: pendiente
outline_url: null
---
# Decision Log

Historial curado de decisiones arquitectónicas. Para PM, PO y stakeholders.

## Backend (NestJS 11)

| ADR | Decisión | Por qué | Impacto en producto |
|---|---|---|---|
| 006 | Monolito Modular + BullMQ | Microservicios demasiado complejos para 2 devs | Features más rápido, onboarding en días |
| 007 | Auth integrada con Supabase | Integridad referencial real | Login y permisos en el mismo sistema |
| 008 | Emails con AWS SES | $0.10/1000 emails | Notificaciones transaccionales sin costo |
| 010 | NestJS 11 | DI nativa, guards, ecosistema | Código consistente, devs entienden todo |
| 011 | Mapas en 2 fases | Bajar costos Google de $500+ a $85/mes | Mapa interactivo sin explotar presupuesto |
| 014 | JSONB bilingüe + AWS Translate | Nicaragua (ES) + inversionistas (EN) | Plataforma en 2 idiomas sin fricción |

## Frontend (MapUI Monorepo)

| ADR | Decisión | Por qué | Impacto en producto |
|---|---|---|---|
| 017 | Monorepo pnpm + Turborepo | Código compartido real entre 4 apps | Consistencia visual total, builds rápidos |
| 018 | 3 apps para 3 grupos de usuarios | Auth isolation, stack óptimo por grupo | Público busca propiedades, agentes gestionan, admin administra |
| 019 | Next.js (público) + Vite (agentes/admin) | SEO para propiedades, velocidad para dashboards | Propiedades indexadas en Google, dashboard rápido |
| 020 | Contract implicit pattern | Frontend avanza sin esperar backend | Features listas con mocks, migración a real en 2 líneas |
| 021 | React Query + Zustand | Caché automática de API, stores livianas para UI | App rápida, sin datos duplicados |
| 022 | 35 componentes UI compartidos | Consistencia visual en 4 apps | Misma experiencia visual en público, agentes y admin |
| 023 | Tailwind CSS v4 única fuente | Sin divergencia de estilos | Diseño consistente, sin CSS huérfano |
| 024 | Wizard create-property de 14 pasos | 50+ campos en un form es inusable | Agentes guiados paso a paso, progreso parcial |

## Decisiones reemplazadas

| ADR | Decisión original | Reemplazada por | Razón |
|---|---|---|---|
| 001 | Microservicios | 006 · Monolito | Demasiado complejo para 2 devs |
| 002 | Fastify como BFF | 010 · NestJS 11 | Sin DI nativa, sin guards |
| 003 | Auth NestJS separado | 007 · Auth integrada | Integridad referencial débil |
| 004 | Next.js + Leaflet | 011 · Mapas 2 fases | Mapbox GL JS mejor calidad visual |
| 005 | QStash | 006 · BullMQ | Servicio externo con costo |
