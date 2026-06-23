---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "Patrón 'contract implicit': services.ts devuelve mocks hoy → api.get<T>() mañana sin cambiar firma"
tags:
  - adr
---
# ADR-020: Patrón "Contract Implicit" (services.ts)

## Contexto

El frontend consume la API del backend NestJS (`develop.patioz.co/api/v1`). Durante el desarrollo temprano, muchos endpoints del backend no están listos o son inestables. Se necesita desarrollar features del frontend sin depender de la disponibilidad del backend.

Patrones tradicionales: MSW (Mock Service Worker), json-server, o mocks inline. Todos agregan infraestructura extra.

## Decisión

**Patrón "contract implicit":** cada feature tiene un `services.ts` que expone funciones con firma tipada. Hoy devuelven `Promise.resolve(MOCK_DATA)`. Mañana se cambian a `api.get<T>("/endpoint")` con la misma firma.

```typescript
// services.ts — HOY
export async function getProperties(): Promise<Property[]> {
  return Promise.resolve(MOCK_PROPERTIES);  // 2 líneas: mock → real
}

// services.ts — MAÑANA
export async function getProperties(): Promise<Property[]> {
  return api.get<Property[]>("/api/v1/properties").then(r => r.data);
}
```

**Reglas:**
- `services.ts` es el único punto de inflexión entre mock y API real
- La firma de la función (parámetros y retorno) **nunca cambia** al migrar
- Los componentes nunca llaman a `api.get()` directamente — siempre pasan por el service
- No hay interfaces Repository formales hasta que existan múltiples fuentes de datos concurrentes

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Contract implicit (elegido)** | Sin infraestructura extra, el mock es dato puro, migrar a real es 2 líneas | Sin interceptación HTTP. Si la API cambia la respuesta, no hay validación automática |
| **MSW (Mock Service Worker)** | Intercepta a nivel de red, realista, mismo código en tests | Infraestructura extra, handlers que mantener, curva de aprendizaje |
| **json-server** | API fake real | Otro proceso que correr, esquemas que mantener en sync |
| **TanStack Query + mocks inline** | Simple | Duplicación de datos mock en cada componente |

## Consecuencias

### Positivas
- **Velocidad de desarrollo:** features se construyen con datos mock sin esperar al backend
- **Migración trivial:** 2 líneas por función cuando el endpoint está listo
- **Tipado estricto:** `Promise<Property[]>` asegura que el mock y la API real devuelvan la misma forma
- **Sin dependencia extra:** no requiere MSW, json-server ni nada externo

### Negativas
- **Sin validación en runtime** de que la respuesta de la API matchee la interfaz TypeScript
- **Los mocks pueden divergir** de la realidad si el backend cambia sin actualizar el frontend
- **Sin interceptación a nivel HTTP** para tests e2e (Playwright usa su propio mocking)

### Mitigaciones
- TypeScript estricto + tipos compartidos en `@mapui/domain`
- Cuando existan múltiples fuentes de datos para una misma entidad, se introduce `IRepository`
- Los tests e2e con Playwright validan contra la API real (o su mock de Playwright)

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
