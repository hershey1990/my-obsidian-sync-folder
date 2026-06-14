---
tags:
  - patioz/runbook
---
# 📘 Runbooks de Patioz

Procedimientos operativos para el día a día del proyecto.

```dataview
TABLE
    file.name AS "Runbook",
    descripcion AS "Descripción"
FROM "patioz/runbooks"
WHERE tipo = "runbook"
SORT file.name ASC
```

---

## Runbooks disponibles

- [[patioz/runbooks/01-setup-local|01 — Setup Local]]
- [[patioz/runbooks/02-deploy|02 — Deploy]]
- [[patioz/runbooks/03-troubleshooting|03 — Troubleshooting]]
