# AGENTS.md — Guía de navegación para Patioz

> Contexto para asistentes de IA (Claude, Cline, etc.) y desarrolladores humanos.
> Este archivo describe la estructura, convenciones y reglas del vault `Talento/patioz/`.

---

## 📁 Estructura del vault

```
Talento/patioz/
├── AGENTS.md              ← Este archivo. Guía de navegación y reglas.
├── 00-patioz-general.md   ← Visión general del sistema, arquitectura, enlaces a módulos
├── 02-auth.md             ← Módulo de autenticación y autorización (Supabase Auth + RBAC)
├── 03-mapui-frontend.md   ← Frontend principal (Next.js + Leaflet)
├── 04-imgproxy.md         ← Módulo de archivos e imágenes (S3 + procesamiento)
├── 05-timeline.md         ← Roadmap y timeline del proyecto
├── 06-glosario.md         ← Lenguaje ubicuo del dominio (actualizado 2026-06-22)
├── adr/                   ← Architecture Decision Records
│   ├── 00-index.md        ← Índice de todos los ADRs
│   ├── plantilla.md       ← Plantilla para crear nuevos ADRs
│   ├── 001-005 ...        ← (reemplazados)
│   ├── 006-016 ...        ← ADRs activos
│   └── maps/              ← Sub-ADRs de mapas
├── docs/                  ← Documentación pulida para exportar a Outline
│   ├── Arquitectura.md
│   ├── API Reference.md
│   ├── Setup Local.md
│   └── Deploy.md
└── runbooks/              ← Guías operativas
    ├── 01-setup-local.md       ← Setup del entorno de desarrollo
    ├── 02-deploy.md            ← Pipeline de despliegue (Bitbucket → Railway)
    └── 03-troubleshooting.md   ← Problemas comunes y soluciones
```

---

## 🧭 Cómo navegar

### Si buscas...

| Tópico | Ir a |
|---|---|
| **Arquitectura general del sistema** | `00-patioz-general.md` |
| **Decisiones arquitectónicas (por qué se hizo X)** | `adr/` — leer `adr/00-index.md` primero |
| **Setup local (cómo levantar el proyecto)** | `runbooks/01-setup-local.md` |
| **Cómo desplegar** | `runbooks/02-deploy.md` |
| **Problemas conocidos** | `runbooks/03-troubleshooting.md` |
| **Definición de términos del dominio** | `06-glosario.md` |
| **Auth / login / permisos** | `02-auth.md` + `adr/007-auth-integration.md` |
| **Frontend / MapUI** | `03-mapui-frontend.md` |
| **Módulo de archivos / imágenes** | `04-imgproxy.md` + `adr/015-file-storage-processing.md` |
| **i18n / Traducción** | `adr/014-i18n-bilingual-content.md` |
| **Testing** | `adr/016-testing-strategy.md` |
| **Roadmap / fechas** | `05-timeline.md` |

### Convención de nombres

| Prefijo | Contenido |
|---|---|
| `00-*` | Índices y visiones generales |
| `0x-*` (01-09) | Documentación de módulos y componentes del sistema |
| `adr/###-*` | Decisiones arquitectónicas, numeradas secuencialmente |
| `runbooks/0x-*` | Guías operativas paso a paso |

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
   - `06-glosario.md` — si el ADR introduce términos nuevos del dominio o técnicos
   - `runbooks/*` — si el ADR cambia flujos de setup, deploy o troubleshooting
   - `00-patioz-general.md` — si el ADR afecta la arquitectura general
4. **Marcar ADRs reemplazados**: si un nuevo ADR invalida uno anterior, agregar `reemplazado_por: ADR-XXX` en el frontmatter del ADR viejo

### Flujo vault → repo → Outline

1. **Vault (este espacio):** fuente de verdad inicial. Los ADRs se crean, discuten y refinan acá.
2. **Repo de código:** cuando un ADR está `aceptado`, se copia al repo correspondiente (`patioz-api-monolith/docs/adr/`) con la numeración propia del repo. El campo `copiado_a` en el frontmatter registra dónde se copió.
3. **Outline (wiki.gettalento.com):** el contenido de `docs/` se exporta manualmente a Outline como documentación pulida para el equipo. Los ADRs crudos no van a Outline.

### Reglas del flujo

| Regla | Detalle |
|---|---|
| Solo ADRs `aceptado` se copian a repos | `propuesto`, `rechazado`, `reemplazado` se quedan en el vault |
| El vault mantiene su numeración | Cada proyecto tiene secuencia independiente (001-0xx) |
| El repo asigna su propia numeración | Al copiar, se usa el siguiente número secuencial del repo |
| Referencia bidireccional | El ADR en vault lleva `copiado_a: [repo-path]`. El ADR en repo lleva `origen_vault: Talento/patioz/adr/###-*.md` |
| Actualización | Si un ADR cambia en el vault, se re-copia al repo |
| Outline solo docs pulidos | `docs/` tiene contenido redactado para consumo externo. No ADRs crudos |

### Al modificar un runbook

1. Verificar que los comandos, puertos, URLs y servicios coinciden con el código real
2. Actualizar el campo `actualizado` en el frontmatter con la fecha del cambio
3. Si el cambio afecta el glosario (ej. nuevo servicio), actualizar `06-glosario.md`

### Al leer documentación existente

- **Siempre verificar la fecha** `actualizado` en el frontmatter. Archivos sin `actualizado` pueden reflejar la arquitectura anterior a ADR-006 (microservicios + Fastify + QStash).
- **Si encuentras una referencia a Fastify, QStash, localStash, BFF, Clean Architecture con domain/application/infrastructure, o Leaflet**, probablemente está desactualizada. La arquitectura actual es NestJS 11 + BullMQ + contracts/adapters.
- **Los archivos `00-patioz-general.md`, `02-auth.md`, `03-mapui-frontend.md` y `04-imgproxy.md` aún contienen referencias a Fastify y Clean Architecture** que no se han actualizado. No tomarlas como verdad arquitectónica actual.

---

## 🔗 Referencias cruzadas

| Archivo | Se actualiza cuando... |
|---|---|
| `adr/00-index.md` | Se crea/modifica un ADR |
| `06-glosario.md` | Surge un término nuevo o cambia el significado de uno existente |
| `runbooks/01-setup-local.md` | Cambian dependencias, puertos, comandos de setup |
| `runbooks/02-deploy.md` | Cambia el pipeline CI/CD, hosting, o pasos de deploy |
| `runbooks/03-troubleshooting.md` | Se descubre un nuevo error recurrente o se soluciona uno existente |
| `00-patioz-general.md` | Cambia la arquitectura general del sistema |

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
