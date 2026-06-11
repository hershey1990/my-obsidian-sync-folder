---
id: TSK-015
fase: 5
modulo: Comparison
prioridad: alta
dependencias: ["TSK-002"]
estimado: 2d
---

# TSK-015: CarModelSpecs catalog + seed data

Catálogo de especificaciones técnicas de fábrica por modelo.

## Entregables
- CarModelSpec model (brand, model, year, engine, hp, torque, fuel_consumption, dimensions, weight, features JSONB)
- Unique constraint (brand + model + year)
- Seed con datos de modelos populares en Nicaragua (Yaris, City, Rio, Swift, Sonata, Tucson, etc.)
- GET /api/v1/models (catalog), GET /api/v1/models/{id} (specs)
- GET /api/v1/models/{id}/offers (todos los carros activos de ese modelo)

## Criterios de aceptación
- Seed data carga sin duplicados
- GET /api/v1/models devuelve lista única de modelos
- GET /api/v1/models/{id}/offers devuelve carros activos de ese modelo
- Unique constraint funciona (misma marca+modelo+año no se duplica)
