---
id: TSK-001
fase: 0
modulo: Cimientos
prioridad: alta
dependencias: []
estimado: 2d
---

# TSK-001: Setup monorepo (Turborepo + shared packages)

Crear la estructura base del monorepo.

## Entregables
- Turborepo configurado con `apps/web`, `apps/admin`
- Packages compartidos: `@estela/ui`, `@estela/types`, `@estela/utils`, `@estela/config`
- ESLint + Prettier + TypeScript config compartidos
- Scripts de build, dev, lint funcionales

## Criterios de aceptación
- `npm run dev` levanta web y admin
- Los shared packages se importan sin error
- El lint corre en todo el monorepo
