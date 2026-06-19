---

tipo: adr
fecha: 2026-06-09
actualizado: 2026-06-18
estado: aceptado
decision: "Módulo de scheduling in-house en el monolito modular NestJS (no cal.com ni herramientas externas de agenda)"
tags:

- adr

---

# ADR-009: Módulo de Scheduling In-House para Agendar Visitas

## Contexto

Patioz necesita permitir que los **listings** (publicaciones de propiedades) puedan ser agendados para que un **agente** le presente la propiedad a un **cliente potencial**. El flujo es simple:

1. Un cliente encuentra un listing en MapUI
2. Solicita una visita (presencial o virtual)
3. El agente propone horarios disponibles
4. Se confirma la cita y se notifica a ambas partes

El Product Owner propuso usar [**cal.com**](https://cal.com) (alternativa open source a Calendly) como solución llave en mano para manejar la agenda.

Sin embargo, cal.com es una **aplicación completa** con su propia base de datos (Prisma + PostgreSQL), Redis, servidor Next.js, sistema de equipos, webhooks, y un modelo de datos genérico orientado a reuniones de oficina (30 min, 60 min, enlaces de videollamada). No está diseñado para el dominio inmobiliario.

## Decisión

**No se adopta cal.com ni ninguna herramienta externa de scheduling. En su lugar, se implementa un módulo de scheduling in-house** dentro del monolito modular NestJS de Patioz, siguiendo los mismos patrones que los módulos existentes (listings, properties, leads, notifications).

### Refinamiento post-ADR-006 y ADR-007

El ADR-006 migró la arquitectura a un monolito modular con BullMQ. Aunque ADR-007 planteaba mantener Fastify como framework HTTP del monolito, la realidad de la implementación demostró que **NestJS 11** (con Express subyacente) era el framework óptimo para el monolite por su sistema de módulos con DI nativa, soporte nativo de BullMQ (`@nestjs/bullmq`), guards de autorización reutilizables, y ecosistema de validación (class-validator + ValidationPipe). Todos los módulos del monolite (auth, properties, listings, leads, maps, files, notifications, locations) se implementaron con NestJS. Este ADR actualiza la proyección del módulo de scheduling para alinearse con la arquitectura real.

### Estructura del módulo

```
modules/scheduling/
├── scheduling.module.ts         # @Module({ controllers, providers, exports })
├── scheduling.controller.ts     # @Controller('scheduling') — rutas REST
├── scheduling.service.ts        # @Injectable() — lógica de negocio
├── types.ts                     # Interfaces del dominio (Visit, Availability)
├── dto/
│   ├── request-visit.dto.ts     # Validación con class-validator
│   ├── propose-times.dto.ts
│   ├── book-visit.dto.ts
│   ├── reschedule-visit.dto.ts
│   └── cancel-visit.dto.ts
├── contracts/
│   ├── visit.interface.ts       # VISIT_REPOSITORY DI token + interface
│   └── agent-availability.interface.ts
└── adapters/
    ├── supabase-visit.repository.ts       # PostgreSQL vía Supabase SDK
    ├── supabase-availability.repository.ts
    ├── availability-cache.adapter.ts      # Redis (ioredis) — cache de slots
    └── reminder-job.processor.ts          # BullMQ @Processor — recordatorios 24h/1h
```

### Stack concreto


| Capa                        | Tecnología                        | Por qué                                                                                                                                        |
| --------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework HTTP**          | NestJS 11 (Express)               | Mismo framework que el resto del monolite. Decoradores `@Controller`, guards reutilizables (`JwtAuthGuard`, `AuthorizeGuard`), DI nativa.      |
| **Persistencia**            | PostgreSQL (Supabase)             | Misma BD que el resto del sistema. Tablas `showings` y `agent_availability`. Migraciones con `supabase migration new`.                         |
| **Cache de disponibilidad** | Redis (ioredis)                   | Slots cacheados por agente, invalidación parcial al agendar. Misma instancia Redis que BullMQ.                                                 |
| **Jobs asíncronos**         | BullMQ + `@nestjs/bullmq`         | Recordatorios de visita, notificaciones de cancelación. Misma cola `events` que otros módulos.                                                 |
| **Email transaccional**     | AWS SES (ADR-008)                 | Confirmaciones, recordatorios, reprogramaciones vía `NotificationService` existente.                                                           |
| **SMS (recordatorios)**     | Twilio (infraestructura actual)   | Recordatorios por SMS usando `TemplateNotificationService` (Twilio) ya existente.                                                              |
| **Validación de DTOs**      | class-validator + ValidationPipe  | Mismo stack que listings y properties. Validación declarativa con decoradores.                                                                 |
| **Frontend**                | React (MapUI)                     | Componente `<ScheduleVisitModal />` con calendario. Sin dependencia externa de librería de scheduling — solo `date-fns` para manejo de fechas. |
| **Guards de autorización**  | `JwtAuthGuard` + `AuthorizeGuard` | Mismos guards que el resto de módulos. Permisos granulares por acción (`scheduling:create`, `scheduling:read`, etc.).                          |


### Módulos existentes que el scheduling consumirá

- **LeadsModule** — Las solicitudes de visita pueden originarse desde un lead (un cliente pidió agente). Se integra en el flujo: lead → asignación de agente → scheduling de visita.
- **ListingsModule** — Las visitas se asocian a un `Listing` (propiedad publicada). Se reutiliza `LISTING_REPOSITORY` para validar que el listing existe y está activo.
- **NotificationService** (infrastructure) — Para envío de emails transaccionales (SES).
- **TemplateNotificationService** (Twilio) — Para SMS de recordatorio.
- **QueueService** (infrastructure) — Para publicar eventos de dominio en la cola `events`.

## Alternativas Consideradas


| Alternativa                     | Pros                                                                                                                                                                                                                       | Contras                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Módulo in-house (elegido)**   | Control total del dominio, sin infraestructura duplicada, mismo runtime, mismo deploy, misma base de datos, misma cola de jobs. El equipo ya conoce los patrones (NestJS + contracts/adapters + class-validator + BullMQ). | Hay que escribirlo. Mantenimiento propio del código de fechas y disponibilidad.                                                                                                                                                                                                                                                                                                               |
| **cal.com (open source)**       | "Llave en mano" para booking genérico. Manejo de disponibilidad, re-agendamiento, cancelaciones, notificaciones, sincronización de calendarios. Comunidad activa.                                                          | **Su propia base de datos** (Prisma + PostgreSQL separada), **su propio Redis**, **su propio servidor Next.js**. Duplica la infraestructura. Modelo de datos genérico (no entiende de listings, agentes, propiedades). Para integrarlo con Patioz hay que escribir un BFF que traduzca entre ambos dominios. Fork y mantenimiento del código ajeno. Curva de aprendizaje alta para el equipo. |
| **Calendly API (SaaS)**         | Cero mantenimiento de infraestructura. Integración vía webhooks.                                                                                                                                                           | Vendor lock-in. Costo recurrente por agente. Límites de API. Datos del cliente en servidor externo (privacidad). Sin control sobre la experiencia de usuario.                                                                                                                                                                                                                                 |
| **Google Calendar API directa** | Sin base de datos propia. Los agentes ya usan Google Calendar.                                                                                                                                                             | No hay concepto de "listing" ni "visita inmobiliaria". No hay workflow de confirmación. Sin notificaciones integradas al sistema. Rompe el principio de que Patioz sea el sistema de registro.                                                                                                                                                                                                |


## Consecuencias

### Positivas

- **Una sola base de datos** que manejar. Sin esquemas externos, sin migraciones ajenas, sin sync de datos entre sistemas.
- **Un solo deploy.** El módulo se despliega como parte del monolite. Cero pipelines adicionales.
- **El equipo entiende todo el código.** Mismos patrones (NestJS modules, contracts/adapters), mismas herramientas, mismo runtime. Cero carga cognitiva de aprender una arquitectura externa.
- **El modelo de datos refleja el dominio inmobiliario.** `Visit` se relaciona directamente con `Listing` y `Agent`. No hay que forzar un modelo genérico de "evento de calendario" a significar "visita a propiedad".
- **La lógica de negocio vive en un solo lugar.** Reglas como "un agente no puede tener dos visitas en el mismo horario" o "una propiedad ocupada no puede agendarse" se implementan en el servicio, no en reglas de disponibilidad genéricas de cal.com.
- **Reutilización de infraestructura existente.** Notificaciones (SES), SMS (Twilio), cola de jobs (BullMQ), Redis, guards de auth — todo está listo.
- **Integración con Leads.** El scheduling es la continuación natural del flujo de leads (solicitud de agente → agendamiento de visita).

### Negativas / Riesgos

- **Hay que construir lo básico:** manejo de disponibilidad, detección de conflictos de horario, re-agendamiento.
- **Sincronización con calendarios externos (Google, Outlook)** queda para una fase posterior. Inicialmente los agentes gestionan su disponibilidad dentro de Patioz.
- **No se obtienen features "gratis"** como enlaces públicos de booking, integración con Zoom/Meet, o páginas de disponibilidad embeddables.

### Mitigaciones

- El módulo de scheduling es **acotado en complejidad** comparado con cal.com: no maneja equipos, ni múltiples temporalidades, ni recurrencias complejas. Es un CRUD con validación de conflictos y notificaciones.
- El equipo ya ha implementado múltiples módulos NestJS con el mismo patrón — el enfoque está probado.
- Si en el futuro se necesita sincronización con calendarios externos, se agrega como un adapter (`CalendarSyncAdapter`) sin cambiar la lógica de dominio.
- `date-fns` es suficiente para el manejo de fechas; no se necesita una librería de scheduling compleja.

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este ADR refleja la decisión de priorizar simplicidad operativa sobre potencia prematura, alineada con ADR-006 (Monolito Modular + BullMQ) y la adopción real de NestJS 11 como framework del monolite. Agregar una herramienta externa como cal.com habría añadido una segunda base de datos, un segundo servidor, y una segunda curva de aprendizaje — duplicando la complejidad operativa del sistema sin resolver el problema de dominio específico.*
>
> *Nota: Este ADR fue actualizado el 2026-06-18 para reflejar la arquitectura NestJS del monolite, reemplazando la proyección original basada en Fastify (derivada de ADR-002/ADR-007). La decisión fundamental (in-house, no cal.com) se mantiene intacta.*

