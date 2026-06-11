---
id: TSK-011
fase: 3
modulo: Search
prioridad: alta
dependencias: ["TSK-003", "TSK-008", "TSK-009"]
estimado: 3d
---

# TSK-011: Search page + filters + map UI

Página de búsqueda con filtros visuales y mapa de resultados.

## Entregables
- Search page (`/search`) con searchParams en URL
- Barra de búsqueda con filtros desplegables:
  - Marca, modelo, año (rango), precio (rango)
  - Transmisión, combustible, tracción (chips)
  - Condición (score min), ubicación
- Grid de resultados como CarCard (imagen, título, precio, año, km, score)
- Mapa con marcadores de resultados (Leaflet/Maplibre)
- Vista lista/mapa toggle
- Filtros persisten en URL (compartibles)

## Criterios de aceptación
- Carga inicial rápida (RSC)
- Cambiar filtros actualiza URL y resultados sin recargar
- Mapa muestra markers con info básica al hover
- Responsive: filters colapsan en mobile
- Funciona sin JavaScript (progressive enhancement)
