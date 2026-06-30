---
id: TSK-012
fase: 3
modulo: Search
prioridad: media
dependencias: ["TSK-009"]
estimado: 1d
---

# TSK-012: Autocomplete/suggestions API + UI

Sugerencias en tiempo real para la barra de búsqueda.

## Entregables
- GET /api/v1/search/suggestions endpoint
- Sugerencias: marcas, modelos, versiones populares
- Límite de 10 resultados, priorizados por relevancia
- Componente Autocomplete con debounce (300ms)
- Navegación por teclado (arrows + enter)

## Criterios de aceptación
- Escribir "Ya" sugiere "Toyota Yaris", "Toyota Yaris 2020", etc.
- Mínimo 2 caracteres para disparar búsqueda
- Debounce evita llamadas innecesarias
- Sugerencias cliqueables que redirigen a /search
