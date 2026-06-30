---
id: TSK-010
fase: 3
modulo: Search
prioridad: media
dependencias: ["TSK-006", "TSK-007"]
estimado: 2d
---

# TSK-010: Geocoding (Nominatim + PostGIS + Queue job)

Geocodificación automática de direcciones para búsqueda por ubicación.

## Entregables
- GeocodeCarLocation job (cola database)
- NominatimGeocoder para convertir ciudad/departamento → coordenadas
- PostGIS GIST index para búsqueda espacial
- Filtro de búsqueda por radio (km desde un punto)

## Criterios de aceptación
- Al crear/publicar un carro, se dispara el job de geocoding
- Coordenadas se guardan correctamente en la columna PostGIS
- Búsqueda por "cerca de mí" funciona con radio configurable
- Timeout y reintentos en caso de error de Nominatim
