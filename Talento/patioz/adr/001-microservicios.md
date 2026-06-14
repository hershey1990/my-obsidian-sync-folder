---
tipo: adr
fecha: 2026-01-15
estado: reemplazado
reemplazado_por: ADR-006
decision: "Adopción de arquitectura de microservicios"
tags:
  - adr
---
# ADR-001: Adopción de Arquitectura de Microservicios

## Contexto
El sistema Patioz requiere gestionar múltiples dominios (autenticación, propiedades, mapas, archivos) con distintos ritmos de evolución. Una arquitectura monolítica escalaría mal y dificultaría el despliegue independiente de cada funcionalidad.

## Decisión
Se adoptó una arquitectura de **microservicios**, donde cada servicio es autónomo, tiene su propio repositorio y puede desplegarse de forma independiente.

Cada microservicio:
- Posee su propia base de datos (persistencia aislada).
- Se comunica con otros servicios vía HTTP síncrono (REST) o colas asíncronas (QStash).
- Sigue Clean Architecture / Hexagonal Architecture.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Monolito Modular** | Simplicidad inicial, despliegue único | Acoplamiento, escalado vertical, equipos pisándose |
| **Microservicios** | Escalamiento horizontal, despliegue independiente, equipos autónomos | Complejidad operativa, comunicación entre servicios |
| **Serverless (Lambda)** | Costo por uso, escalado infinito | Cold starts, límite de tiempo, vendor lock-in |

## Consecuencias
- **Positivo:** Cada equipo puede trabajar en su servicio sin bloquear a otros. Mayor resiliencia (fallo aislado).
- **Negativo:** Mayor complejidad operativa (orquestación, monitoreo, tracing distribuido).
- **Mitigación:** Se usa un BFF como punto de entrada único para simplificar la comunicación desde el frontend.

## Estado
- [x] Aceptado
