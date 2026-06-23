---
tipo: adr
fecha: 2026-06-18
estado: aceptado
proyecto: patioz-be
implementado: si
decision: NestJS 11 como framework del monolito modular (reemplaza Fastify como framework HTTP)
tags:
  - adr
---

# ADR-010: NestJS 11 como Framework del Monolito Modular

## Contexto

El ADR-006 (2026-06-07) migró la arquitectura de microservicios a un monolito modular con BullMQ. En ese momento no se especificó un framework HTTP para el monolite — se asumió que Fastify (ADR-002) seguiría siendo la capa HTTP, y que el submódulo NestJS de auth (ADR-003) sería eliminado (ADR-007).

Sin embargo, durante la implementación del monolite se hizo evidente que **NestJS 11** ofrecía ventajas decisivas sobre Fastify para un monolite con múltiples módulos de dominio:

1. **Sistema de módulos con DI nativa** — `@Module()` con providers, imports, exports. Fastify no tiene DI; requería gestión manual de dependencias o un contenedor externo.
2. **Ecosistema de guards reutilizables** — `@UseGuards(JwtAuthGuard, AuthorizeGuard)` aplicado por módulo o ruta. Los guards de auth (`JwtAuthGuard`, `AuthorizeGuard`, `@Permission()`, `@Public()`, `@CurrentUser()`) se comparten entre todos los módulos sin duplicación.
3. **Soporte nativo de BullMQ** — `@nestjs/bullmq` con `@InjectQueue()`, `@Processor()`, `@Process()`. En Fastify habría que integrar BullMQ manualmente.
4. **class-validator + ValidationPipe** — Validación declarativa de DTOs con decoradores, aplicada globalmente vía `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })`.
5. **Ecosistema maduro** — NestJS tiene soporte oficial para Passport/JWT, ConfigModule, decoradores personalizados, interceptors, pipes, exception filters.
6. **Express subyacente** — NestJS corre sobre Express, que es el estándar de facto del ecosistema Node.js. Middleware, multer para file uploads, y herramientas existentes funcionan sin adaptación.

Fastify, aunque más rápido en benchmarks de peticiones simples, no ofrece ninguna de estas ventajas estructurales para un monolite con múltiples módulos de dominio. El overhead de rendimiento de Express frente a Fastify es irrelevante para el perfil de carga actual de Patioz (cientos de requests/minuto, no miles/segundo).

## Decisión

**NestJS 11 (con `@nestjs/platform-express`) es el framework oficial del monolito modular de Patioz.** Todos los módulos nuevos deben implementarse con NestJS, siguiendo los patrones establecidos por los módulos existentes.

### Patrón de módulo NestJS

```
modules/{nombre}/
├── {nombre}.module.ts         # @Module({ controllers, providers, exports })
├── {nombre}.controller.ts     # @Controller('ruta')
├── {nombre}.service.ts        # @Injectable() — lógica de negocio
├── types.ts                   # Interfaces de dominio
├── dto/                       # class-validator DTOs
│   └── *.dto.ts
├── contracts/                 # Interfaces + DI tokens
│   └── *.interface.ts
└── adapters/                  # Implementaciones (Supabase, Redis, etc.)
    └── *.repository.ts
```

### Stack del monolite

| Capa                     | Tecnología                        |
| ------------------------ | --------------------------------- |
| **Framework**            | NestJS 11 (`@nestjs/core`)        |
| **HTTP**                 | Express (`@nestjs/platform-express`) |
| **Validación**           | class-validator + class-transformer + ValidationPipe |
| **Auth**                 | Supabase Auth + JWT (Passport) + RBAC |
| **Base de datos**        | PostgreSQL (Supabase)             |
| **Cache**                | Redis (ioredis)                   |
| **Cola de trabajos**     | BullMQ (`@nestjs/bullmq`)         |
| **File storage**         | S3-compatible (`@aws-sdk/client-s3`) |
| **Emails**               | AWS SES                           |
| **SMS**                  | Twilio                            |
| **Traducción**           | AWS Translate                     |
| **Testing unitario**     | Jest + `@nestjs/testing`          |
| **Testing e2e**          | Supertest + `@nestjs/testing`     |

### Módulos existentes que validan el patrón

- `auth` — Guards JWT, decoradores `@CurrentUser()`, `@Public()`, `@Permission()`, RBAC con Supabase
- `properties` — CRUD con SupabaseRepository adapter, contracts, DTOs
- `listings` — CRUD + file uploads (multer) + BullMQ events + traducción
- `leads` — Flujo de leads integrado con listings + auth + BullMQ
- `maps` — Google Maps API + Turf.js
- `notifications` — Email (SES) + SMS (Twilio)
- `locations` — Geolocalización
- `files` — Upload de archivos a S3 con variantes de imagen

## Alternativas Consideradas

| Alternativa           | Pros                                                                                         | Contras                                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **NestJS (elegido)**  | DI nativa, guards reutilizables, soporte BullMQ nativo, validación declarativa, ecosistema.  | Overhead de abstracción comparado con Fastify puro. Express es menos performante que Fastify en benchmarks sintéticos.                                      |
| **Fastify**           | Mayor rendimiento en requests simples. Más liviano. Menos abstracción.                       | Sin DI nativa, sin sistema de módulos, sin soporte oficial de BullMQ, sin guards. Cada módulo tendría que resolver la DI manualmente.                       |
| **Fastify + contenedor DI externo** | Combina rendimiento de Fastify con DI de NestJS.                                             | Complejidad de integración. Dos ecosistemas que mantener. El equipo tendría que aprender una combinación no estándar.                                       |
| **Express puro**      | Simple, ampliamente conocido.                                                                | Sin estructura opinionada. Cada desarrollador organiza el código distinto. Sin guards, sin DI, sin sistema de módulos. El equipo junior se beneficiaría de menos estructura, no más. |

## Consecuencias

### Positivas

- **Patrón consistente en todos los módulos.** Un dev junior puede leer cualquier módulo y entender su estructura inmediatamente.
- **Guards de auth reutilizables.** Cualquier módulo nuevo obtiene auth granular con 3 líneas: `@UseGuards(JwtAuthGuard, AuthorizeGuard)` + `@Permission()`.
- **Validación centralizada.** `ValidationPipe` global asegura que todos los endpoints validen DTOs consistentemente.
- **Integración BullMQ nativa.** `@nestjs/bullmq` permite declarar queues y processors con decoradores, sin boilerplate.
- **Testing con `@nestjs/testing`.** El `Test.createTestingModule()` permite sobreescribir providers para testing unitario y e2e.

### Negativas / Riesgos

- **Express es más lento que Fastify.** En benchmarks de routing puro, Fastify es ~2x más rápido. Para el perfil de Patioz (cientos de requests/min) la diferencia es despreciable.
- **Vendor lock-in con NestJS.** Migrar a otro framework en el futuro requeriría reescribir todos los módulos. La separación en contracts/adapters mitiga esto parcialmente (la lógica de negocio en services está acoplada a decoradores NestJS).
- **NestJS abstrae Express.** Si se necesita un middleware Express específico, hay que usar `@nestjs/platform-express` o acceder a la instancia raw.

### Mitigaciones

- La estructura `contracts/` + `adapters/` mantiene la lógica de negocio desacoplada de la infraestructura. Si cambiara el framework, habría que reescribir controllers y decoradores, pero services y adapters se migrarían con cambios mínimos.
- Express es el estándar de facto del ecosistema Node.js. Cualquier dev Node.js puede trabajar con NestJS.
- La velocidad de desarrollo y la consistencia del equipo pesan más que la diferencia de rendimiento entre Express y Fastify para el perfil actual.

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este ADR formaliza una decisión que ya se tomó en la implementación: todos los módulos del monolite (auth, properties, listings, leads, maps, files, notifications, locations, config, translate, amenities, property-types, health) se construyeron con NestJS 11. La decisión no documentada previamente generó discrepancias entre ADR-007 (que asumía Fastify) y la realidad del código. Este ADR cierra esa brecha.*

## Referencias

- Reemplaza implícitamente a ADR-002 (BFF con Fastify) como framework HTTP del backend
- Corrige la proyección de ADR-007 (Integración de Auth), que asumía Fastify
- Es consistente con ADR-006 (Monolito Modular + BullMQ)
- Sirve como base arquitectónica para ADR-009 (Módulo de Scheduling In-House) y futuros módulos
