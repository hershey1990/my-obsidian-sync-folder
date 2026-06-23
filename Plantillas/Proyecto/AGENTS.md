# AGENTS.md — Guía de navegación para {{NOMBRE}}

> Contexto para asistentes de IA y desarrolladores humanos.
> Este archivo describe la estructura, convenciones y reglas del vault `{{PATH}}/`.

---

## 📁 Estructura del vault

```
{{PATH}}/
├── AGENTS.md              ← Este archivo. Guía de navegación y reglas.
├── Proyecto.md            ← Landing: resumen, navegación, stack, glosario
├── Tracker.md             ← Tracking de ADRs y Docs (embebe bd/*.base)
├── adr/                   ← Architecture Decision Records
│   ├── 00-index.md        ← Índice de todos los ADRs
│   ├── plantilla.md       ← Plantilla para crear nuevos ADRs
│   └── ###-*.md           ← ADRs numerados secuencialmente
├── bd/                    ← Bases de datos (tracking sync + Outline)
│   ├── ADRs.base          ← ADRs: qué copiar a BE/FE, estado de copia
│   ├── Docs.base          ← Docs: qué publicar en Outline, estado
│   └── Decisiones.base    ← Vista combinada ADRs + Docs
└── docs/                  ← Documentación pulida para exportar a Outline
    └── *.md               ← Docs técnicos (setup, deploy, API ref, etc.)
```

---

## 🧭 Cómo navegar

| Tópico | Ir a |
|---|---|
| **Resumen general y glosario** | `Proyecto.md` |
| **Decisiones arquitectónicas (por qué se hizo X)** | `adr/` — leer `adr/00-index.md` primero |
| **Tracking (qué publicar en Outline)** | `Tracker.md` o `bd/Docs.base` |
| **Documentación técnica** | `docs/` |

---

## 📐 Estado arquitectónico actual

| ADR | Estado | Qué establece |
|---|---|---|
| — | — | — |

---

## 📋 Reglas para asistentes de IA (y humanos)

### Al crear o modificar un ADR

1. **Usar la plantilla** `adr/plantilla.md`
2. **Nombrar** con el formato `adr/###-titulo-descripitivo.md`
3. **Actualizar estos archivos** siempre que corresponda:
   - `adr/00-index.md` — agregar entrada en la lista de ADRs
   - `Proyecto.md` — si el ADR introduce términos nuevos del dominio
   - `docs/*` — si el ADR cambia flujos de setup, deploy o troubleshooting
4. **Marcar ADRs reemplazados**: agregar `reemplazado_por: ADR-XXX` en el frontmatter del ADR viejo

### Al copiar un ADR al repositorio

1. **Quitar el bloque YAML** del inicio (`---` ... `---`)
2. **Reemplazar wikilinks**: `[[archivo|texto]]` → `texto`, `[[archivo]]` → nombre del archivo
3. **Agregar al pie**: `> Origen vault: {{PATH}}/adr/###-*.md`
4. **Mantener** Mermaid, tablas, código, secciones

### Flujo de trabajo

1. **Vault:** crear ADR con `estado: propuesto`, refinar, aceptar → `estado: aceptado`
2. **Código:** implementar la decisión → cambiar `implementado: si`
3. **Outline:** publicar doc → `outline_status: publicado` + `outline_url`

Los ADRs se quedan en el vault como documentación de decisiones. Al implementar un ADR, actualizar el `AGENTS.md` del repositorio con sus reglas.

### Al copiar un ADR al repositorio (solo si es necesario)

1. **Quitar el bloque YAML** del inicio (`---` ... `---`)
2. **Reemplazar wikilinks**: `[[archivo|texto]]` → `texto`, `[[archivo]]` → nombre del archivo
3. **Agregar al pie**: `> Origen vault: {{PATH}}/adr/###-*.md`
4. **Mantener** Mermaid, tablas, código, secciones

### Qué va en cada zona

| ¿Qué? | Vault | Code Repo | Outline |
|---|---|---|---|
| ADR aceptado | Queda (frontmatter, wikilinks) | No se copia (AGENTS.md se actualiza con sus reglas) | No va |
| ADR propuesto/rechazado/reemplazado | Queda | No va | No va |
| Doc técnico | Borrador en `docs/` | No va | Versión pulida |
| Glosario | `Proyecto.md` | No va | No va |
| Tracking de estados | `bd/*.base` | No va | No va |
| Guías operativas | `docs/` | No va | Versión pulida |
| Wikilinks de Obsidian | Quedan | Se traducen a texto | No existen |
| Frontmatter | Queda | Se elimina | Se usa `title`/`description` |

---

## 🛠 Stack actual

| Capa | Tecnología |
|---|---|
| ... | ... |

---

> *Mantener este archivo actualizado. La regla de oro: si un humano o IA necesita saber algo para navegar correctamente, debe estar acá.*
