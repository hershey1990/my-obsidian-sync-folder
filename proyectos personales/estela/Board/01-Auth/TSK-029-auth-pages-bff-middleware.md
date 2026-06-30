---
id: TSK-029
fase: 1
modulo: Auth
tipo: frontend
prioridad: alta
dependencias: ["TSK-004"]
estimado: 2d
responsable: TBD
tags:
  - auth
  - frontend
  - nextjs
  - bff
  - middleware
---

# TSK-029: Auth pages + BFF proxy + Middleware + Store

Formularios de autenticación, proxy BFF, middleware de rutas, store de sesión y tipos compartidos.

## Entregables

### Login page (`/auth/login`)
- Client Component con react-hook-form + zod
- Campos: email, password
- Validación client-side: email format, password no vacío
- Submit → POST /api/auth/login (BFF proxy) → redirect según role
- Estados: loading spinner, error (credenciales inválidas), rate limit (429)
- Link a registro

### Register page (`/auth/register`)
- Client Component con react-hook-form + zod
- Campos: name, email, phone, password, password_confirmation
- Validación client-side: email, phone (+505XXXXXXXX), password match, password strength (1 mayúscula + 1 número)
- Submit → POST /api/auth/register (BFF proxy) → redirect a landing
- Estados: loading, error, success

### BFF proxy (Next.js API Routes)
- `apps/web/src/app/api/auth/login/route.ts`
  - POST: forward a `POST /api/v1/auth/login` (Laravel)
  - Recibe { data: { user, role }, token }
  - Setea httpOnly cookie: `sanctum_token={token}; HttpOnly; Secure; SameSite=Lax; Path=/`
  - Response 200: { user, role }
- `apps/web/src/app/api/auth/register/route.ts`
  - POST: forward a `POST /api/v1/auth/register`
  - Misma lógica de cookie
- `apps/web/src/app/api/auth/logout/route.ts`
  - POST: forward a `POST /api/v1/auth/logout`
  - Elimina cookie sanctum_token
  - Response 200
- `apps/web/src/app/api/auth/me/route.ts`
  - GET: forward a `GET /api/v1/auth/me` (con cookie sanctum_token)
  - Response: { user, role } o 401

### Middleware de ruta
- `apps/web/middleware.ts`
  - Lee cookie sanctum_token
  - GET /api/auth/me para validar sesión
  - `/account/*` → redirect a `/auth/login` si no auth
  - `/dealer/*` → redirect a `/` si role != dealer/admin/super_admin
  - `/auth/*` → redirect a `/` si ya tiene sesión
- `apps/admin/middleware.ts`
  - Verifica role = admin/super_admin
  - Si no → 403

### Auth store (Zustand)
- `lib/stores/auth-store.ts`
  - user: User | null
  - role: string | null
  - isAuthenticated: boolean
  - isLoading: boolean
  - login(email, password): Promise<void>
  - register(data): Promise<void>
  - logout(): Promise<void>
  - checkSession(): Promise<void> — llama a /api/auth/me
- Integración con TanStack Query para caching

### Types (@estela/types)
- `User` — id, name, email, phone, role, avatar, email_verified_at, created_at
- `LoginRequest` — email, password
- `RegisterRequest` — name, email, phone, password, password_confirmation
- `UpdateProfileRequest` — name?, phone?, current_password?, new_password?, new_password_confirmation?
- `AuthResponse` — data: { user, role }, message?
- `APIResponse<T>` — data?: T, error?: { code, message, details? }

### API Client
- `lib/api-client.ts`
  - Fetch wrapper con base URL, credentials: 'include', error handling
  - Tipado con genéricos de @estela/types

### Componentes
- `auth/LoginForm.tsx` — formulario reutilizable con react-hook-form
- `auth/RegisterForm.tsx` — formulario reutilizable con react-hook-form

## Criterios de aceptación

1. Login flujo completo: formulario → BFF → Laravel → cookie → redirect según role
2. Register flujo completo: formulario → BFF → Laravel → cookie → redirect a landing
3. Errores de validación se muestran inline en el formulario
4. Rate limit (429) muestra mensaje amigable ("Demasiados intentos, espera un minuto")
5. Refresh de página mantiene sesión (cookie persiste, /me retorna user)
6. Logout elimina cookie y redirige a landing
7. Middleware protege `/account/*` → redirect a `/auth/login`
8. Middleware protege `/dealer/*` → redirect si no es dealer/admin
9. Middleware redirige a `/` si usuario auth visita `/auth/login`
10. Header actualiza estado al login/logout sin refresh de página

## Checklist de implementación

- [ ] Crear @estela/types con interfaces de auth
- [ ] Crear api-client.ts
- [ ] Crear BFF proxy: login route
- [ ] Crear BFF proxy: register route
- [ ] Crear BFF proxy: logout route
- [ ] Crear BFF proxy: me route
- [ ] Configurar httpOnly cookie en login/register BFF
- [ ] Crear LoginForm + página /auth/login
- [ ] Crear RegisterForm + página /auth/register
- [ ] Crear useAuthStore (Zustand)
- [ ] Integrar TanStack Query para session check
- [ ] Crear middleware.ts (apps/web)
- [ ] Crear middleware.ts (apps/admin)
- [ ] Probar flujo completo: register → login → session → logout
- [ ] Probar middleware: rutas protegidas, redirects, refresh de sesión
