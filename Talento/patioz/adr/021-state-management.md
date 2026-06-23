---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "TanStack React Query para server state + Zustand para client state, separación estricta por dominio"
tags:
  - adr
---
# ADR-021: State Management — TanStack Query + Zustand

## Contexto

El monorepo tiene 4 apps, múltiples features, datos de API (propiedades, listings, leads) y estado de UI (filtros, wizard steps, preferencias). Se necesita una estrategia clara de state management que evite:

1. **Duplicación:** datos de API en stores locales
2. **Sobre-fetching:** mismos datos pedidos múltiples veces
3. **Acoplamiento:** estado de un feature filtrándose a otro

## Decisión

**Separación estricta por tipo de estado y dominio:**

### Server state → TanStack React Query

Todo dato que viene del backend (propiedades, listings, leads, amenities, locations) se gestiona con React Query:

- Caché automática con stale time
- Re-fetch en focus/reconnect
- Deduplicación de requests (2 componentes que piden lo mismo = 1 request)
- Mutaciones con invalidación de queries relacionadas

```typescript
// useProperties.ts
export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => getProperties(filters),  // ← services.ts
  });
}
```

### Client state → Zustand

Estado de UI, filtros, wizard steps, preferencias. Separado por dominio:

```typescript
// filterStore.ts
export const useFilterStore = create<FilterState>((set) => ({
  priceRange: [0, 1000000],
  propertyType: null,
  setPriceRange: (range) => set({ priceRange: range }),
}));

// wizardStore.ts
export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 0,
  formData: {},
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
}));
```

### Reglas
- **Nunca** poner datos de API en Zustand
- **Nunca** usar React Query para estado de UI
- Una store de Zustand por dominio (no una store global monolítica)

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **React Query + Zustand (elegido)** | Cada herramienta para su propósito. Caché y re-fetch automático para API. Stores livianas para UI | Dos librerías que aprender |
| **Solo React Query** | Una librería, simplicidad | React Query no está diseñado para estado de UI (filtros, wizard steps) |
| **Solo Zustand** | Una librería, simple | Sin caché, sin re-fetch, sin deduplicación de requests |
| **Redux Toolkit + RTK Query** | Ecosistema maduro, DevTools | Boilerplate excesivo para el tamaño del equipo |
| **Jotai / Recoil** | Atómico, flexible | Menos maduro, ecosistema más chico |

## Consecuencias

### Positivas
- **Sin duplicación:** datos de API en React Query, no en Zustand
- **Sin over-fetching:** React Query deduplica requests idénticos
- **Stores livianas:** Zustand stores por dominio, fáciles de testear
- **Patrón consistente en las 4 apps**

### Negativas
- **Dos librerías** que el equipo debe conocer
- **Invalidación de queries** requiere disciplina (al mutar un listing, invalidar `['listings']`)

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
