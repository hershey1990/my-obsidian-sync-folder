---
id: TSK-022
fase: 7
modulo: Contacto
prioridad: media
dependencias: ["TSK-005", "TSK-020", "TSK-021"]
estimado: 2d
---

# TSK-022: User dashboard + profile editing

Panel de usuario con sus actividades y edición de perfil.

## Entregables
- **User dashboard** (`/account`):
  - Resumen: favoritos, contactos enviados, carros publicados (si es dealer)
- **Favorites list** (`/account/favorites`): grid de carros guardados
- **My cars** (`/account/cars`): lista de carros publicados por el usuario
- **Profile edit** (`/account/profile`): nombre, email, teléfono, avatar
  - PUT /api/v1/users/me endpoint

## Criterios de aceptación
- Dashboard muestra datos reales del usuario
- Editar perfil persiste cambios
- My cars lista solo carros del usuario autenticado
- Navegación entre secciones del dashboard
