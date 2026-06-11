---
id: TSK-004
fase: 1
modulo: Auth
prioridad: alta
dependencias: []
estimado: 3d
---

# TSK-004: Users domain + Auth API (Sanctum)

Modelo de usuarios y endpoints de autenticación.

## Entregables
- User model con roles (user, dealer, admin)
- ValueObject PhoneNumber
- Enum UserRole
- RegisterUserService, LoginService
- AuthController (POST register, login, logout; GET me)
- Sanctum token-based via BFF proxy (httpOnly cookies)

## Criterios de aceptación
- POST /api/v1/register crea usuario y devuelve token
- POST /api/v1/login autentica y devuelve token en cookie
- GET /api/v1/me devuelve usuario autenticado
- POST /api/v1/logout invalida token
- Roles protegidos por middleware
