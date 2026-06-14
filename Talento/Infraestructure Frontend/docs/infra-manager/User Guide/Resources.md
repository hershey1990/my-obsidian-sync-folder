---
title: Resources
description: Manage services and external dependencies for each server
---

# Resources

Resources represent the services running on a server or external dependencies that a server connects to.

## Local Resources

Created automatically by auto-discovery or manually.

**Examples:**
- Rocket.Chat container on `localhost:3000`
- MongoDB container on `localhost:27017`
- Nginx reverse proxy on `localhost:80`

Each resource tracks:
| Field | Description |
|---|---|
| Name | Label (e.g., "Rocket.Chat Production") |
| Type | Service type (affects health check presets) |
| Version | Auto-detected or manually entered |
| Port | Internal port |
| Health Endpoint | URL for health checks |

## External Resources

Resources not running on the server itself but connected to it.

**Examples:**
- MongoDB Atlas cluster linked to your Rocket.Chat
- Neon Postgres database linked to your Outline
- Cloudflare R2 bucket for backups

External resources store:
| Field | Description |
|---|---|
| Name | Label |
| Type | Database, object storage, etc. |
| Connection String | Encrypted URI |
| Credentials | Optional user/password for direct connectivity |

## Resource Hierarchy

```
Server: Rocket.Chat Production
├── 🟢 Rocket.Chat (local, port 3000)
├── 🟢 MongoDB (local, port 27017)
└── 🔵 Mongo Atlas Cluster (external)
        └── Connection: mongodb+srv://...

Server: Vaultwarden
└── 🟢 Vaultwarden (local, port 80)
```

## Direct DB Connection (Optional)

For supported resource types, you can configure credentials in the `drivers_config` field. This allows the panel to:

- Test connectivity directly to the database
- Run database-specific health checks
- Execute database backup jobs via native driver (not just SSH)

This is optional — the panel works fine with just SSH to the application server.
