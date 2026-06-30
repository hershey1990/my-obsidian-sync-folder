---
id: TSK-023
fase: 8
modulo: Admin
prioridad: media
dependencias: ["TSK-004"]
estimado: 2d
---

# TSK-023: Admin app scaffolding + auth

Segunda app del monorepo para el backoffice administrativo.

## Entregables
- apps/admin creada con Next.js
- Layout admin con sidebar navigation
- Auth middleware (solo rol admin)
- Dashboard page con stats generales:
  - Total usuarios, dealers, carros publicados
  - Carros nuevos hoy, contactos hoy
- Integración con shared packages (@estela/ui, @estela/types)

## Criterios de aceptación
- /admin/login redirige a auth (misma sesión que web)
- Usuario sin rol admin recibe 403
- Sidebar navega entre secciones
- Dashboard stats cargan correctamente
