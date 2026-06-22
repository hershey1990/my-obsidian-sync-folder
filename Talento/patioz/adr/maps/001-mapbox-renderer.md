---
tipo: adr
fecha: 2026-06-22
estado: aceptado
decision: "Mapbox GL JS como renderer del mapa frontend (reemplaza Leaflet + OSM raster)"
tags:
  - adr
  - maps
---

# Maps-001: Renderer del Mapa — Mapbox GL JS

## Contexto

El frontend de Patioz necesita un mapa interactivo para buscar y visualizar propiedades. El renderer actual es **Leaflet + OpenStreetMap (tiles raster)** definido en ADR-004 (ahora reemplazado por ADR-011).

Tras evaluar la experiencia de usuario esperada — especialmente para el sitio web público donde compradores exploran listings en el mapa — se identificaron limitaciones de Leaflet + OSM raster:

- Calidad visual inferior en Latinoamérica (cobertura de datos, actualización de mapas)
- Zoom raster (escalado de píxeles, no fluido)
- Sin rotación ni inclinación del mapa
- Renderizado menos performante en dispositivos móviles con múltiples marcadores

## Decisión

El frontend renderiza mapas con **Mapbox GL JS** (mosaicos vectoriales), reemplazando a Leaflet + OSM raster.

### Stack

| Capa | Tecnología |
|---|---|
| Renderer | Mapbox GL JS (`mapbox-gl`) |
| Tipo de mapa | Vector tiles (zoom fluido, rotación 3D, etiquetas dinámicas) |
| Plan | Free hasta 50,000 map loads/mes |
| GeoJSON | Nativo vía `map.addSource({ type: 'geojson' })` |

### Por qué Mapbox GL JS

1. **Mosaicos vectoriales** — zoom fluido sin pixelado, rotación e inclinación del mapa, etiquetas que se redimensionan automáticamente.
2. **Cobertura LatAm** — mejor calidad visual y datos más actualizados que OSM raster en Nicaragua.
3. **Rendimiento** — renderizado por GPU, maneja cientos de marcadores y polígonos sin degradación.
4. **Costo** — free hasta 50K map loads/mes. Para el perfil de Patioz (cientos de propiedades, no miles de usuarios concurrentes) es holgado.
5. **GeoJSON nativo** — el contrato de respuesta de `/locations/search` (`geojson` + `bbox` + `centroid`) es agnóstico al renderer. Mapbox GL JS consume GeoJSON directamente sin transformación.

### Implicaciones técnicas

- El contrato de respuesta (`geojson`, `bbox`, `centroid`) **no cambia** — es agnóstico al renderer.
- `turf.js` sigue en el backend; es independiente del renderer.
- El pintado de polígonos usa `map.addLayer({ type: 'fill' })` + `type: 'line'` en lugar de `L.geoJSON()`.
- Mapbox GL JS y Google Maps JS API coexisten sin conflicto: Google solo produce `place_id`, Mapbox solo consume GeoJSON.
- Componente React: `react-map-gl` (wrapper oficial de Mapbox para React) reemplaza a `react-leaflet`.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Mapbox GL JS (elegido)** | Vector tiles, zoom fluido, rotación, buen rendimiento, free hasta 50K/mes | Costo si escala, clave de API requerida |
| **Leaflet + OSM (actual)** | Gratuito, sin API key, open-source, probado | Raster tiles, sin rotación, menor calidad visual LatAm |
| **Google Maps SDK** | Excelente cobertura, autocompletado nativo, 3D | Costo elevado, restricciones de uso, vendor lock-in, requiere API key |

## Consecuencias

### Positivas

- Experiencia de mapa significativamente mejor para compradores (sitio público)
- Vector tiles: zoom fluido, rotación, rendimiento en móviles
- GeoJSON nativo sin transformación
- Contrato de backend agnóstico al renderer

### Negativas / Riesgos

- Dependencia de API key de Mapbox
- Costo si el uso escala más allá del tier free
- Curva de aprendizaje del equipo (migrar de Leaflet a Mapbox GL JS)
- Dos vendors de mapas (Mapbox render + Google Places data)

### Mitigaciones

- El contrato `geojson` + `bbox` + `centroid` es independiente del renderer. Si en el futuro se quisiera cambiar, el backend no se toca.
- `turf.js` es independiente y se mantiene.
- El tier free (50K map loads/mes) es suficiente para la etapa actual.

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este sub-ADR depende de ADR-011 (Arquitectura de Búsqueda y Verificación de Ubicaciones). El contrato de backend definido en ADR-011 es agnóstico al renderer, por lo que ambas decisiones son compatibles.*
