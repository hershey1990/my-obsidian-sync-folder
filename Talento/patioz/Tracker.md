---
tags:
  - patioz/tracker
---
# Tracker — Patioz

## ADRs

![[bd/ADRs.base]]

Al copiar un ADR al repo, cambiar `sync_status.backend` o `.frontend` de `pendiente` a `copiado` directamente en la tabla.

---

## Docs

![[bd/Docs.base]]

Al publicar un doc en Outline, cambiar `outline_status` a `publicado` y llenar `outline_url` directamente en la tabla.

---

## Checklist de copia

### ADRs → Backend (`patioz-api-monolith/docs/adr/`)

- [ ] 006 · Monolito + BullMQ
- [ ] 007 · Auth integrada
- [ ] 008 · Email SES
- [ ] 009 · Scheduling
- [ ] 010 · NestJS 11
- [ ] 011 · Mapas y ubicaciones
- [ ] 012 · Module Architecture
- [ ] 013 · Inter-Module Communication
- [ ] 014 · i18n
- [ ] 015 · File Storage
- [ ] 016 · Testing
- [ ] maps/002 · Google Places

### ADRs → Frontend (`patioz-fe/docs/adr/`)

- [ ] maps/001 · Mapbox Renderer

### Docs → Outline (`wiki.gettalento.com`)

- [ ] Overview
- [ ] Arquitectura
- [ ] API Reference
- [ ] Auth & RBAC
- [ ] Deploy
- [ ] File Processing
- [ ] i18n & Traducción
- [ ] Setup Local
- [ ] Testing
- [ ] Troubleshooting
- [ ] Coding Conventions
- [ ] Decision Log
