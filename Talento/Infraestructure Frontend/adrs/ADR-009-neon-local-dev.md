---
title: "ADR-009: Neon como base de datos local de desarrollo"
status: accepted
date: 2026-06-15
---

# ADR-009: Neon como base de datos local de desarrollo

## Contexto

El proyecto usa PostgreSQL en todos los entornos. Hasta ahora, el entorno de desarrollo local corre PostgreSQL dentro de Docker Compose.

Esta aproximación tiene problemas:

- **Consumo de recursos**: PostgreSQL en Docker ocupa RAM y CPU aunque no se esté trabajando activamente en el panel
- **Estado local frágil**: la DB local se corrompe fácilmente al suspender el equipo, cambiar de red, o hacer `docker compose down`
- **Aislamiento entre features**: al trabajar en múltiples branches, hay que migrar up/down constantemente o mantener múltiples contenedores
- **Colaboración**: compartir un snapshot de DB entre desarrolladores implica dumps manuales

Neon es un servicio serverless de PostgreSQL que ofrece:

- Postgres completo (no mock, no fork) — compatible al 100% con Laravel
- Free tier generoso (0.5 GB storage, branching ilimitado)
- Branching: crear una base de datos hija a partir de cualquier punto en el tiempo
- Connection pooling vía PgBouncer integrado
- Sin necesidad de correr un contenedor local

## Decisión

**Usar Neon como base de datos PostgreSQL para el entorno de desarrollo local, reemplazando el contenedor PostgreSQL de Docker Compose.**

El servicio PostgreSQL en Docker Compose se elimina. La DB de producción sigue en Railway Managed PostgreSQL (ADR-002) — este ADR solo aplica a desarrollo.

### Configuración

```
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432   ← pgvector proxy local de Neon (neon-proxy)
DB_DATABASE=inframanager_dev
DB_USERNAME=...
DB_PASSWORD=...
```

La conexión se hace vía `neon-proxy` — un proxy local que se autentica con API key de Neon y expone PostgreSQL en `localhost:5432`. No expone la base de datos directamente a internet.

### Flujo de trabajo (sin branching)

1. El desarrollador instala `@neondatabase/neon-proxy` (CLI)
2. Ejecuta `neon-proxy --project-id <id> --api-key <key>`
3. `localhost:5432` apunta a la DB dev principal de Neon
4. `php artisan migrate` funciona igual que antes

### Flujo de trabajo (con branching, opcional)

Para features complejos que requieren cambios de esquema:

1. Desde Neon Dashboard o CLI: crear branch a partir del punto actual
2. `neon-proxy` se conecta a la nueva branch
3. Desarrollo y migraciones aislados
4. Al hacer merge: descartar branch o mergear a principal desde Neon

## Opciones consideradas

| Opción | Pros | Contras |
|---|---|---|
| **Docker PostgreSQL** (status quo) | Sin dependencia externa, funciona offline | Consume recursos local, estado frágil, sin branching |
| **Neon** (elegido) | Serverless, branching, sin contenedor, free tier | Requiere internet, depende de servicio externo |
| **Supabase** | Similar a Neon, ofrece más servicios | Overkill (auth, storage, realtime — no usamos nada de eso) |
| **SQLite + Laravel** | Cero infra, archivo local | Diferencias con PostgreSQL en producción, sin features como `WHERE IN JSON` |

## Consecuencias

- Positivas: Docker Compose más ligero (solo app + redis), arranque más rápido
- Positivas: branching permite ambientes de desarrollo aislados sin migraciones condicionales
- Positivas: la DB nunca se corrompe por apagados bruscos
- Positivas: mismo PostgreSQL que producción — cero diferencias de motor
- Negativas: requiere internet para conectar a la base de datos
- Negativas: dependencia de un servicio externo incluso para desarrollo
- Negativas: el proxy local es un paso adicional en el setup del desarrollador

## Referencias

- [Neon — Serverless PostgreSQL](https://neon.tech)
- [Neon Proxy — conexión local](https://neon.tech/docs/connect/connect-from-any-app#neon-proxy)
- ADR-002: Infraestructura (Railway + PG managed en producción)
- ADR-006: Lenguaje de documentación (español)
