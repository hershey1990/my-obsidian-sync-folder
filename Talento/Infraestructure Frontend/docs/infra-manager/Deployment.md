---
title: Deployment
description: Deploy and maintain the panel in production
---

# Deployment

## Production Requirements

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04+ | Ubuntu 24.04 |
| Docker | 24+ | Latest |

## Docker Compose (Production)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - APP_ENV=production
    depends_on:
      - postgres
      - redis
    volumes:
      - storage:/var/www/html/storage
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: inframanager
      POSTGRES_USER: inframanager
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    restart: unless-stopped

  reverb:
    build:
      context: .
      dockerfile: Dockerfile
    command: php artisan reverb:start
    ports:
      - "8080:8080"
    depends_on:
      - redis
    restart: unless-stopped

  horizon:
    build:
      context: .
      dockerfile: Dockerfile
    command: php artisan horizon
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  scheduler:
    build:
      context: .
      dockerfile: Dockerfile
    command: php artisan schedule:work
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

volumes:
  pgdata:
  redisdata:
  storage:
```

## Security Considerations

| Area | Recommendation |
|---|---|
| **HTTPS** | Use Caddy or Traefik as reverse proxy with automatic Let's Encrypt |
| **APP_KEY** | Keep secure — it encrypts all PEM keys and credentials |
| **Database** | Use strong password, restrict network access to Docker network only |
| **Backups** | Schedule daily backups of PostgreSQL + storage volume |
| **Updates** | Subscribe to releases for security patches |

## Backing Up the Panel

```bash
# Backup database
docker compose exec postgres pg_dump -U inframanager inframanager > backup.sql

# Backup storage (encrypted PEMs, etc.)
docker run --rm -v infra-manager_storage:/data -v .:/backup alpine \
  tar czf /backup/storage-backup.tar.gz -C /data .
```

## Updating

```bash
git pull origin main
docker compose build --no-cache app reverb horizon scheduler
docker compose up -d
php artisan migrate
```

## Monitoring the Panel

Access Laravel Horizon at `/horizon` to monitor:

- Queue status (active jobs, failed jobs, throughput)
- Worker health
- Job retries and failures

The panel itself can be added as a server to monitor its own health.
