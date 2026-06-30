---
tags:
  - bb/docs
---
# BB — Frontend Overview

> Documento en borrador. Se completará al definir ADRs de frontend.

## Stack

- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS
- **State:** TanStack React Query + Zustand
- **PWA:** Service Worker + offline support
- **Forms:** React Hook Form + Zod

## App Shell

La PWA tiene una arquitectura app-shell:
- Shell cached (Service Worker)
- Datos dinámicos (API + localStorage para offline)
- Sincronización al recuperar conexión
