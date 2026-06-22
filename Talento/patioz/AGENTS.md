# AGENTS.md — Guía de navegación para Patioz

> Contexto para asistentes de IA (Claude, Cline, etc.) y desarrolladores humanos.
> Este archivo describe la estructura, convenciones y reglas del vault `Talento/patioz/`.

---

## 📁 Estructura del vault

```
Talento/patioz/
├── AGENTS.md              ← Este archivo. Guía de navegación y reglas.
├── Patioz.md              ← Landing: resumen, navegación, stack, glosario
├── Tracker.md             ← Tracking de ADRs y Docs (embebe bd/*.base)
├── adr/                   ← Architecture Decision Records
│   ├── 00-index.md        ← Índice de todos los ADRs
│   ├── plantilla.md       ← Plantilla para crear nuevos ADRs
│   ├── 001-005 ...        ← (reemplazados)
│   ├── 006-016 ...        ← ADRs activos
│   └── maps/              ← Sub-ADRs de mapas
├── bd/                    ← Bases de datos (tracking sync + Outline)
│   ├── ADRs.base          ← ADRs: qué copiar a BE/FE, estado de copia
│   ├── Docs.base          ← Docs: qué publicar en Outline, estado
│   └── Decisiones.base    ← Vista combinada ADRs + Docs
└── docs/                  ← Documentación pulida para exportar a Outline
    ├── Overview.md
    ├── Arquitectura.md
    ├── API Reference.md
    ├── Setup Local.md
    ├── Deploy.md
    ├── Auth & RBAC.md
    ├── i18n & Traducción.md
    ├── File Processing.md
    ├── Testing.md
    ├── Troubleshooting.md
    ├── Coding Conventions.md
    └── Decision Log.md
```

---

## 🧭 Cómo navegar

### Si buscas...

| Tópico | Ir a |
|---|---|
| **Resumen general y glosario** | `Patioz.md` |
| **Arquitectura general del sistema** | `docs/Overview.md` o `docs/Arquitectura.md` |
| **Decisiones arquitectónicas (por qué se hizo X)** | `adr/` — leer `adr/00-index.md` primero |
| **Tracking de ADRs y Docs (qué copiar, qué publicar)** | `Tracker.md` o `bd/ADRs.base`, `bd/Docs.base` |
| **Setup local (cómo levantar el proyecto)** | `docs/Setup Local.md` |
| **Cómo desplegar** | `docs/Deploy.md` |
| **Problemas conocidos** | `docs/Troubleshooting.md` |
| **Definición de términos del dominio** | `Patioz.md` |
| **Auth / login / permisos** | `docs/Auth & RBAC.md` + `adr/007-auth-integration.md` |
| **i18n / Traducción** | `docs/i18n & Traducción.md` + `adr/014-i18n-bilingual-content.md` |
| **Módulo de archivos / imágenes** | `docs/File Processing.md` + `adr/015-file-storage-processing.md` |
| **Testing** | `docs/Testing.md` + `adr/016-testing-strategy.md` |

### Convención de nombres

| Prefijo | Contenido |
|---|---|
| `Patioz.md` | Landing page con resumen y glosario |
| `adr/###-*` | Decisiones arquitectónicas, numeradas secuencialmente |
| `bd/*.base` | Bases de Obsidian para tracking interactivo |
| `docs/*.md` | Documentación pulida para exportar a Outline |

---

## 📐 Estado arquitectónico actual

La arquitectura activa está definida por estos ADRs (el resto están reemplazados o son históricos):

| ADR | Estado | Qué establece |
|---|---|---|
| **ADR-006** | ✅ Aceptado | Monolito Modular + BullMQ (reemplaza ADR-001, ADR-005) — corregido por ADR-012 |
| **ADR-007** | ✅ Aceptado | Auth integrado en el monolite con Supabase — corregido por ADR-010 |
| **ADR-008** | ✅ Aceptado | Emails con AWS SES |
| **ADR-009** | ✅ Aceptado | Scheduling in-house (actualizado a NestJS 2026-06-18) |
| **ADR-010** | ✅ Aceptado | NestJS 11 como framework del monolite (reemplaza ADR-002) |
| **ADR-011** | ✅ Aceptado | Búsqueda y verificación de ubicaciones geográficas (reemplaza ADR-004) |
| **ADR-012** | ✅ Aceptado | Estructura de módulo: Repository Pattern con contracts/adapters (corrige ADR-006) |
| **ADR-013** | ✅ Aceptado | Comunicación entre módulos: Sync DI + Async BullMQ |
| **ADR-014** | ✅ Aceptado | Contenido bilingüe: JSONB + AWS Translate |
| **ADR-015** | ✅ Aceptado | Almacenamiento y procesamiento de archivos: S3 + imgproxy-api |
| **ADR-016** | ✅ Aceptado | Estrategia de testing: TDD pragmático |

> ⚠️ ADR-002 (Fastify) y ADR-003 (NestJS como servicio separado) están reemplazados. No usar como referencia para decisiones actuales.

---

## 📋 Reglas para asistentes de IA (y humanos)

### Al crear o modificar un ADR

1. **Usar la plantilla** `adr/plantilla.md`
2. **Nombrar** con el formato `adr/###-titulo-descripitivo.md`
3. **Actualizar estos archivos** siempre que corresponda:
   - `adr/00-index.md` — agregar entrada en la tabla y en la lista de ADRs existentes
   - `Patioz.md` — si el ADR introduce términos nuevos del dominio o técnicos
   - `docs/*` — si el ADR cambia flujos de setup, deploy o troubleshooting
    - `docs/Arquitectura.md` — si el ADR afecta la arquitectura general
4. **Marcar ADRs reemplazados**: si un nuevo ADR invalida uno anterior, agregar `reemplazado_por: ADR-XXX` en el frontmatter del ADR viejo

### Al completar una copia a repo o publicación a Outline

1. **Copiar ADR al repo** → cambiar `sync_backend` o `sync_frontend` de `pendiente` a `copiado` en el frontmatter del ADR
2. **Publicar doc en Outline** → cambiar `outline_status` de `pendiente` a `publicado` y llenar `outline_url`
3. Verificar que `bd/ADRs.base` y `bd/Docs.base` reflejen los cambios

### Flujo vault → repo → Outline

1. **Vault (este espacio):** fuente de verdad inicial. Los ADRs se crean, discuten y refinan acá.
2. **Repo de código:** cuando `sync_backend: pendiente`, copiar el ADR al repo. Al copiar, cambiar a `copiado`.
3. **Outline:** cuando `outline_status: pendiente`, publicar el doc manualmente. Al publicar, cambiar a `publicado` y llenar `outline_url`.

### Qué va en cada zona

| ¿Qué? | Vault | Code Repo | Outline |
|---|---|---|---|
| ADR aceptado | Queda (frontmatter, wikilinks) | Copia (sin wikilinks) | No va |
| ADR propuesto/rechazado/reemplazado | Queda | No va | No va |
| Doc técnico | Borrador en `docs/` | No va | Versión pulida |
| Decision Log (tabla curada PM/PO) | `docs/Decision Log.md` | No va | Versión pulida |
| Glosario | `06-glosario.md` | No va | No va |
| Tracking de estados | `bd/*.base` | No va | No va |
| Guías operativas | `docs/` (Setup, Deploy, Troubleshooting) | No va | Versión pulida |
| Wikilinks de Obsidian (`[[]]`) | Quedan | Se traducen a texto | No existen |
| Frontmatter (`tipo`, `estado`, `sync_status`) | Queda | Se elimina | Se usa `title`/`description` |

### Al leer documentación existente

- **Siempre verificar la fecha** `actualizado` en el frontmatter de los docs.
- La arquitectura actual es NestJS 11 + BullMQ + contracts/adapters. Los ADRs 006-016 documentan el estado real.
- Referencias a Fastify, QStash, BFF, Clean Architecture layers o Leaflet están obsoletas.

---

## 🔗 Referencias cruzadas

| Archivo | Se actualiza cuando... |
|---|---|
| `adr/00-index.md` | Se crea/modifica un ADR |
| `bd/ADRs.base` | Los campos `sync_backend`/`sync_frontend` reflejan el estado real de copia |
| `bd/Docs.base` | Los campos `outline_status`/`outline_url` reflejan el estado real de publicación |
| `Patioz.md` | Surge un término nuevo o cambia el significado de uno existente |
| `docs/Setup Local.md` | Cambian dependencias, puertos, comandos de setup |
| `docs/Deploy.md` | Cambia el pipeline CI/CD, hosting, o pasos de deploy |
| `docs/Troubleshooting.md` | Se descubre un nuevo error recurrente o se soluciona uno existente |
| `docs/Arquitectura.md` | Cambia la arquitectura general del sistema |

---

## 🛠 Stack actual (post-ADR-016)

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 (`@nestjs/core`) |
| HTTP | Express (`@nestjs/platform-express`) |
| Base de datos | PostgreSQL (Supabase) |
| Auth | Supabase Auth + JWT (Passport) + RBAC |
| Cola de trabajos | BullMQ (`@nestjs/bullmq`) |
| Cache | Redis (ioredis) |
| File storage | S3-compatible (MinIO local / R2 producción) |
| Procesamiento de imágenes | imgproxy-api (Go, servicio externo) |
| Traducción | AWS Translate |
| Emails | AWS SES |
| SMS | Twilio |
| Mapas | Google Maps API + Turf.js + Mapbox GL JS |
| CI/CD | Bitbucket Pipelines |
| Hosting | Railway |
| Frontend | Next.js 16 + Mapbox GL JS (repositorio separado) |
| Testing | Jest + Supertest + `@nestjs/testing` |

---

> *Mantener este archivo actualizado a medida que evoluciona el vault. La regla de oro: si un humano o IA necesita saber algo para navegar correctamente, debe estar acá.*
