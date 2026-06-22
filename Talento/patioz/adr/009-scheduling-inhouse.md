---
tipo: adr
fecha: 2026-06-09
actualizado: 2026-06-22
estado: aceptado
proyecto: patioz-be
sync_backend: copiado
sync_frontend: no_aplica
decision: Módulo de scheduling in-house en el monolito modular NestJS (no cal.com ni herramientas externas de agenda)
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

### Integración con calendarios externos vía OAuth

La arquitectura del módulo incluye la capacidad de sincronizar disponibilidad y visitas con calendarios externos (Google Calendar, Zoho Calendar, Outlook) mediante un flujo OAuth donde el agente autoriza la conexión con su cuenta.

#### Arquitectura de sincronización

Se introduce un nuevo contrato `CalendarSyncAdapter` en la capa de `contracts/`, con implementaciones específicas por proveedor:

```
modules/scheduling/contracts/
├── calendar-sync.interface.ts   ← Interfaz CalendarSyncAdapter
├── visit.interface.ts           (existente)
└── agent-availability.interface.ts (existente)

modules/scheduling/adapters/
├── supabase-visit.repository.ts            (existente)
├── supabase-availability.repository.ts     (existente)
├── availability-cache.adapter.ts           (existente)
├── reminder-job.processor.ts               (existente)
├── google-calendar.adapter.ts              ← Google Calendar API v3
├── zoho-calendar.adapter.ts                ← Zoho Calendar API
└── outlook-calendar.adapter.ts             ← Outlook Calendar API
```

**Contrato `CalendarSyncAdapter`:**

```typescript
interface CalendarSyncAdapter {
  connect(authCode: string, redirectUri: string): Promise<ConnectionResult>;
  disconnect(accountId: string): Promise<void>;
  syncDownAvailability(accountId: string, from: Date, to: Date): Promise<ExternalEvent[]>;
  syncUpVisit(visit: Visit, accountId: string): Promise<string>;   // returns external event ID
  updateExternalEvent(visit: Visit, externalEventId: string): Promise<void>;
  deleteExternalEvent(externalEventId: string): Promise<void>;
  refreshToken(accountId: string): Promise<void>;
}
```

La inyección del adapter se resuelve en runtime según el proveedor que cada agente haya conectado, usando un provider dinámico con `@Inject(CALENDAR_SYNC_ADAPTER)`.

#### Flujo OAuth

```
1. Agent → Settings → "Conectar Google Calendar"
   GET /scheduling/calendar/connect/:provider
   → Backend redirect a Google OAuth consent screen
   → Scopes: https://www.googleapis.com/auth/calendar.events

2. User autoriza en la pantalla de Google

3. Google → callback a /scheduling/calendar/callback?code=xxx&state=yyy
   → Backend canjea auth code por access + refresh tokens
   → Almacena en tabla calendar_connections (token encriptado vía Crypt)
   → Crea job BullMQ RefreshCalendarTokens (se ejecuta antes de expirar)

4. Agent → "Desconectar"
   POST /scheduling/calendar/disconnect/:accountId
   → Revoca tokens en el proveedor
   → Elimina registro de calendar_connections
```

#### Modelo de datos

Tabla `calendar_connections` (datos geográficos en JSONB, tokens encriptados):

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | PK |
| `agent_id` | UUID | FK → agents |
| `provider` | enum | `google` \| `zoho` \| `outlook` |
| `account_email` | string | Email de la cuenta conectada |
| `tokens` | JSONB (encriptado) | `{ accessToken, refreshToken, expiresAt }` |
| `sync_config` | JSONB | `{ syncAvailability, syncVisits, direction }` |
| `last_synced_at` | timestamptz | Última sincronización exitosa |
| `connected_at` | timestamptz | Cuándo se conectó |
| `status` | enum | `active` \| `expired` \| `revoked` |

Los tokens se almacenan encriptados con `Crypt.encryptString()` (AES-256-CBC con APP_KEY), similar al manejo de PEMs en el módulo de infraestructura.

#### Estrategia de sincronización

| Dirección | Origen → Destino | Cuándo | Mecanismo |
|---|---|---|---|
| Disponibilidad | Calendar externo → Patioz | Pull cada 15 min | BullMQ job `SyncCalendarAvailability` lee eventos del calendar externo y marca slots ocupados en Redis |
| Visitas (booked) | Patioz → Calendar externo | Inmediato | Event-driven: cuando `visit.status` cambia a `confirmed`, `CalendarSyncService.syncUpVisit()` |
| Visitas (cancelled) | Patioz → Calendar externo | Inmediato | Event-driven: cuando `visit.status` cambia a `cancelled`, `CalendarSyncService.deleteExternalEvent()` |
| Visitas (rescheduled) | Patioz → Calendar externo | Inmediato | Event-driven: `CalendarSyncService.updateExternalEvent()` |

**Patioz siempre es la fuente de verdad para visitas.** El calendario externo es un reflejo. Para disponibilidad, se lee el calendario externo para detectar conflictos con eventos existentes del agente (reuniones personales, bloques ocupados).

#### Consideraciones de seguridad

- Tokens almacenados encriptados en BD, nunca en texto plano
- Refresh automático vía BullMQ job antes de expiración
- Revocación de tokens al desconectar
- Rate limiting por proveedor para evitar bloqueos por abuso de API

## Alternativas Consideradas


| Alternativa                     | Pros                                                                                                                                                                                                                       | Contras                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Módulo in-house (elegido)**   | Control total del dominio, sin infraestructura duplicada, mismo runtime, mismo deploy, misma base de datos, misma cola de jobs. El equipo ya conoce los patrones (NestJS + contracts/adapters + class-validator + BullMQ). | Hay que escribirlo. Mantenimiento propio del código de fechas y disponibilidad.                                                                                                                                                                                                                                                                                                               |
| **cal.com (open source)**       | "Llave en mano" para booking genérico. Manejo de disponibilidad, re-agendamiento, cancelaciones, notificaciones, sincronización de calendarios. Comunidad activa.                                                          | **Su propia base de datos** (Prisma + PostgreSQL separada), **su propio Redis**, **su propio servidor Next.js**. Duplica la infraestructura. Modelo de datos genérico (no entiende de listings, agentes, propiedades). Para integrarlo con Patioz hay que escribir un BFF que traduzca entre ambos dominios. Fork y mantenimiento del código ajeno. Curva de aprendizaje alta para el equipo. |
| **Calendly API (SaaS)**         | Cero mantenimiento de infraestructura. Integración vía webhooks.                                                                                                                                                           | Vendor lock-in. Costo recurrente por agente. Límites de API. Datos del cliente en servidor externo (privacidad). Sin control sobre la experiencia de usuario.                                                                                                                                                                                                                                 |
| **Google Calendar API directa** | Sin base de datos propia. Los agentes ya usan Google Calendar. | No hay concepto de "listing" ni "visita inmobiliaria". No hay workflow de confirmación. Sin notificaciones integradas al sistema. Rompe el principio de que Patioz sea el sistema de registro. |
| **In-house + OAuth multi-calendar (decisión actualizada)** | Disponibilidad real del agente sin doble entrada de datos. Patioz sigue siendo fuente de verdad para visitas. UX fluida: el agente conecta con un login. | Complejidad OAuth (manejo de refresh tokens, rate limits de APIs externas). Mantenimiento de adapters por proveedor. |


## Consecuencias

### Positivas

- **Una sola base de datos** que manejar. Sin esquemas externos, sin migraciones ajenas, sin sync de datos entre sistemas.
- **Un solo deploy.** El módulo se despliega como parte del monolite. Cero pipelines adicionales.
- **El equipo entiende todo el código.** Mismos patrones (NestJS modules, contracts/adapters), mismas herramientas, mismo runtime. Cero carga cognitiva de aprender una arquitectura externa.
- **El modelo de datos refleja el dominio inmobiliario.** `Visit` se relaciona directamente con `Listing` y `Agent`. No hay que forzar un modelo genérico de "evento de calendario" a significar "visita a propiedad".
- **La lógica de negocio vive en un solo lugar.** Reglas como "un agente no puede tener dos visitas en el mismo horario" o "una propiedad ocupada no puede agendarse" se implementan en el servicio, no en reglas de disponibilidad genéricas de cal.com.
- **Reutilización de infraestructura existente.** Notificaciones (SES), SMS (Twilio), cola de jobs (BullMQ), Redis, guards de auth — todo está listo.
- **Integración con Leads.** El scheduling es la continuación natural del flujo de leads (solicitud de agente → agendamiento de visita).
- **Sincronización con calendarios externos vía OAuth.** Los agentes conectan su calendario (Google, Zoho, Outlook) con un solo login y su disponibilidad real se sincroniza automáticamente.

### Negativas / Riesgos

- **Hay que construir lo básico:** manejo de disponibilidad, detección de conflictos de horario, re-agendamiento.
- **Mantenimiento de adapters por proveedor de calendario.** Cada API tiene su propio SDK, rate limits y particularidades OAuth.
- **Manejo de refresh tokens.** Los tokens expiran y requieren renovación automática vía BullMQ. Un fallo en el refresh puede dejar al agente sin conexión.
- **Rate limits de APIs externas.** Google Calendar tiene cuotas por usuario y por proyecto. Sincronizaciones masivas o mal diseñadas pueden resultar en bloqueos temporales.
- **No se obtienen features "gratis"** como enlaces públicos de booking, integración con Zoom/Meet, o páginas de disponibilidad embeddables.

### Mitigaciones

- El módulo de scheduling es **acotado en complejidad** comparado con cal.com: no maneja equipos, ni múltiples temporalidades, ni recurrencias complejas. Es un CRUD con validación de conflictos y notificaciones.
- El equipo ya ha implementado múltiples módulos NestJS con el mismo patrón — el enfoque está probado.
- La sincronización con calendarios externos se implementa como un adapter (`CalendarSyncAdapter`) sin cambiar la lógica de dominio. Agregar un nuevo proveedor = nuevo adapter + config OAuth, sin tocar el core del módulo.
- Los tokens se encriptan con `Crypt.encryptString()` (AES-256-CBC) al almacenarse, y un job BullMQ `RefreshCalendarTokens` los renueva automáticamente antes de expirar, evitando desconexiones.
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

