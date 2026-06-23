---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-be
implementado: si
decision: Google Places como provider de datos de lugares (Autocomplete + Place Details + Geocoding)
tags:
  - adr
  - maps
---

# Maps-002: Provider de Datos de Lugares — Google Places

## Contexto

El sistema de búsqueda de ubicaciones de Patioz necesita un provider de datos de lugares para las fases de autocompletado (Fase 1) y verificación (Fase 2), definidas en ADR-011.

Las opciones consideradas fueron:
- **Google Places** — API madura, mejor cobertura de direcciones en Nicaragua
- **Mapbox Geocoding** — integración natural con Mapbox GL JS (maps-001), mismo vendor
- **Nominatim (OSM)** — gratuito, datos abiertos, rate-limited

El equipo técnico consideró inicialmente usar **Mapbox Geocoding** para tener un solo vendor (Mapbox render + Mapbox data), simplificando operaciones (un SDK, un billing, un token).

Sin embargo, el caso de uso crítico de Patioz — reconciliación de zonas informales con nombres vernáculos (ej. "Las Colinas Norte", "Las Colinas Sur") — requiere cobertura de Google.

## Decisión

El provider de datos de lugares (Autocomplete + Place Details + Geocoding) es **Google Places**. No se usa Mapbox Geocoding como fuente de datos.

### Stack

| Capa | Tecnología |
|---|---|
| Autocomplete (Fase 1) | Google Maps JS API — Places Autocomplete widget (frontend directo) |
| Place Details (Fase 2) | Google Places API — Place Details (backend) |
| Geocoding (batch) | Google Geocoding API (backend, reconciliación) |
| Adapter backend | `google-geocoding.provider.ts` implementa `IGeocodingProvider` |

### Por qué Google Places

1. **Cobertura de barrios informales** — Google tiene mejor cobertura de nombres vernáculos y zonas no catastradas en Nicaragua, que es justamente el caso de uso que motiva el flujo de reconciliación (Tipo B).
2. **place_id es vendor-locked** — el `place_id` devuelto por Autocomplete solo lo resuelve Place Details del mismo proveedor. No se puede mezclar Autocomplete de Google con Geocoding de Mapbox.
3. **Viabilidad del flujo** — la reconciliación Tipo B (fragmentos espaciales) depende de Google Places. Sin cobertura de Google, ese flujo no es viable.
4. **Renderer y data provider son independientes** — Mapbox GL JS como renderer (maps-001) no obliga a usar Mapbox Geocoding. Mapbox renderiza GeoJSON de cualquier fuente.

### Trade-off aceptado

**Dos vendors** (Mapbox render + Google data). Se asume la complejidad operacional (dos SDKs, dos billings, dos tokens de API) porque la cobertura de nombres vernáculos de Google es indispensable para la reconciliación Tipo B.

### Implicaciones técnicas

- El adapter `google-geocoding.provider.ts` implementa `IGeocodingProvider` / `ILocationGeocodingProvider` en los contracts de `locations`.
- El frontend usa **Google Maps JS API** para el widget Autocomplete (Fase 1) y **Mapbox GL JS** para el renderizado del mapa (post-búsqueda). Ambos coexisten sin conflicto: el primero solo produce `place_id`, el segundo solo consume GeoJSON.
- `turf.js` sigue en el backend; es independiente del renderer y del data provider.
- El `place_id` se almacena en la tabla `locations` como `google_place_id`.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Google Places (elegido)** | Mejor cobertura Nicaragua, place_id resoluble, API madura | Dos vendors (Mapbox + Google), dos billings, dos tokens |
| **Mapbox Geocoding** | Un solo vendor (Mapbox), SDK unificado, billing único | Cobertura insuficiente de nombres vernáculos en Nicaragua. El `place_id` de Mapbox no es resoluble por Google. La reconciliación Tipo B no sería viable |
| **Nominatim (OSM)** | Gratuito, datos abiertos | Rate-limited (~1 req/s), sin SLA, cobertura limitada de barrios informales |

## Consecuencias

### Positivas

- Cobertura de nombres vernáculos y barrios informales de Nicaragua
- Reconciliación Tipo B viable (depende de Google Places)
- place_id resoluble de extremo a extremo (Autocomplete → Place Details)
- Autocomplete widget es gratuito hasta 28K solicitudes/día
- Independencia entre renderer (Mapbox) y data provider (Google)

### Negativas / Riesgos

- Dos vendors de mapas que gestionar (SDKs, billings, tokens)
- Google Place Details tiene costo ($17/1K requests) — mitigado con TTL de 90 días y caché local
- Google Geocoding tiene costo ($5/1K requests) — solo para reconciliación batch
- Vendor lock-in del `place_id` a Google

### Mitigaciones

- La caché local con `google_place_id` elimina ~95% de Place Details después del seed inicial
- TTL de 90 días reduce Place Details a ~4 veces/año por location
- El adapter `google-geocoding.provider.ts` implementa un contrato (`IGeocodingProvider`). Si en el futuro se quisiera cambiar de provider, se crea un nuevo adapter sin cambiar la lógica de dominio
- Mapbox GL JS y Google Maps JS API coexisten en el frontend sin conflicto: el primero renderiza el mapa, el segundo produce place_ids

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este sub-ADR depende de ADR-011 (Arquitectura de Búsqueda y Verificación de Ubicaciones) y se complementa con maps-001 (Mapbox GL JS como renderer). La decisión de usar dos vendors (Mapbox render + Google data) es un trade-off consciente basado en la cobertura de datos de Google en Nicaragua.*
