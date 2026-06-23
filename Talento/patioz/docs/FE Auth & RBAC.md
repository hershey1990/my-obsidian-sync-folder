---
title: "Frontend Auth & RBAC — Patioz"
description: "Autenticación en el frontend: 3 grupos de usuarios, auth isolation, multi-tenant"
actualizado: 2026-06-22
outline_status: pendiente
outline_url: null
---
# Frontend — Auth & RBAC

## Grupos de usuarios

| App | Grupo | Tipo de login |
|---|---|---|
| mapui | Público / Propietarios | Standard (email + password) |
| operations | Agentes de agencia | Multi-tenant (tenantSlug requerido) |
| admin | Staff administrativo | Staff-only |

## Aislamiento estricto

Cada app tiene su propio sistema de login **aislado**:

- Una sesión de `operations` **no es válida** en `admin` ni en `mapui`
- Un token de `admin` **es rechazado** por `operations` y `mapui`
- Esto se implementa a nivel de backend (cada grupo valida contra su propio scope)

## Flujo de login (operations)

```
1. Agente ingresa email + password + tenantSlug
2. POST /api/v1/auth/login { email, password, tenantSlug }
3. Backend valida credenciales + pertenencia al tenant
4. Respuesta: JWT con claims de grupo y tenant
5. Frontend guarda token en @mapui/auth store
6. Guards verifican token en cada ruta protegida
```

## Guards

`@mapui/auth` provee:

- `AuthGuard`: envuelve rutas que requieren autenticación
- `useAuth()`: hook para acceder al usuario actual
- `authStore`: estado de sesión (Zustand)

## Roles y permisos

Definidos en el backend. El frontend usa los guards para:
- Ocultar/mostrar UI según permisos
- Redirigir a login si no hay sesión
- Redirigir a 403 si no hay permisos
