# AGENTS.md — Guía de navegación para Estela

> Contexto para asistentes de IA y desarrolladores humanos.
> Este archivo describe la estructura, convenciones y reglas del proyecto `proyectos personales/estela/`.

---

## Identidad
Eres OpenCode, actuando como **co-fundador técnico y estratega de producto**. Tu rol es procesar ideas, estructurar información, y generar el plan de negocios más sólido posible. El usuario es el fundador/developer.

---

## 📁 Estructura del proyecto

```
proyectos personales/estela/
├── AGENTS.md              ← Este archivo. Guía de navegación y reglas.
├── Estela.md              ← Landing: resumen, navegación, stack, glosario
├── Tracker.md             ← Tracking de ADRs y Docs (embebe bd/*.base)
├── adr/                   ← Architecture Decision Records
│   ├── 00-index.md        ← Índice completo con wikilinks
│   ├── plantilla.md       ← Plantilla para crear nuevos ADRs
│   └── 001-004 ...        ← ADRs del proyecto
├── bd/                    ← Bases de Obsidian (tablas interactivas)
│   ├── ADRs.base          ← ADRs: decisión, proyecto, estado, implementado
│   ├── Docs.base          ← Docs: título, outline_status, outline_url
│   └── Decisiones.base    ← Vista combinada ADRs + Docs
├── docs/                  ← Documentación técnica pulida
├── Board/                 ← Kanban de desarrollo (plugin Obsidian)
├── Business Plan/         ← Plan de negocios + Pitch Deck (14 docs)
├── Definiciones/          ← Definiciones de módulos
├── Ideas/                 ← Ideas formuladas + descartadas
├── Research/              ← Investigación de mercado con fuentes
├── Sessions/              ← Registro de sesiones con OpenCode
└── Technical/             ← Arquitectura, stack, wireframes
```

---

## 🧭 Cómo navegar

| Tópico | Ir a |
|---|---|
| **Resumen general y glosario** | `Estela.md` |
| **Decisiones arquitectónicas** | `adr/` (001-004) |
| **Tracking de ADRs/Docs** | `Tracker.md` o `bd/Decisiones.base` |
| **Documentación técnica** | `docs/` |
| **Plan de negocios** | `Business Plan/00-Index.md` |
| **Pitch Deck** | `Business Plan/Pitch-Deck.md` |
| **Board de desarrollo** | `Board/Kanban.md` |
| **Research de mercado** | `Research/` |
| **Sesiones** | `Sessions/` |

---

## 📐 ADRs activos

| ADR | Implementado | Qué establece |
|---|---|---|
| 001 | pendiente | Marketplace de Autos como idea ganadora |
| 002 | pendiente | Laravel 11 + Supabase PostgreSQL + Clean Architecture Light |
| 003 | pendiente | Monorepo con 2 apps Next.js 14+ + 4 packages |
| 004 | pendiente | Auth & RBAC con Laravel Sanctum + spatie/laravel-permission |

---

## 📋 Reglas para asistentes de IA

### Al crear o modificar un ADR

1. **Usar la plantilla** `adr/plantilla.md`
2. **Nombrar** con el formato `###-titulo-descripitivo.md`
3. **Asignar** `proyecto: estela-be` o `estela-fe` según corresponda
4. **Actualizar** `adr/00-index.md` con la nueva entrada
5. **Actualizar** `Estela.md` si introduce términos nuevos al glosario
6. **Actualizar** `docs/*` si el ADR afecta docs existentes

### Flujo de trabajo

1. **Vault:** crear ADR con `estado: propuesto`, refinar, aceptar → `estado: aceptado`
2. **Código:** implementar la decisión → cambiar `implementado: si`
3. **Docs:** publicar doc técnico → actualizar `docs/`

Los ADRs se quedan en el vault como documentación de decisiones.

### Al copiar un ADR al repositorio (solo si es necesario)

1. **Quitar el bloque YAML** del inicio (`---` ... `---`)
2. **Reemplazar wikilinks**: `[[archivo|texto]]` → `texto`, `[[archivo]]` → nombre del archivo
3. **Agregar al pie**: `> Origen vault: proyectos personales/estela/adr/###-*.md`
4. **Mantener** Mermaid, tablas, código, secciones

### Qué va en cada zona

| ¿Qué? | Vault | Code Repo | Outline |
|---|---|---|---|
| ADR aceptado | Queda (frontmatter, wikilinks) | No se copia | No va |
| ADR propuesto/rechazado/reemplazado | Queda | No va | No va |
| Doc técnico | Borrador en `docs/` | No va | Versión pulida |
| Business Plan | `Business Plan/` | No va | Versión pulida (PDF) |
| Glosario | `Estela.md` | No va | No va |
| Tracking de estados | `bd/*.base` | No va | No va |
| Wikilinks de Obsidian | Quedan | Se traducen a texto | No existen |
| Frontmatter | Queda | Se elimina | Se usa `title`/`description` |

---

## 🔗 Referencias cruzadas

| Archivo | Se actualiza cuando... |
|---|---|
| `adr/00-index.md` | Se crea/modifica un ADR |
| `Estela.md` | Surge un término nuevo en el glosario |
| `bd/Docs.base` | Un doc cambia de estado |
| `Business Plan/` | Cambia el plan de negocios o el pitch deck |
| `Board/Kanban.md` | Avanza una fase de desarrollo |

---

## 📋 Board de Desarrollo
El board vive en `Board/Kanban.md` usando el plugin **Kanban** (obsidian community).

### Columnas
| Columna | Propósito |
|---|---|
| 📥 Backlog | Módulos/tasks identificadas pero sin planificar activamente |
| 👨‍💻 Planning | Módulo siendo desglosado (definición + tasks) |
| ✅ Done | Módulo completamente planeado |

### Convenciones
- Cada task es un `.md` en `Board/<fase>/` con frontmatter YAML
- Cada módulo tiene una definición en `Definiciones/<id>.md`
- Los IDs siguen el patrón `TSK-NNN`
- Las dependencias se declaran en el frontmatter (`dependencias: ["TSK-XXX"]`)

### Fases (orden lógico programable)
| Fase | Módulo | Depende de |
|---|---|---|
| 1 | Auth (users, landing, login/register) | — |
| 2 | Cars CRUD (modelo, API, publish wizard) | Fase 1 |
| 3 | Search (tsvector, filtros, mapa, geocoding) | Fase 2 |
| 4 | Condition Score (checklist, score 1-100) | Fase 2 |
| 5 | Comparison (model specs, comparativa) | Fase 2 |
| 6 | Dealers + Monetización (perfiles, planes, pagos) | Fase 1, 2 |
| 7 | Contact + Favoritos (contacto, email, favs) | Fase 1, 2 |
| 8 | Admin (backoffice, moderación) | Fase 1, 2, 6 |
| 9 | Polish + Launch (SEO, monitoreo, seed, launch) | Todo |

> **Principio:** Cada fase es una vertical slice completa. Ninguna fase depende de una fase posterior.

---

## Contexto técnico del fundador
- Es desarrollador full-stack (experiencia en arquitectura, backend, frontend)
- Stack familiar: TypeScript, React, Node.js, infraestructura cloud
- Puede construir el MVP él mismo

---

> *Mantener este archivo actualizado. La regla de oro: si un humano o IA necesita saber algo para navegar correctamente, debe estar acá.*
