---
title: Troubleshooting — Patioz
description: Problemas comunes y soluciones del monolito NestJS
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Troubleshooting

## La app no arranca

### `Error: connect ECONNREFUSED` (Supabase)

Supabase no está accesible. Verificar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env`. Si es local: `pnpm supabase:start`.

### `Error: connect ECONNREFUSED :::6379` (Redis)

Redis no está corriendo. Ejecutar `docker compose up -d`. Verificar `REDIS_HOST=localhost` en `.env`.

### `JwtStrategy requires a secret or key`

`JWT_SECRET` no está definido en `.env`. Debe tener al menos 32 caracteres.

### `Cannot find module '@nestjs/common'`

Dependencias no instaladas. Ejecutar `pnpm install`.

### Puerto 3000 ocupado

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Upload de archivos falla

### `403 AccessDenied` (S3/MinIO)

MinIO no está corriendo (`docker compose up -d`) o credenciales S3 incorrectas en `.env`. Verificar `S3_ACCESS_KEY_ID` y `S3_SECRET_ACCESS_KEY`.

### imgproxy-api no responde

Verificar `IMAGEPROXY_API_URL` en `.env`. En producción, verificar que el servicio esté corriendo en Railway.

## Google Maps no funciona

- `GOOGLE_MAPS_API_KEY` no configurada en `.env`
- La API key no tiene Geocoding API habilitada en Google Cloud Console
- Cuota excedida → Google Cloud Console → APIs & Services → Quotas

## Emails no se envían

- `SES_ENABLED=false` → cambiar a `true`
- `SES_FROM_ADDRESS` no verificado en AWS SES (sandbox mode)
- AWS credentials sin permiso `ses:SendEmail`

## Tests no pasan

### `Cannot find module '@patioz/shared'`

Alias de TypeScript no resueltos. Verificar `moduleNameMapper` en `package.json` → `jest`.

### `pnpm install --frozen-lockfile` falla en CI

Se agregó una dependencia sin actualizar `pnpm-lock.yaml`:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

## Railway deploy falla

- `RAILWAY_TOKEN` no configurado en Bitbucket Repository Variables
- `pnpm start:prod` no definido en `package.json`
- Railway requiere versión específica de Node.js → verificar `engines.node` en `package.json`

## API lenta

1. Verificar queries N+1 en Supabase logs
2. Revisar índices faltantes en tablas grandes
3. Verificar Redis está cacheando (BullMQ no debería bloquear)
4. Usar `Promise.all` para consultas paralelas en services
