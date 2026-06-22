---
title: "Deploy — Patioz"
description: "Pipeline de despliegue del monolito Patioz a Railway via Bitbucket Pipelines"
actualizado: 2026-06-22
outline_status: pendiente
outline_url: null
---
# Deploy — Patioz

## Infraestructura

| Componente | Proveedor |
|---|---|
| Monolito NestJS | Railway |
| Base de datos | Supabase (PostgreSQL) |
| Cache / Cola | Redis (Railway) |
| Archivos | Cloudflare R2 (S3-compatible) |
| Procesamiento de imágenes | imgproxy-api (Railway) |
| Dominio | `api.patioz.co` |

## CI/CD

El proyecto usa **Bitbucket Pipelines** para CI/CD:

```yaml
# bitbucket-pipelines.yml (resumen)
pipelines:
  default:
    - step:
        name: Test
        script:
          - pnpm install
          - pnpm test
          - pnpm test:e2e
    - step:
        name: Deploy
        script:
          - pnpm build
          - railway up
```

### Flujo

1. Push a `main` dispara el pipeline
2. Step **Test**: corre tests unitarios + e2e. Coverage thresholds (≥70% statements, ≥60% branches)
3. Step **Deploy**: build de producción + `railway up`

## Variables de Entorno en Railway

Configuradas en Railway Dashboard (no en `.env`):

- `DATABASE_URL` — connection string de Supabase
- `JWT_SECRET` — secreto JWT
- `AUTH_SERVICE_URL` — URL del servicio de auth
- `IMAGEPROXY_API_URL` — URL de imgproxy-api
- `REDIS_HOST` / `REDIS_PORT` — Redis interno de Railway
- `S3_ENDPOINT` / `S3_REGION` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` — R2
- `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — AWS (SES, Translate)
- `GOOGLE_MAPS_API_KEY` — Google Maps

## Health Check

Railway monitorea `GET /api/v1/health` para determinar si el servicio está healthy.

## Rollback

Railway soporta rollback a deploys anteriores desde el dashboard.
