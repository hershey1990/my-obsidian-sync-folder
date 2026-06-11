---
id: TSK-005
fase: 1
modulo: Auth
tipo: frontend
prioridad: alta
dependencias: ["TSK-004"]
estimado: 3d
responsable: TBD
tags:
  - auth
  - frontend
  - landing
  - nextjs
---

# TSK-005: Landing page + Auth pages (frontend)

Páginas públicas de aterrizaje, autenticación y middleware de ruta.

## Entregables

### Landing page (`/`)
- React Server Component (RSC) con ISR
- Secciones: Hero, Cómo funciona, Features destacadas, CTA
- SEO: metadata dinámica (title, description, opengraph)
- Header con estado de auth (logueado → nombre + avatar; no logueado → "Iniciar sesión")
- Footer con links básicos

### Login page (`/auth/login`)
- Client Component con react-hook-form + zod
- Campos: email, password
- Validación client-side: email format, password no vacío
- Submit → POST /api/auth/login (BFF proxy) → redirect según role
- Estado: loading, error (credenciales inválidas), rate limit
- Link a registro

### Register page (`/auth/register`)
- Client Component con react-hook-form + zod
- Campos: name, email, phone, password, password_confirmation
- Validación client-side: email format, phone format (+505), password match, password strength
- Submit → POST /api/auth/register (BFF proxy) → redirect a landing
- Estado: loading, error, success

### BFF proxy (Next.js API routes)
- `apps/web/src/app/api/auth/login/route.ts`
  - POST: forward a `POST /api/v1/auth/login` (Laravel)
  - Recibe { user, token }
  - Setea httpOnly cookie: `sanctum_token={token}; HttpOnly; Secure; SameSite=Lax; Path=/; Domain=.estela.com`
  - Response: { user, role } + redirect URL según role
- `apps/web/src/app/api/auth/register/route.ts`
  - POST: forward a `POST /api/v1/auth/register`
  - Misma lógica de cookie
- `apps/web/src/app/api/auth/logout/route.ts`
  - POST: forward a `POST /api/v1/auth/logout`
  - Elimina cookie sanctum_token
- `apps/web/src/app/api/auth/me/route.ts`
  - GET: forward a `GET /api/v1/auth/me` (con cookie)
  - Response: user + role o 401

### Middleware de ruta
- `apps/web/middleware.ts`
  - Lee cookie sanctum_token
  - GET /api/v1/auth/me para validar sesión
  - `/account/*` → redirect a `/auth/login` si no auth
  - `/dealer/*` → redirect si role != dealer/admin/super-admin
  - `/auth/*` → redirect a `/` si ya auth
- `apps/admin/middleware.ts`
  - Verifica role = admin/super-admin, si no → 403 o redirect

### Auth store (Zustand)
- `useAuthStore`
  - user: User | null
  - role: string | null
  - isAuthenticated: boolean
  - isLoading: boolean
  - login(email, password): Promise<void>
  - register(data): Promise<void>
  - logout(): Promise<void>
  - checkSession(): Promise<void> — llama a /api/auth/me
- Integración con TanStack Query para caching de session

### Types (@estela/types)
- `User` interface (id, name, email, phone, role, avatar, email_verified_at, created_at)
- `LoginRequest` interface (email, password)
- `RegisterRequest` interface (name, email, phone, password, password_confirmation)
- `AuthResponse` interface (data: { user, role }, message?)
- `APIResponse<T>` generic

### Componentes (@estela/ui)
- `auth/LoginForm.tsx` — formulario reutilizable
- `auth/RegisterForm.tsx` — formulario reutilizable
- `shared/Header.tsx` — header con estado de auth
- `shared/Footer.tsx`

## Criterios de aceptación

1. Landing page carga rápido (Lighthouse > 90 performance)
2. Login/register flujo completo: llenar formulario → submit → BFF proxy → Laravel → cookie → redirect
3. Usuario logueado ve su nombre + avatar en Header
4. Usuario no logueado ve botón "Iniciar sesión" en Header
5. Redirección post-login según role (buyer → /, dealer → /dealer/dashboard)
6. Middleware protege `/account/*` → redirect a login si no auth
7. Middleware protege `/dealer/*` → redirect si no es dealer/admin
8. Middleware redirige a `/` si usuario auth visita `/auth/login`
9. Refresh de página mantiene sesión (cookie persiste)
10. Logout elimina cookie y redirige a landing
11. Errores de validación se muestran inline en el formulario
12. Rate limit (429) muestra mensaje amigable

## Checklist de implementación

- [ ] Configurar monorepo (apps/web, apps/admin, packages)
- [ ] Crear @estela/types con interfaces de auth
- [ ] Crear header/footer componentes
- [ ] Crear landing page con RSC + ISR
- [ ] Crear LoginForm + página /auth/login
- [ ] Crear RegisterForm + página /auth/register
- [ ] Crear BFF proxy routes (login, register, logout, me)
- [ ] Configurar httpOnly cookie en login/register
- [ ] Crear useAuthStore (Zustand)
- [ ] Integrar TanStack Query para session check
- [ ] Crear middleware.ts para web (apps/web)
- [ ] Crear middleware.ts para admin (apps/admin)
- [ ] Probar flujo completo: register → login → session → logout
- [ ] Probar middleware: rutas protegidas, redirects
