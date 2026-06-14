---
tags:
  - patioz/timeline
---
# 🗓 Timeline de Patioz

```mermaid
gantt
    title Roadmap de Patioz
    dateFormat  YYYY-MM-DD
    axisFormat  %Y-%m

    section ⚙️ Fundación
    Definición de arquitectura          :milestone, m1, 2026-01-15, 0d
    Setup de infraestructura            :infra, 2026-01-15, 14d
    Repositorios y CI/CD                :repos, after infra, 7d

    section 🔐 Auth
    Auth API (NestJS + Supabase)        :auth, after repos, 30d
    RBAC + permisos                     :after auth, 14d

    section 🧩 BFF
    BFF (Fastify + Clean Arch)          :bff, after repos, 35d
    Integración QStash                  :after bff, 10d

    section 🗺 Frontend
    MapUI (Next.js + Leaflet)           :frontend, after bff, 40d
    Búsqueda híbrida (Google + GeoJSON) :after frontend, 14d

    section 📁 Imágenes
    imgproxy-api (S3 + CDN)             :img, after bff, 20d
    Procesamiento de imágenes (Sharp)   :after img, 10d

    section 🚀 Lanzamiento
    MVP (funcionalidades core)          :milestone, m2, after frontend img, 0d
    Correcciones y feedback             :after m2, 14d
    Producción                          :milestone, m3, after m2, 0d
```

## Milestones Clave

| Hito | Fecha | Descripción |
|---|---|---|
| 🏗 Fundación | — | Definición de arquitectura, infraestructura, CI/CD |
| ✅ MVP | — | Funcionalidades core operativas |
| 🚀 Producción | — | Release a producción |

> *Las fechas son estimadas. Actualizar este archivo a medida que el proyecto avanza.*
