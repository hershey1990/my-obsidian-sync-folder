---
tipo: adr
fecha: 2026-02-01
estado: aceptado
reemplazado_por: ADR-007
proyecto: patioz-be
implementado: no_aplica
decision: "Auth API con NestJS + Supabase + RBAC"
tags:
  - adr
---
# ADR-003: Auth API con NestJS + Supabase + RBAC

## Contexto
Se necesita un servicio de autorización que gestione permisos granulares (acción + recurso) para los distintos roles de usuario en el sistema. La autenticación (login) se delega a un proveedor externo.

## Decisión
Se construye una **Auth API** independiente con:
- **NestJS 10 + Express** — framework opinionado con DI, módulos y buena estructura para APIs.
- **Supabase (PostgreSQL)** — base de datos como servicio, evita operar un servidor propio.
- **RBAC** — control de acceso basado en roles (Usuario → Rol → Permiso).
- **Arquitectura Hexagonal** — separación de dominio, aplicación e infraestructura.
- **class-validator / class-transformer** — validación de DTOs.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Supabase + NestJS** | Menos overhead operativo, RBAC flexible | Dependencia de Supabase (vendor lock-in parcial) |
| **Auth0 / Clerk** | SaaS, zero maintenance | Costo recurrente, control limitado sobre datos |
| **PostgreSQL + raw SQL** | Control total | Más trabajo operativo, sin UI de administración |
| **Clerk + API Key** | Rápido de integrar | Menos flexible para permisos personalizados |

## Consecuencias
- **Positivo:** Separación clara entre autenticación (delegada) y autorización (propia). La arquitectura hexagonal facilita cambiar de proveedor de BD si es necesario.
- **Negativo:** NestJS añade complejidad frente a una solución más liviana.
- **Mitigación:** Se usa NestJS solo para este servicio; el BFF usa Fastify que es más liviano.

## Estado
- [x] Aceptado
