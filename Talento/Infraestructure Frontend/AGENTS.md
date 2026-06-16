# Control — Infraestructure Manager

## Purpose
Panel web self-hosted para gestionar servidores vía SSH: monitoreo, playbooks de automatización (backups, updates), terminal interactiva, health checks, y notificaciones.

## ADRs
| # | Decisión | Archivo |
|---|---|---|
| 001 | Nombre: **Control** | `adrs/ADR-001-nombre-del-proyecto.md` |
| 002 | Infra: **Railway** (app + PG managed + Redis managed) | `adrs/ADR-002-infraestructura.md` |
| 003 | LOCAL steps: **Railway Volumes** como staging + **S3** como destino | `adrs/ADR-003-local-steps-s3.md` |
| 004 | Auth: **Breeze** (email/password) MVP + GitHub OAuth Fase 2 | `adrs/ADR-004-autenticacion.md` |
| 005 | Licencia: **MIT** | `adrs/ADR-005-licencia.md` |
| 006 | Docs: **Español** (por ahora) | `adrs/ADR-006-lenguaje-documentacion.md` |
| 007 | Arquitectura: **Layered + Action Pattern** | `adrs/ADR-007-arquitectura.md` |
| 008 | SSH: **SshService con spatie/ssh** | `adrs/ADR-008-ssh-service.md` |

## Stack
| Capa | Tecnología |
|---|---|
| Backend | Laravel 11 |
| Frontend | Inertia + React + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Jobs | Laravel Horizon + Redis |
| Scheduling | Laravel Scheduler |
| SSH comandos | spatie/ssh |
| SSH terminal | Laravel Reverb + phpseclib |
| WebSocket | Laravel Reverb |
| DB | PostgreSQL |
| Infra | Railway (volúmenes persistentes) |

## Arquitectura (`app/`)
```
Http/Controllers → Actions/ → Models/ + Services/
```
- **Controllers**: delgados, solo validan y llaman Actions
- **Actions**: un caso de uso = una clase (CreateServerAction, RunPlaybookAction, etc.)
- **Models**: Eloquent anémicos (relationships, scopes, accessors)
- **Services**: lógica con dependencias externas (SSH, WebSocket, S3)
- Sin Repository, sin Hexagonal, sin DDD táctico — pragmáticos

## Modelo de datos
- **Server**: ip, port, username, pem_key (encrypted), status
- **ServerResource**: servicio local o externo (MongoDB, Postgres, etc.)
- **Playbook**: nombre, server default, parámetros
- **PlaybookStep**: type (ssh/local/docker/http/wait/notify), command, rollback_command
- **PlaybookRun**: status, triggered_by (manual|schedule)
- **StepRun**: status, exit_code, output
- **HealthCheckResult**: checkable (Server|Resource), status, value
- **NotificationChannel**: slack/discord/email/webhook

## Features MVP
1. CRUD Servers + test conexión SSH + auto-discovery (docker ps, systemctl)
2. CRUD Resources + conexión directa opcional a DBs externas
3. Playbooks con steps multi-tipo, rollback automático
4. Scheduling cron
5. Terminal interactiva via Reverb + xterm.js
6. Health checks automáticos
7. Notificaciones (Slack, Discord, Email, Webhook)

## Roadmap implementación
| Fase | Qué | Archivos clave |
|---|---|---|
| 1 | Setup Laravel + Breeze + shadcn + Docker Compose | `docker-compose.yml`, `Dockerfile` |
| 2 | Auth + Settings full | Breeze built-in + NotificationChannels CRUD |
| 3 | Servers CRUD + SSH + Discovery | `Actions/Servers/`, `Services/SshService.php` |
| 4 | Resources CRUD | `Actions/Resources/`, `Models/ServerResource.php` |
| 5 | Playbooks + Engine + Horizon | `Actions/Playbooks/`, `Services/PlaybookEngine.php` |
| 6 | Terminal (xterm.js + Reverb) | `Services/TerminalSessionService.php` |
| 7 | Health Checks | `Actions/Health/`, scheduling |
| 8 | Dashboard + pulido | `Pages/Dashboard.tsx` |

## Docs exportables a Outline
`docs/infra-manager/` — 8 archivos con frontmatter title/description.

## Notas técnicas
- PEMs se encriptan con `Crypt::encryptString()` usando APP_KEY (AES-256)
- Los steps LOCAL en playbooks escriben al Volume Railway (`/data/`) como staging
- Destino final de backups siempre es S3 (AWS, Cloudflare R2, etc.)
- Terminal usa WebSocket bidireccional; sesiones SSH persistentes con phpseclib

## Child DOX Index
| Child | Scope |
|---|---|
| `adrs/` | Decisiones arquitectónicas (7 ADRs) |
| `docs/infra-manager/` | Documentación del proyecto exportable a Outline |
