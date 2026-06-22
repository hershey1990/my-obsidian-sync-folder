---
tipo: adr
fecha: 2026-06-07
estado: aceptado
decision: "Migración a Monolito Modular + BullMQ"
proyecto: patioz-be
copiado_a: []
corregido_por:
  - ADR-012
tags:
  - adr
---
# ADR-006: Migración a Monolito Modular + BullMQ

## Contexto
El equipo está compuesto por un Senior Tech Lead (tiempo parcial) y devs juniors. La arquitectura de microservicios demostró ser demasiado compleja para la capacidad actual del equipo: múltiples repositorios, pipelines de CI/CD independientes, orquestación de deploys, tracing distribuido. El tiempo de onboarding de un nuevo dev pasó de días a semanas.

Además, a corto plazo el sistema no requiere escalar servicios de forma independiente — el cuello de botella es la entrega de funcionalidades, no la carga de usuarios.

## Decisión
Se migra a una arquitectura de **Monolito Modular**:

- **Un solo repositorio** con todos los módulos (auth, bff, imgproxy) en un mismo proyecto.
- **Separación lógica por módulos** — cada módulo sigue Clean Architecture internamente con su propio dominio, aplicación e infraestructura, pero comparten el mismo runtime y base de datos.
- **BullMQ** (Redis) reemplaza a QStash para toda comunicación asíncrona entre módulos y tareas de larga duración (procesamiento de imágenes, notificaciones, etc.).
- **Redis** como capa de caché compartida y cola de trabajos.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Monolito Modular + BullMQ** | Simplicidad operativa, despliegue único, onboarding rápido, un solo pipeline CI/CD | Escalado vertical, acoplamiento si no se cuidan los límites de módulo |
| **Microservicios (estado actual)** | Escalamiento horizontal, equipos autónomos | Complejidad operativa excesiva para el equipo actual |
| **Serverless (Lambda + SQS)** | Sin servidores que operar | Cold starts, vendor lock-in, debugging complejo |

## Consecuencias
- **Positivo:** Un solo `docker compose` para levantar todo. Un solo pipeline CI/CD. Los devs juniors entienden el proyecto completo más rápido. Se elimina la dependencia de QStash (servicio externo).
- **Negativo:** Redis pasa a ser una dependencia crítica del sistema. El monolite solo escala verticalmente.
- **Mitigación:** La separación por módulos con Clean Architecture permite extraer un módulo a microservicio si en el futuro se necesita escalar de forma independiente. Redis es fácil de operar y ampliamente conocido.

## Estado
- [x] Aceptado

> **Nota (2026-06-22):** La estructura interna de módulos descrita en este ADR ("Clean Architecture con dominio, aplicación e infraestructura") fue corregida por ADR-012. La implementación real usa el Repository Pattern con `contracts/` + `adapters/` a nivel raíz del módulo, sin subdirectorios `domain/application/infrastructure`.

## Reemplaza
- ADR-001 (Microservicios)
- ADR-005 (QStash)
