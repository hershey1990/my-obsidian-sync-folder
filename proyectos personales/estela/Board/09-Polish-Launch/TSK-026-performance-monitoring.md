---
id: TSK-026
fase: 9
modulo: Lanzamiento
prioridad: alta
dependencias: ["TSK-007", "TSK-009", "TSK-011"]
estimado: 2d
---

# TSK-026: Performance + monitoring (Sentry)

Monitoreo y optimización de performance pre-lanzamiento.

## Entregables
- Sentry configurado en Laravel (backend)
- Sentry configurado en Next.js (frontend web + admin)
- Logs estructurados (Laravel logging)
- Lighthouse audit: Performance > 85, Accessibility > 90
- Optimización de imágenes (next/image + WebP)
- Bundle analysis (Turborepo + @next/bundle-analyzer)
- Error boundaries en frontend

## Criterios de aceptación
- Error en backend aparece en Sentry en < 1 min
- Lighthouse mobile performance > 75
- Imágenes se sirven en WebP con lazy loading
- Bundle de páginas públicas < 150KB (JS inicial)
- Error boundary muestra UI amigable en vez de pantalla blanca
