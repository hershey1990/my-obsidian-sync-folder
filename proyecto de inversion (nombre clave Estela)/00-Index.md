# Proyecto de Inversión — *Clave: Estela*

**Estado:** 📋 Plan de Negocios (Marketplace de Autos)  
**Objetivo:** Definir, validar y presentar un plan de negocios para una plataforma digital a un inversor.

---

## Mapa del proyecto

| Carpeta | Propósito |
|---------|-----------|
| `Ideas/` | Las 3 ideas formuladas (+ descartadas) |
| `Decisiones/` | ADRs y acuerdos clave del proyecto |
| `Research/` | Investigación de mercado, competencia, tendencias |
| `Business Plan/` | Plan de negocios final para el inversor |
| `Technical/` | Arquitectura, stack tecnológico, prototipos |
| `Sessions/` | Registro de sesiones con OpenCode para continuidad de contexto |

## Estado del plan de negocios

```dataview
TABLE
  status AS "Estado"
FROM "proyecto de inversion (nombre clave Estela)/Business Plan"
SORT file.name ASC
```

## Timeline

- [x] **Fase 1:** Formular las 3 ideas
- [x] **Fase 2:** Evaluación y descarte → Marketplace de Autos + fallback Servicios
- [ ] **Fase 3:** Plan de negocios (en progreso)
- [ ] **Fase 4:** Presentación al inversor

## Decisiones clave

| # | Decisión | Archivo |
|---|----------|---------|
| 001 | Marketplace de Autos como idea ganadora | `Decisiones/ADR-001-Seleccion-Idea.md` |
| 002 | Stack tecnológico (Laravel + Next.js + Supabase) | `Decisiones/ADR-002-Arquitectura-Stack.md` |
| 003 | Arquitectura Frontend (monorepo con 2 apps) | `Decisiones/ADR-003-Arquitectura-Frontend.md` |
