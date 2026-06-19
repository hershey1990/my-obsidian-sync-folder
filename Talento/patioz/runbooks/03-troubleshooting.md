---
tipo: runbook
descripcion: Problemas comunes y soluciones del monolito NestJS
tags:
  - patioz/runbook
actualizado: 2026-06-18
---

# Runbook: Troubleshooting — Monolito NestJS

## 🔴 Error: Conexión a Supabase falla

**Síntoma:** `Error: connect ECONNREFUSED` o `timeout` al iniciar la app.

**Causas posibles:**
1. Supabase local no está corriendo → `pnpm supabase:start`
2. Variables de entorno mal configuradas → verificar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env`
3. Puerto ocupado → cambiar puerto en `supabase/config.toml`
4. Token de acceso expirado → regenerar en Supabase Dashboard → Settings → API

---

## 🔴 Error: Redis / BullMQ no conecta

**Síntoma:** `Error: connect ECONNREFUSED ::1:6379` o jobs encolados no se procesan.

**Causas posibles:**
1. Redis no está corriendo → `docker compose up -d` (levanta Redis + MinIO)
2. Variable `REDIS_HOST` incorrecta → verificar que apunte a `localhost`
3. Puerto 6379 ocupado por otro proceso → `netstat -ano | findstr :6379`
4. Contraseña de Redis configurada pero no coincide → revisar `REDIS_PASSWORD` en `.env`

---

## 🔴 Error: Upload a S3 / MinIO falla

**Síntoma:** `403 AccessDenied` o `Connection refused` al subir archivos.

**Causas posibles:**
1. MinIO no está corriendo → `docker compose up -d`
2. Bucket `patioz-assets` no creado → `docker compose up` lo crea automáticamente, o hacerlo manual desde la consola de MinIO en `http://localhost:9001`
3. Credenciales S3 incorrectas en `.env` → `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`
4. En producción: verificar políticas de bucket en R2 / AWS S3

---

## 🔴 Error: JwtStrategy requires a secret or key

**Síntoma:** La app no arranca y muestra este error.

**Causas posibles:**
1. `JWT_SECRET` no está definido o está vacío en `.env`
2. `JWT_SECRET` tiene menos de 32 caracteres
3. El archivo `.env` no se está cargando → verificar que `envFilePath` en `app.module.ts` incluya la ruta correcta

**Solución:**
```bash
echo "JWT_SECRET=una-frase-segura-de-al-menos-32-caracteres" >> .env
```

---

## 🔴 Error: Tests no encuentran módulos (TS path alias)

**Síntoma:** `Cannot find module '@patioz/shared'` o errores de ruta en tests.

**Causas posibles:**
1. `tsconfig.json` no está configurado con `paths` → revisar que los alias coincidan con los imports
2. Jest no usa `tsconfig` → verificar `moduleNameMapper` en `package.json` → `jest`
3. `dist/` tiene artefactos stale → `pnpm prebuild` (se ejecuta automáticamente en `prestart:dev`)

---

## 🔴 Error: Migración de Supabase falla

**Síntoma:** `supabase db push` devuelve error o `supabase:reset` falla.

**Causas posibles:**
1. La migración local tiene SQL inválido → probar la query directamente en Supabase Studio
2. Conflicto con migraciones existentes → `supabase migration list` para ver el estado
3. DB password incorrecta → verificar `SUPABASE_DB_PASSWORD` en el entorno de CI
4. En producción: migración requiere deshacer cambios manualmente (ver runbook de deploy)

---

## 🔴 Error: Google Maps API no responde

**Síntoma:** Las rutas de maps devuelven `500` o geocoding falla.

**Causas posibles:**
1. `GOOGLE_MAPS_API_KEY` no está configurada en `.env`
2. La API key no tiene habilitada la Geocoding API en Google Cloud Console
3. Límite de cuota excedido → verificar en Google Cloud Console → APIs & Services → Quotas

---

## 🔴 Error: Email no se envía (SES)

**Síntoma:** Las notificaciones por email no llegan, pero no hay error en la app.

**Causas posibles:**
1. `SES_ENABLED=false` en el entorno → cambiar a `true`
2. `SES_FROM_ADDRESS` no está verificado en AWS SES (sandbox mode)
3. AWS credentials no tienen permiso `ses:SendEmail`
4. En desarrollo: SES no está configurado, los emails se loguean pero no se envían

---

## 🔴 Error: Module '@nestjs/common' no se encuentra después de clonar

**Síntoma:** `Error: Cannot find module '@nestjs/common'` o módulos de NestJS no resueltos.

**Causas posibles:**
1. `pnpm install` no se ejecutó → `pnpm install`
2. `node_modules` corrupto → `rm -rf node_modules && pnpm install`
3. Versión de Node.js incorrecta → `node --version` debe ser >= 20

---

## 🔴 Error: Puerto 3000 ya está en uso

**Síntoma:** `Error: listen EADDRINUSE :::3000`

**Causas posibles:**
1. Otra instancia de la app corriendo → `netstat -ano | findstr :3000` y matar el proceso
2. `PORT` en `.env` no tiene prioridad → Railway asigna `PORT` automáticamente en producción

**Solución:**
```bash
# Encontrar PID del proceso en el puerto
netstat -ano | findstr :3000
# Matar el proceso (ejemplo con PID 1234)
taskkill /PID 1234 /F
# O cambiar el puerto en .env
echo "PORT=3001" >> .env
```

---

## 🔴 Error: Railway deploy falla

**Síntoma:** El paso de deploy en Bitbucket Pipelines falla, o Railway rechaza el build.

**Causas posibles:**
1. `RAILWAY_TOKEN` no está configurado en Bitbucket → verificar Repository Variables
2. `RAILWAY_SERVICE_ID` incorrecto → obtener de Railway Dashboard → Settings
3. Build de Railway falla por falta de memoria → revisar logs en Railway Dashboard
4. `pnpm start:prod` no está definido en `package.json` → Railway usa `start` por defecto; verificar que exista
5. Railway requiere Node.js version específica → configurar en `package.json` → `engines.node`

---

## ⚠️ Performance: API lenta

**Síntoma:** Tiempos de respuesta > 1s en endpoints de la API.

**Acciones:**
1. Habilitar query logging de Supabase para detectar N+1
2. Revisar si hay queries sin índice en tablas grandes (`showings`, `listings`, `properties`)
3. Verificar que Redis está haciendo cache de sesiones (BullMQ no debería bloquear)
4. Usar `Promise.all` para consultas paralelas en services
5. Revisar logs de NestJS para detectar excepciones no manejadas

---

## 🔴 Error: Bitbucket Pipeline falla — `pnpm install --frozen-lockfile`

**Síntoma:** Pipeline falla con `ERR_PNPM_FROZEN_LOCKFILE_LOCKFILE_IS_NOT_UPDATED`

**Causas posibles:**
1. Se agregó/quitó una dependencia pero no se actualizó `pnpm-lock.yaml`
2. Conflicto de merge en `pnpm-lock.yaml`

**Solución:**
```bash
# Local: regenerar lockfile
pnpm install
# Commitear el pnpm-lock.yaml actualizado
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

---

## 📝 Cómo agregar un nuevo troubleshooting

1. Agregar una entrada con el formato `## 🔴 Error: <título>`
2. Describir síntoma, causas posibles y solución
3. Mantenerlo actualizado a medida que aparecen nuevos problemas
