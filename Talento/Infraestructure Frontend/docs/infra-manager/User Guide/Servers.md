---
title: Servers
description: Add, manage, and monitor your servers
---

# Servers

## Adding a Server

Connecting a server requires SSH access with a private key (`.pem`).

### Fields

| Field | Required | Description |
|---|---|---|
| Name | Yes | Human-readable label |
| IP / Hostname | Yes | Public IP or DNS name |
| Port | No | Default: 22 |
| Username | Yes | SSH user (typically `ubuntu`, `root`, or `admin`) |
| PEM Key | Yes | Private key file upload |
| Type | No | Provider label (lightsail, hetzner, vultr, etc.) |

### PEM Key Handling

- Keys are encrypted with AES-256 (using the application's `APP_KEY`) before storage
- They are never shown in the UI or exposed in API responses
- They are decrypted in memory only during SSH operations
- To rotate a key, edit the server and upload a new one

## Auto-Discovery

After adding a server, run auto-discovery to detect running services.

The panel executes:

| Command | Purpose |
|---|---|
| `docker ps --format json` | Find running containers |
| `docker images --format json` | See installed images with versions |
| `systemctl list-units --type=service --state=running` | Detect system services |
| `ss -tlnp` | See listening ports |
| `cat /etc/os-release` | Get OS details |

Results are presented for you to:

1. Review detected services
2. Assign a type label (Rocket.Chat, MongoDB, etc.)
3. Confirm or discard

Unrecognized services default to type `custom`.

## Server Status

| Status | Meaning |
|---|---|
| 🟢 Online | Successfully connected on last check |
| 🟡 Unknown | Not yet checked |
| 🔴 Offline | SSH connection failed on last check |

The panel checks connectivity periodically and displays the status on the dashboard.

## Managing Servers

From the server detail page, you can:

- **Edit** name, IP, port, username, or PEM key
- **Delete** the server (cascades to its Resources and Playbook history)
- **Test Connection** to verify SSH access
- **View Resources** — linked services (local and external)
- **Run Playbooks** — execute or schedule playbooks targeting this server
- **Open Terminal** — interactive SSH terminal in the browser
- **View Health** — latest health check results
