---
id: TSK-004
fase: 1
modulo: Auth
tipo: backend
prioridad: alta
dependencias: []
estimado: 3d
responsable: TBD
tags:
  - auth
  - sanctum
  - spatie
  - api
---

# TSK-004: Users domain + Auth API (Sanctum + Spatie)

Modelo de usuarios, integración con spatie/laravel-permission y endpoints de autenticación.

## Entregables

### Domain
- `User.php` — Eloquent Model (id, name, email, phone, password, avatar, verified_at)
  - HasRoles trait de spatie
  - HasApiTokens trait de Sanctum
  - Mutator: password hasheado al setear
  - Casts: email_verified_at (datetime)
- `Domain/Users/ValueObjects/PhoneNumber.php` — Value Object con formato +505XXXXXXXX
  - `__construct(string $value)` — valida formato
  - `format(): string` — devuelve +505XXXXXXXX
  - `isValid(): bool` — validación estática
- `Domain/Users/Enums/UserRole.php` — Enum de roles (buyer, dealer, admin, super_admin)
  - Método `label(): string` — traducción legible
  - Método `isAtLeast(UserRole $role): bool` — jerarquía de roles

### Application
- `RegisterUserService.php`
  - Recibe RegisterUserRequest
  - Valida reglas de negocio (email único, password policy, teléfono)
  - Crea User + assignRole('buyer')
  - Crea token Sanctum
  - Devuelve User + role + token
- `LoginService.php`
  - Valida credenciales
  - Crea token Sanctum
  - Devuelve User + role + token
- `LogoutService.php`
  - Revoca token actual
- `MeService.php`
  - Devuelve User autenticado con role

### Presentation
- `RegisterUserRequest.php` — Form Request
  - name: required, string, max:255
  - email: required, email, unique:users
  - phone: required, string, regex:/^\+505\d{8}$/
  - password: required, string, min:8, regex:/[A-Z]/, regex:/[0-9]/, confirmed
- `AuthController.php`
  - `register(RegisterUserRequest $request)` → 201
  - `login(LoginRequest $request)` → 200/401
  - `me(Request $request)` → 200/401
  - `logout(Request $request)` → 200
- Routes: `routes/api.php`
  - POST /api/v1/auth/register
  - POST /api/v1/auth/login
  - GET /api/v1/auth/me (auth:sanctum)
  - POST /api/v1/auth/logout (auth:sanctum)

### Infrastructure
- Spatie migration publicada (roles, permissions, model_has_roles, model_has_permissions, role_has_permissions)
- `RolePermissionSeeder.php` — seeders con permisos y roles según ADR-004
- Sanctum config: token expiración 24h

### Tests (Pest)
- `Unit/Domain/Users/PhoneNumberTest.php`
- `Feature/Api/V1/Auth/RegisterTest.php`
- `Feature/Api/V1/Auth/LoginTest.php`
- `Feature/Api/V1/Auth/MeTest.php`
- `Feature/Api/V1/Auth/LogoutTest.php`

## Criterios de aceptación

1. POST /api/v1/auth/register crea usuario con role `buyer`, devuelve 201 + user + token
2. POST /api/v1/auth/register rechaza email duplicado con 422
3. POST /api/v1/auth/register rechaza password débil con 422
4. POST /api/v1/auth/register rechaza teléfono inválido con 422
5. POST /api/v1/auth/login autentica y devuelve 200 + user + role + token
6. POST /api/v1/auth/login rechaza credenciales inválidas con 401
7. GET /api/v1/auth/me devuelve usuario autenticado con role
8. GET /api/v1/auth/me devuelve 401 si token inválido/expirado
9. POST /api/v1/auth/logout invalida token, siguientes requests dan 401
10. Seeder crea todos los roles y permisos definidos en ADR-004
11. Rate limiting: 5 intentos de login por minuto por IP (429 después del límite)

## Checklist de implementación

- [ ] Publicar y correr migration de spatie/laravel-permission
- [ ] Crear seeder RolePermissionSeeder
- [ ] Agregar HasRoles + HasApiTokens a User model
- [ ] Crear PhoneNumber ValueObject
- [ ] Crear UserRole enum
- [ ] Crear RegisterUserRequest
- [ ] Crear RegisterUserService
- [ ] Crear LoginService
- [ ] Crear LogoutService
- [ ] Crear MeService
- [ ] Crear AuthController (register, login, me, logout)
- [ ] Definir rutas en routes/api.php
- [ ] Configurar expiración de token Sanctum
- [ ] Configurar rate limiting en Laravel
- [ ] Escribir tests unitarios (PhoneNumber)
- [ ] Escribir tests feature (register, login, me, logout)
- [ ] Correr tests y verificar cobertura
