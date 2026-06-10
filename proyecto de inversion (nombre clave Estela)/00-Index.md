# Proyecto de Inversión — *Clave: Estela*

**Estado:** 🔵 Plan de Negocios completo (14 docs + Research + Wireframes)  
**Objetivo:** Definir, validar y presentar un plan de negocios para una plataforma digital a un inversor.
**Estado Fase 4:** ✅ Pitch Deck pulido (v2.0, 10 slides), guión + Q&A listos, one-pager + financial model detail creados.

---

## Mapa del proyecto

| Carpeta | Propósito |
|---------|-----------|
| `Ideas/` | Las 3 ideas formuladas (+ descartadas) |
| `Decisiones/` | ADRs y acuerdos clave del proyecto |
| `Research/` | Investigación de mercado con fuentes citadas (✅ 5 docs) |
| `Business Plan/` | 14 documentos del plan de negocios |
| `Technical/` | Arquitectura, stack tecnológico, wireframes (✅ 4 screenshots) |
| `Sessions/` | Registro de sesiones con OpenCode (✅ 4 sesiones) |

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
- [x] **Fase 3:** Plan de negocios — 14 documentos completados:
  - Research con fuentes, Riesgos, Unit Economics, Cap Table (SAFE $700K pre), Exit Strategy (5.8x EV)
  - Wireframes funcionales (4 pantallas en Technical/)
  - Timeline MVP: 4 meses + 1 buffer
- [x] **Fase 4:** Presentación al inversor — Pitch Deck (10 slides YC), guión, Q&A, one-pager, financial model detail

## Decisiones de la sesión 3

| Decisión | Valor | Archivo |
|----------|-------|---------|
| Pre-money valuation | **$700K** | `Business Plan/13-Cap-Table.md` |
| Dilución al inversor | **22.2%** por $200K seed | `Business Plan/13-Cap-Table.md` |
| Instrumento de inversión | **SAFE** con Valuation Cap $1.5M | `Business Plan/13-Cap-Table.md` |
| Constitución legal | **S.A. Nicaragua** | `Business Plan/13-Cap-Table.md` |
| Timeline MVP | **4 meses + 1 buffer** | `Business Plan/11-Risk-Analysis.md` |
| Wireframes | **Código → PNGs** (sin Figma) | `Technical/Wireframes/` |
| Fuentes de mercado | DataReportal, BCN, PN, 6Wresearch | `Research/` |
| Expected Value inversor | **~5.8x** en 3-5 años | `Business Plan/14-Exit-Strategy.md` |

## Decisiones clave del proyecto

| # | Decisión | Archivo |
|---|----------|---------|
| 001 | Marketplace de Autos como idea ganadora | `Decisiones/ADR-001-Seleccion-Idea.md` |
| 002 | Stack tecnológico (Laravel + Next.js + Supabase) | `Decisiones/ADR-002-Arquitectura-Stack.md` |
| 003 | Arquitectura Frontend (monorepo con 2 apps) | `Decisiones/ADR-003-Arquitectura-Frontend.md` |
