---
id: TSK-009
fase: 3
modulo: Search
prioridad: alta
dependencias: ["TSK-006"]
estimado: 3d
---

# TSK-009: Search index (tsvector + GIN) + filters backend

Motor de búsqueda con filtros reales especializados para autos.

## Entregables
- GIN index con tsvector en español sobre cars (brand, model, version, description)
- Filtros backend: marca, modelo, año (min-max), precio (min-max), transmisión, combustible, tracción, kilómetros, condición, departamento/ciudad
- SearchCarService con query builder optimizado
- SearchController con SearchCarRequest
- Paginación con cursor o offset

## Criterios de aceptación
- Búsqueda por texto parcial encuentra resultados (ej: "Yaris" encuentra "Toyota Yaris 2020")
- Combinación de 5+ filtros responde en < 500ms
- Los filtros inválidos no rompen la query
- Paginación funcional
