---
tipo: runbook
descripcion: Pipeline de despliegue a producción del monolito NestJS en Railway
tags:
  - patioz/runbook
actualizado: 2026-06-18
---

# Runbook: Deploy — Monolito NestJS a Railway

## Stack de despliegue

| Componente | Tecnología |
|---|---|
| **CI/CD** | Bitbucket Pipelines |
| **Host** | Railway |
| **Base de datos** | Supabase (PostgreSQL administrado) |
| **Cache / Queue** | Redis (Railway add-on o Upstash) |
| **File storage** | S3-compatible (Cloudflare R2 / AWS S3) |
| **Emails** | AWS SES |
| **SMS** | Twilio |

No se usa Docker propio — Railway detecta automáticamente el proyecto Node.js y usa `pnpm start:prod`.

## Pipeline CI/CD

```mermaid
graph LR
    A[git push] --> B[develop: Test + Build]
    A --> C[master: Test + Build]
    B --> D[Migraciones Staging]
    D --> E[Railway up --env development]
    C --> F[Migraciones Prod<br/>(manual)]
    F --> G[Railway up --env production<br/>(manual)]
```

## Branches

| Rama | Entorno | Disparador | Migraciones | Deploy |
|---|---|---|---|---|
| `develop` | Staging | Automático al pushear | Automático | Automático |
| `master` | Producción | Manual (PR merge) | Manual (aprobación) | Manual (aprobación) |
| Pull Requests | — | Automático | No | Solo build + test |

## Paso a paso

### 1. Push a develop (Staging automático)

```bash
git checkout develop
git add .
git commit -m "feat: ..."
git push
```

Bitbucket Pipelines ejecuta automáticamente:

1. **Test**: `pnpm install --frozen-lockfile` → `pnpm build` → `pnpm test --coverage`
2. **Migraciones Staging**: `supabase db push` contra el project-ref de staging
3. **Deploy Staging**: `railway up --service $RAILWAY_SERVICE_ID --environment development --ci`

### 2. Merge a master (Producción manual)

```bash
# Crear PR de develop → master en Bitbucket
# Esperar build + test del PR
# Mergear a master

# En Bitbucket Pipelines:
# — Tests se corren automáticos
# — "Run Migrations (Production)" requiere clic manual
# — "Deploy to Production" requiere clic manual
```

### 3. Verificar deploy

```bash
# Health check (público)
curl https://api.patioz.com/api/v1/health

# Ver logs en Railway
# railway logs --service $RAILWAY_SERVICE_ID --environment production
```

## Variables de entorno en Railway

Cada entorno (`development`, `production`) tiene su propio conjunto de variables. Las críticas son:

| Variable | Staging | Producción |
|---|---|---|
| `PORT` | `3000` | `3000` |
| `SUPABASE_URL` | Proyecto Supabase staging | Proyecto Supabase producción |
| `SUPABASE_SERVICE_ROLE_KEY` | Staging key | Producción key |
| `REDIS_HOST` | Redis staging | Redis producción |
| `S3_ENDPOINT` | R2 staging bucket | R2 producción bucket |
| `AUTH_SERVICE_URL` | Auth microservicio staging | Auth microservicio producción |
| `IMAGEPROXY_API_URL` | imgproxy staging | imgproxy producción |
| `SES_FROM_ADDRESS` | `no-reply@staging.patioz.com` | `no-reply@patioz.com` |

## Migraciones de base de datos

Las migraciones se ejecutan **antes** del deploy para evitar que el nuevo código corra contra un schema viejo.

```bash
# Local: crear migración
pnpm supabase:migration:new descripcion-del-cambio

# Local: aplicar localmente para testear
pnpm supabase:reset

# Commit + push
# Bitbucket ejecutará supabase db push contra staging automático
# Producción requiere aprobación manual
```

> ⚠️ Las migraciones son **destructivas** si incluyen `DROP`. Siempre testear en staging primero.

## Rollback

### De Railway

Railway mantiene el deployment anterior. Para hacer rollback:

```bash
# CLI
railway service rollback --service $RAILWAY_SERVICE_ID --environment production
```

O desde la UI de Railway → "Deployments" → "Rollback" al deployment anterior.

### De base de datos

Supabase no tiene rollback automático de migraciones. Si una migración falla:

```bash
# Revertir manualmente
supabase db diff --linked
# Crear migración inversa
pnpm supabase:migration:new revert-xxx
# Aplicar
supabase db push --password $SUPABASE_DB_PASSWORD
```

## Troubleshooting

### `pnpm build` falla en CI

```bash
# Verificar que pnpm-lock.yaml está actualizado
pnpm install --frozen-lockfile
# Si falla: pnpm install && pnpm update
```

### Migraciones fallan en producción

```bash
# Revisar que SUPABASE_ACCESS_TOKEN y SUPABASE_DB_PASSWORD son correctos
# Verificar que supabase link --project-ref apunta al proyecto correcto
supabase projects list
```

### Deploy a Railway falla

```bash
# Railway CLI debe estar autenticado
railway login
# Verificar que el token es correcto
railway whoami
# Forzar redeploy
railway up --service $RAILWAY_SERVICE_ID --environment production --ci
```

### Health check devuelve degraded

```bash
# Revisar conectividad a dependencias
curl https://api.patioz.com/api/v1/health
# Si imageProxyApi = degraded: verificar que IMAGEPROXY_API_URL está configurado
# Si auth = degraded: verificar que AUTH_SERVICE_URL responde
```

## Post-deploy checklist

- [ ] Health check responde `status: ok`
- [ ] Login funciona (`POST /api/v1/auth/login`)
- [ ] Listings públicos cargan (`GET /api/v1/listings` — público)
- [ ] Migraciones aplicadas correctamente
- [ ] Redis responde (BullMQ jobs)
- [ ] Notificaciones email/SMS (probar con un lead de prueba)
