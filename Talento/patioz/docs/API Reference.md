---
title: "API Reference — Patioz"
description: "Referencia de endpoints de la API REST de Patioz (api/v1)"
actualizado: 2026-06-22
outline_status: pendiente
outline_url: null
---
# API Reference — Patioz

## Base URL

```
https://api.patioz.co/api/v1
```

## Autenticación

Todas las rutas son privadas por defecto (requieren `Authorization: Bearer <jwt>`). Las rutas públicas se marcan explícitamente.

### Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | Público | Registro de usuario |
| `POST` | `/auth/login` | Público | Login (devuelve JWT) |
| `GET` | `/auth/me` | JWT | Perfil del usuario autenticado |

### Properties

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/properties` | JWT | Listar propiedades |
| `GET` | `/properties/:id` | JWT | Detalle de propiedad |
| `POST` | `/properties` | JWT + RBAC | Crear propiedad |
| `PATCH` | `/properties/:id` | JWT + RBAC | Actualizar propiedad |
| `PATCH` | `/properties/:id/content` | JWT + RBAC | Actualizar contenido (descripción, título) |
| `DELETE` | `/properties/:id` | JWT + RBAC | Eliminar propiedad |

### Listings

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/listings` | JWT | Listar publicaciones |
| `GET` | `/listings/:id` | JWT | Detalle de publicación |
| `POST` | `/listings` | JWT + RBAC | Crear publicación |
| `PATCH` | `/listings/:id` | JWT + RBAC | Actualizar publicación |
| `DELETE` | `/listings/:id` | JWT + RBAC | Eliminar publicación |

### Files

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/files/upload` | JWT + RBAC | Subir archivo (multipart/form-data) |
| `GET` | `/files/:id` | JWT | Obtener metadatos de archivo |
| `DELETE` | `/files/:id` | JWT + RBAC | Eliminar archivo |

### Locations

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/locations?level=&parentId=` | JWT | Listar zonas por jerarquía |
| `GET` | `/locations/:id/geometry` | JWT | Obtener GeoJSON de zona |
| `POST` | `/locations/search` | JWT | Buscar + verificar ubicación |
| `GET` | `/locations/containing?lat=&lng=` | JWT | Zonas que contienen un punto |

### Maps

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/maps/geocode?address=` | JWT | Geocoding de dirección |
| `GET` | `/maps/reverse?lat=&lng=` | JWT | Geocoding inverso |

### Health

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | Público | Estado de dependencias |

## Formato de Errores

```json
{
  "statusCode": 400,
  "message": ["title must be a string"],
  "error": "Bad Request"
}
```

## Paginación

Endpoints `GET` que devuelven listas aceptan:

| Query Param | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Items por página |
| `sort` | string | `created_at` | Campo de ordenamiento |
| `order` | `asc` \| `desc` | `desc` | Dirección |

## RBAC

Endpoints protegidos requieren `@Permission(resource, action)`:

| Recurso | Acciones |
|---|---|
| `properties` | `create`, `read`, `update`, `delete` |
| `listings` | `create`, `read`, `update`, `delete` |
| `files` | `upload`, `read`, `delete` |
| `leads` | `read`, `assign`, `close` |
