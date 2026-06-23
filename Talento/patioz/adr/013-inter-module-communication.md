---
tipo: adr
fecha: 2026-06-22
estado: aceptado
decision: "Estrategia dual de comunicación entre módulos: DI síncrona para consultas + BullMQ asíncrono para side effects"
proyecto: patioz-be
implementado: si
tags:
  - adr
---
# ADR-013: Estrategia de Comunicación entre Módulos

## Contexto

Con la arquitectura de Monolito Modular (ADR-006) y NestJS 11 (ADR-010), los módulos de dominio necesitan comunicarse entre sí. Por ejemplo:

- `listings` necesita validar que una propiedad existe antes de crear un listing → consulta a `properties`
- `listings` necesita publicar un evento cuando se crea un listing → notificar a `notifications`, `leads`
- `locations` necesita verificar jerarquía geográfica → consulta a `maps`

En una arquitectura de microservicios, esta comunicación sería vía HTTP/RPC con todos los costos de red y serialización. En el monolite, todos los módulos comparten el mismo proceso, lo que abre la posibilidad de comunicación directa vía DI. Pero sin reglas claras, el acoplamiento entre módulos puede volverse inmanejable.

La comunicación entre módulos no tenía un ADR explícito. Las reglas evolucionaron orgánicamente durante la implementación y están documentadas en el AGENTS.md del repositorio, pero sin trazabilidad arquitectónica.

## Decisión

Se adopta una **estrategia dual** con dos patrones de comunicación, cada uno para un propósito distinto:

### 1. Síncrono — Direct DI (para consultas)

Cuando un módulo necesita **leer datos** de otro módulo para cumplir un request, inyecta el repositorio del otro módulo directamente vía su DI token:

```typescript
// ListingsService necesita validar que una propiedad existe
constructor(
  @Inject(PROPERTY_REPOSITORY) private propertyRepo: PropertyRepository,
) { }
```

**Reglas:**
- Solo se inyectan **repositories o providers vía tokens** (interfaces), nunca services completos ni módulos
- El contrato (interface + token) del repositorio debe estar exportado por el módulo dueño
- No se crean dependencias circulares — si dos módulos se necesitan mutuamente, se usa BullMQ para uno de los sentidos
- Los guards, decorators, y tipos compartidos (infraestructura) se importan directamente — no son módulos de dominio

**Casos de uso típicos:**
- Validar existencia de una entidad de otro módulo (`propertyRepo.findOne(id)`)
- Leer datos para enriquecer una respuesta (`locationRepo.findById(property.locationId)`)
- Verificar pertenencia (`listingRepo.findByProperty(propertyId)`)

### 2. Asíncrono — BullMQ (para side effects)

Para operaciones que ocurren **después** de que el request principal se completó — side effects, notificaciones, procesamiento en background — se usa `QueueService.publish()`:

```typescript
await this.queueService.publish(this.eventsQueue, {
  eventType: "property.created",
  aggregateType: "property",
  aggregateId: property.id,
  payload: { propertyId: property.id },
});
```

**Reglas:**
- `QueueService.publish(queue: Queue, data)` recibe una instancia de `Queue` (inyectada vía `@InjectQueue()`), no un string
- Cada módulo registra sus propias colas en `@Module.imports` via `BullModule.registerQueue({ name: 'queue-name' })`
- `QueueModule` es `@Global()` y solo provee `BullModule.forRootAsync` (conexión Redis) + `QueueService`
- Los jobs tienen 3 reintentos con backoff exponencial (2s base)
- Los consumers usan `@Processor()` + `@Process()` de `@nestjs/bullmq`

**Casos de uso típicos:**
- Publicar eventos de dominio (`listing.created`, `lead.assigned`)
- Disparar notificaciones (email, SMS, push)
- Procesamiento asíncrono (traducción, geocodificación batch)
- Sincronización con servicios externos

### Cuadro de decisión

| Necesidad | Mecanismo | Ejemplo |
|---|---|---|
| Leer datos de otro módulo | DI síncrona vía token | `propertyRepo.findOne(id)` |
| Validar existencia | DI síncrona vía token | `locationRepo.exists(placeId)` |
| Publicar evento post-operación | BullMQ asíncrono | `queueService.publish(...)` |
| Disparar notificación | BullMQ asíncrono | `queueService.publish(...)` |
| Procesamiento batch/largo | BullMQ asíncrono | `queueService.publish(...)` |
| Usar guard/auth/decorator | Import directo (infraestructura) | `@UseGuards(JwtAuthGuard)` |

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Dual: Sync DI + Async BullMQ (elegido)** | Simple, performante, sin overhead de red. Cada patrón para su caso de uso correcto. | Riesgo de acoplamiento si sync DI se abusa. Requiere disciplina del equipo. |
| **Todo asíncrono (event-driven)** | Máximo desacoplamiento. Cada módulo es una isla. | Latencia innecesaria para consultas simples. Complejidad de debugging (eventos encadenados). Overkill para un monolite. |
| **Todo síncrono (DI directa)** | Máxima simplicidad y performance. | Acoplamiento total. Si un módulo crece y se extrae a microservicio, todas las dependencias se rompen. |
| **Event bus (NestJS CQRS)** | Infraestructura nativa de NestJS para eventos. | Agrega abstracción innecesaria (Command/Event handlers). BullMQ es más directo y ya está en el stack. |
| **HTTP interno entre módulos** | Fronteras de módulo estrictas. Fácil migrar a microservicios. | Ridículo en un monolite: overhead de HTTP para llamadas en el mismo proceso. |

## Consecuencias

### Positivas
- **Sin overhead de red:** las consultas síncronas son llamadas a función directas, no HTTP.
- **Desacoplamiento donde importa:** los side effects son asíncronos y tolerantes a fallos (reintentos BullMQ).
- **Trazabilidad:** `QueueService.publish()` deja registro en Redis/Bull Board de cada evento publicado.
- **Preparado para extracción:** si un módulo se extrae a microservicio, las dependencias síncronas son las únicas que necesitan migración. Las asíncronas ya están desacopladas.

### Negativas
- **Acoplamiento potencial:** si sync DI se usa sin disciplina, módulos pueden volverse frágiles (cambio en un repositorio rompe consumidores en otros módulos).
- **No hay contratos formales entre módulos:** a diferencia de HTTP (OpenAPI) o gRPC (protobuf), las interfaces TypeScript no tienen validación en runtime del contrato.
- **BullMQ como dependencia crítica:** si Redis cae, los side effects se pierden (mitigado por reintentos + persistencia de Redis).

### Mitigaciones
- Solo se inyectan repositorios/providers vía tokens (interfaces), nunca services ni módulos completos.
- Si se detecta acoplamiento excesivo entre dos módulos, se evalúa extraer uno a microservicio o mover la lógica compartida a un módulo de infraestructura.
- Bull Board permite monitorear el estado de las colas y detectar trabajos fallidos.

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este ADR formaliza reglas que ya estaban implementadas y documentadas en el AGENTS.md del repositorio. La decisión de usar sync DI para consultas y BullMQ para side effects surgió orgánicamente durante la construcción del monolite y probó ser efectiva en todos los módulos existentes.*

## Referencias

- Depende de ADR-006 (Monolito Modular + BullMQ) — la cola de mensajería
- Depende de ADR-010 (NestJS 11) — el sistema de DI y módulos
- Complementa a ADR-012 (Estructura de Módulo) — define cómo se organizan los módulos que se comunican
