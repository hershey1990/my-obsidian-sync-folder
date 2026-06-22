# MapUI Frontend

Esta es la interfaz de usuario principal de Patioz para la navegación y búsqueda de propiedades en un mapa interactivo. Es una aplicación construida con **Next.js (App Router)**.

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Mapa:** Mapbox GL JS con react-map-gl
- **Tooling:** Biome (linting) y Prettier (formateo)

## Arquitectura de Búsqueda en Dos Fases

> **Definido por ADR-011.** Este ADR reemplazó a ADR-004 como la arquitectura oficial de búsqueda y verificación de ubicaciones. El renderer del mapa es **Mapbox GL JS** (definido en [[patioz/adr/maps/001-mapbox-renderer|maps/001]]) y el provider de datos de lugares es **Google Places** (definido en [[patioz/adr/maps/002-google-places-provider|maps/002]]).

La búsqueda de ubicaciones sigue una **arquitectura en dos fases** para optimizar costos, latencia y precisión:

### Fase 1: Autocomplete (Frontend → Google Maps JS API)

El frontend usa el widget `Places Autocomplete` de Google Maps JavaScript API **directamente, sin pasar por el backend**.

```
Usuario escribe "Manag"
  ↓
Frontend → Google Maps JS API (Places Autocomplete widget)
  ↓
Google responde con sugerencias: [{ place_id, description, main_text }]
  ↓
Usuario selecciona "Managua, Nicaragua"
  ↓
Frontend obtiene place_id = "ChIJ..."
```

**Razones para ir directo a Google:**
- Latencia optimizada (debounce + caché local de Google)
- Costo $0 (gratis hasta 28K solicitudes/día)
- UX completa: dropdown, resaltado, teclado
- Sin consumo de recursos del backend por keystroke

### Fase 2: Verificación (Frontend → Backend)

Cuando el usuario selecciona una sugerencia, el frontend envía el `place_id` al backend:

```
POST /api/v1/locations/search { placeId: "ChIJ_xxx" }
```

Respuesta:

```json
{
  "geojson": { "type": "Polygon", "coordinates": [[...]] },
  "centroid": { "lat": 12.13, "lng": -86.25 },
  "bbox": { "north": 12.14, "south": 12.12, "east": -86.24, "west": -86.26 },
  "verified": true,
  "source": "local",
  "confidence": "high"
}
```

- Si el polígono existe en BD y está verificado (<90 días) → respuesta inmediata ($0)
- Si expiró o no existe → backend llama a Google Place Details, ejecuta verificación espacial y cachea
- El frontend **siempre** puede renderizar algo: polígono con estilo según confidence, o marcador punto

### Estados del Location y Pintado Sugerido

| `verified` | `confidence` | Pintado en Mapbox GL JS |
|:---:|:---:|---|---|
| true | high | borde sólido, opacidad normal |
| true | medium | borde sólido + ícono "?" |
| false | low | borde discontinuo, opacidad baja |
| false (source=google) | — | marcador punto, sin polígono |

### Variables de Entorno Clave

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Token de Mapbox para el mapa base (vector tiles).
- `NEXT_PUBLIC_BROKER_API_URL` (Opcional): Activa el modo en que el backend proxy sea el destino de `/locations/search`.
- `GOOGLE_MAPS_API_KEY`: Clave de API para Google Places Autocomplete (frontend) y Place Details (backend).

> Para más detalles, ver [[patioz/adr/011-mapas-ubicaciones|ADR-011: Búsqueda y Verificación de Ubicaciones Geográficas]].
