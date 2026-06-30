---
tags:
  - bb/index
---
# BB (bibi)

Sistema de time tracking inteligente para tripulaciones y personal con horarios fragmentados. Originalmente una PWA para tripulantes de aerolínea, evolucionando a SaaS.

- **Origen:** PWA para logging diario de horas de vuelo + generación de reportes Excel para nómina
- **Nicho inicial:** Tripulaciones aéreas (pilotos, sobrecargos) con horarios quebrados
- **Mercado expandible:** Personal part-time/full-time con turnos fragmentados (logística, salud, retail)

## Navegación

| Sección | Archivo | Contenido |
|---|---|---|
| Tracking | [[Tracker]] | ADRs y Docs pendientes |
| ADRs | [[adr/00-index\|adr/]] | Architecture Decision Records |
| Docs | [[docs/Overview\|docs/]] | Documentación técnica |
| Board | [[Board/Kanban\|Board/]] | Kanban de desarrollo |
| Bases | [[bd/ADRs\|bd/]] | Tablas interactivas |

## Stack propuesto

### Backend

| Capa | Tecnología |
|---|---|
| Framework | NestJS o Express + TypeScript |
| HTTP | REST API |
| Base de datos | PostgreSQL (Supabase) |
| Auth | Supabase Auth + JWT |
| Reportes | Generación de Excel (xlsx) |
| Hosting | Railway o DigitalOcean |

### Frontend

| Capa | Tecnología |
|---|---|
| Framework | React + Vite (o Next.js) |
| UI | Tailwind CSS |
| State | TanStack React Query + Zustand |
| PWA | Service Worker + offline support |
| Forms | React Hook Form + Zod |

---

## 📖 Glosario — Lenguaje Ubicuo

### 📌 Dominio de Time Tracking

| Término | Definición |
|---|---|
| **Tripulante / Empleado** | Usuario que registra horas trabajadas. Puede ser piloto, sobrecargo, enfermero, repartidor, etc. |
| **Check-in** | Registro de inicio de turno o jornada. Incluye hora, ubicación (opcional) y notas. |
| **Check-out** | Registro de fin de turno. Cierra el bloque de tiempo. |
| **Jornada / Turno** | Período entre check-in y check-out. |
| **Horas extra (overtime)** | Horas trabajadas por encima del umbral base. Cálculo automático según reglas configurables. |
| **Horario quebrado** | Jornada con múltiples segmentos (ej. vuelo ida, escala, vuelo vuelta). |
| **Split shift** | Turno dividido en 2+ bloques en el mismo día con pausa intermedia. |
| **Reporte mensual** | Documento Excel generado automáticamente con el desglose de horas, horas extra y totales del mes. |
| **Organización / Aerolínea** | Entidad que agrupa empleados. Configura reglas de overtime, umbrales y formato de reporte. |
| **Admin de organización** | Usuario con permisos para gestionar empleados, ver reportes y configurar reglas. |
| **Regla de overtime** | Configuración que define: umbral diario/semanal/mensual, multiplicador (1.5x, 2x), y días festivos. |

### ⚙️ Dominio Técnico

| Término | Definición |
|---|---|
| **PWA** | Progressive Web App. Instalable en el teléfono, funciona offline. |
| **Offline-first** | La app funciona sin conexión. Sincroniza datos cuando hay red. |
| **Exportación Excel** | Generación de archivos .xlsx con formato predefinido para nómina. |
| **Reglas de overtime configurables** | Motor de reglas que permite a cada organización definir sus propios umbrales y multiplicadores. |
