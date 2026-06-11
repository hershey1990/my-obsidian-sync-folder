---
id: TSK-002
fase: 0
modulo: Cimientos
prioridad: alta
dependencias: []
estimado: 2d
---

# TSK-002: Setup Laravel + Supabase + DB migrations

Inicializar backend con Laravel 11 y conectar Supabase PostgreSQL.

## Entregables
- Proyecto Laravel 11 creado y funcional
- Conexión a Supabase PostgreSQL (Plan Pro: 8GB RAM, 100GB)
- Migraciones iniciales para las 7 tablas del schema
- Seeders básicos para modelos de referencia
- Laravel Sanctum configurado para auth

## Criterios de aceptación
- `php artisan migrate` corre sin errores
- Se conecta a Supabase
- Las 7 tablas existen en la DB
