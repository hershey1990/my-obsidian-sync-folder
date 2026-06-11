---
id: DEF-001
fase: 1
modulo: Auth
estado: planning
---

# Definición — Módulo Auth (Fase 1)

## Propósito
Permitir que usuarios se registren, autentiquen y gestionen su sesión en la plataforma. Es la puerta de entrada para todas las interacciones personalizadas.

## Actores
| Actor | Descripción |
|---|---|
| **Visitante** | Usuario no autenticado. Solo ve landing y search. |
| **Comprador** | Usuario registrado. Puede ver detalles, guardar favoritos, contactar vendedores. |
| **Dealer** | Usuario con rol dealer. Puede publicar carros, gestionar inventario, tener perfil profesional. |
| **Admin** | Usuario con rol admin. Accede al backoffice para moderar. |

## Flujo de negocio

### Registro
```
Visitante → /auth/register → llena formulario (nombre, email, teléfono, password)
  → POST /api/v1/register → sistema valida (email único, password ≥ 8 chars, teléfono formato NI)
  → Crea User con role=user → devuelve token en httpOnly cookie
  → Redirect a /account
```

### Inicio de sesión
```
Usuario → /auth/login → email + password
  → POST /api/v1/login → Sanctum valida credenciales
  → Devuelve token en httpOnly cookie → redirect a página anterior o /account
```

### Cierre de sesión
```
Usuario autenticado → click "Cerrar sesión"
  → POST /api/v1/logout → invalida token → limpia cookie → redirect a /
```

### Verificación de sesión
```
App carga → GET /api/v1/me
  → Si token válido: devuelve User + role
  → Si token inválido/expirado: 401 → mostrar UI de visitante
```

## Reglas de negocio
1. Email debe ser único en el sistema.
2. Password mínimo 8 caracteres, al menos 1 mayúscula y 1 número.
3. Teléfono debe ser formato Nicaragua (+505XXXXXXXX).
4. El usuario nace con rol `user`. El upgrade a `dealer` se hace desde el dashboard (Fase 6).
5. Rol `admin` solo se asigna desde base de datos o backoffice (Fase 8).
6. Sesión expira después de 24h de inactividad (configurable).
7. Rate limiting: máximo 5 intentos de login por minuto por IP.

## Esquemas de datos

### POST /api/v1/register
```json
// Request
{
  "name": "string (required, max 255)",
  "email": "string (required, email, unique)",
  "phone": "string (required, format +505XXXXXXXX)",
  "password": "string (required, min 8, 1 mayúscula, 1 número)",
  "password_confirmation": "string (required, must match password)"
}

// Response 201
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "user",
    "created_at": "datetime"
  },
  "message": "Usuario registrado exitosamente"
}
```

### POST /api/v1/login
```json
// Request
{
  "email": "string (required)",
  "password": "string (required)"
}

// Response 200
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "user|dealer|admin",
    "avatar": "string|null",
    "created_at": "datetime"
  },
  "message": "Sesión iniciada"
}

// Response 401
{
  "message": "Credenciales inválidas"
}
```

### GET /api/v1/me
```json
// Response 200
{
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "user|dealer|admin",
    "avatar": "string|null",
    "email_verified_at": "datetime|null",
    "created_at": "datetime"
  }
}

// Response 401
{
  "message": "No autenticado"
}
```

### POST /api/v1/logout
```json
// Response 200
{
  "message": "Sesión cerrada"
}
```

## Dependencias técnicas
| Dependencia | Tipo | Propósito |
|---|---|---|
| Laravel Sanctum | Librería | Auth token-based con httpOnly cookies |
| BFF Proxy | Arquitectura | Proxy en Next.js para forward cookies al frontend |
| Tabla `users` | DB | Migración ya incluida en TSK-002 |
| @estela/types | Shared package | Interfaces TypeScript para User, LoginRequest, RegisterRequest |

## Limite y alcance (Scope)
**Incluye:**
- Registro, login, logout, verificación de sesión
- Roles básicos (user, dealer, admin)
- BFF proxy para cookies

**No incluye (futuro):**
- Verificación de email (post-MVP)
- Recuperación de password (post-MVP)
- OAuth social (post-MVP)
- 2FA (post-MVP)
