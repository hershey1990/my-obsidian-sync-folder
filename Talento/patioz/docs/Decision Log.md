---
title: "Decision Log — Patioz"
description: "Historial de decisiones técnicas y su impacto en el producto (para PM, PO y stakeholders)"
actualizado: 2026-06-22
outline_status: pendiente
outline_url: null
---
# Decision Log

Historial curado de decisiones arquitectónicas. Cada decisión explica **qué se decidió**, **por qué** y **cómo impacta al producto**. Los ADRs completos están en el repositorio de código.

## Decisiones activas

| ADR | Decisión | Por qué | Impacto en producto |
|---|---|---|---|
| **006** | Monolito Modular + BullMQ | Microservicios eran demasiado complejos para el equipo actual (2 devs). Un solo deploy, un solo repo. | Features salen más rápido. Onboarding de devs nuevos en días, no semanas. |
| **007** | Auth integrada con Supabase | Integridad referencial real entre usuarios, roles y permisos. Sin servicio separado. | Login, registro y permisos funcionan en el mismo sistema. Menos puntos de falla. |
| **008** | Emails con AWS SES + Zoho | SES para envío transaccional (~$0.10/1000 emails). Zoho para recibir correos (admin@, noreply@). | Emails de confirmación, recuperación de contraseña y notificaciones sin costo significativo. |
| **009** | Scheduling in-house | No depender de cal.com ni APIs externas de agenda. Control total del flujo de visitas. | Agendamiento de visitas integrado en la plataforma. Sincronización con Google/Zoho Calendar. |
| **010** | NestJS 11 | DI nativa, guards reutilizables, soporte BullMQ, validación declarativa. Fastify era más rápido pero sin estructura. | Código consistente en todos los módulos. Un dev nuevo entiende cualquier módulo en minutos. |
| **011** | Mapas en 2 fases | Separar autocomplete (gratis, frontend) de verificación (paga, backend bajo demanda). | Mapa interactivo con búsqueda por barrio/zona. Costo controlado: ~$85/mes en Google Maps. |
| **012** | Repository Pattern (contracts/adapters) | Las capas Clean Architecture eran excesivas para CRUD. Estructura plana es más navegable. | Menos archivos por feature, onboarding más rápido. |
| **013** | Comunicación dual: Sync DI + Async BullMQ | Consultas entre módulos son directas (sin overhead). Side effects son asíncronos (tolerantes a fallos). | Notificaciones, emails y procesamiento no bloquean la respuesta al usuario. |
| **014** | JSONB bilingüe + AWS Translate | Nicaragua (español) + inversionistas internacionales (inglés). Traducción automática sin fricción. | Plataforma disponible en 2 idiomas. El usuario escribe en su idioma y el sistema completa el otro. |
| **015** | Archivos: S3 + imgproxy-api | Procesar imágenes en Node.js bloquearía la API. imgproxy-api (Go) es especializado. | Upload de imágenes con redimensionado automático. Sin impacto en performance de la API. |
| **016** | TDD pragmático | Sin tests, cada deploy es ansioso. Con tests, CI bloquea regresiones antes de producción. | Menos bugs en producción. Deploys con confianza. Devs nuevos no rompen funcionalidad existente sin saberlo. |

## Decisiones reemplazadas

| ADR | Decisión original | Reemplazada por | Razón |
|---|---|---|---|
| **001** | Microservicios | ADR-006 | Demasiado complejo para 2 devs. Múltiples repos, pipelines y deploys. |
| **002** | Fastify como BFF | ADR-010 | Sin DI nativa, sin guards, sin sistema de módulos. NestJS resolvió todo esto. |
| **003** | Auth como servicio NestJS separado | ADR-007 | Integridad referencial débil (sin FKs reales entre servicios). |
| **004** | Next.js + Leaflet | ADR-011 | Leaflet usa raster tiles, sin rotación. Mapbox GL JS ofrece vector tiles y mejor calidad visual. |
| **005** | QStash para mensajería | ADR-006 | Servicio externo con costo. BullMQ sobre Redis es interno y sin costo adicional. |
