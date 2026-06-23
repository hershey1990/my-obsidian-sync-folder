---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "Tailwind CSS v4 como única fuente de estilos. Sin CSS modules, styled-components, Sass ni estilos inline"
tags:
  - adr
---
# ADR-023: Tailwind CSS v4 como Única Fuente de Estilos

## Contexto

4 aplicaciones, 35+ componentes compartidos, un design system. Sin una regla clara de estilos, cada dev usa su enfoque preferido: CSS modules, styled-components, inline styles, Sass. Esto genera:

1. **Divergencia visual:** mismo componente se ve distinto según quién lo escribió
2. **Bundle size:** múltiples librerías de CSS-in-JS
3. **Curva de aprendizaje:** cada enfoque requiere contexto distinto

## Decisión

**Tailwind CSS v4 es la única fuente de estilos.** Reglas:

- Prohibido: CSS modules, styled-components, Emotion, Sass, CSS-in-JS, estilos inline (`style={{}}`), archivos `.css` separados
- Permitido: clases de Tailwind en JSX, `@apply` en `globals.css` solo para estilos base
- Personalización: `tailwind.config.ts` define la paleta, fuentes, spacing y breakpoints del design system

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Tailwind v4 (elegido)** | Consistencia total, utility-first rápido, sin cambiar de archivo, tree-shaking nativo en v4 | Curva de aprendizaje inicial. Clases largas en componentes complejos |
| **CSS Modules** | Scoped por componente, sin colisiones | Difícil compartir variables con el design system. Props dinámicas requieren lógica extra |
| **Styled-components** | Estilos como código, props dinámicas naturales | Runtime CSS-in-JS = bundle size. Performance en SSR |
| **Sass** | Variables, mixins, nesting | Otro build step. Fácil acumular CSS muerto sin tree-shaking |

## Consecuencias

### Positivas
- **Un solo enfoque** en 4 apps y 35+ componentes
- **Sin CSS huérfano:** Tailwind v4 tree-shakea clases no usadas
- **Design system en código:** colores, fuentes, spacing en `tailwind.config.ts`
- **Productividad:** no se cambia de archivo HTML → CSS

### Negativas
- **Clases largas** en componentes con mucha lógica visual
- **Curva de aprendizaje** para devs que vienen de CSS tradicional
- **No hay scoping por componente** (el orden de clases en el HTML determina la especificidad)

### Mitigaciones
- `@mapui/ui-core` encapsula los componentes más complejos (Button, Modal, Table)
- `biome.json` formatea clases de Tailwind consistentemente
- La regla "Tailwind solo" elimina la tentación de mezclar enfoques

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
