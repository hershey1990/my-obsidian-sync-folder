---
id: TSK-024
fase: 8
modulo: Admin
prioridad: media
dependencias: ["TSK-007", "TSK-017", "TSK-023"]
estimado: 3d
---

# TSK-024: Moderate listings + manage users/dealers

Funcionalidades de moderación y gestión de la plataforma.

## Entregables
- **Manage listings** (`/admin/listings`):
  - Tabla de todos los carros con filtros (estado, fecha, usuario)
  - Acciones: approve, reject (con motivo), flag for review
  - Bulk actions
- **Manage users** (`/admin/users`):
  - Tabla de usuarios con roles
  - Acciones: suspend, verify, change role
- **Manage dealers** (`/admin/dealers`):
  - Tabla de dealers con plan, estado, verificación
  - Acciones: verify, upgrade/downgrade plan, suspend
- **Model catalog CRUD** (`/admin/models`):
  - CRUD de CarModelSpecs para mantener el catálogo

## Criterios de aceptación
- Approve/reject cambia estado del carro y notifica al dueño
- Suspender usuario oculta sus carros activos
- Verificar dealer agrega badge de "Verificado"
- CRUD de modelos con validación de unique constraint
- Búsqueda y paginación en todas las tablas
