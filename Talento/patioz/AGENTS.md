# AGENTS.md — Guía de navegación para Patioz

> Contexto para asistentes de IA y desarrolladores humanos.
> Este archivo describe la estructura, convenciones y reglas del vault `Talento/patioz/`.

---

## 📁 Estructura del vault

```
Talento/patioz/
├── AGENTS.md              ← Este archivo. Guía de navegación y reglas.
├── Patioz.md              ← Landing: resumen, navegación, stack, glosario
├── Tracker.md             ← Tracking de Docs (embebe bd/Docs.base)
├── adr/                   ← Architecture Decision Records
│   ├── README.md          ← Índice y saltos de numeración para el repo
│   ├── 00-index.md        ← Índice completo con wikilinks
│   ├── plantilla.md       ← Plantilla para crear nuevos ADRs
│   ├── 001-005 ...        ← Reemplazados (históricos)
│   ├── 006-016 ...        ← Backend activos
│   ├── 017-024 ...        ← Frontend activos
│   └── maps/              ← Sub-ADRs de mapas
├── bd/                    ← Bases de Obsidian (tablas interactivas)
│   ├── ADRs.base          ← ADRs: decisión, proyecto, estado, implementado
│   ├── Docs.base          ← Docs: título, outline_status, outline_url
│   └── Decisiones.base    ← Vista combinada ADRs + Docs
└── docs/                  ← Documentación pulida para exportar a Outline
    ├── Overview.md, Arquitectura.md, API Reference.md ... (BE)
    ├── FE Overview.md, FE Arquitectura.md, FE Setup Local.md ... (FE)
    └── Decision Log.md    ← Tabla curada BE + FE para PM/PO
```

---

## 🧭 Cómo navegar

| Tópico | Ir a |
|---|---|
| **Resumen general y glosario** | `Patioz.md` |
| **Decisiones arquitectónicas BE** | `adr/` (006-016) |
| **Decisiones arquitectónicas FE** | `adr/` (017-024) |
| **Tracking de Docs (Outline)** | `Tracker.md` o `bd/Docs.base` |
| **Documentación técnica BE** | `docs/` |
| **Documentación técnica FE** | `docs/FE Overview.md` |
| **Decision Log (PM/PO)** | `docs/Decision Log.md` |

---

## 📐 ADRs activos

### Backend (patioz-be)

| ADR | Implementado | Qué establece |
|---|---|---|
| 006 | si | Monolito Modular + BullMQ |
| 007 | si | Auth integrada con Supabase |
| 008 | si | Emails con AWS SES |
| 009 | si | Scheduling in-house |
| 010 | si | NestJS 11 como framework |
| 011 | si | Mapas y ubicaciones en 2 fases |
| 012 | si | Repository Pattern (contracts/adapters) |
| 013 | si | Comunicación: Sync DI + Async BullMQ |
| 014 | si | i18n: JSONB + AWS Translate |
| 015 | si | Archivos: S3 + imgproxy-api |
| 016 | si | Testing: TDD pragmático |

### Frontend (patioz-fe)

| ADR | Implementado | Qué establece |
|---|---|---|
| 017 | si | Monorepo pnpm + Turborepo |
| 018 | si | 3 apps para 3 grupos de usuarios |
| 019 | si | Next.js 16 (mapui) + Vite (operations/admin) |
| 020 | si | Contract implicit pattern |
| 021 | si | State: React Query + Zustand |
| 022 | si | @mapui/ui-core (35 componentes) |
| 023 | si | Tailwind CSS v4 única fuente de estilos |
| 024 | si | Wizard create-property de 14 pasos |

---

## 📋 Reglas para asistentes de IA

### Al crear o modificar un ADR

1. **Usar la plantilla** `adr/plantilla.md`
2. **Nombrar** con el formato `adr/###-titulo-descripitivo.md`
3. **Asignar** `proyecto: patioz-be` o `patioz-fe` según corresponda
4. **Actualizar** `adr/00-index.md` con la nueva entrada
5. **Actualizar** `Patioz.md` si introduce términos nuevos al glosario
6. **Actualizar** `docs/*` si el ADR afecta docs existentes

### Flujo de trabajo

1. **Vault:** crear ADR con `estado: propuesto`, refinar, aceptar → `estado: aceptado`
2. **Código:** implementar la decisión → cambiar `implementado: si`
3. **Outline:** publicar doc → `outline_status: publicado` + `outline_url`

Los ADRs se quedan en el vault como documentación de decisiones. No se copian al repositorio de código. En su lugar, al implementar un ADR, actualizar el `AGENTS.md` del repositorio con las reglas y convenciones derivadas.

### Al copiar un ADR al repositorio (solo si es necesario)

1. **Quitar el bloque YAML** del inicio (`---` ... `---`)
2. **Reemplazar wikilinks**: `[[archivo|texto]]` → `texto`, `[[archivo]]` → nombre del archivo
3. **Agregar al pie**: `> Origen vault: Talento/patioz/adr/###-*.md`
4. **Mantener** Mermaid, tablas, código, secciones

### Qué va en cada zona

| ¿Qué? | Vault | Code Repo | Outline |
|---|---|---|---|
| ADR aceptado | Queda (frontmatter, wikilinks) | No se copia (AGENTS.md del repo se actualiza con sus reglas) | No va |
| ADR propuesto/rechazado/reemplazado | Queda | No va | No va |
| Doc técnico | Borrador en `docs/` | No va | Versión pulida |
| Decision Log (PM/PO) | `docs/Decision Log.md` | No va | Versión pulida |
| Glosario | `Patioz.md` | No va | No va |
| Tracking de estados | `bd/*.base` | No va | No va |
| Wikilinks de Obsidian | Quedan | Se traducen a texto | No existen |
| Frontmatter | Queda | Se elimina | Se usa `title`/`description` |

---

## 🔗 Referencias cruzadas

| Archivo | Se actualiza cuando... |
|---|---|
| `adr/00-index.md` | Se crea/modifica un ADR |
| `Patioz.md` | Surge un término nuevo en el glosario |
| `bd/Docs.base` | Un doc cambia de estado en Outline |
| `docs/Setup Local.md` | Cambian dependencias o comandos de setup |
| `docs/Deploy.md` | Cambia CI/CD o hosting |
| `docs/Troubleshooting.md` | Se descubre/soluciona un error recurrente |

---

## 🛠 Stack

### Backend

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 |
| HTTP | Express |
| DB | PostgreSQL (Supabase) |
| Auth | Supabase Auth + JWT + RBAC |
| Cola | BullMQ + Redis |
| Archivos | S3 + imgproxy-api |
| Traducción | AWS Translate |
| Email | AWS SES |
| SMS | Twilio |
| CI/CD | Bitbucket Pipelines |
| Hosting | Railway |

### Frontend

| Capa | Tecnología |
|---|---|
| Monorepo | pnpm + Turborepo |
| Frameworks | Next.js 16, Vite 6 |
| UI | React 19, Tailwind CSS v4 |
| State | TanStack React Query, Zustand |
| Forms | React Hook Form + Zod |
| i18n | next-intl, @mapui/i18n |
| Testing | Playwright (e2e), Vitest |
| Auth | Supabase Auth (aislado por app) |

---

> *Mantener este archivo actualizado. La regla de oro: si un humano o IA necesita saber algo para navegar correctamente, debe estar acá.*
