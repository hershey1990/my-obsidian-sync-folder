---
created: 2026-06-09
tags:
  - ygo/index
---

# Yu-Gi-Oh Brain

Base de conocimiento personal para Master Duel. Arquetipos, mazos, ideas y análisis vía IA.

## Navegación

| Carpeta | Contenido |
|---|---|
| `Arquetipos/` | Fichas de arquetipos con mecánica, engine, variantes |
| `Mazos/` | Deck lists completas con combos y matchups |
| `Ideas/` | Ideas generadas (IA y propias) para nuevos decks |

## Estadísticas

```dataview
TABLE
  length(rows) AS Cantidad
FROM "Yu-Gi-Oh Brain"
WHERE tipo
GROUP BY tipo AS Tipo
SORT Tipo ASC
```

## Mazos por estado

```dataview
TABLE
  rows.nombre AS Mazo,
  rows.dificultad AS Dificultad
FROM "Yu-Gi-Oh Brain/Mazos"
WHERE tipo = "mazo"
GROUP BY estado AS Estado
SORT Estado ASC
```

## Arquetipos activos

```dataview
TABLE
  nombre AS Arquetipo,
  estado AS Estado
FROM "Yu-Gi-Oh Brain/Arquetipos"
WHERE estado = "activo" OR estado = "explorando"
SORT nombre ASC
```

## Ideas pendientes

```dataview
TABLE
  nombre AS Idea,
  arquetipos_base AS Arquetipos,
  origen AS Origen
FROM "Yu-Gi-Oh Brain/Ideas"
WHERE estado = "pendiente" OR estado = "probar"
SORT fecha ASC
```

## Últimas actualizaciones

```dataview
TABLE
  file.name AS Nota,
  ultima_actualizacion AS Actualizado
FROM "Yu-Gi-Oh Brain"
WHERE ultima_actualizacion
SORT ultima_actualizacion DESC
LIMIT 10
```
