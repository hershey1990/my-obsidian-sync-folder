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
| 📥 Backlog | Tasks identificadas pero sin planificar activamente |
| 📝 Planning | Tasks en desglose y estimación |
| ⏳ Blocked | Tasks listas pero bloqueadas por dependencia |
| ✅ Planned | Tasks completamente detalladas, listas para desarrollo |

### Convenciones
- Cada task es un `.md` en `Board/<fase>/` con frontmatter YAML
- Los IDs siguen el patrón `TSK-NNN`
- Las dependencias se declaran en el frontmatter (`dependencias: ["TSK-XXX"]`)
- Mover un card entre columnas = arrastrarlo en el Kanban
- Cuando un task pasa a `✅ Planned`, está listo para asignar a un dev

### Fases (orden lógico programable)
| Fase | Módulo | Depende de |
|---|---|---|
| 0 | Cimientos (monorepo, Laravel, design system) | — |
| 1 | Auth (users, landing, login/register) | Fase 0 |
| 2 | Cars CRUD (modelo, API, publish wizard) | Fase 1 |
| 3 | Search (tsvector, filtros, mapa, geocoding) | Fase 2 |
| 4 | Condition Score (checklist, score 1-100) | Fase 2 |
| 5 | Comparison (model specs, comparativa) | Fase 2 |
| 6 | Dealers + Monetización (perfiles, planes, pagos) | Fase 1, 2 |
| 7 | Contact + Favoritos (contacto, email, favs) | Fase 1, 2 |
| 8 | Admin (backoffice, moderación) | Fase 0, 1, 2, 6 |
| 9 | Polish + Launch (SEO, monitoreo, seed, launch) | Todo |

> **Principio:** Cada fase es una vertical slice completa. Ninguna fase depende de una fase posterior.

## Contexto técnico del fundador
- Es desarrollador full-stack (experiencia en arquitectura, backend, frontend)
- Stack familiar: TypeScript, React, Node.js, infraestructura cloud
- Puede construir el MVP él mismo
