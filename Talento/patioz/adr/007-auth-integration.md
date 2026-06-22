---
tipo: adr
fecha: 2026-06-08
estado: aceptado
decision: Integración de Auth (login + permisos) en el Monolito Modular con Supabase
proyecto: patioz-be
sync_backend: copiado
sync_frontend: no_aplica
corregido_por:
  - ADR-010
tags:
  - adr
---
# ADR-007: Integración de Auth (login + permisos) en el Monolito Modular

## Contexto
El ADR-006 migró la arquitectura de microservicios a un monolito modular. Sin embargo, el módulo de auth se mantuvo como un submódulo NestJS heredado de la arquitectura anterior (ADR-003). Esto generó dos problemas:

1. **Integridad referencial:** Los usuarios residen en Supabase Auth (servicio externo), mientras que roles y permisos están en la BD del monolite. Los `userId` se referencian como strings UUID sin FK real, permitiendo huérfanos e inconsistencias.

2. **Complejidad innecesaria:** NestJS (Express) dentro de un monolite que usa Fastify añade overhead de mantenimiento sin beneficio. El módulo no necesita exponer una API HTTP separada; la capa HTTP del monolite (Fastify) ya puede delegar directamente.

Además, el módulo actual solo cubría autorización (permisos). La autenticación (login/signup) estaba delegada a Supabase Auth pero sin una integración clara con el flujo del monolite.

## Decisión
Se integra toda la lógica de auth (login + permisos) directamente en el monolito modular, eliminando el submódulo NestJS:

- **Supabase Auth** para autenticación (login, signup, sesiones JWT).
- **RBAC nativo en Supabase** — roles y permisos en tablas del esquema `public`, misma BD Postgres del monolite. Esto garantiza integridad referencial real mediante FKs.
- **NestJS como framework HTTP** — corregido por ADR-010. Este ADR originalmente asumía Fastify, pero el monolite migró a NestJS 11. La lógica de auth es un módulo NestJS con guards, decoradores y DI nativa.
- **Flujo de desarrollo:**
  - Las migraciones (seeds) crean un usuario de prueba con roles predefinidos.
  - Los devs deben crear usuarios usando `register` (signup) para simular flujos idénticos a producción.
  - No se permite insertar usuarios directo en `auth.users`.
- **Sincronización:** Una tabla `users` del dominio se sincroniza con `auth.users` mediante un trigger de Supabase (Database Function) o un hook post-register en el módulo de auth.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Monolito + Supabase Auth + RBAC (elegida)** | Un solo schema de BD, integridad referencial real, simplicidad operativa, flujos dev idénticos a prod | Vendor lock-in parcial con Supabase Auth |
| **Mantener NestJS como módulo auth** | Bajo costo de migración inmediato | NestJS + Express conviviendo con Fastify, integridad referencial débil, complejidad heredada |
| **Auth0 / Clerk** | Zero maintenance, sesiones avanzadas | Costo recurrente, datos fuera del monolite, mismo problema de integridad referencial |
| **JWT manual + PostgreSQL** | Control total, sin dependencias externas | Mayor trabajo operativo, riesgo de seguridad si no se implementa correctamente |

## Consecuencias
- **Positivo:** Integridad referencial real (usuarios ↔ roles ↔ permisos). Un solo framework HTTP (Fastify). Los devs prueban flujos completos localmente con `register`. Se elimina NestJS + Express del stack.
- **Negativo:** Mayor dependencia de Supabase (auth + BD).
- **Mitigación:** La lógica de auth está encapsulada tras interfaces (Clean Architecture). Cambiar de proveedor solo implica reemplazar la implementación de infraestructura.

## Estado
- [x] Aceptado

## Reemplaza
- ADR-003 (Auth API con NestJS + Supabase)
