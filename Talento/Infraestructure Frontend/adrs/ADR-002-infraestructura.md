---
title: ADR-002: Infraestructura
status: accepted
date: 2026-06-14
---

# ADR-002: Infraestructura

## Contexto

El panel necesita un lugar donde ejecutarse con acceso a PostgreSQL, Redis, HTTPS, y capacidad de ejecutar conexiones SSH salientes. Las opciones consideradas fueron:

- VPS propio (Hetzner, Lightsail, etc.)
- Railway
- Fly.io
- Render

## Decisión

**Railway**

- PostgreSQL managed (backups, restauración, punto de restauración)
- Redis managed
- HTTPS automático con certificados Let's Encrypt
- Deploy directo desde GitHub (push to deploy)
- Escalado horizontal simple cuando sea necesario

## Consecuencias

- Positivas: cero mantenimiento de infraestructura, HTTPS automático, backups de DB incluidos
- Positivas: Redis y PostgreSQL como servicios managed, sin configurar
- Negativas: el disco de la aplicación es efímero — cualquier paso LOCAL en un playbook debe escribir a S3/B2, no a disco local
- Negativas: costo mensual mayor que un VPS (~$11-15/mo vs ~€6/mo)
