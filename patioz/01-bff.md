# BFF (Backend for Frontend)

Este servicio actúa como el **Backend for Frontend** o Gateway para toda la plataforma Patioz. Está construido sobre Node.js utilizando TypeScript y el framework Fastify.

## Stack Tecnológico y Justificación

La elección del stack tecnológico se basa en los siguientes principios: rendimiento, robustez y una excelente experiencia de desarrollo.

- **Node.js y Fastify:** Se eligió Fastify por ser un framework web de alto rendimiento y bajo overhead para Node.js. Su arquitectura basada en plugins y su enfoque en la velocidad lo hacen ideal para un BFF, que debe procesar y enrutar un gran volumen de peticiones de manera eficiente, actuando como una capa delgada y rápida frente a los microservicios.

- **TypeScript:** El uso de TypeScript es fundamental para construir un sistema robusto y mantenible. El tipado estático nos permite detectar errores en tiempo de compilación, mejora la legibilidad del código y facilita la colaboración en el equipo.

## Validación de Schemas y DTOs con Zod

La validación de todos los datos de entrada (payloads, query params, etc.) se gestiona exclusivamente con **Zod**. Esta librería juega un doble papel crucial:

1.  **Validación en Tiempo de Ejecución:** Define schemas que validan la estructura y los tipos de los datos de las peticiones HTTP en el borde del sistema (la capa de rutas).
2.  **Inferencia de Tipos Estáticos:** A partir de un único schema de Zod, se infieren automáticamente los tipos de TypeScript para los DTOs (Data Transfer Objects). Esto elimina la duplicación de código y garantiza que los tipos estáticos y las validaciones de runtime estén siempre sincronizados.

## Orquestación Asíncrona con BullMQ

Para la orquestación de flujos que involucran tareas de larga duración (como el procesamiento de subidas de archivos), el BFF utiliza **BullMQ (Redis)**. Cuando necesita ejecutar una tarea en segundo plano, publica un trabajo en una cola de BullMQ que es procesada por un worker dedicado dentro del mismo proceso o en un worker por separado. Esto desacopla la petición HTTP de la ejecución, mejorando la experiencia del usuario y la resiliencia del sistema.

BullMQ ofrece control total sobre las colas: reintentos configurables, prioridades, scheduling, y monitoreo vía su Dashboard (Bull Board). Al correr sobre Redis, no requiere servicios externos a la infraestructura del proyecto.

## Arquitectura

El proyecto sigue estrictamente los principios de **Arquitectura Limpia (Clean Architecture)** y **Domain-Driven Design (DDD)**. Esto asegura una separación clara de responsabilidades, donde la lógica de negocio del dominio permanece completamente agnóstica a los detalles de la infraestructura (frameworks, bases de datos, colas, etc.). Esta separación facilita las pruebas, el mantenimiento y la evolución del sistema.

## Flujo de Comunicación Asíncrona

El siguiente diagrama ilustra el flujo de una operación asíncrona orquestada por el BFF, como por ejemplo, el procesamiento de una imagen.

```mermaid
sequenceDiagram
    participant Client as Cliente (Frontend)
    participant BFF
    participant Redis as Redis / BullMQ
    participant Worker as Worker (mismo proceso)
    participant DB as Base de Datos

    Client->>+BFF: 1. Inicia operación (e.g., POST /upload)
    BFF->>BFF: 2. Genera `operationId`
    BFF->>DB: 3. Persiste estado inicial de la operación (PENDING)
    BFF->>-Client: 4. Responde inmediatamente con `operationId`
    BFF->>+Redis: 5. Publica el trabajo en la cola (con `operationId`)
    Redis->>-Worker: 6. Entrega el trabajo al worker
    
    activate Worker
    Worker->>Worker: 7. Procesa la tarea...
    alt Proceso Exitoso
        Worker->>DB: 8a. Actualiza estado de la operación (COMPLETED)
    else Proceso Fallido
        Worker->>DB: 8b. Actualiza estado de la operación (FAILED)
    end
    deactivate Worker

    Note over Client, DB: El cliente usa el `operationId` para consultar el estado periódicamente (Polling).

    Client->>+BFF: 9. GET /operation/status/{operationId}
    BFF->>DB: 10. Lee estado de la operación
    BFF-->>-Client: 11. Responde con el estado final (e.g., COMPLETED y resultado)
```

