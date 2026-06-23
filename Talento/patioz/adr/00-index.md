---
tags:
  - patioz/adr
---
# 📐 Architecture Decision Records

> Ver [[Tracker]] o [[bd/ADRs|ADRs.base]] para tracking de implementación.

## 📝 Cómo crear un nuevo ADR

1. Usa la plantilla [[adr/plantilla|adr/plantilla.md]]
2. Nómbralo con el formato `###-titulo-descripitivo.md`
3. Completa las secciones: contexto, decisión, alternativas, consecuencias
4. Asigna `estado: propuesto`, `proyecto`, `implementado: pendiente`

## ADRs existentes

### Backend (patioz-be)

- [[patioz/adr/001-microservicios|001 — Adopción de Microservicios]] (reemplazado por ADR-006)
- [[patioz/adr/002-bff-fastify|002 — BFF con Fastify + Clean Architecture]] (reemplazado por ADR-010)
- [[patioz/adr/003-auth-supabase|003 — Auth API con NestJS + Supabase]] (reemplazado por ADR-007)
- [[patioz/adr/004-frontend-nextjs|004 — Frontend con Next.js]] (reemplazado por ADR-011)
- [[patioz/adr/005-queue-qstash|005 — Cola de mensajería con QStash]] (reemplazado por ADR-006)
- [[patioz/adr/006-monolito-bullmq|006 — Migración a Monolito Modular + BullMQ]] (corregido por ADR-012)
- [[patioz/adr/007-auth-integration|007 — Integración de Auth en el Monolito Modular]] (corregido por ADR-010)
- [[patioz/adr/008-email-ses|008 — Envío de Emails con AWS SES + Zoho Mail]]
- [[patioz/adr/009-scheduling-inhouse|009 — Módulo de Scheduling In-House]]
- [[patioz/adr/010-nestjs-monolito|010 — NestJS 11 como Framework del Monolito Modular]]
- [[patioz/adr/011-mapas-ubicaciones|011 — Búsqueda y Verificación de Ubicaciones Geográficas]]
- [[patioz/adr/012-module-architecture|012 — Estructura de Módulo: Repository Pattern con contracts/adapters]]
- [[patioz/adr/013-inter-module-communication|013 — Estrategia de Comunicación entre Módulos]]
- [[patioz/adr/014-i18n-bilingual-content|014 — Estrategia de Contenido Bilingüe (JSONB + AWS Translate)]]
- [[patioz/adr/015-file-storage-processing|015 — Arquitectura de Almacenamiento y Procesamiento de Archivos]]
- [[patioz/adr/016-testing-strategy|016 — Estrategia de Testing: TDD Pragmático]]
- [[patioz/adr/maps/001-mapbox-renderer|maps/001 — Mapbox GL JS como Renderer del Mapa]]
- [[patioz/adr/maps/002-google-places-provider|maps/002 — Google Places como Provider de Datos]]

### Frontend (patioz-fe)

- [[patioz/adr/017-monorepo-turborepo|017 — Monorepo pnpm + Turborepo]]
- [[patioz/adr/018-apps-user-groups|018 — 4 Apps para 3 Grupos de Usuarios con Auth Isolation]]
- [[patioz/adr/019-nextjs-vite-split|019 — Next.js 16 (mapui) + Vite (operations/admin/basement)]]
- [[patioz/adr/020-contract-implicit|020 — Patrón Contract Implicit (services.ts)]]
- [[patioz/adr/021-state-management|021 — State Management: React Query + Zustand]]
- [[patioz/adr/022-ui-core-library|022 — @mapui/ui-core: 35 Componentes Presentacionales]]
- [[patioz/adr/023-tailwind-v4|023 — Tailwind CSS v4 como Única Fuente de Estilos]]
- [[patioz/adr/024-create-property-wizard|024 — Wizard Create-Property de 14 Pasos]]
