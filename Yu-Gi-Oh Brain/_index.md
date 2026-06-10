---
created: 2026-06-09
tags:
  - ygo/index
---

# Yu-Gi-Oh Brain

Base de conocimiento personal para Master Duel. Arquetipos, mazos, ideas y análisis vía IA.

## Navegación

| Carpeta | Contenido | Acción |
|---|---|---|
| `Arquetipos/` | Fichas con mecánica, engine, variantes | Nueva → Plantilla: `YGO - Arquetipo` |
| `Mazos/` | Deck lists completas, combos, matchups | Nueva → Plantilla: `YGO - Mazo` |
| `Ideas/` | Ideas generadas (IA/propias) para nuevos decks | Nueva → Plantilla: `YGO - Idea` |

## Todos los registros

```dataview
TABLE
  tipo AS Tipo,
  estado AS Estado,
  ultima_actualizacion AS Actualizado
FROM "Yu-Gi-Oh Brain"
WHERE tipo
SORT ultima_actualizacion DESC
```

---

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

## Arquetipos

```dataview
TABLE
  nombre AS Arquetipo,
  estado AS Estado,
  ultima_actualizacion AS Actualizado
FROM "Yu-Gi-Oh Brain/Arquetipos"
WHERE tipo = "arquetipo"
SORT estado ASC, nombre ASC
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

## Estadísticas

```dataview
TABLE
  length(rows) AS Cantidad
FROM "Yu-Gi-Oh Brain"
WHERE tipo
GROUP BY tipo AS Tipo
SORT Tipo ASC
```
