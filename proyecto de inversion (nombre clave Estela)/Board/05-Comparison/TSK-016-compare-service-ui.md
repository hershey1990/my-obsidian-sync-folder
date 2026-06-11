---
id: TSK-016
fase: 5
modulo: Comparison
prioridad: alta
dependencias: ["TSK-009", "TSK-015"]
estimado: 3d
---

# TSK-016: CompareModelsService + Compare page UI

Comparación lado a lado de modelos y de ofertas del mismo modelo.

## Entregables
- CompareModelsService: specs side-by-side
- Endpoint GET /api/v1/compare?models=yaris,city,rio
- **Comparison page** (`/compare`):
  - Tabla de especificaciones lado a lado (3-4 modelos)
  - Filas: precio, año, hp, torque, consumo, dimensiones, etc.
  - Resaltar la mejor métrica en cada fila
  - Botón "Ver ofertas" → redirige a /search?model=X
- **Ofertas del modelo**: tabla en car detail mostrando todos los listados activos de ese modelo con precio, año, km, score

## Criterios de aceptación
- Comparación de hasta 4 modelos simultáneamente
- Tabla scrolleable horizontalmente en mobile
- Celdas con valor numérico se ordenan y comparan automáticamente
- Ofertas del modelo se cargan rápido (query optimizada)
