---
tipo: adr
fecha: 2026-06-14
estado: aceptado
tags:
  - adr
---
# ADR-005: Sistema de Seguimiento de Aplicaciones

## Contexto
Para una búsqueda efectiva debo trackear:
- Qué empresas he contactado y en qué estado está cada una
- El feedback recibido post-entrevista para mejorar iterativamente
- Próximos pasos y follow-ups
- Visibilidad del pipeline completo (embudo aplicaciones → oferta)

Tengo experiencia previa con sistemas Dataview en Obsidian (ver `Interviews/Panel de Control de Entrevistas.md`). Se replica el patrón pero para mis propias aplicaciones.

## Decisión

### 1. Estructura de Archivos

```
Job Search/
├── Companies/
│   └── {Empresa} - {Puesto}.md    ← Una nota por aplicación
├── Dashboard.md                    ← Dataview TABLE plano (sin JS)
├── Kanban.md                       ← Dataview LIST agrupado por estado
└── Retrospectivas.md               ← Entradas post-entrevista
```

### 2. Frontmatter de cada Aplicación

Cada nota en `Companies/` tiene frontmatter obligatorio:

```yaml
---
tipo: aplicacion
empresa: ""
puesto: ""
url: ""
salario: ""
fecha_aplicacion: YYYY-MM-DD
estado: applied
feedback_tecnico: ""
feedback_ingles: ""
proximo_paso: ""
tags:
  - aplicacion
---
```

### 3. Estados y Workflow

**Estados en orden progresivo:**
```
applied → screening → technical → cultural → offer → accepted
                                                       → declined
```
**Terminal desde cualquier estado:**
```
→ rejected
```

Regla: cada cambio de estado se registra actualizando el frontmatter. No hay tabs ni metadata adicional.

### 4. Dashboard (Dataview TABLE)

```dataview
TABLE empresa AS "Empresa", puesto AS "Puesto", fecha_aplicacion AS "Fecha",
      estado AS "Estado", proximo_paso AS "Próximo Paso"
FROM "Job Search/Companies"
WHERE tipo = "aplicacion"
SORT fecha_aplicacion DESC
```

Propósito: vista rápida de todo el pipeline ordenado por fecha.

### 5. Kanban (Dataview LIST agrupado)

```dataview
LIST rows.file.link
FROM "Job Search/Companies"
WHERE tipo = "aplicacion"
GROUP BY estado
SORT rows.file.ctime DESC
```

Propósito: visualizar distribución por estado. Un grupo por estado.

### 6. Retrospectivas

Formato libre, una entrada por interacción:

> **YYYY-MM-DD — Empresa (Fase)**
> - ✅ **Bien:**
> - ❌ **Mejorar:**
> - 🎯 **Próxima acción:**

Se registra después de cada screening, technical, cultural. Sirve como insumo para mejorar en la siguiente entrevista.

### 7. Convenciones

- Cada empresa se registra **una vez**, aunque se aplique a múltiples roles. Si aplico a dos puestos en la misma empresa, crear nota separada con sufijo (`- Puesto1`, `- Puesto2`)
- El estado `rejected` es terminal. No se elimina la nota, queda como registro histórico
- `proximo_paso` se actualiza cada vez que hay interacción
- Las retrospectivas son acumulativas en un solo archivo (`Retrospectivas.md`), no por empresa

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| DataviewJS con selects interactivos | Experiencia de usuario fluida | Complejidad técnica, mantenimiento |
| Tabla manual en markdown | Simple | No escalable, sin filtros |
| Airtable/Excel externo | Potente, colaborativo | Fuera de Obsidian, rompe el flujo |
| ATS tipo Huntr | Especializado | Costo, datos fuera de mi control |

## Consecuencias
- Positivo: Todo queda dentro de Obsidian, mismo ecosistema que el resto del vault
- Positivo: Dataview permite consultas sin escribir JS (mantenible)
- Riesgo: Si no hay consistencia en frontmatter, las queries fallan (mitigación: template definido, validación manual inicial)
- Acción: No crear ninguna nota en `Companies/` sin el frontmatter completo

## Estado
- [x] Aceptado
