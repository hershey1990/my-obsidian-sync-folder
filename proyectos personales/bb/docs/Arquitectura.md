---
tags:
  - bb/docs
---
# BB — Arquitectura

> Documento en borrador. Se completará al definir ADRs de arquitectura.

## Visión general

BB es un SaaS multi-tenant de time tracking con soporte offline-first vía PWA.

### Componentes principales

- **Backend API** — REST API en TypeScript (NestJS o Express)
- **Base de datos** — PostgreSQL (Supabase)
- **Auth** — Supabase Auth con JWT
- **Frontend PWA** — React + Vite + Tailwind CSS
- **Exportación** — Biblioteca xlsx para generación de reportes Excel

### Flujo de datos

```
[PWA (offline)] ←→ [API] ←→ [PostgreSQL]
       ↓
[Exportación Excel] → [Reporte mensual]
```
