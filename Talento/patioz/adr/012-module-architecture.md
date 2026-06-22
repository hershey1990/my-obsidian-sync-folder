---
tipo: adr
fecha: 2026-06-22
estado: aceptado
decision: "Estructura plana de módulo con contracts/adapters (Repository Pattern) en lugar de capas Clean Architecture (domain/application/infrastructure)"
proyecto: patioz-be
copiado_a: []
tags:
  - adr
corrige:
  - ADR-006
---
# ADR-012: Estructura de Módulo — Repository Pattern con contracts/adapters

## Contexto

El ADR-006 (2026-06-07) migró a Monolito Modular asumiendo Clean Architecture internamente: cada módulo con subdirectorios `domain/`, `application/`, `infrastructure/`. El ADR-010 (2026-06-18) formalizó NestJS 11 como framework, definiendo una estructura de módulo con `contracts/`, `adapters/`, `dto/`.

Durante la implementación de todos los módulos (auth, properties, listings, leads, maps, files, locations, notifications, amenities, property-types, health), el equipo encontró que la estructura de capas Clean Architecture generaba fricción con NestJS:

1. **NestJS ya provee DI nativa** — `@Module({ providers, imports, exports })`. Crear capas `domain/application/infrastructure` dentro de cada módulo duplicaba la separación que NestJS ya resuelve con `contracts/adapters`.
2. **Navegación excesiva** — una feature simple requería tocar 4+ subdirectorios (`domain/entity.ts`, `application/service.ts`, `infrastructure/repository.ts`, `interface/controller.ts`). Con contracts/adapters, todos los archivos están a 1-2 niveles de profundidad.
3. **Sobrecarga para devs junior** — la distinción entre "application use case" y "domain service" era confusa. El Repository Pattern es más directo: el service contiene la lógica de negocio, el repository (vía adapter) maneja la persistencia.

La estructura real de todos los módulos en el código fuente (`patioz-api-monolith/src/modules/`) es plana con `contracts/` + `adapters/` + `dto/`. El ADR-006 quedó desactualizado al seguir refiriéndose a capas Clean Architecture.

## Decisión

Se adopta el **Repository Pattern con estructura plana** para todos los módulos del monolite:

```
modules/{name}/
├── {name}.module.ts              # @Module({ imports, controllers, providers, exports })
├── {name}.controller.ts          # @Controller('ruta')
├── {name}.service.ts             # @Injectable() — lógica de negocio
├── types.ts                      # Interfaces de entidad (no clases, no ORM)
├── dto/                          # class-validator DTOs
│   ├── create-{entity}.dto.ts
│   └── update-{entity}.dto.ts
├── contracts/                    # Interfaces abstractas + DI token constants
│   ├── {name}-repository.interface.ts
│   └── {name}-provider.interface.ts
└── adapters/                     # Implementaciones concretas
    └── supabase-{name}.repository.ts
```

**No se deben crear** subdirectorios `domain/`, `application/`, `infrastructure/`, `interface/`.

### Reglas de la estructura

| Capa | Responsabilidad | Depende de |
|---|---|---|
| **Controller** | Routing, validación DTO, HTTP status codes | Service |
| **Service** | Lógica de negocio, orquestación, event publishing | Repository (vía token), QueueService, ConfigService |
| **Contracts** | Interfaces + `export const TOKEN = 'TOKEN'` | Nada (puro TypeScript) |
| **Adapters** | Implementaciones concretas (Supabase, Google, HTTP remoto) | Contracts (implementan la interfaz) |
| **DTOs** | Validación declarativa con class-validator | class-validator, class-transformer |
| **types.ts** | Entity interfaces (TypeScript, no clases) | Nada |

### Dependency Injection

- **Tokens string** para repositorios y providers: `PROPERTY_REPOSITORY`, `GEOCODING_PROVIDER`, `FILE_API`
- Definidos como `export const` en el archivo de contrato
- Los services inyectan vía `@Inject(TOKEN)`, no vía clase concreta
- Los módulos mapean en `providers`: `{ provide: TOKEN, useClass: AdapterImpl }`

### Naming de adapters

Los adapters siguen el patrón `{implementación}-{rol}.ts`:

| Prefijo | Tecnología | Ejemplo |
|---|---|---|
| `supabase-*` | PostgreSQL via Supabase | `supabase-property.repository.ts` |
| `remote-*` | HTTP externo | `remote-auth.provider.ts` |
| `google-*` | Google Maps API | `google-geocoding.provider.ts` |
| `image-proxy-*` | imgproxy-api | `image-proxy-health.checker.ts` |

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Repository Pattern plano (elegido)** | Navegación simple (1-2 niveles), alineado con DI de NestJS, onboarding rápido para juniors | Sin separación explícita de capas DDD. Si el dominio crece mucho, un service puede volverse dios. |
| **Clean Architecture (domain/application/infrastructure)** | Separación estricta de concerns, ideal para dominios complejos | Excesiva para CRUD. 4+ directorios por feature. Confunde a devs junior. Duplica la separación que NestJS ya da. |
| **Hexagonal (ports/adapters)** | Buen desacoplamiento de infraestructura | Similar sobrecarga que Clean Architecture. Los "ports" son esencialmente contracts. |
| **DDD táctico (aggregates, value objects, domain events)** | Modelado rico del dominio | Overkill para un sistema CRUD-heavy. Requiere madurez del equipo. |

## Consecuencias

### Positivas
- **Onboarding rápido:** un dev junior entiende la estructura de cualquier módulo en minutos.
- **Menos archivos por feature:** un CRUD típico tiene ~8 archivos vs ~15+ en Clean Architecture.
- **Alineado con NestJS:** `contracts/` = DI tokens, `adapters/` = providers. Sin fricción conceptual.
- **Consistencia:** todos los módulos existentes ya siguen este patrón. El ADR formaliza la realidad del código.

### Negativas
- **Services pueden crecer sin control:** sin la disciplina de casos de uso separados, un service puede acumular demasiada lógica.
- **Sin ubicación canónica para lógica de dominio pura:** types.ts + service.ts comparten la responsabilidad del dominio. En Clean Architecture, `domain/` era el lugar indiscutible.

### Mitigaciones
- Si un service excede ~300 líneas, es señal de que el módulo necesita partirse o extraer un provider especializado.
- La lógica de dominio pura (validaciones, cálculos) puede ir en `types.ts` como funciones exportadas junto a las interfaces.
- Si en el futuro un módulo requiere DDD táctico (aggregates, domain events), se puede migrar ese módulo específico sin afectar al resto.

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este ADR formaliza la estructura real de todos los módulos del monolite y corrige la discrepancia entre ADR-006 (que asumía Clean Architecture con domain/application/infrastructure) y el código fuente. La estructura contracts/adapters no es una desviación del plan original, sino una evolución pragmática informada por la experiencia de implementación.*

## Referencias

- Corrige a ADR-006 (Monolito Modular + BullMQ) en lo referente a estructura interna de módulos
- Es consistente con ADR-010 (NestJS 11 como framework), que ya documentaba contracts/adapters
- Complementa a ADR-013 (Inter-Module Communication), que define cómo se comunican estos módulos
