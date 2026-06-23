---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "Wizard de 14 pasos para creación de propiedades en operations, con Zustand store, Zod schemas y componentes reutilizables"
tags:
  - adr
---
# ADR-024: Wizard Create-Property de 14 Pasos

## Contexto

Crear una propiedad en Patioz requiere muchos datos: tipo, ubicación, amenities, fotos, precios, fees, planos, promoción. Un formulario único de 50 campos es inusable.

Se necesita un flujo guiado que:
1. No abrume al agente con todos los campos de una vez
2. Permita guardar progreso parcial
3. Valide cada paso independientemente
4. Sea mantenible (agregar/quitar pasos sin reescribir todo)

## Decisión

**Wizard de 14 pasos** implementado en `apps/operations/src/features/create-property/`:

```
Estructura:
  pages/        → 13 páginas del wizard (una por paso)
  components/   → AgentPromotionCard, AmenitySelection, Fee, PropertyType, etc.
  hooks/        → useAgentAssistance, useAmenities, useGeolocation, etc.
  store/        → wizardStore.ts (Zustand)
  services/     → propertyService.ts, stepperNavigation.ts, stepValidators.ts
  config/       → stepperConfig.ts
  data/         → nicaragua-locations.ts
  schemas/      → fee, floor-plan, location, property-details (Zod)
  layouts/      → WizardLayout.tsx
```

**Arquitectura:**
- **Zustand store** (`wizardStore.ts`): mantiene `currentStep` y `formData` acumulado
- **Zod schemas** por paso: validan solo los campos de ese paso
- **Stepper navigation**: `stepperConfig.ts` define el orden y dependencias entre pasos
- **Componentes reutilizables**: `Stepper`, `OptionCard`, `LocationPicker` de `@mapui/ui-core`

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Wizard con Zustand + Zod (elegido)** | Estado centralizado, validación por paso, fácil extender pasos | Complejidad inicial de arquitectura |
| **Formulario único con secciones colapsables** | Simple de implementar | Inusable con 50 campos. Scroll infinito. Validación todo-o-nada |
| **React Hook Form multi-step** | Nativo de RHF | Sin estado compartido entre pasos. Lógica de navegación manual |
| **Formik + Wizard** | Maduro | Boilerplate, menos integración con React 19 |

## Consecuencias

### Positivas
- **Agente guiado:** 14 pasos pequeños en vez de 1 formulario enorme
- **Progreso parcial:** Zustand store persiste datos entre pasos
- **Validación granular:** Zod schema por paso, errores específicos
- **Extensible:** agregar un paso es crear una página, un schema y agregar al config

### Negativas
- **14 pasos pueden sentirse largos** para propiedades simples
- **Zustand store** no persiste entre sesiones (sin backend aún)

### Mitigaciones
- `stepperConfig.ts` permite saltos condicionales (si no hay amenities, saltar ese paso)
- El backend guardará drafts de propiedades para persistencia entre sesiones

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
