---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "Biome como linter y formatter único (JS/TS/CSS/JSON), reemplazando ESLint + Prettier"
tags:
  - adr
---

# ADR-025: Biome como Linter y Formatter Único

## Contexto

4 apps, 6 packages, 3 frameworks (Next.js 16, Vite 6) en el monorepo. Cada uno con su propia configuración de linting y formato:

- ESLint con extends, plugins y parsers distintos por app
- Prettier con config compartida pero ignorada en algunos packages
- Sin reglas unificadas de import sorting, class naming, o formato de Tailwind
- CI lento: ESLint + Prettier corren por separado en cada app (~2min total)

## Decisión

**Biome reemplaza ESLint + Prettier** como linter y formatter único. Reglas:

- `biome.json` en la raíz del monorepo con configuración compartida
- Sin ESLint, sin Prettier, sin `.eslintrc*`, sin `.prettierrc*` en ninguna app/package
- Plugins de editor biome (VS Code, Cursor) usan el `biome.json` raíz
- Lint + format en un solo comando: `biome check --write`
- Tailwind CSS classes ordenadas por Biome plugin nativo (`biome.json` configura `linter.rules.correctness.useSortedClasses`)

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Biome (elegido)** | Un solo tool, 10-50x más rápido que ESLint, sin plugins externos, ordena clases Tailwind, Rust | Menos reglas de lint que ESLint (creciendo). Sin soporte para plugins personalizados |
| **ESLint + Prettier (status quo)** | Ecosistema enorme, cualquier regla existe como plugin | 2 herramientas, config duplicada, lento en CI, conflicto entre reglas de ESLint y Prettier |
| **ESLint 9 flat config + dprint** | ESLint moderno con flat config + formatter rápido | Siguen siendo 2 herramientas, dprint es menos conocido |
| **Oxlint** | Muy rápido, Rust | Solo linter, sin formatter. Menos maduro que Biome |

## Consecuencias

### Positivas
- **Velocidad:** `biome check --write` reemplaza 2 comandos. CI lint baja de ~2min a ~5s
- **Config unificada:** un solo `biome.json` en la raíz, no 5 configs distintas
- **Reglas consistentes:** mismo linter + formatter en todas las apps/packages
- **Tailwind classes ordenadas:** Biome ordena clases automáticamente (equivalente a prettier-plugin-tailwindcss)
- **Zero plugins externos:** Biome trae 200+ reglas de lint built-in

### Negativas
- **Reglas faltantes:** algunas reglas específicas de React/Next.js no existen en Biome (ej: `@next/next/no-img-element`)
- **Sin plugins personalizados:** no se pueden escribir reglas custom de lint
- **Migración:** requiere borrar configs legacy y ajustar CI

### Mitigaciones
- Las reglas faltantes de Next.js se cubren con `noUnusedImports`, `noUnusedVariables` y revisiones manuales en code review
- `biome.json` se configura con el nivel de severidad más alto (`error`) para reglas clave
- Se ejecuta `biome check --apply` en pre-commit via simple-git-hooks

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
