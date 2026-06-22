---
tags:
  - patioz/adr
---
# 📐 Architecture Decision Records

Índice de todas las decisiones arquitectónicas documentadas para Patioz.

```dataview
TABLE
    fecha AS "Fecha",
    decision AS "Decisión",
    estado AS "Estado"
FROM "patioz/adr"
WHERE tipo = "adr"
SORT file.name ASC
```

---

## 📝 Cómo crear un nuevo ADR

1. Usa la plantilla [[Plantilla de ADR]] o copia [[patioz/adr/plantilla|patioz/adr/plantilla.md]]
2. Nómbralo con el formato `###-titulo-descripitivo.md` (ej. `006-select-database.md`)
3. Completa todas las secciones (contexto, decisión, alternativas, consecuencias)
4. Asigna un estado inicial: `propuesto` → `aceptado` | `rechazado` | `reemplazado`

## ADRs existentes

- [[patioz/adr/001-microservicios|001 — Adopción de Microservicios]]
- [[patioz/adr/002-bff-fastify|002 — BFF con Fastify + Clean Architecture]]
- [[patioz/adr/003-auth-supabase|003 — Auth API con NestJS + Supabase]]
- [[patioz/adr/004-frontend-nextjs|004 — Frontend con Next.js]] (reemplazado por ADR-011)
- [[patioz/adr/011-mapas-ubicaciones|011 — Búsqueda y Verificación de Ubicaciones Geográficas]]
- [[patioz/adr/005-queue-qstash|005 — Cola de mensajería con QStash]]
- [[patioz/adr/006-monolito-bullmq|006 — Migración a Monolito Modular + BullMQ]]
- [[patioz/adr/007-auth-integration|007 — Integración de Auth en el Monolito Modular]]
- [[patioz/adr/008-email-ses|008 — Envío de Emails con AWS SES + Zoho Mail]]
- [[patioz/adr/009-scheduling-inhouse|009 — Módulo de Scheduling In-House (no cal.com)]]
- [[patioz/adr/010-nestjs-monolito|010 — NestJS 11 como Framework del Monolito Modular]]
