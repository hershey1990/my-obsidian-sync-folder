# AGENTS.md — Guía de navegación para BB (bibi)

> Contexto para asistentes de IA y desarrolladores humanos.
> Este archivo describe la estructura, convenciones y reglas del proyecto `proyectos personales/bb/`.

---

## 📁 Estructura del proyecto

```
proyectos personales/bb/
├── AGENTS.md              ← Este archivo. Guía de navegación y reglas.
├── BB.md                  ← Landing: resumen, navegación, stack, glosario
├── Tracker.md             ← Tracking de ADRs y Docs (embebe bd/*.base)
├── adr/                   ← Architecture Decision Records
│   ├── 00-index.md        ← Índice completo con wikilinks
│   ├── plantilla.md       ← Plantilla para crear nuevos ADRs
│   └── 001-...            ← ADRs del proyecto
├── bd/                    ← Bases de Obsidian (tablas interactivas)
│   ├── ADRs.base          ← ADRs: decisión, proyecto, estado, implementado
│   ├── Docs.base          ← Docs: título, outline_status, outline_url
│   └── Decisiones.base    ← Vista combinada ADRs + Docs
├── docs/                  ← Documentación técnica pulida
│   ├── Overview.md
│   ├── Arquitectura.md
│   ├── Setup Local.md
│   └── FE Overview.md
└── Board/                 ← Kanban de desarrollo (plugin Obsidian)
    └── Kanban.md
```

---

## 🧭 Cómo navegar

| Tópico | Ir a |
|---|---|
| **Resumen general y glosario** | `BB.md` |
| **Decisiones arquitectónicas** | `adr/00-index.md` |
| **Tracking de ADRs/Docs** | `Tracker.md` o `bd/Decisiones.base` |
| **Documentación técnica** | `docs/Overview.md` |
| **Board de desarrollo** | `Board/Kanban.md` |

---

## 📐 ADRs activos

| ADR | Implementado | Qué establece |
|---|---|---|
| 001 | pendiente | Visión inicial: PWA de time tracking para tripulaciones → SaaS |

---

## 📋 Reglas para asistentes de IA

### Al crear o modificar un ADR

1. **Usar la plantilla** `adr/plantilla.md`
2. **Nombrar** con el formato `###-titulo-descripitivo.md`
3. **Asignar** `proyecto: bb-be` o `bb-fe` según corresponda
4. **Actualizar** `adr/00-index.md` con la nueva entrada
5. **Actualizar** `BB.md` si introduce términos nuevos al glosario
6. **Actualizar** `docs/*` si el ADR afecta docs existentes

### Flujo de trabajo

1. **Vault:** crear ADR con `estado: propuesto`, refinar, aceptar → `estado: aceptado`
2. **Código:** implementar la decisión → cambiar `implementado: si`
3. **Docs:** publicar doc técnico → actualizar `docs/`

### Al copiar un ADR al repositorio (solo si es necesario)

1. **Quitar el bloque YAML** del inicio (`---` ... `---`)
2. **Reemplazar wikilinks**: `[[archivo|texto]]` → `texto`, `[[archivo]]` → nombre del archivo
3. **Agregar al pie**: `> Origen vault: proyectos personales/bb/adr/###-*.md`
4. **Mantener** Mermaid, tablas, código, secciones

### Qué va en cada zona

| ¿Qué? | Vault | Code Repo | Outline |
|---|---|---|---|
| ADR aceptado | Queda (frontmatter, wikilinks) | No se copia | No va |
| ADR propuesto/rechazado/reemplazado | Queda | No va | No va |
| Doc técnico | Borrador en `docs/` | No va | Versión pulida |
| Glosario | `BB.md` | No va | No va |
| Tracking de estados | `bd/*.base` | No va | No va |
| Wikilinks de Obsidian | Quedan | Se traducen a texto | No existen |
| Frontmatter | Queda | Se elimina | Se usa `title`/`description` |

---

## 🔗 Referencias cruzadas

| Archivo | Se actualiza cuando... |
|---|---|
| `adr/00-index.md` | Se crea/modifica un ADR |
| `BB.md` | Surge un término nuevo en el glosario |
| `bd/Docs.base` | Un doc cambia de estado |
| `Board/Kanban.md` | Avanza una fase de desarrollo |
| `docs/Setup Local.md` | Cambian dependencias o comandos de setup |
| `docs/Deploy.md` | Cambia CI/CD o hosting |

---

> *Mantener este archivo actualizado. La regla de oro: si un humano o IA necesita saber algo para navegar correctamente, debe estar acá.*
