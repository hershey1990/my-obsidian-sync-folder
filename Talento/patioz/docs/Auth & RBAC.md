---
title: Auth & RBAC — Patioz
description: "Autenticación y autorización: flujo de login, JWT, roles y permisos"
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Auth & RBAC

## Cómo funciona la autenticación

Patioz usa **Supabase Auth** como proveedor de autenticación y **JWT** para sesiones:

1. **Registro:** `POST /api/v1/auth/register` crea el usuario en Supabase Auth
2. **Login:** `POST /api/v1/auth/login` devuelve un JWT
3. **Cada request:** El JWT se envía en el header `Authorization: Bearer <token>`
4. **Validación:** `JwtAuthGuard` (global) valida el JWT en cada endpoint

### Rutas públicas

Los endpoints marcados con `@Public()` no requieren JWT:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/health`

Todas las demás rutas son privadas por defecto.

## Cómo funciona la autorización (RBAC)

### Modelo

```
Usuario → Rol → Permiso (Acción + Recurso)
```

Un usuario tiene uno o más roles. Cada rol tiene permisos. Un permiso es un par `acción + recurso` (ej. `create` sobre `properties`).

### Verificación en el código

```typescript
@UseGuards(AuthorizeGuard)
@Permission("properties", "create")
@Post()
async create(@Body() dto: CreatePropertyDto) { ... }
```

Si el usuario no tiene el permiso, la API responde `403 Forbidden`.

### Recursos y acciones disponibles

| Recurso | Acciones |
|---|---|
| `properties` | `create`, `read`, `update`, `delete` |
| `listings` | `create`, `read`, `update`, `delete` |
| `files` | `upload`, `read`, `delete` |
| `leads` | `read`, `assign`, `close` |

## Roles predefinidos

| Rol | Permisos |
|---|---|
| **Admin** | Todos los permisos sobre todos los recursos |
| **Agent** | CRUD de properties, listings y files propios. Lectura de leads asignados. |
| **Viewer** | Solo lectura de properties y listings públicos |

## Estructura de la base de datos

- `auth.users` — tabla de Supabase Auth (usuarios, contraseñas, sesiones)
- `public.users` — sincronizada con `auth.users` vía trigger
- `public.roles` — roles del sistema
- `public.permissions` — permisos atómicos (acción + recurso)
- `public.user_roles` — asignación usuario → rol
- `public.role_permissions` — asignación rol → permisos
- `public.audit_logs` — registro de cada verificación de permisos

## Desarrollo local

Las migraciones crean un usuario admin de prueba. Para probar flujos de usuario real, usar `POST /api/v1/auth/register`. No insertar usuarios directamente en `auth.users`.
