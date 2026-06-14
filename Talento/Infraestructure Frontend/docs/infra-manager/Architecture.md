---
title: Architecture
description: System architecture, data model, and component interactions
---

# Architecture

## High-Level Architecture

```
[Browser] ◄──HTTPS──► [Laravel App (Nginx + PHP-FPM)]
           ◄──WS────► [Laravel Reverb (WebSocket)]
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

## Data Model

### Server

Represents a remote machine accessible via SSH.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | string | Human-readable label |
| `ip` | string | IP address or hostname |
| `port` | integer | SSH port (default 22) |
| `username` | string | SSH user |
| `pem_key` | text (encrypted) | Private key content, AES-256 encrypted via `Crypt::encryptString()` |
| `type` | string | Provider: lightsail, hetzner, vultr, local, etc. |
| `status` | enum | online, offline, unknown |
| `metadata` | json | Detected OS, Docker version, provider info |
| `discovered_at` | timestamp | Last auto-discovery run |

### ServerResource

A service running on a server or an external dependency.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `server_id` | UUID (nullable) | Parent server, null for external resources |
| `name` | string | Label (e.g., "Rocket.Chat Production") |
| `type` | enum | Service type: rocketchat, vaultwarden, mongodb, postgres, etc. |
| `connection_type` | enum | local or external |
| `connection_string` | text (encrypted) | External connection URI |
| `port` | integer (nullable) | Internal port |
| `discovery_method` | enum | auto or manual |
| `drivers_config` | json (nullable) | Optional credentials for direct DB connection |
| `health_check_config` | json | Custom health checks |

### Playbook

A multi-step automation pipeline.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | string | Display name |
| `description` | text | Purpose and notes |
| `server_id` | UUID (nullable) | Default target server |
| `parameters` | json | User-defined variables with defaults |
| `notification_channels` | json | Which channels to notify on events |
| `status` | enum | active or archived |
| `version` | integer | Incremented on each edit |

### PlaybookStep

A single step within a playbook.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `playbook_id` | UUID | Parent playbook |
| `order` | integer | Execution order |
| `type` | enum | ssh, local, docker, http, wait, notify |
| `name` | string | Step label |
| `command` | text | Command or script to execute |
| `target_server_id` | UUID (nullable) | Override default server |
| `run_if` | string (nullable) | Condition expression |
| `rollback_command` | text (nullable) | Command to revert on failure |
| `timeout` | integer | Max execution time in seconds |
| `retries` | integer | Number of automatic retries |

### PlaybookRun & StepRun

Execution records for auditing and debugging.

| Field | Description |
|---|---|
| `status` | running, success, failed, rolled_back, cancelled |
| `triggered_by` | manual or schedule |
| `output` | Full log of command execution |
| `exit_code` | Process exit code |

## Key Flows

### Server Connection

1. User provides IP + PEM
2. PEM is encrypted and stored in the database
3. On each operation, PEM is decrypted in memory
4. SSH connection is established via `spatie/ssh` (commands) or `phpseclib` (terminal)
5. Connection is closed after the operation

### Playbook Execution

1. PlaybookRun is created with status `running`
2. Steps execute sequentially
3. Each StepRun streams output via WebSocket to the browser
4. On step failure, rollback steps execute automatically
5. On completion, notification is sent via configured channels

### Auto-Discovery

1. After SSH connection is verified
2. Panel runs: `docker ps`, `docker images`, `systemctl`, `ss -tlnp`
3. Results are parsed and displayed
4. User confirms discovered services → ServerResources are created
