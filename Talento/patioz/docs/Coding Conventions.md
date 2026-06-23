---
title: Coding Conventions — Patioz
description: "Convenciones de código del monolito NestJS: estructura de módulos, naming, testing, inter-module communication"
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Coding Conventions

## Estructura de módulo

Cada módulo de dominio sigue el Repository Pattern:

```
modules/{name}/
├── {name}.module.ts              # @Module({ imports, controllers, providers, exports })
├── {name}.controller.ts          # @Controller('ruta')
├── {name}.service.ts             # @Injectable() — lógica de negocio
├── types.ts                      # Interfaces de entidad
├── dto/                          # class-validator DTOs
│   ├── create-{entity}.dto.ts
│   └── update-{entity}.dto.ts
├── contracts/                    # Interfaces + DI token constants
│   └── {name}-repository.interface.ts
└── adapters/                     # Implementaciones concretas
    └── supabase-{name}.repository.ts
```

No crear subdirectorios `domain/`, `application/`, `infrastructure/`.

## Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos | kebab-case | `create-property.dto.ts` |
| Clases | PascalCase | `PropertiesController` |
| Interfaces | `I` prefijo o nombre descriptivo | `IPropertyRepository` |
| DTOs | `{Verb}{Entity}Dto` | `CreatePropertyDto` |
| Tokens DI | `UPPER_SNAKE_CASE` | `PROPERTY_REPOSITORY` |
| Adapters | `{tech}-{rol}.ts` | `supabase-property.repository.ts` |

## Dependency Injection

- Tokens string para repositorios/providers: `@Inject(PROPERTY_REPOSITORY)`
- Tokens definidos como `export const` en el archivo de contrato
- Services dependen de interfaces, no de implementaciones concretas
- `@Global()` solo para módulos de infraestructura (Supabase, Queue, Storage, Translation)

## Comunicación entre módulos

- **Síncrono (consultas):** inyectar repositorio vía token `@Inject(OTHER_REPOSITORY)`
- **Asíncrono (side effects):** `QueueService.publish(queue, { eventType, payload })`
- No importar services de otros módulos — solo repositorios/providers vía tokens

## Auth

- `JwtAuthGuard` es global (todas las rutas son privadas por defecto)
- `@Public()` para rutas sin auth
- `@UseGuards(AuthorizeGuard)` + `@Permission(resource, action)` para RBAC

## DTOs

- `class-validator` para validación declarativa
- `Create*Dto` con decoradores (`@IsString()`, `@IsOptional()`, etc.)
- `Update*Dto` extiende `PartialType(Create*Dto)`
- `@Type(() => Number)` en query params numéricos

## Entities

- TypeScript interfaces (no clases, no ORM)
- `id: string` (UUID), fechas ISO 8601, enums como union types
- Todos los campos de texto usan `LocalizedString` (`{ es?, en? }`)

## Barrel exports

No crear `index.ts`. Todos los imports usan paths explícitos al archivo.

## Testing

- Co-ubicar tests: `{name}.spec.ts` en el mismo directorio
- Un spec por source file
- `Test.createTestingModule()` para tests unitarios
- `createTestApp()` factory para tests e2e HTTP
- Coverage thresholds: ≥ 70% statements, ≥ 60% branches

## Single Class Per File

Cada archivo contiene exactamente una clase exportada. Excepción: DTOs pequeños y tipos auxiliares.
