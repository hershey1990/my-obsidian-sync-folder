# Infraestructure Manager

Panel centralizado para gestionar servidores, recursos, playbooks de automatización y monitoreo de infraestructura.

---

## Stack

| Componente | Tecnología |
|---|---|
| Backend | Laravel 11 |
| Frontend | Inertia + React + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Job Queue | Laravel Horizon + Redis |
| Scheduling | Laravel Scheduler |
| SSH (comandos) | `spatie/ssh` |
| SSH (terminal) | Laravel Reverb + `phpseclib` |
| Notificaciones | Laravel Notifications (Slack, Discord, Email) |
| Auth | Laravel Breeze + Sanctum |
| DB | PostgreSQL |
| Encriptación PEMs | `Crypt::encryptString()` (APP_KEY, AES-256-CBC) |
| Deploy | Docker Compose |

---

## Modelo de Datos

### Server

```php
Server
├── id, name, ip, port (int), username (string)
├── pem_key (texto encriptado — upload por formulario)
├── tipo (lightsail, hetzner, local, vultr, etc.)
├── tipo_detected (json — auto-detected: docker, systemd, os)
├── discovered_at, last_seen (timestamps)
├── status (online|offline|unknown)
├── metadata (json — info del VPS: provider, region, plan)
└── health_check_config (json — intervalos y comandos)
```

### ServerResource

```php
ServerResource
├── id, name, type (enum)
│   ├── rocketchat, vaultwarden, outline
│   ├── mongodb, postgres, redis, mysql, mariadb
│   ├── nginx, caddy, traefik
│   └── custom
├── server_id (nullable — servicio que corre local)
├── connection_type (local|external)
├── connection_string (texto encriptado — para externas)
├── port (nullable)
├── discovery_method (auto|manual)
├── metadata (json — versión, tags docker, health endpoints)
├── health_check_config (json — checks custom)
├── drivers_config (json — opcional, user/pass para conexión directa desde el panel)
└── last_health (json — último resultado de checks)
```

### Playbook

```php
Playbook
├── id, name, description
├── server_id (nullable — target default)
├── parameters (json — [{key, label, default, type}])
├── notification_channels (json — qué canales y en qué eventos)
├── version (int)
└── status (active|archived)
```

### PlaybookStep

```php
PlaybookStep
├── id, playbook_id, order (int)
├── type (ssh|local|docker|http|wait|notify)
├── name (string — label visible en UI)
├── command (string — comando o script)
├── target_server_id (nullable — override del server del playbook)
├── run_if (nullable — condición: "{{steps.1.exit_code}} == 0")
├── rollback_command (nullable — comando para revertir)
├── timeout (int — segundos, default 300)
├── retries (int — default 0)
├── retry_delay (int — segundos entre reintentos)
└── parameters_binding (json — mapeo de parámetros del playbook a este step)
```

### PlaybookRun & StepRun

```php
PlaybookRun
├── id, playbook_id, status (running|success|failed|rolled_back|cancelled)
├── triggered_by (manual|schedule)
├── trigger_detail (nullable — "0 3 * * *" o "user@email")
├── started_at, finished_at
└── rollback_triggered_at (nullable)

StepRun
├── id, playbook_run_id, step_id, order
├── status (pending|running|success|failed|skipped|rolled_back)
├── exit_code (nullable)
├── output (texto — log completo)
├── output_truncated (boolean — si excede tamaño se trunca)
├── started_at, finished_at
└── rollback_status (nullable)
```

### HealthCheckResult

```php
HealthCheckResult
├── id, checkable_id, checkable_type (Server|ServerResource)
├── check_name (string)
├── status (ok|warning|critical|unknown)
├── value (nullable — ej: "6.5.0")
├── expected (nullable — ej: ">=6.6.0")
├── message (nullable — ej: "Update 6.7.0 disponible")
├── checked_at (timestamp)
└── duration_ms (int)
```

### NotificationChannel

```php
NotificationChannel
├── id, type (slack|discord|email|webhook)
├── label (string — "Slack #ops")
├── config (json — webhook url, email, token)
└── enabled (boolean)
```

---

## Arquitectura del Sistema

```
[Browser] ◄─HTTPS──► [Laravel App (Nginx + PHP-FPM)]
           ◄─WS────► [Laravel Reverb (WebSocket server)]
                        │
                  [Horizon Workers]
                        │
                  [Scheduler (cron)]
                        │
              [SshService / TerminalSession]
                        │
                 ┌──────┴──────┐
                 │              │
            [VPS A]         [VPS B]
         (Rocket.Chat)   (Vaultwarden)
              │               │
        [Mongo Atlas]    [SQLite local]
```

### Componentes Docker

| Servicio | Imagen | Puerto |
|---|---|---|
| App | custom (php-fpm + nginx) | 80 |
| PostgreSQL | postgres:16 | 5432 |
| Redis | redis:7-alpine | 6379 |
| Reverb | custom (php-cli, WS server) | 8080 |
| Horizon | custom (php-cli, queue worker) | — |

---

## Auto-discovery (post-conexión SSH)

Al agregar un server, se ejecuta un flujo de descubrimiento:

```bash
# 1. Docker — containers running
docker ps --format '{{json .}}'

# 2. Docker — images disponibles
docker images --format '{{json .}}'

# 3. Servicios systemd activos
systemctl list-units --type=service --state=running --no-pager

# 4. Puertos escuchando
ss -tlnp

# 5. OS + kernel
cat /etc/os-release | head -3
uname -r
```

Resultado presentado al usuario en una pantalla de confirmación donde asigna tipos y nombres. Los no reconocidos se marcan como `custom`.

---

## Flujo de un Playbook (Full Upgrade Rocket.Chat)

```
1. Trigger: manual ("Ejecutar ahora") o schedule (cron)
2. PlaybookRun creado → status: running
3. Steps ejecutados secuencialmente:

   Step 1: SSH → bash backup.sh
     ├─ Conecta vía SSH al target server
     ├─ Stream de output en vivo (WebSocket → Browser)
     └─ Exit code 0 ✓

   Step 2: LOCAL → rsync -avz remote:backups/ ./local/
     ├─ Ejecuta rsync desde el panel (local)
     ├─ Stream de output
     └─ Exit code 0 ✓

   Step 3: LOCAL → ./scripts/upload.sh
     └─ Exit code 0 ✓

   Step 4: SSH → docker compose pull && up -d
     └─ Exit code 0 ✓

   Step 5: SSH → curl -f http://localhost:3000
     └─ Exit code 0 ✓

4. PlaybookRun → status: success
5. Notificación a Slack/Discord: "Full Upgrade completado ✅"
6. Health check automático programado
```

### En caso de fallo

```
Step 4: SSH → docker compose up -d
  └─ Exit code 1 ❌ (container failed to start)

→ Rollback automático:
  Step 4 Rollback: docker compose down && compose up -d (versión anterior)

→ Notificación: "Full Upgrade falló en Step 4 — rollback ejecutado"
```

---

## Pantallas del MVP

| Ruta | Página | Contenido |
|---|---|---|
| `/` | Dashboard | Resumen: servidores online/offline, últimas alerts, playbooks recientes |
| `/servers` | Servers Index | Grid/lista con IP, tipo, status, última conexión |
| `/servers/create` | Crear Server | Form: nombre, IP, puerto, username, upload PEM, test conexión |
| `/servers/{id}` | Server Detail | Info general + tabs: Resources / Playbooks / Terminal / Health |
| `/servers/{id}/discover` | Auto-discovery | Resultados de descubrimiento → confirmar/nombrar |
| `/servers/{id}/terminal` | Terminal | xterm.js full terminal vía WebSocket |
| `/resources/{id}` | Resource Detail | Versión, health, connection string (opcional), drivers |
| `/playbooks` | Playbooks Index | Lista con búsqueda, filtrar por server |
| `/playbooks/create` | Builder | Steps drag & drop, parámetros, scheduling |
| `/playbooks/{id}` | Playbook Detail | Steps, historial de runs, editar, duplicar |
| `/playbooks/{id}/runs/{runId}` | Run Live | Output streaming, status de cada step, cancelar |
| `/settings/notifications` | Notificaciones | CRUD canales (Slack, Discord, Email, Webhook) |
| `/settings/keys` | Key Manager | Ver/rotar PEMs (sin exponer el contenido) |
| `/horizon` | Horizon Dashboard | UI nativa de Laravel Horizon para monitorear queues |

---

## API Endpoints Principales

### Servers
```
POST   /api/servers                    → crear + test conexión
GET    /api/servers                    → listar
GET    /api/servers/{id}               → detalle
PUT    /api/servers/{id}               → actualizar
DELETE /api/servers/{id}               → eliminar
POST   /api/servers/{id}/test-connection → test SSH
POST   /api/servers/{id}/discover      → ejecutar auto-discovery
```

### Resources
```
POST   /api/servers/{server}/resources  → crear recurso
GET    /api/resources                   → listar todos
GET    /api/resources/{id}              → detalle
PUT    /api/resources/{id}              → actualizar
DELETE /api/resources/{id}              → eliminar
POST   /api/resources/{id}/test-connection → test conexión DB externa
```

### Playbooks
```
POST   /api/playbooks                    → crear con steps anidados
GET    /api/playbooks                    → listar
GET    /api/playbooks/{id}               → detalle con steps
PUT    /api/playbooks/{id}               → actualizar
DELETE /api/playbooks/{id}               → eliminar
POST   /api/playbooks/{id}/run           → ejecutar ahora
POST   /api/playbooks/{id}/runs/{run}/cancel → cancelar en ejecución
GET    /api/playbooks/{id}/runs          → historial
GET    /api/playbooks/{id}/runs/{run}    → detalle con step runs
POST   /api/playbooks/{id}/schedule      → programar (cron)
DELETE /api/playbooks/{id}/schedule      → eliminar schedule
```

### Health
```
GET    /api/health                 → dashboard de todos los checks
GET    /api/health/server/{id}     → checks de un servidor
GET    /api/health/resource/{id}   → checks de un recurso
POST   /api/health/check/{id}      → forzar check ahora
```

### Notifications
```
GET    /api/notifications/channels → listar canales
POST   /api/notifications/channels → crear canal
PUT    /api/notifications/channels/{id} → actualizar
DELETE /api/notifications/channels/{id} → eliminar
POST   /api/notifications/test/{id} → enviar test
```

### Terminal (WebSocket — Reverb)
```
WS connect → channel: terminal.{serverId}
→ Client: { action: "connect", server_id, cols, rows }
→ Server: Output streaming...
→ Client: { action: "input", data: "ls -la\n" }
→ Server: { action: "output", data: "..." }
→ Client: { action: "resize", cols, rows }
→ Client: { action: "disconnect" }
```

---

## Roadmap de Implementación

### Fase 1 — Setup (día 1)
- [ ] Crear proyecto Laravel 11 con Breeze (Inertia + React stack)
- [ ] Configurar Docker Compose: app, postgres, redis
- [ ] Configurar Reverb + Horizon
- [ ] Migración users + base de autenticación
- [ ] Layout base con sidebar (shadcn/ui)

### Fase 2 — Auth + Settings (días 2-3)
- [ ] Login, register, logout funcionando
- [ ] Settings: perfil, cambiar contraseña
- [ ] Configuración de notificaciones (CRUD canales)

### Fase 3 — Servers (días 4-7)
- [ ] Modelo + migración Server
- [ ] CRUD de servidores con upload de PEM
- [ ] SshService — conexión + test (spatie/ssh)
- [ ] Encriptación/desencriptación de PEMs
- [ ] UI: Servers Index + Create + Detail
- [ ] Auto-discovery básico (docker ps)

### Fase 4 — Resources (días 8-10)
- [ ] Modelo + migración ServerResource
- [ ] CRUD de recursos (manual + desde discovery)
- [ ] Conexión opcional a DBs externas (drivers)
- [ ] UI: Resources como tabs dentro de Server

### Fase 5 — Playbooks (días 11-16)
- [ ] Modelos: Playbook, PlaybookStep, PlaybookRun, StepRun
- [ ] Playbook Builder UI (drag & drop steps)
- [ ] Ejecutor de playbooks (secuencial, paso a paso)
- [ ] Streaming de output vía Reverb
- [ ] Historial de runs
- [ ] Scheduling con cron
- [ ] Rollback automático en fallo

### Fase 6 — Terminal (días 17-19)
- [ ] TerminalSessionService (phpseclib)
- [ ] Reverb channel handler para terminal
- [ ] Componente xterm.js en React
- [ ] Resize, copy/paste, session persistente

### Fase 7 — Health Checks (días 20-22)
- [ ] Modelo HealthCheckResult
- [ ] Ejecutor de checks programados
- [ ] Dashboard de health (status, alerts)
- [ ] Health checks predefinidos por tipo de servicio

### Fase 8 — Pulido (días 23-25)
- [ ] Dashboard principal con métricas
- [ ] Notificaciones en eventos (playbook, health, server down)
- [ ] Horizon Dashboard accesible
- [ ] Rol de administrador (opcional)
- [ ] Tests básicos

---

## Notas Técnicas

### Manejo de PEMs
- Upload por formulario (file input), se valida que sea una key válida
- Se almacena encryptada con `Crypt::encryptString()` usando APP_KEY
- Nunca se expone en respuestas API (campo siempre null en serialización)
- Se decrypta en memoria al establecer conexión SSH
- Rotación: al subir nueva key, se encripta y reemplaza

### Variables de Entorno

```env
APP_NAME=InfraManager
APP_ENV=local
APP_KEY=

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=inframanager
DB_USERNAME=inframanager
DB_PASSWORD=

REDIS_HOST=redis
REDIS_PORT=6379

REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=0.0.0.0
REVERB_PORT=8080

SCHEDULER_ENABLED=true
HORIZON_ENABLED=true
```

### Docker Compose

```yaml
services:
  app:
    build: .
    ports: ["80:80"]
    depends_on: [postgres, redis]
    volumes: [".:/var/www/html"]

  postgres:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine

  reverb:
    build: .
    command: php artisan reverb:start
    depends_on: [redis]

  horizon:
    build: .
    command: php artisan horizon
    depends_on: [redis]

  scheduler:
    build: .
    command: php artisan schedule:work
    depends_on: [redis]
```

---

## Referencias

- [Laravel 11](https://laravel.com/docs/11.x)
- [Inertia + React](https://inertiajs.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Laravel Reverb](https://reverb.laravel.com/)
- [Laravel Horizon](https://laravel.com/docs/11.x/horizon)
- [phpseclib](https://github.com/phpseclib/phpseclib)
- [spatie/ssh](https://github.com/spatie/ssh)
- [xterm.js](https://xtermjs.org/)
