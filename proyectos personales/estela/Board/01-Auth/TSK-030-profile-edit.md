---
id: TSK-030
fase: 1
modulo: Auth
tipo: fullstack
prioridad: media
dependencias: ["TSK-004"]
estimado: 1d
responsable: TBD
tags:
  - auth
  - backend
  - frontend
  - profile
---

# TSK-030: Profile edit (backend + frontend)

Permite al usuario autenticado editar su perfil (nombre, teléfono, avatar) y cambiar su contraseña.

## Entregables

### Backend (Laravel)

- `UpdateProfileRequest.php` — Form Request
  - name: sometimes, string, max:255
  - phone: sometimes, string, regex:/^\+505\d{8}$/
  - current_password: required_with:new_password, string
  - new_password: sometimes, string, min:8, regex:/[A-Z]/, regex:/[0-9]/, confirmed
- `AuthController::updateProfile(Request $request)` → PUT /api/v1/auth/profile
  - Valida request
  - Si `new_password` presente: verifica `current_password` contra hash actual
  - Actualiza campos permitidos
  - Response 200: { data: { user } }
- `AuthController::updateAvatar(Request $request)` → POST /api/v1/auth/avatar
  - Recibe file (image, max 2MB, jpg/png/webp)
  - Almacena en Supabase Storage
  - Actualiza campo avatar en users
  - Response 200: { data: { avatar_url } }

### Frontend (Next.js)

- `account/layout.tsx` — layout base para `/account/*` con sidebar de navegación
- `account/page.tsx` — ProfileForm page
  - Campos editables: name, phone
  - Sección cambiar password: current_password, new_password, new_password_confirmation
  - Avatar upload con preview
  - Submit → PUT /api/auth/profile (BFF proxy) → actualiza store
- BFF proxy route: `apps/web/src/app/api/auth/profile/route.ts`
  - PUT: forward a `PUT /api/v1/auth/profile` con cookie

### Componentes
- `account/ProfileForm.tsx` — react-hook-form + zod
- `account/AvatarUpload.tsx` — file input con preview + drag & drop
- `account/ChangePasswordForm.tsx` — formulario cambio de password

## Criterios de aceptación

1. PUT /api/v1/auth/profile actualiza name y phone correctamente
2. PUT /api/v1/auth/profile rechaza teléfono inválido con 422
3. PUT /api/v1/auth/profile rechaza cambio de password si current_password no coincide
4. PUT /api/v1/auth/profile cambia password correctamente (nuevo hash, viejo password ya no funciona)
5. POST /api/v1/auth/avatar sube imagen, devuelve URL
6. Frontend muestra datos actuales del usuario en el formulario
7. Frontend permite editar y guardar cambios
8. Frontend muestra feedback visual (toast de éxito/error)

## Checklist de implementación

- [ ] Backend: Crear UpdateProfileRequest
- [ ] Backend: Agregar updateProfile a AuthController
- [ ] Backend: Agregar updateAvatar a AuthController
- [ ] Backend: Definir ruta PUT /api/v1/auth/profile
- [ ] Backend: Definir ruta POST /api/v1/auth/avatar
- [ ] Backend: Configurar Supabase Storage para avatares
- [ ] Backend: Escribir tests (Pest) — profile update, password change, avatar upload
- [ ] Frontend: Crear BFF proxy PUT /api/auth/profile
- [ ] Frontend: Crear BFF proxy POST /api/auth/avatar
- [ ] Frontend: Crear layout de /account
- [ ] Frontend: Crear ProfileForm
- [ ] Frontend: Crear AvatarUpload
- [ ] Frontend: Crear ChangePasswordForm
- [ ] Frontend: Integrar con useAuthStore (actualizar user en store)
- [ ] Probar flujo completo: editar perfil → guardar → ver cambios reflejados
