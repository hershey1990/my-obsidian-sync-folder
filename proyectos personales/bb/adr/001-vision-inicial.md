---
tipo: adr
fecha: 2026-06-29
estado: aceptado
proyecto: bb-core
implementado: pendiente
decision: "Convertir la PWA de time tracking para tripulaciones en un SaaS multi-organización enfocado en horarios fragmentados"
tags:
  - adr
  - bb
  - vision
  - producto
---
# ADR-001: Visión inicial — De PWA personal a SaaS de time tracking

## Contexto

BB comenzó como una Progressive Web App (PWA) construida para que la esposa del fundador — tripulante de una aerolínea — registrara sus horas diarias de vuelo. Al final del mes, la app genera un reporte Excel con el desglose de horas trabajadas y horas extra para presentar a nómina.

El sistema resuelve un problema real: las aerolíneas y empresas con horarios fragmentados (turnos quebrados, split shifts, múltiples segmentos por día) no están bien servidas por herramientas genéricas como Toggl o Clockify, que asumen jornadas continuas.

Tras validación informal con otros tripulantes, el fundador decide evolucionar la PWA a un SaaS multi-organización.

## Decisión

**Convertir BB en un SaaS de time tracking enfocado en tripulaciones aéreas y personal con horarios fragmentados.**

### Alcance inicial (MVP)

1. **Registro de jornadas** — Check-in / check-out con timestamp, ubicación (opcional), notas
2. **Soporte para horarios quebrados** — Múltiples segmentos por día (ej. vuelo ida + vuelo vuelta)
3. **Cálculo automático de horas extra** — Reglas configurables por organización (umbral diario/semanal/mensual, multiplicadores)
4. **Reporte mensual Excel** — Formato predefinido listo para nómina
5. **Multi-organización** — Cada aerolínea/empresa es un tenant aislado con sus propias reglas y empleados
6. **PWA offline-first** — Funciona sin conexión, sincroniza al recuperar red

### Lo que NO está en el MVP

- Facturación integrada
- GPS tracking continuo
- Integración con sistemas de nómina (APIs)
- App nativa (iOS/Android) — la PWA cubre esto
- Dashboards analytics avanzados

## Mercado objetivo

### Nicho primario: Tripulaciones aéreas
- Pilotos y sobrecargos con horarios no convencionales
- Necesitan reportes precisos para que les paguen horas extra correctamente
- Mercado inicial: Nicaragua → Centroamérica → LATAM

### Nicho expandible
- Personal de salud (enfermeros con turnos rotativos)
- Logística y transporte (choferes, repartidores)
- Retail y hospitalidad (meseros, recepcionistas con split shifts)
- Call centers

## Diferenciadores

| Frente a | Diferenciador |
|---|---|
| **Toggl / Clockify** | Soporte nativo para horarios quebrados + reportes Excel para nómina |
| **Planillas manuales (Excel)** | Automatización, cero errores de cálculo, PWA siempre disponible |
| **Sistemas enterprise (SAP, Kronos)** | Simplicidad, sin implantación, $0-10/mes por usuario |

## Stack propuesto (a definir en ADRs futuros)

El stack se alineará con la experiencia del fundador en TypeScript:

- **Backend:** NestJS (o Express) + TypeScript + PostgreSQL (Supabase)
- **Frontend:** React + Vite + Tailwind CSS + PWA
- **Auth:** Supabase Auth
- **Reportes:** Biblioteca xlsx para generación de Excel

## Consecuencias

1. **Evolución de PWA a SaaS** — Requiere migrar de una app single-user a una arquitectura multi-tenant
2. **Motor de reglas de overtime** — Componente core del sistema. Debe ser configurable por organización
3. **Offline-first** — La PWA debe seguir funcionando sin conexión (diferencia clave para tripulantes en vuelo)
4. **Mercado pequeño pero profundo** — Nicaragua tiene ~500-1000 tripulantes. El valor está en la expansión regional y horizontal (otros sectores con horarios quebrados)
5. **Monetización** — Freemium (1 usuario gratis) + planes por organización ($5-10/usuario/mes)
