---
id: TSK-021
fase: 7
modulo: Contacto
prioridad: media
dependencias: ["TSK-004", "TSK-007"]
estimado: 1d
---

# TSK-021: Favorites (backend + frontend)

Sistema de "Me interesa" para que compradores guarden carros.

## Entregables
- Tabla `favorites` (user_id, car_id, timestamps) — migración
- POST /api/v1/favorites (add), DELETE /api/v1/favorites/{car} (remove)
- GET /api/v1/favorites (list)
- Botón ♡ en CarCard y CarDetail
- Badge de conteo en Header

## Criterios de aceptación
- Toggle heart funciona sin recargar
- Lista de favoritos accesible desde /account/favorites
- Corazón coloreado si ya está en favoritos
- Usuario no autenticado ve heart gris (redirige a login al click)
