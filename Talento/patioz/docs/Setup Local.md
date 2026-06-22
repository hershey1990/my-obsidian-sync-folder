---
title: "Setup Local — Patioz"
description: "Guía de setup del entorno de desarrollo local para el monolito Patioz"
actualizado: 2026-06-22
---
# Setup Local — Patioz

## Requisitos

- Node.js >= 20
- pnpm 10
- Docker Desktop
- Git

## Instalación

```bash
git clone <repo-url> patioz-api-monolith
cd patioz-api-monolith
pnpm install
```

## Servicios Locales

```bash
docker compose up -d
```

Esto levanta:
- **MinIO** en `http://localhost:9000` (S3-compatible)
- **Redis** en `http://localhost:6379` (BullMQ + cache)

## Variables de Entorno

```bash
cp .env.example .env
```

Variables críticas a configurar:

```env
PORT=3000
JWT_SECRET=<generar-secreto>
AUTH_SERVICE_URL=http://localhost:3002
IMAGEPROXY_API_URL=http://localhost:3001
SUPABASE_URL=<url-de-proyecto-supabase>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_JWT_SECRET=<jwt-secret-de-supabase>
REDIS_HOST=localhost
REDIS_PORT=6379
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
GOOGLE_MAPS_API_KEY=<google-maps-api-key>
```

## Iniciar

```bash
pnpm start:dev
```

La API estará disponible en `http://localhost:3000/api/v1`.

## Tests

```bash
pnpm test              # Tests unitarios (~17s)
pnpm test:e2e          # Tests e2e HTTP (~5s)
```

## Migraciones

Las migraciones de Supabase se ejecutan via CI. Para desarrollo local, usar el proyecto Supabase de desarrollo.

## Verificación

```bash
curl http://localhost:3000/api/v1/health
# {"status":"ok","dependencies":{"imageProxyApi":"healthy"},"timestamp":"..."}
```
