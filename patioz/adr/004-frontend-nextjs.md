---
tipo: adr
fecha: 2026-02-15
estado: aceptado
tags:
  - adr
---
# ADR-004: Frontend con Next.js + Leaflet + Búsqueda Híbrida

## Contexto
La aplicación necesita un mapa interactivo para buscar y visualizar propiedades. Se requiere una experiencia de búsqueda rápida con autocompletado y visualización de polígonos geográficos.

## Decisión
Se implementa el frontend con:
- **Next.js 16 (App Router)** — SSR, Server Actions, routing moderno.
- **TypeScript** — tipado estático en toda la aplicación.
- **Tailwind CSS** — estilos utility-first, rápido de prototipar.
- **Leaflet + React Leaflet** — mapa interactivo open-source, sin costos de licencia.
- **Google Places API** — autocompletado de direcciones.
- **GeoJSON local** — polígonos de zonas para visualización offline.
- **Estrategia híbrida** — primero intentar coincidencia local, fallback a Google Geocoding.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Next.js** | SSR, Server Actions, buen DX, ecosistema | Bundle size si no se cuida |
| **Vite + React** | Más liviano, builds rápidos | Sin SSR nativo, más configuración para SEO |
| **Mapbox** | Mejor calidad de mapas, personalización | Costo por request, vendor lock-in |
| **Google Maps** | Exactitud de datos, autocompletado nativo | Costo elevado, restricciones de uso |

## Consecuencias
- **Positivo:** Next.js permite renderizado híbrido (SSR + CSR). Leaflet es gratuito y funciona sin API key.
- **Negativo:** Google Places API tiene costo por request. Leaflet requiere configuración de tile server.
- **Mitigación:** El autocompletado tiene debounce para minimizar requests a Google. Los tiles de mapa son de OpenStreetMap.

## Estado
- [x] Aceptado
