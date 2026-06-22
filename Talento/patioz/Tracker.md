---
tags:
  - patioz/tracker
---
# Tracker — Patioz

> Abrir `bd/ADRs.base` y `bd/Docs.base` para la vista interactiva con filtros y cards.

## ADRs pendientes de copiar

```dataview
TABLE WITHOUT ID
  file.link AS ADR,
  decision AS Decisión,
  sync_status.backend AS Backend,
  sync_status.frontend AS Frontend
FROM "Talento/patioz/adr"
WHERE tipo = "adr" AND estado = "aceptado"
  AND (sync_status.backend = "pendiente" OR sync_status.frontend = "pendiente")
SORT file.name ASC
```

## ADRs ya copiados

```dataview
TABLE WITHOUT ID
  file.link AS ADR,
  decision AS Decisión,
  sync_status.backend AS Backend,
  sync_status.frontend AS Frontend
FROM "Talento/patioz/adr"
WHERE tipo = "adr" AND estado = "aceptado"
  AND (sync_status.backend = "copiado" OR sync_status.frontend = "copiado")
SORT file.name ASC
```

## Docs pendientes de publicar en Outline

```dataview
TABLE WITHOUT ID
  file.link AS Documento,
  title AS Título,
  outline_status AS Estado
FROM "Talento/patioz/docs"
WHERE outline_status = "pendiente"
SORT file.name ASC
```

## Docs ya publicados

```dataview
TABLE WITHOUT ID
  file.link AS Documento,
  outline_url AS "URL en Outline"
FROM "Talento/patioz/docs"
WHERE outline_status = "publicado"
SORT file.name ASC
```

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

---

> Al copiar un ADR al repo, cambiar `sync_status.backend` o `.frontend` de `pendiente` a `copiado`.  
> Al publicar un doc en Outline, cambiar `outline_status` a `publicado` y llenar `outline_url`.
