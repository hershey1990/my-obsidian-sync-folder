---
id: TSK-008
fase: 2
modulo: Cars CRUD
prioridad: alta
dependencias: ["TSK-003", "TSK-005", "TSK-007"]
estimado: 4d
---

# TSK-008: Publish wizard + Car detail page (frontend)

Flujo de publicación multi-paso y página de detalle de carro.

## Entregables
- **Publish wizard** (`/dealer/publish`):
  - Paso 1: Info básica (marca, modelo, año, versión, transmisión, combustible, etc.)
  - Paso 2: Fotos (subida con preview, reordenar, máximo 20)
  - Paso 3: Condition Checklist (placeholder hasta Fase 4)
  - Paso 4: Revisión y publicar
- **Car detail page** (`/cars/[id]`):
  - Galería de fotos
  - Especificaciones técnicas en tabla
  - Precio, ubicación, descripción
  - Badge de Condition Score (placeholder)
  - Botón "Contactar vendedor"
  - Breadcrumbs

## Criterios de aceptación
- Wizard guarda progreso por paso (no se pierde al recargar)
- Fotos se ven en preview antes de subir
- Car detail carga rápido (RSC, ISR)
- Diseño mobile-first
