---
tipo: adr
fecha: 2026-03-01
estado: aceptado
tags:
  - adr
---
# ADR-005: Orquestación Asíncrona con QStash / localStash

## Contexto
Varios flujos del sistema requieren procesamiento asíncrono (subida de archivos, notificaciones, sincronización de datos). Se necesita un sistema de colas que sea fiable, fácil de usar y que funcione tanto en desarrollo como en producción.

## Decisión
Se utiliza **QStash (Upstash)** como proveedor de colas en producción y **localStash** (simulador en memoria) para desarrollo local.

- **QStash:** Cola serverless con entrega garantizada (at-least-once), reintentos configurables y latencia baja.
- **localStash:** Implementación en memoria que emula la API de QStash, activada por `QUEUE_PROVIDER=local`.
- **Flujo:** BFF publica mensajes → QStash entrega al microservicio destino → microservicio procesa y notifica vía webhook.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **QStash** | Serverless, sin infraestructura que operar, buen DX | Dependencia externa, límites de plan gratuito |
| **Redis + BullMQ** | Control total, maduro, auto-hosteable | Requiere operar Redis, más complejidad operativa |
| **SQS (AWS)** | Integración nativa con AWS, escalable | Vendor lock-in, no funciona offline |
| **RabbitMQ** | Robusto, mensajería avanzada | Overhead operativo, excesivo para el caso de uso |

## Consecuencias
- **Positivo:** localStash permite desarrollo offline y tests sin conexión. QStash elimina la necesidad de operar infraestructura de colas.
- **Negativo:** Dependencia de un servicio externo en producción.
- **Mitigación:** localStash permite cambiar de proveedor sin modificar la lógica de negocio (interface-based design).

## Estado
- [x] Aceptado
