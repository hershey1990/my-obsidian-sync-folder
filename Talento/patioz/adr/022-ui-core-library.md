---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "Librería de 35 componentes presentacionales (@mapui/ui-core) compartida entre las 4 apps, cero lógica de negocio"
tags:
  - adr
---
# ADR-022: @mapui/ui-core — Componentes Presentacionales Compartidos

## Contexto

4 aplicaciones comparten la misma identidad visual (Patioz). Duplicar componentes (Button, Modal, Table, Stepper) en cada app genera divergencia visual y de comportamiento.

¿Librería de componentes propia, librería externa (shadcn/ui, MUI, Ant), o componentes duplicados por app?

## Decisión

**Librería interna `@mapui/ui-core`** con 35 componentes presentacionales. Reglas estrictas:

- **Cero lógica de negocio:** sin API calls, sin estado global de dominio, sin auth
- **Props-driven:** reciben datos por props, emiten eventos vía callbacks
- **Tailwind CSS v4:** única fuente de estilos
- **Compartida vía monorepo:** no se publica a npm, se importa directamente

Componentes incluidos: Avatar, Badge, Button, Card, Checkbox, Chip, ColorPalette, DocumentUploader, DropZone, FontFamily, HamburgerButton, Inputs, LetterSpacing, LocationPicker, Modal, NumberCounter, OptionCard, PageHeader, PhotoUploader, PillTabs, PropertyCard, RadioButton, Select, Skeleton, SpacingScale, Spinner, StateMessage, Stepper, Table, Tabs, Text, Toast, Toggle, ToggleGroup, TypographyPractice.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **@mapui/ui-core (elegido)** | Control total del diseño, consistencia garantizada, sin dependencia externa | Mantenimiento interno de 35 componentes |
| **shadcn/ui** | Excelente DX, copiable, personalizable | Componentes por app = divergencia inevitable. No todos los componentes necesarios existen |
| **MUI / Ant Design** | Maduro, completo | Pesado, difícil de personalizar al diseño de Patioz, vendor lock-in |
| **Componentes duplicados por app** | Sin dependencia entre apps | Divergencia visual garantizada. 4 botones distintos en 4 apps |

## Consecuencias

### Positivas
- **Consistencia visual total** en las 4 apps
- **Un cambio en ui-core** se refleja en todas las apps
- **Sin dependencia externa** de librerías de componentes
- **Tailwind nativo** — los componentes se estilan como el resto del código

### Negativas
- **35 componentes que mantener** — requiere disciplina para no romper APIs
- **Sin árbol de dependencias** entre componentes (cada uno es auto-contenido)
- **basement app necesaria** para visualizar y testear todos los componentes

### Mitigaciones
- `apps/basement` existe específicamente para showcase y testing visual
- Los componentes no dependen entre sí — cambiar Button no rompe Modal
- TypeScript estricto asegura que los cambios de props se detecten en todas las apps

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
