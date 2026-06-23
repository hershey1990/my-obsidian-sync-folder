---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "Next.js 16 (App Router) para la app pública (mapui), Vite + React 19 para agentes, admin y design system"
tags:
  - adr
---
# ADR-019: Next.js 16 (mapui) + Vite (operations/admin/basement)

## Contexto

Las apps de Patioz tienen requerimientos distintos:

| App | Requerimiento clave |
|---|---|
| mapui | SEO, maps, público, SSR/SSG, next-intl |
| operations | Dashboard interno, wizard complejo, no SEO |
| admin | Staff interno, mínimo, no SEO |
| basement | Design system showcase, sin lógica |

¿Un solo framework para todas o el mejor framework para cada caso?

## Decisión

**Next.js 16 (App Router) para mapui. Vite + React 19 para operations, admin y basement.**

- **mapui → Next.js 16:** SSR/SSG para SEO de propiedades, App Router para layouts anidados, next-intl nativo, Streaming/React Server Components
- **operations → Vite:** Sin SEO necesario. HMR instantáneo para desarrollo del wizard. Build rápido. Bundle más liviano
- **admin → Vite:** Mínimo, sin SEO. Mismo stack que operations para consistencia
- **basement → Vite:** Solo necesita renderizar componentes de ui-core. Vite es más que suficiente

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Híbrido Next.js + Vite (elegido)** | Cada app con lo que necesita. SEO donde importa, velocidad donde no | Dos frameworks que mantener |
| **Todo Next.js** | Un solo framework, convenciones consistentes | SSR innecesario en admin/operations. Mayor complejidad para apps simples |
| **Todo Vite** | Un solo framework, simplicidad | Sin SSR/SEO para la app pública. next-intl no disponible (se pierde i18n del lado del servidor) |
| **Remix** | Buen SSR, más simple que Next.js | Ecosistema más chico, menos maduro para i18n |

## Consecuencias

### Positivas
- **mapui obtiene SEO** vía SSR/SSG + next-intl server-side
- **operations/admin obtienen velocidad** de desarrollo con HMR instantáneo de Vite
- **Cada app usa el stack que necesita** sin cargar con lo que no

### Negativas
- **Dos configuraciones de build** (Next.js + Vite)
- **Dos sistemas de ruteo** (App Router + TanStack Router)
- **Dos sistemas de i18n** (next-intl + @mapui/i18n)

### Mitigaciones
- Turborepo (ADR-017) unifica el pipeline de build para ambos frameworks
- Los packages compartidos (`@mapui/ui-core`, `@mapui/auth`, `@mapui/api-client`) funcionan en ambos sin adaptación
- TypeScript estricto asegura compatibilidad de tipos entre apps

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
