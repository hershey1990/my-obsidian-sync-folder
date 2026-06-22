---
tipo: adr
fecha: 2026-01-20
estado: aceptado
reemplazado_por: ADR-010
proyecto: patioz-be
sync_status:
  backend: no_aplica
  frontend: no_aplica
decision: "BFF con Fastify + TypeScript + Clean Architecture"
tags:
  - adr
---
# ADR-002: BFF con Fastify + TypeScript + Clean Architecture

## Contexto
Los microservicios exponen APIs especializadas que no están optimizadas para el frontend. Se necesita una capa intermedia que orqueste llamadas, agregue respuestas y adapte los datos a las necesidades de la UI.

## Decisión
Se implementa un **Backend for Frontend (BFF)** con:
- **Node.js + TypeScript** — tipado estático, ecosistema maduro.
- **Fastify** — alto rendimiento, bajo overhead, plugin system.
- **Clean Architecture** — separación estricta de dominio, aplicación e infraestructura.
- **Zod** — validación de schemas + inferencia de tipos estáticos.
- **QStash / localStash** — orquestación asíncrona.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Fastify** | Rápido, liviano, buena DX con TypeScript | Menos ecosistema que Express |
| **Express** | Ampliamente conocido, mucha comunidad | Menos performante, middleware verboso |
| **NestJS** | Estructura opinionada, DI, módulos | Overhead para un BFF delgado |
| **GraphQL (Apollo)** | Flexibilidad de queries, tipado fuerte | Complejidad de schemas, caché difícil |

## Consecuencias
- **Positivo:** El frontend se comunica con un solo endpoint. La Clean Architecture facilita testing y evolución.
- **Negativo:** El BFF puede convertirse en un cuello de botella si no se escala adecuadamente.
- **Mitigación:** El BFF es stateless, permitiendo escalado horizontal con un load balancer.

## Estado
- [x] Aceptado
