---
id: TSK-005
fase: 1
modulo: Auth
prioridad: alta
dependencias: ["TSK-004"]
estimado: 3d
---

# TSK-005: Landing page + Auth pages (frontend)

Páginas públicas de aterrizaje y autenticación.

## Entregables
- **Landing page** (`/`) — Hero, cómo funciona, features, CTA
- **Login page** (`/auth/login`) — formulario con email + password
- **Register page** (`/auth/register`) — formulario con nombre, email, teléfono, password
- BFF proxy forwarding cookies
- Middleware de ruta por rol (redirect si no autenticado)

## Criterios de aceptación
- La landing carga rápido (RSC, ISR)
- Login/register flujo completo: formulario → API → redirect
- Usuario logueado ve su nombre en Header
- Usuario no logueado ve botón "Iniciar sesión"
