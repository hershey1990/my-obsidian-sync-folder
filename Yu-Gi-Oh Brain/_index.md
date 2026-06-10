---
created: 2026-06-09
tags:
  - ygo/index
---

# Yu-Gi-Oh Brain

Base de conocimiento personal para Master Duel. Arquetipos, mazos, ideas y análisis vía IA.

[[Arquetipos/Arquetipo - Dark Magician|Dark Magician]] · [[Arquetipos/Arquetipo - Red-Eyes|Red-Eyes]] · [[Arquetipos/Arquetipo - Monarchs|Monarchs]] · [[Arquetipos/Arquetipo - Gaia|Gaia]]

## Navegación

| Carpeta | Contenido | Acción |
|---|---|---|
| `Arquetipos/` | Fichas con mecánica, engine, variantes | Nueva → Plantilla: `YGO - Arquetipo` |
| `Mazos/` | Deck lists completas, combos, matchups | Nueva → Plantilla: `YGO - Mazo` |
| `Ideas/` | Ideas generadas (IA/propias) para nuevos decks | Nueva → Plantilla: `YGO - Idea` |

---

## Todos los registros

```dataview
TABLE tipo, estado, ultima_actualizacion
FROM "Yu-Gi-Oh Brain/Arquetipos"
SORT ultima_actualizacion DESC
```

```dataview
TABLE tipo, estado, ultima_actualizacion
FROM "Yu-Gi-Oh Brain/Mazos"
SORT ultima_actualizacion DESC
```

```dataview
TABLE tipo, estado, fecha
FROM "Yu-Gi-Oh Brain/Ideas"
SORT fecha DESC
```

---

## Cuántos tengo

```dataview
TABLE length(rows) AS total
FROM "Yu-Gi-Oh Brain"
WHERE tipo
GROUP BY tipo
```
