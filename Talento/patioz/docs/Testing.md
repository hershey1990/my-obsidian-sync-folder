---
title: Testing — Patioz
description: "Estrategia de testing: TDD pragmático, tests unitarios y e2e, coverage thresholds"
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Testing

## Filosofía

**TDD pragmático:** los tests son especificaciones ejecutables, no trofeos de cobertura. Escribir el test primero cuando clarifica el contrato; escribirlo después cuando el contrato es obvio (CRUD passthrough).

## Qué se testea

| Capa | Tipo de test | Qué valida |
|---|---|---|
| **Service** | Unitario | Lógica de negocio, condicionales, cálculos |
| **Adapter** | Unitario | Transformaciones, mapeo, manejo de errores de APIs externas |
| **Guard** | Unitario | Permisos, edge cases (sin usuario, sin metadata) |
| **Controller** | e2e HTTP | Pipeline completo: Guards → Pipes → Controller → Response |
| **Repository** | Integración | Traducción SQL, mapeo de resultados |

## Qué NO se testea

- Configuración de módulos (`@Module`, `BullModule.forRoot`) — wiring del framework
- DTOs — los decoradores de `class-validator` son código de librería
- Adaptadores passthrough puros (solo traducen un método a una query sin lógica)

## Cobertura

- **Services y adapters con lógica:** 100% branch coverage
- **Promedio por módulo:** ≥ 70% statements, ≥ 60% branches
- **Enforceado en CI:** PRs sin tests en services/adapters nuevos son bloqueados

## Comandos

```bash
pnpm test              # Tests unitarios (src/**/*.spec.ts, ~17s)
pnpm test:e2e          # Tests e2e HTTP (test/integration/, ~5s)
pnpm build             # Build de producción
```

## Estructura de tests

```
src/modules/properties/
├── properties.service.ts
├── properties.service.spec.ts     ← Co-ubicado con el source
└── adapters/
    └── supabase-property.repository.spec.ts

test/
├── helpers/
│   └── test-app.ts                ← Factory que mockea infraestructura externa
└── integration/
    └── auth/
        └── auth.e2e-spec.ts       ← Tests HTTP con Supertest
```

## Tests e2e

Los tests e2e validan lo que los unitarios no pueden:

- `ValidationPipe` aplica reglas de DTO → 400 en campos inválidos
- `@Public()` bypassea el guard global de auth
- `forbidNonWhitelisted` rechaza campos extra
- Global prefix `api/v1` está aplicado
- Status codes reales (400, 401, 403, 201)

## CI/CD

Bitbucket Pipelines ejecuta `pnpm test` y `pnpm test:e2e` en cada push. Si los thresholds de cobertura no se cumplen, el pipeline falla y el PR no se puede mergear.
