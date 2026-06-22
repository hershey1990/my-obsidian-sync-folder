---
tipo: adr
fecha: 2026-06-22
estado: aceptado
decision: "Estrategia de testing pragmático (TDD pragmático) con cobertura mínima del 70% statements y 60% branches, incluyendo tests unitarios y e2e HTTP"
proyecto: patioz-be
sync_status:
  backend: pendiente
  frontend: no_aplica
tags:
  - adr
---
# ADR-016: Estrategia de Testing — TDD Pragmático

## Contexto

El monolite Patioz creció de un prototipo a una aplicación con 9+ módulos de dominio, múltiples integraciones externas (Supabase, AWS, Google Maps, imgproxy-api), y lógica de negocio con impacto financiero (listings, leads, propiedades).

Sin una estrategia de testing definida, el equipo corría riesgos:

1. **Regresiones silenciosas:** cambios en un módulo rompen otro sin detección temprana
2. **Deploy ansioso:** cada push a producción sin certeza de que todo funciona
3. **Deuda de tests:** funcionalidades sin tests que nadie quiere tocar por miedo a romper
4. **Sobre-testing:** tests triviales que no aportan valor pero consumen tiempo de CI

Se necesitaba una estrategia clara que balanceara cobertura, velocidad de desarrollo, y confianza en los deploys.

## Decisión

Se adopta **TDD pragmático** con reglas explícitas sobre qué testear y qué no, dos tipos de tests (unitarios + e2e HTTP), y thresholds de cobertura enforceados en CI.

### Filosofía

> Los tests son especificaciones ejecutables, no trofeos de cobertura.

Escribir el test primero cuando clarifica el contrato; escribirlo después cuando el contrato es obvio (passthrough de CRUD).

### Qué SÍ debe tener tests

| Capa | Tipo de test | Scope | Razón |
|---|---|---|---|
| **Service** | Unitario | Lógica de dominio, branches condicionales, cálculos, publicación de eventos | Reglas de negocio — mayor ROI |
| **Adapter** | Unitario | Transformaciones, filtrado, mapeo, manejo de errores de API externa | Cualquier lógica más allá de "pasar el llamado al driver" |
| **Guard** | Unitario | Resolución de permisos, edge cases (sin usuario, sin metadata) | Barrera de seguridad |
| **Controller** | Integración (liviano) | Delegación de rutas, status codes, binding de DTOs | Solo si agrega lógica más allá de llamar al service |
| **Repository** | Integración | CRUD contra BD real o mockeada | Repos mockeados mienten; validar la traducción SQL |
| **Flujo completo** | e2e HTTP | Guards → Pipes → Controller → Service → Response | Lo que tests unitarios no pueden verificar |

### Qué NO necesita tests

- **Configuración de módulos** (`@Module`, `BullModule.forRoot`, `JwtModule.registerAsync`) — wiring del framework
- **Adaptadores passthrough puros** — solo traducen un método a una query Supabase sin lógica
- **Getters/setters simples** — sin branching no hay valor de test
- **DTOs** — los decoradores de `class-validator` son código de librería

### Tipos de tests

#### Unitarios (Jest + `@nestjs/testing`)

- Co-ubicados con el source: `{name}.spec.ts` en el mismo directorio
- Un spec file por source file (controllers admin/public separados)
- Dependencias mockeadas via `{ provide: TOKEN, useValue: mock }`
- Nunca se instancian adapters reales
- BullMQ: mock de `Queue` con `{ add: jest.fn() }`
- SupabaseService: mock del cliente con query builder encadenable

#### e2e HTTP (Supertest + `@nestjs/testing`)

- Ubicados en `test/integration/{module}/` (separados de tests unitarios)
- Botean la app NestJS completa con `createTestApp()` factory
- Mockean infraestructura externa (Supabase, Redis, S3, AWS Translate, BullMQ) a nivel de provider
- Validan el pipeline completo: Guards → Pipes → Controller → Service → Response
- Config: `api/v1` prefix, `ValidationPipe` global, CORS

```typescript
// Ejemplo: test e2e de validación de DTO
it('should return 400 when email is missing', async () => {
  const res = await request
    .post('/api/v1/auth/login')
    .send({ password: 'secret123' })
    .expect(400);

  expect(res.body.message).toEqual(
    expect.arrayContaining([expect.stringMatching(/email/i)]),
  );
});
```

#### Lo que los tests e2e atrapan que los unitarios no

| Concern | Unitario | e2e |
|---|---|---|
| `ValidationPipe` aplica reglas de DTO | No | Si |
| `@Public()` bypassea el guard global de auth | No | Si |
| `forbidNonWhitelisted` rechaza campos extra | No | Si |
| Global prefix `api/v1` aplicado | No | Si |
| Status codes correctos (400/401/403/201) | No | Si |
| Forma del JSON de respuesta real | No | Si |

### Cobertura

- **Services:** 100% branch coverage en lógica de negocio (condicionales, loops)
- **Adapters con lógica:** 100% branch coverage
- **Promedio por módulo:** ≥ 70% statements, ≥ 60% branches
- Enforceado en CI via `bitbucket-pipelines.yml`
- No perseguir 100% line coverage si significa testear código passthrough

### Workflow Red-Green-Refactor

1. **Red:** Escribir un test que falle describiendo el comportamiento deseado o reproduciendo un bug
2. **Green:** Escribir el código mínimo para que el test pase. No refactorizar todavía
3. **Refactor:** Limpiar duplicación, renombrar, extraer helpers. Los tests deben seguir en verde

### CI Enforcement

PRs que introduzcan nuevos services o adapters sin specs son bloqueados por CI. La regla de TDD pragmático aplica: el test puede escribirse antes o después, pero debe existir antes del merge.

### Comandos

```bash
pnpm test              # Tests unitarios (src/**/*.spec.ts, ~17s)
pnpm test:e2e          # Tests e2e HTTP (test/integration/**/*.e2e-spec.ts, ~5s)
pnpm build             # Build de producción
```

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **TDD pragmático (elegido)** | Balance entre cobertura y velocidad. Reglas claras de qué testear. | Requiere disciplina del equipo para no saltear tests "porque el cambio es chico". |
| **TDD estricto (siempre test first)** | Máxima confianza, diseño guiado por tests | Fricción excesiva para CRUD obvio. Los devs junior lo abandonan. |
| **BDD / Cucumber** | Tests legibles por no-técnicos | Overhead de mantenimiento de features files. El equipo y stakeholders son técnicos. |
| **Solo tests e2e** | Cubren el flujo completo real | Lentos (boot de app). Poco granulares para debuggear. Difíciles de mantener para lógica de negocio compleja. |
| **Sin tests (solo manual QA)** | Máxima velocidad de feature development | Regresiones constantes. Deploy ansioso. Deuda técnica que escala con el equipo. |

## Consecuencias

### Positivas
- **Confianza en deploys:** CI bloquea merges que rompen cobertura o tests existentes
- **Onboarding estandarizado:** nuevos devs saben exactamente qué testear y cómo
- **Detección temprana:** tests unitarios corren en ~17s; feedback inmediato en desarrollo local
- **Documentación viva:** los tests describen el comportamiento esperado de services y guards

### Negativas
- **Tiempo de escritura de tests:** ~30-50% del tiempo de desarrollo de una feature se va en tests
- **Mantenimiento de mocks:** si una interfaz cambia, todos los tests que la mockean deben actualizarse
- **Falsos verdes:** un mock mal configurado puede dar green sin validar el comportamiento real

### Mitigaciones
- La regla "no testear passthrough puro" evita tests triviales que no aportan valor
- Los tests e2e validan que los mocks de tests unitarios no mientan sobre el comportamiento real
- Thresholds de cobertura (70%/60%) son alcanzables sin sobre-testear
- La factory `createTestApp()` centraliza la configuración de mocks para tests e2e

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este ADR formaliza prácticas que el equipo ya sigue y que están documentadas en el AGENTS.md del repositorio. La decisión de TDD pragmático (no estricto) es deliberada: reconoce que no todo código merece un test, pero que el código crítico (services, guards, adapters con lógica) debe estar cubierto antes de llegar a producción.*

## Referencias

- Complementa a ADR-012 (Estructura de Módulo) — los tests respetan la misma estructura de carpetas
- Depende de ADR-010 (NestJS 11) — `@nestjs/testing` y `Test.createTestingModule()`
