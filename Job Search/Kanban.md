---
tags:
  - kanban
---

# Kanban de Aplicaciones

## Applied
```dataview
LIST rows.file.link
FROM "Job Search/Companies"
WHERE tipo = "aplicacion" AND estado = "applied"
GROUP BY estado
SORT rows.file.ctime DESC
```

## Screening
```dataview
LIST rows.file.link
FROM "Job Search/Companies"
WHERE tipo = "aplicacion" AND estado = "screening"
GROUP BY estado
SORT rows.file.ctime DESC
```

## Technical Interview
```dataview
LIST rows.file.link
FROM "Job Search/Companies"
WHERE tipo = "aplicacion" AND estado = "technical"
GROUP BY estado
SORT rows.file.ctime DESC
```

## Cultural Interview
```dataview
LIST rows.file.link
FROM "Job Search/Companies"
WHERE tipo = "aplicacion" AND estado = "cultural"
GROUP BY estado
SORT rows.file.ctime DESC
```

## Offer
```dataview
LIST rows.file.link
FROM "Job Search/Companies"
WHERE tipo = "aplicacion" AND estado = "offer"
GROUP BY estado
SORT rows.file.ctime DESC
```

## Rejected / Declined
```dataview
LIST rows.file.link
FROM "Job Search/Companies"
WHERE tipo = "aplicacion" AND estado = "rejected" OR estado = "declined"
GROUP BY estado
SORT rows.file.ctime DESC
```
