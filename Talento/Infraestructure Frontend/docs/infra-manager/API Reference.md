---
title: API Reference
description: REST and WebSocket API documentation
---

# API Reference

## Base URL

All API endpoints are prefixed with `/api`. Responses are JSON.

```
https://infra.example.com/api
```

## Authentication

All endpoints require a Bearer token obtained via Sanctum.

```
Authorization: Bearer <token>
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "token": "sanctum-token",
  "user": { "id": "uuid", "name": "User", "email": "user@example.com" }
}
```

---

## Servers

### List Servers

```
GET /api/servers
Params: ?page=1&per_page=20&status=online

Response:
{
  "data": [
    {
      "id": "uuid",
      "name": "Rocket.Chat Prod",
      "ip": "203.0.113.10",
      "port": 22,
      "username": "ubuntu",
      "type": "lightsail",
      "status": "online",
      "last_seen": "2026-06-14T10:00:00Z",
      "resources_count": 3,
      "playbooks_count": 2,
      "created_at": "..."
    }
  ],
  "meta": { "current_page": 1, "total": 10 }
}
```

### Create Server

```
POST /api/servers
Content-Type: multipart/form-data

{
  "name": "Rocket.Chat Prod",
  "ip": "203.0.113.10",
  "port": 22,
  "username": "ubuntu",
  "pem_key": (file upload .pem),
  "type": "lightsail"
}

Response:
{
  "data": { "id": "uuid", ... },
  "message": "Server created. Connection test: success"
}
```

### Get Server

```
GET /api/servers/{id}

Response:
{
  "data": {
    "id": "uuid",
    "name": "...",
    "ip": "...",
    "resources": [...],
    "latest_health": {...}
  }
}
```

### Update Server

```
PUT /api/servers/{id}
Content-Type: multipart/form-data

{
  "name": "Updated Name",
  "pem_key": (file upload — only if rotating key)
}
```

### Delete Server

```
DELETE /api/servers/{id}
```

### Test Connection

```
POST /api/servers/{id}/test-connection

Response:
{
  "success": true,
  "message": "Connected successfully",
  "latency_ms": 45
}
```

### Auto-Discover

```
POST /api/servers/{id}/discover

Response:
{
  "data": {
    "os": "Ubuntu 24.04",
    "docker": true,
    "containers": [
      {
        "name": "rocketchat",
        "image": "registry.rocket.chat/rocketchat/rocket.chat:6.5.0",
        "status": "running",
        "ports": ["3000/tcp"]
      }
    ],
    "services": [
      { "name": "nginx", "status": "active" }
    ]
  }
}
```

---

## Resources

### List Resources

```
GET /api/resources
GET /api/servers/{serverId}/resources
```

### Create Resource

```
POST /api/servers/{serverId}/resources

{
  "name": "MongoDB Atlas",
  "type": "mongodb",
  "connection_type": "external",
  "connection_string": "mongodb+srv://..."
}
```

### Test Direct Connection

```
POST /api/resources/{id}/test-connection

Response:
{
  "success": true,
  "version": "7.0.12",
  "latency_ms": 120
}
```

---

## Playbooks

### List Playbooks

```
GET /api/playbooks
```

### Create Playbook

```
POST /api/playbooks

{
  "name": "Full Upgrade",
  "server_id": "uuid",
  "parameters": [
    { "key": "BACKUP_PATH", "label": "Backup Path", "default": "/tmp" }
  ],
  "steps": [
    {
      "type": "ssh",
      "name": "Backup DB",
      "command": "docker compose exec mongo mongodump",
      "order": 1,
      "timeout": 120,
      "rollback_command": "echo rollback"
    }
  ]
}
```

### Run Playbook

```
POST /api/playbooks/{id}/run

Response:
{
  "data": {
    "id": "run-uuid",
    "status": "running",
    "steps": [
      {
        "id": "step-run-uuid",
        "name": "Backup DB",
        "status": "running"
      }
    ]
  }
}
```

### Get Run Details

```
GET /api/playbooks/{id}/runs/{runId}

Response:
{
  "data": {
    "id": "run-uuid",
    "status": "success",
    "steps": [
      {
        "name": "Backup DB",
        "status": "success",
        "exit_code": 0,
        "output": "Connected to MongoDB...\nBackup complete.",
        "duration_ms": 12300,
        "started_at": "...",
        "finished_at": "..."
      }
    ]
  }
}
```

### Cancel Run

```
POST /api/playbooks/{id}/runs/{runId}/cancel
```

### Schedule Playbook

```
POST /api/playbooks/{id}/schedule

{
  "cron": "0 3 * * 0",
  "timezone": "UTC",
  "enabled": true
}
```

---

## WebSocket (Terminal)

### Connection

```
Endpoint: wss://infra.example.com:8080
Channel: terminal.{serverId}
```

### Messages

**Client → Server:**

```json
// Connect to terminal session
{ "action": "connect", "server_id": "uuid", "cols": 80, "rows": 24 }

// Send input keystrokes
{ "action": "input", "data": "ls -la\n" }

// Resize terminal
{ "action": "resize", "cols": 120, "rows": 40 }

// Disconnect
{ "action": "disconnect" }
```

**Server → Client:**

```json
// Terminal output
{ "action": "output", "data": "total 128\ndrwxr-xr-x ..." }

// Connection established
{ "action": "connected", "session_id": "..." }

// Disconnected
{ "action": "disconnected", "reason": "connection closed" }

// Error
{ "action": "error", "message": "Authentication failed" }
```

---

## Health Checks

### List Health Results

```
GET /api/health
GET /api/health/server/{serverId}
GET /api/health/resource/{resourceId}
```

### Trigger Check

```
POST /api/health/check/{serverId}
```
