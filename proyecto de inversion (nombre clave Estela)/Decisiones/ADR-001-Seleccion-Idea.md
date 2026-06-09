---
title: "ADR-001: Selección de idea ganadora"
status: "aceptado"
date: "2026-06-09"
tags:
  - decision
  - ideas
  - autos
---

# ADR-001: Marketplace de Autos como idea principal

## Contexto
Se formularon 3 ideas de negocio para una plataforma digital:
1. Marketplace de compra/venta/intercambio de autos (inspirado en Carvana, CarGurus)
2. Sistema de pagos instantáneos estilo Pix para Nicaragua
3. Marketplace de servicios multi-categoría estilo inDrive

Se evaluaron mediante matriz ponderada con 9 criterios.

## Decisión
**Seleccionar la Idea 1: Marketplace de Autos como idea principal.**

**Idea fallback:** Marketplace de Servicios (Idea 3).

**Idea descartada:** Pix Nicaragua (Idea 2) — barrera regulatoria insalvable sin apoyo del BCN, sin APIs bancarias abiertas.

## Argumentos
1. **Founder-market fit excepcional:** El fundador es fanático de autos, ya inspecciona vehículos para su círculo social — validación real de la propuesta de valor.
2. **Baja barrera de entrada:** Sin regulación significativa, modelo C2C marketplace, sin CAPEX físico.
3. **Factibilidad técnica alta:** Stack CRUD + búsqueda + geolocalización. El fundador construye el MVP solo.
4. **Monetización clara:** Comisión por transacción, suscripción concesionarios, publicidad.
5. **Escalabilidad regional:** Nicaragua como mercado inicial → expansión a Centroamérica.
6. **Diferenciación real:** Enfoque en calidad de búsqueda + inspección de vehículos como servicio de confianza.

## Consecuencias
- Se descarta formalmente la idea de Pix (archivada en `Ideas/_descartadas/`)
- La idea de Servicios queda como fallback, no se invierte más tiempo en ella
- Todo el esfuerzo se enfoca en el plan de negocios del Marketplace de Autos
