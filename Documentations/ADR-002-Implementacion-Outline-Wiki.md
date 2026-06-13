# ADR-002: Implementación de Outline Wiki — wiki.gettalento.com

**Estado:** Aprobado  
**Fecha:** 2026-06-12  

---

## Contexto

El [ADR-001](ADR-001-Plataforma-de-Documentacion.md) definió Outline como plataforma de documentación y planificó su implementación con autenticación Zoho OIDC. Este documento registra las decisiones reales tomadas durante el despliegue, las desviaciones del plan original, los errores enfrentados y la configuración final del sistema.

---

## 1. Stack final: 3 containers + 2 servicios cloud

| Componente | Decisión | Alternativa descartada | Por qué |
|---|---|---|---|
| Base de datos | Neon (serverless Postgres) | Postgres local en VPS | Free tier (3GB), backups automáticos, point-in-time recovery, libera ~350MB RAM del VPS |
| Base de datos | Neon | Supabase | Neon ofrece 3GB gratis vs 500MB de Supabase; branching para staging |
| Archivos | AWS S3 (`outline-files-talento`) | MinIO (local) | MinIO consumía ~200MB RAM + disco; S3 es ~$1/mes con 99.999999999% durabilidad |
| Archivos | S3 real de AWS | Lightsail Object Storage | Lightsail OS no expone CORS UI y el IAM es muy restrictivo; S3 real tiene control total |
| Proxy/SSL | Caddy | Nginx | SSL automático (Let's Encrypt sin certbot), config simple, WebSocket nativo |
| Cache | Redis 7 (local, Docker) | Upstash (cloud) | Solo 50MB RAM, latencia <1ms, sin límites de comandos/día del free tier |
| Dominio | `wiki.gettalento.com` | `docs.gettalento.com` | `wiki` transmite colaboración (tipo Confluence); `docs` suena a estático |

> **Nota:** El dominio cambió de `docs.gettalento.com` (planificado en ADR-001) a `wiki.gettalento.com` por criterio de naming.

---

## 2. Autenticación: email magic link (sin Zoho OIDC)

| Decisión | Por qué |
|---|---|
| Magic link (email) | Implementado ahora, funcional |
| Zoho OIDC descartado | La app cliente de Zoho requiere ser creada por un admin de la organización. La cuenta usada no era admin → Invalid Client persistente. Se puede activar en el futuro sin migración de datos (Outline vincula por email). |
| SMTP | `smtppro.zoho.com` (puerto 587, STARTTLS) con cuenta `info@smbssolutions.com`. Se descartó `smtp.zoho.com` y `SMTP_SECURE=true` tras errores SSL. |

---

## 3. VPS: AWS Lightsail small

| Recurso | Valor |
|---|---|
| RAM | 2GB (~800MB usados, 1.2GB libres) |
| vCPU | 2 |
| Disco | 60GB SSD |
| OS | Ubuntu 24.04 LTS |
| IP | 44.207.165.117 |
| Costo | ~$15/mes |

---

## 4. Costo mensual total: ~$16

| Item | Costo |
|---|---|
| Lightsail VPS | ~$15 |
| Neon DB | $0 (free tier) |
| AWS S3 | ~$1 (pocos GB) |
| **Total** | **~$16** |

---

## 5. Errores enfrentados y soluciones

| # | Error | Causa | Solución |
|---|---|---|---|
| 1 | Caddy reiniciaba en loop | `reverse_proxy` anidado inválido en Caddyfile (WebSocket) | Simplificado a `reverse_proxy outline:3000` |
| 2 | Zoho "Invalid Redirect URI" | App Self Client vs Client-Based; redirect URI con diferencias invisibles | Se recreó la app 3 veces; finalmente se identificó que la cuenta no era admin |
| 3 | Zoho "Invalid Client" | App creada por usuario no-admin no tiene permisos para autenticar a la org | Abandonado temporalmente; migrado a email magic link |
| 4 | SMTP no enviaba emails | Password con "S" extra (`FzVfqZZU3b8RS` → `FzVfqZZU3b8R`); host `smtp.zoho.com` vs `smtppro.zoho.com` | Corregidos host y password |
| 5 | SMTP error SSL "wrong version number" | `SMTP_SECURE=true` fuerza TLS implícito; `smtppro.zoho.com:587` usa STARTTLS | `SMTP_SECURE=false` |
| 6 | Cambios en .env no se aplicaban | `docker compose restart` no recrea contenedores ni relee .env | Usar siempre `docker compose down && docker compose up -d` |
| 7 | Upload de archivos fallaba (1) | Bucket Lightsail S3 sin CORS; IAM sin permisos para configurarlo | Migrado a S3 real de AWS |
| 8 | Upload de archivos fallaba (2) | IAM policy permitía `s3:*` al bucket pero no a `bucket/*` (objetos) | Agregado `arn:aws:s3:::outline-files-talento/*` al Resource |

---

## 6. Configuración actual

```
VPS:  44.207.165.117 (SSH: Outline-Key.pem)
URL:  https://wiki.gettalento.com
Auth: email magic link → gershell.lopez@gettalento.com (admin)
DB:   postgresql://neondb_owner:***@ep-proud-heart-***.aws.neon.tech/neondb
S3:   outline-files-talento (us-east-1)
SMTP: smtppro.zoho.com / info@smbssolutions.com / STARTTLS:587
```

---

## 7. Pendiente futuro

- Activar Zoho OIDC cuando haya acceso admin a la consola Zoho (instrucciones en AGENTS.md)
- Configurar backups automáticos (cron: `backup.sh` diario, `monitor.sh` cada 5 min)
- Habilitar versioning en bucket S3
