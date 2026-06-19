---
tipo: runbook
descripcion: Puesta en marcha del entorno de desarrollo local del monolito NestJS
tags:
  - patioz/runbook
actualizado: 2026-06-18
---

# Runbook: Setup Local — Monolito NestJS

## Prerrequisitos

- **Node.js** >= 20
- **pnpm** 10 (`npm install -g pnpm`)
- **Docker Desktop** (para Supabase local, Redis y MinIO)
- **Supabase CLI** — instalar según el OS:
  - **macOS**: `brew install supabase/tap/supabase`
  - **Linux/WSL**: descargar de [GitHub releases](https://github.com/supabase/cli/releases)
  - **npm (solo macOS)**: `pnpm add -g @supabase/cli`
- **Git**

## Topología del sistema

```
┌──────────────────────────────────────────────────────┐
│              patioz-api-monolith                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │   Auth   │ │Properties│ │ Listings │ │  Maps   │ │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├─────────┤ │
│  │  Leads   │ │  Files   │ │ Locations│ │  Health │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│         │              │               │             │
│    ┌────┴────┐   ┌────┴────┐    ┌─────┴─────┐      │
│    │  Redis  │   │ MinIO   │    │  Supabase  │      │
│    │(BullMQ) │   │  (S3)   │    │ (Postgres) │      │
│    └─────────┘   └─────────┘    └───────────┘      │
└──────────────────────────────────────────────────────┘
         │
         ▼
  imgproxy-api (servicio externo)
  auth (servicio externo — solo permisos remotos)
```

**Dependencias externas** (no corren localmente a menos que se configuren):
- `AUTH_SERVICE_URL` — microservicio de auth (permisos RBAC remotos)
- `IMAGEPROXY_API_URL` — microservicio de procesamiento de imágenes

## Paso a paso

### 1. Clonar repositorio

```bash
git clone <repo-patioz-api-monolith>
cd patioz-api-monolith
```

Solo hay **un repositorio** para el backend. El frontend (MapUI) va en otro repo.

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Variables de entorno

```bash
cp .env.example .env
# Editar .env:
#   - JWT_SECRET: cualquier string de al menos 32 caracteres
#   - GOOGLE_MAPS_API_KEY: obligatoria para maps
#   - AUTH_SERVICE_URL e IMAGEPROXY_API_URL: opcionales (modo offline)
```

Valores por defecto que funcionan out-of-the-box:
| Variable | Valor local |
|---|---|
| `PORT` | `3000` |
| `SUPABASE_URL` | `http://localhost:54321` |
| `SUPABASE_SERVICE_ROLE_KEY` | (la del .env.example) |
| `REDIS_HOST` | `localhost` |
| `REDIS_PORT` | `6379` |
| `S3_ENDPOINT` | `http://localhost:9000` |

### 4. Iniciar dependencias locales

#### 4a. Supabase local

```bash
# Primera vez: descarga imágenes Docker (~2 GB)
pnpm supabase:start
```

Esto levanta:
- **PostgreSQL** en `localhost:54322`
- **Supabase API** (PostgREST) en `localhost:54321`
- **Supabase Studio** (UI) en `http://localhost:54323`
- **Auth local** (GoTrue) en `localhost:54321/auth/v1`

> Anotar las claves que imprime `supabase:start` y verificar que coinciden con `.env`.

#### 4b. Aplicar migraciones y seed data

```bash
pnpm supabase:reset
```

Esto ejecuta todas las migraciones en orden y luego corre `supabase/seed.sql`.

#### 4c. Redis + MinIO (S3 local)

```bash
docker compose up -d
```

Esto levanta:
- **Redis** en `localhost:6379` (cola BullMQ + caché)
- **MinIO** en `localhost:9000` (API S3) y `localhost:9001` (console UI)
- Crea el bucket `patioz-assets` automáticamente

Credenciales MinIO por defecto: `minioadmin` / `minioadmin`

### 5. Iniciar la app

```bash
pnpm start:dev
```

La app corre en **`http://localhost:3000`** con prefijo global `/api/v1`.

### 6. Verificar

```bash
# Health check (público)
curl http://localhost:3000/api/v1/health
# → { "status": "ok", "timestamp": "...", "dependencies": {...} }

# Auth — login (si hay seed data)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@patioz.com","password":"test123"}'
# → { "access_token": "..." }
```

## Modo offline (sin servicios externos)

Si `AUTH_SERVICE_URL` e `IMAGEPROXY_API_URL` no están configurados, los módulos que dependen de ellos operan en modo degradado:

- **Auth remoto** → fallback a validación JWT local (sin verificación RBAC remota)
- **imgproxy-api** → fallback a URLs directas de S3 sin procesamiento de imágenes

No se necesita configurar variables para el funcionamiento básico del CRUD.

## Seed de datos

```bash
# Seed adicional: crear usuario admin local
pnpm db:seed:admin
```

Esto crea un usuario administrador en Supabase Auth + sus roles en la tabla `users`.

## Comandos útiles

```bash
pnpm start:dev          # Desarrollo con hot-reload (NestJS --watch)
pnpm build              # Compilar a dist/
pnpm test               # Tests unitarios (src/**/*.spec.ts)
pnpm test:e2e           # Tests de integración HTTP (test/**/*.e2e-spec.ts)
pnpm test:cov           # Tests con cobertura
pnpm supabase:reset     # Resetear BD (migraciones + seed)
pnpm supabase:migration:new nombre   # Crear nueva migración
pnpm supabase:typegen   # Generar types de la BD
pnpm db:seed:admin      # Seed de admin
```

## Referencia rápida de URLs

| Servicio | URL | Propósito |
|---|---|---|
| API Monolith | `http://localhost:3000/api/v1` | Backend NestJS |
| Supabase Studio | `http://localhost:54323` | UI de BD |
| Redis | `localhost:6379` | Cache + BullMQ |
| MinIO API | `http://localhost:9000` | S3-compatible storage |
| MinIO Console | `http://localhost:9001` | UI de archivos |
| Postgres directo | `postgresql://postgres:postgres@localhost:54322/postgres` | BD directa |

## Troubleshooting

### `JwtStrategy requires a secret or key`

```bash
# Asegurar que JWT_SECRET existe y tiene al menos 32 caracteres
echo "JWT_SECRET=mi-secreto-super-seguro-de-al-menos-32-chars" >> .env
```

### `Connection refused a Redis / MinIO`

```bash
docker compose up -d
# Verificar que los contenedores están corriendo
docker compose ps
```

### `Supabase start` da error de puertos ocupados

```bash
# Verificar qué está usando los puertos 54321-54323
netstat -ano | findstr :54321
# Cambiar puertos en `supabase/config.toml` si es necesario
```

### Tests fallan por falta de mock de Redis

Los tests e2e ya tienen mocking automático de ioredis y bullmq en `test/jest-e2e-setup.ts`. Si algún test unitario falla por Redis, revisar que el provider esté mockeado con `useValue`.
