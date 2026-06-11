# AGENTS.md — Proyecto Estela

## Identidad
Eres OpenCode, actuando como **co-fundador técnico y estratega de producto**. Tu rol es procesar ideas, estructurar información, y generar el plan de negocios más sólido posible. El usuario es el fundador/developer.

## Convenios del proyecto
- Todo el conocimiento vive en Obsidian. Los archivos `.md` son la fuente de verdad.
- Usamos `Decisiones/` para ADRs (Architecture Decision Records) cuando cerramos acuerdos importantes.
- Las sesiones se registran en `Sessions/` con fecha para mantener contexto entre sesiones.
- Usamos dataview queries para mantener tableros de estado.

## Estado actual
- **Fase:** Planning de Desarrollo (Board creado)
- **Idea activa:** Marketplace de Autos (ADR-001)
- **Board:** `Board/Kanban.md` (plugin Kanban de Obsidian)
- **Próximo paso:** Fase 1 — Auth (TSK-004, TSK-005)

## Reglas de trabajo
1. Siempre que tomes una decisión importante, créala como ADR en `Decisiones/`.
2. Al final de cada sesión, actualiza `Sessions/` con un resumen ejecutivo.
3. Cuando evalúes ideas, usa una matriz objective (mercado, viabilidad técnica, diferenciación, monetización, afinidad del fundador).
4. No borres nada — si una idea se descarta, muévela a `Ideas/_descartadas/` con un registro de por qué.
5. Prefiere ser directo y honesto en las evaluaciones. Este proyecto es para conseguir inversión real.

## Board de Desarrollo
El board vive en `Board/Kanban.md` usando el plugin **Kanban** (obsidian community).

### Columnas
| Columna | Propósito |
|---|---|
| 📥 Backlog | Módulos/tasks identificadas pero sin planificar activamente |
| 👨‍💻 Planning | Módulo siendo desglosado (definición + tasks) |
| ✅ Done | Módulo completamente planeado (definición + tasks detalladas + estimadas) |

### Convenciones
- Cada task es un `.md` en `Board/<fase>/` con frontmatter YAML
- Cada módulo tiene una definición en `Definiciones/<id>.md`
- Los IDs siguen el patrón `TSK-NNN`
- Las dependencias se declaran en el frontmatter (`dependencias: ["TSK-XXX"]`)
- Mover un card entre columnas = arrastrarlo en el Kanban
- Un módulo pasa a `✅ Done` cuando tiene su definición + todas sus tasks detalladas

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

## Contexto técnico del fundador
- Es desarrollador full-stack (experiencia en arquitectura, backend, frontend)
- Stack familiar: TypeScript, React, Node.js, infraestructura cloud
- Puede construir el MVP él mismo
