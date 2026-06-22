# Architecture Decision Records

Origen canónico: vault Obsidian `Talento/patioz/adr/`.

## ADRs en este repositorio

| # | Decisión | Estado |
|---|---|---|
| 006 | Monolito Modular + BullMQ | Aceptado |
| 007 | Auth integrada con Supabase | Aceptado |
| 008 | Emails con AWS SES + Zoho | Aceptado |
| 009 | Scheduling in-house | Aceptado |
| 010 | NestJS 11 como framework | Aceptado |
| 011 | Mapas y ubicaciones (2 fases) | Aceptado |
| 012 | Module Architecture (contracts/adapters) | Aceptado |
| 013 | Inter-Module Communication (Sync DI + Async BullMQ) | Aceptado |
| 014 | i18n bilingüe (JSONB + AWS Translate) | Aceptado |
| 015 | File Storage & Processing (S3 + imgproxy-api) | Aceptado |
| 016 | Testing: TDD pragmático | Aceptado |
| maps/002 | Google Places como provider de datos | Aceptado |

## Saltos en la numeración

Los ADRs 001-005 fueron reemplazados durante la evolución del proyecto:

| Reemplazado | Por | Razón |
|---|---|---|
| 001 · Microservicios | 006 · Monolito | Demasiado complejo para el equipo actual |
| 002 · BFF Fastify | 010 · NestJS 11 | Sin DI nativa, sin guards, sin sistema de módulos |
| 003 · Auth NestJS separado | 007 · Auth integrada | Integridad referencial débil sin FKs reales |
| 004 · Next.js + Leaflet | 011 · Mapas 2 fases | Leaflet → Mapbox GL JS, búsqueda en 2 fases |
| 005 · QStash | 006 · BullMQ | Servicio externo con costo; BullMQ es interno |

El historial completo con contexto, alternativas y consecuencias está en el vault.
