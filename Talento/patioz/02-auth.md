# Módulo de Autorización y Autenticación (Auth)

Este módulo gestiona tanto la **autenticación** (login/signup) como la **autorización** (roles y permisos RBAC) dentro del monolite, utilizando **Supabase Auth** y **PostgreSQL**.

Tras el ADR-007, la lógica de auth se integró completamente en el monolite eliminando el submódulo NestJS heredado. Fastify expone los endpoints `/auth/*` y delega directamente al módulo de dominio.

## Stack Tecnológico

- **Autenticación:** Supabase Auth (login, signup, sesiones JWT).
- **Base de Datos:** Supabase (PostgreSQL) — roles, permisos y usuarios del dominio en el esquema `public`.
- **SDK:** `@supabase/supabase-js` desde la capa de infraestructura.
- **Capa HTTP:** Fastify expone los endpoints `/auth/*`.

## Arquitectura y Flujo de Permisos

El módulo sigue una arquitectura **Hexagonal (Clean Architecture)** encapsulada en el monolite. La lógica de dominio de auth no depende de frameworks ni de Supabase directamente — solo las implementaciones de infraestructura.

### Flujo Lógico de Permisos

La autorización de un usuario se resuelve siguiendo la cadena de relaciones en la base de datos:

`Usuario -> Rol -> Permiso (Acción + Recurso)`

Para que un usuario tenga permiso para realizar una `acción` sobre un `recurso`, debe existir una ruta que conecte su `userId` con el permiso correspondiente a través de los roles que tiene asignados.

### Diagrama de Flujo: Verificación de Permiso

```mermaid
sequenceDiagram
    participant Client as Cliente (Frontend)
    participant HTTP as Capa HTTP (Fastify)
    participant AuthModule as Módulo Auth
    participant Supabase as Base de Datos

    Client->>+HTTP: 1. GET /auth/check-permission?userId=...&action=...&resource=...
    HTTP->>+AuthModule: 2. Delega al módulo Auth
    AuthModule->>AuthModule: 3. Valida DTO (userId, action, resource)
    AuthModule->>+Supabase: 4. Ejecuta query RBAC
    Supabase-->>-AuthModule: 5. Devuelve resultado
    AuthModule->>AuthModule: 6. Registra en audit_logs (background)
    AuthModule-->>-HTTP: 7. Responde {"hasPermission": boolean}
    HTTP-->>-Client: 8. Responde al frontend
    deactivate AuthModule
```

## Endpoints de la API

El prefijo base para todos los endpoints es `/auth`.

### `POST /register`

Crea un nuevo usuario. Los desarrolladores deben usar este método para simular flujos idénticos a producción.

- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta Exitosa:** `201 Created` con `{ "user": User, "session": Session }`

### `POST /login`

Inicia sesión y devuelve un JWT.

- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta Exitosa:** `200 OK` con `{ "user": User, "session": Session }`

### `POST /assign-role`

Asigna un rol a un usuario específico.

- **Body:**
  ```json
  {
    "userId": "uuid",
    "roleName": "string"
  }
  ```
- **Respuesta Exitosa:** `201 Created` con `{ "message": "Role assigned successfully" }`

---

### `GET /check-permission`

Verifica si un usuario tiene un permiso. Esta acción genera un registro de auditoría.

- **Query Params:**
  - `userId` (uuid): ID del usuario a verificar.
  - `action` (string): Acción que se desea realizar (e.g., "read", "create").
  - `resource` (string): Recurso sobre el que se actúa (e.g., "reports", "invoices").
- **Respuesta Exitosa:** `200 OK` con `{ "hasPermission": boolean }`

---

### `GET /audit-logs`

Obtiene los registros de auditoría de las verificaciones de permisos, con paginación.

- **Query Params:**
  - `limit` (number, opcional, default: 50): Cantidad de registros a devolver.
  - `offset` (number, opcional, default: 0): Desplazamiento para la paginación.
- **Respuesta Exitosa:** `200 OK` con `{ "data": AuditLog[] }`

## Flujo de Desarrollo

1. Las migraciones (seeds) crean un usuario de prueba con roles predefinidos.
2. Los desarrolladores crean usuarios adicionales usando `POST /register` para simular flujos reales.
3. No se permite insertar usuarios directamente en `auth.users` de Supabase.

## Estructura de la Base de Datos

Las tablas principales se encuentran en el esquema `public` de Supabase:

- `users`: Sincronizada con `auth.users` mediante triggers de base de datos.
- `roles`: Define los roles disponibles (e.g., "admin", "viewer").
- `permissions`: Define los permisos atómicos como un par `acción` + `recurso`.
- `user_roles`: Tabla de unión que asigna roles a usuarios.
- `role_permissions`: Tabla de unión que asigna permisos a roles.
- `audit_logs`: Almacena un registro de cada llamada a `check-permission`.
