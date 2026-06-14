---
tags:
  - dashboard
---

# Dashboard de Aplicaciones

```dataview
TABLE empresa AS "Empresa", puesto AS "Puesto", fecha_aplicacion AS "Fecha", estado AS "Estado", proximo_paso AS "Próximo Paso"
FROM "Job Search/Companies"
WHERE tipo = "aplicacion"
SORT fecha_aplicacion DESC
```
