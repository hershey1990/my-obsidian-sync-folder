---
tipo: runbook
descripcion: Puesta en marcha del entorno de desarrollo local
tags:
  - patioz/runbook
---
# Runbook: Setup Local

## Prerrequisitos

- Node.js >= 20
- Docker Desktop (para Supabase local)
- Git
- Claves de API (ver `.env.example` en cada repo)

## Paso a paso

### 1. Clonar repositorios

```bash
git clone <repo-bff>
git clone <repo-auth>
git clone <repo-frontend>
git clone <repo-imgproxy>
```

### 2. Variables de entorno

Cada proyecto tiene un `.env.example`. Copiarlo a `.env` y completar:

```bash
cp .env.example .env
# Editar .env con los valores correspondientes
```

### 3. Iniciar Supabase local

```bash
cd auth
npx supabase start
# Anotar las URLs y claves que imprime el comando
```

### 4. Iniciar servicios

```bash
# Terminal 1 — BFF
cd bff && npm install && npm run dev

# Terminal 2 — Auth API
cd auth && npm install && npm run start:dev

# Terminal 3 — Frontend
cd frontend && npm install && npm run dev

# Terminal 4 — imgproxy-api
cd imgproxy && npm install && npm run dev
```

### 5. Verificar

- BFF: `http://localhost:3000/health`
- Auth API: `http://localhost:4000/auth/health`
- Frontend: `http://localhost:3001`
- imgproxy-api: `http://localhost:3002/health`

## Modo offline (sin QStash)

```bash
export QUEUE_PROVIDER=local
# localStash se activa automáticamente
```

## Comandos útiles

```bash
# Limpiar node_modules y reinstalar
npm run clean && npm install

# Ejecutar tests
npm test

# Lint
npm run lint
```
