---
title: Setup & Installation
description: Deploy the panel on your own infrastructure
---

# Setup & Installation

## Prerequisites

- A Linux VPS with Docker and Docker Compose installed
- A domain name pointed to your server (optional, for HTTPS)
- Git

## Quick Start

```bash
git clone https://github.com/your-org/infra-manager.git
cd infra-manager
cp .env.example .env
# Edit .env with your settings

docker compose up -d
```

## Environment Variables

```env
APP_NAME=InfraManager
APP_ENV=production
APP_KEY=base64:...   # Generate with: php artisan key:generate
APP_URL=https://infra.example.com

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=inframanager
DB_USERNAME=inframanager
DB_PASSWORD=secure_password

REDIS_HOST=redis
REDIS_PORT=6379

REVERB_APP_ID=app-id
REVERB_APP_KEY=app-key
REVERB_APP_SECRET=app-secret
REVERB_HOST=0.0.0.0
REVERB_PORT=8080

SCHEDULER_ENABLED=true
HORIZON_ENABLED=true

# Optional: Default notification channels
SLACK_WEBHOOK_URL=
DISCORD_WEBHOOK_URL=
```

## First Run

1. Access `https://infra.example.com`
2. Create the admin account
3. Go to **Settings > Keys** to manage SSH PEM keys
4. Add your first server

## Docker Services

| Service | Description |
|---|---|
| `app` | Nginx + PHP-FPM serving the Laravel app |
| `postgres` | PostgreSQL 16 database |
| `redis` | Redis 7 for queues and caching |
| `reverb` | WebSocket server for terminal and live output |
| `horizon` | Queue worker for async job execution |
| `scheduler` | Runs scheduled tasks every minute |

## Updating

```bash
git pull
docker compose build --no-cache app reverb horizon scheduler
docker compose up -d
php artisan migrate
```
