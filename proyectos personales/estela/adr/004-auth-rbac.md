---
tipo: adr
fecha: 2026-06-11
estado: aceptado
proyecto: estela-be
implementado: pendiente
decision: "Laravel Sanctum + spatie/laravel-permission con RBAC granular y BFF proxy via Next.js"
tags:
  - adr
  - estela
  - auth
  - rbac
  - seguridad
---
# ADR-004: Auth & RBAC

## Contexto

Se requiere definir el sistema de autenticación y autorización del Marketplace de Autos (Proyecto Estela). La plataforma tiene 4 actores (buyer, dealer, admin, super-admin) que comparten login pero tienen diferentes capacidades. Es necesario decidir:

1. Librería de permisos y roles
2. Nivel de granularidad (roles planos vs permisos granulares)
3. Tablas de autorización
4. Flujo de login, registro y verificación de sesión
5. Estrategia de middleware por rol
6. Seeders de permisos iniciales

## Stack de autenticación

| Capa | Tecnología | Propósito |
|---|---|---|
| Auth provider | **Laravel Sanctum** | Token-based auth (ya definido en ADR-002) |
| RBAC library | **spatie/laravel-permission** | Roles + permisos granulares con caching |
| Transport | **httpOnly cookies** via BFF Proxy (Next.js) | Seguridad XSS, dominio `.estela.com` |
| Session validation | **GET /api/v1/me** con middleware auth:sanctum | Cada carga de app verifica sesión |

## Roles y permisos

### Roles del sistema

| Role | Descripción | Acceso |
|---|---|---|
| `buyer` | Usuario comprador registrado | Web pública + dashboard personal |
| `dealer` | Vendedor con perfil profesional | Todo lo de buyer + dealer dashboard + publicar autos |
| `admin` | Moderador del backoffice | Admin panel (moderar listings, users, dealers) |
| `super-admin` | Dueño del sistema | Todo. Se asigna solo desde DB. |

### Permisos por rol

```
buyer:
  ─ cars.search, cars.view
  ─ favorites.manage
  ─ contact.seller

dealer:
  ─ (todo buyer)
  ─ cars.create, cars.edit, cars.delete (own)
  ─ dealer.profile.manage

admin:
  ─ (todo)
  ─ listings.moderate
  ─ users.manage
  ─ dealers.manage
  ─ settings.manage

super-admin:
  ─ (implicit all via gate before())
```

### Convención de naming de permisos

```
{recurso}.{accion}

Recursos: cars, favorites, contact, dealer, listings, users, settings
Acciones: view, search, create, edit, delete, manage, moderate
```

## Esquema de tablas (spatie/laravel-permission)

Spatie usa 6 tablas que se publican con su migration. Se incluyen en la migración inicial de auth.

```sql
-- roles
CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    guard_name  VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(name, guard_name)
);

-- permissions
CREATE TABLE permissions (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    guard_name  VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(name, guard_name)
);

-- model_has_roles (user_id → role_id)
CREATE TABLE model_has_roles (
    model_id        BIGINT NOT NULL,
    model_type      VARCHAR(255) NOT NULL,
    role_id         BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (model_id, model_type, role_id)
);
CREATE INDEX idx_model_has_roles_model ON model_has_roles(model_id, model_type);

-- model_has_permissions
CREATE TABLE model_has_permissions (
    model_id        BIGINT NOT NULL,
    model_type      VARCHAR(255) NOT NULL,
    permission_id   BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (model_id, model_type, permission_id)
);
CREATE INDEX idx_model_has_permissions_model ON model_has_permissions(model_id, model_type);

-- role_has_permissions
CREATE TABLE role_has_permissions (
    permission_id   BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    role_id         BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (permission_id, role_id)
);
```

### Notas sobre la tabla `users`

La tabla `users` (definida en ADR-002) se mantiene igual. NO se agrega columna `role` — el role se asigna via spatie (`model_has_roles`). La columna `role` existente en el schema de ADR-002 se omite o se deja como denormalización de lectura (actualizada por un observer).

**Decisión:** Se quita el enum `role` de la tabla `users`. El role se obtiene via `$user->getRoleNames()` de spatie. Si se necesita denormalizar para queries rápidas (ej. listar admins), se usa un scope o índice en `model_has_roles`.

## Flujo de autenticación

### Login unificado

```
POST /api/v1/auth/login → { email, password }
  → Laravel valida credenciales via Sanctum
  → Obtiene roles del usuario via spatie
  → Crea token Sanctum (abilities = lista de permisos)
  → Response 200: { data: { user, role: primary_role }, token }
  → NO se guarda en cookie desde Laravel
  → El BFF proxy (Next.js) recibe el token y lo setea como httpOnly cookie
```

```
Next.js API Route (/api/auth/login):
  1. Recibe POST del browser
  2. Forward a POST /api/v1/auth/login (Laravel)
  3. Recibe { user, token }
  4. Setea cookie httpOnly: sanctum_token={token}; Secure; SameSite=Lax; Path=/; Domain=.estela.com
  5. Redirige según role:
     ─ buyer  → /
     ─ dealer → /dealer/dashboard
     ─ admin/super-admin → admin.estela.com
```

### Registro

```
POST /api/v1/auth/register → { name, email, phone, password, password_confirmation }
  → Valida reglas (email único, password ≥ 8 + mayúscula + número, teléfono +505)
  → Crea User
  → Asigna role `buyer` via spatie ($user->assignRole('buyer'))
  → Crea token Sanctum
  → Response 201: { data: { user, role: buyer } }
```

### Verificación de sesión

```
GET /api/v1/me → Auth header: Bearer {token}
  → Sanctum valida token
  → Spatie eager-loads roles
  → Response 200: { data: { id, name, email, phone, role, avatar, created_at } }
  → Response 401 (token inválido/expirado)
```

### Logout

```
POST /api/v1/auth/logout
  → Sanctum revoca token actual
  → Next.js elimina cookie
  → Response 200: { message: "Sesión cerrada" }
```

## Estrategia de middleware

### Laravel (API)

```php
// routes/api.php
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Rutas protegidas por permiso
    Route::middleware('permission:cars.create')->group(function () {
        Route::post('/cars', [CarController::class, 'store']);
    });
});
```

### Next.js (BFF y frontend)

```typescript
// apps/web/middleware.ts
// Lee cookie sanctum_token
// Si no existe → redirect a /auth/login (para rutas protegidas)
// Si existe → GET /api/v1/me para validar
// Según role: redirect si no tiene permiso

// apps/admin/middleware.ts
// Igual + verifica role=admin|super-admin
```

## Seeders

La migración + seed corre al levantar el proyecto.

```php
// database/seeders/RolePermissionSeeder.php

// 1. Crear permisos
$permissions = ['cars.view', 'cars.search', 'cars.create', 'cars.edit', 'cars.delete',
    'favorites.manage', 'contact.seller',
    'dealer.profile.manage',
    'listings.moderate', 'users.manage', 'dealers.manage', 'settings.manage'];

foreach ($permissions as $perm) {
    Permission::create(['name' => $perm, 'guard_name' => 'web']);
}

// 2. Crear roles y asignar permisos
$buyer = Role::create(['name' => 'buyer', 'guard_name' => 'web']);
$buyer->givePermissionTo(['cars.view', 'cars.search', 'favorites.manage', 'contact.seller']);

$dealer = Role::create(['name' => 'dealer', 'guard_name' => 'web']);
$dealer->givePermissionTo(Permission::whereNotIn('name', ['listings.moderate', 'users.manage', 'dealers.manage', 'settings.manage'])->get());

$admin = Role::create(['name' => 'admin', 'guard_name' => 'web']);
$admin->givePermissionTo(Permission::all());
```

## Consideraciones de seguridad

| Riesgo | Mitigación |
|---|---|
| XSS | Token en httpOnly cookie, no en JS accesible |
| CSRF | Sanctum CSRF protection + SameSite=Lax |
| Token leak | Cookie Secure + expiración 24h |
| Rate limiting | 5 intentos/min/IP en login |
| Registro abusivo | Email único + rate limiting por IP |

## Consecuencias

1. **Spatie como dependencia** — Se agrega `spatie/laravel-permission` a composer.json
2. **Sin columna role en users** — El role se lee de spatie. Si se necesita denormalizar, se agrega después.
3. **Seeders obligatorios** — El sistema no funciona sin los seeders de roles y permisos iniciales.
4. **Migración de spatie** — Se publica y corre en la migración inicial de auth (TSK-004).
5. **BFF proxy más inteligente** — Next.js necesita leer el role de la response de login para redirigir correctamente.
6. **Permisos en abilities de Sanctum** — Opcional: se pueden pasar permisos como abilities del token para validación rápida en frontend sin llamar a `/me`.

## Referencias

- [spatie/laravel-permission docs](https://spatie.be/docs/laravel-permission)
- [Laravel Sanctum docs](https://laravel.com/docs/sanctum)
- ADR-002: Arquitectura de Software Stack
- ADR-003: Arquitectura Frontend
