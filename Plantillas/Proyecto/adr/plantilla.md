---
tipo: adr
fecha: {{date:YYYY-MM-DD}}
estado: propuesto # propuesto | aceptado | rechazado | reemplazado
proyecto: {{NOMBRE}}
sync_backend: pendiente # pendiente | copiado | no_aplica
sync_frontend: no_aplica # pendiente | copiado | no_aplica
tags:
  - adr
# Opcionales:
# decision: "Resumen de la decisión en una línea"
# reemplaza: [ADR-XXX]
# reemplazado_por: ADR-XXX
# corrige: [ADR-XXX]
# corregido_por: [ADR-XXX]
---
# ADR-XXX: Título de la Decisión

## Contexto
*¿Qué problema motivó esta decisión? ¿Qué restricciones o factores externos influyen?*

## Decisión
*¿Qué se decidió hacer? Describir la solución elegida con suficiente detalle.*

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| Opción A | — | — |
| Opción B | — | — |

## Consecuencias

### Positivas

### Negativas / Riesgos

### Mitigaciones

## Estado

- [ ] Propuesto
- [ ] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Un ADR debe ser concreto, justificado y rastreable.*
> *Al ser aceptado, copiarlo al repositorio y cambiar `sync_backend`/`sync_frontend` a `copiado`.*
