---
id: TSK-018
fase: 6
modulo: Dealers
prioridad: alta
dependencias: ["TSK-008", "TSK-017"]
estimado: 3d
---

# TSK-018: Dealer dashboard (frontend)

Dashboard del concesionario para gestionar su presencia en la plataforma.

## Entregables
- **Dealer dashboard** (`/dealer/dashboard`):
  - Cards de stats (carros activos, vistas, contactos este mes)
  - Tabla de inventario con estado (published/draft/sold)
  - Acciones rápidas: editar, marcar como vendido, destacar
  - Enlace al publish wizard
- **Dealer profile page** (`/dealers/[id]`):
  - Información del concesionario
  - Grid de inventario activo
  - Badge de plan (Pro, Básico, Enterprise)
  - Botón "Contactar dealer"

## Criterios de aceptación
- Dashboard carga datos reales del API
- Marcar carro como vendido → desaparece de search
- Dealer profile público muestra solo published cars
- Stats se actualizan al cambiar inventario
