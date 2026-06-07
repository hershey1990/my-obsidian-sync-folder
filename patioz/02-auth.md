# Módulo de Autorización (Auth)

Este módulo, construido con **NestJS 10** y **Supabase**, gestiona la autorización mediante un sistema de **Control de Acceso Basado en Roles (RBAC)** dentro del monolite. Es crucial entender que este módulo **no se encarga de la autenticación** (login/password), sino que determina los permisos que tiene un usuario ya autenticado.

## Stack Tecnológico

- **Framework:** NestJS 10 sobre Express.
- **Lenguaje:** TypeScript 5.
- **Base de Datos:** Supabase (PostgreSQL).
- **Validación:** `class-validator` y `class-transformer`.

## Arquitectura y Flujo de Permisos

El proyecto sigue una arquitectura **Hexagonal (Clean Architecture)**, lo que garantiza una separación estricta entre la lógica de negocio y los detalles de implementación (frameworks, base de datos).

### Flujo Lógico de Permisos

La autorización de un usuario se resuelve siguiendo la cadena de relaciones en la base de datos:

`Usuario -> Rol -> Permiso (Acción + Recurso)`

Para que un usuario tenga permiso para realizar una `acción` sobre un `recurso`, debe existir una ruta que conecte su `userId` con el permiso correspondiente a través de los roles que tiene asignados.

### Diagrama de Flujo: Verificación de Permiso

El siguiente diagrama ilustra cómo un cliente externo (frontend) interactúa con este módulo para verificar un permiso a través de la capa HTTP del monolite.

```mermaid
sequenceDiagram
    participant Client as Cliente (Frontend)
    participant HTTP as Capa HTTP (Fastify)
    participant AuthModule as Módulo Auth (NestJS)
    participant Supabase as Base de Datos

    Client->>+HTTP: 1. GET /auth/check-permission?userId=...&action=...&resource=...
    HTTP->>+AuthModule: 2. Delega al módulo Auth
    AuthModule->>AuthModule: 3. Valida DTO (userId, action, resource)
    AuthModule->>+Supabase: 4. Ejecuta query para encontrar coincidencia en la cadena user_roles -> roles -> role_permissions -> permissions
    Supabase-->>-AuthModule: 5. Devuelve resultado de la query
    AuthModule->>AuthModule: 6. Registra la consulta en `audit_logs` (en segundo plano)
    AuthModule-->>-HTTP: 7. Responde con `{"hasPermission": boolean}`
    HTTP-->>-Client: 8. Responde al frontend
    deactivate AuthModule
```

## Endpoints de la API

El prefijo base para todos los endpoints es `/auth`.

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

## Estructura de la Base de Datos

Las tablas principales se encuentran en el esquema `public` de Supabase:

- `roles`: Define los roles disponibles (e.g., "admin", "viewer").
- `permissions`: Define los permisos atómicos como un par `acción` + `recurso`.
- `user_roles`: Tabla de unión que asigna roles a usuarios.
- `role_permissions`: Tabla de unión que asigna permisos a roles.
- `audit_logs`: Almacena un registro de cada llamada a `check-permission`.
