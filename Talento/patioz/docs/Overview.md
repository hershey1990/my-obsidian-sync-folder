---
title: Overview — Patioz
description: "Visión general de Patioz: plataforma de gestión inmobiliaria para Nicaragua"
actualizado: 2026-06-22
outline_status: publicado
outline_url:
---
# Patioz — Plataforma de Gestión Inmobiliaria

## Qué es Patioz

Plataforma de gestión de propiedades inmobiliarias para el mercado nicaragüense. Permite a agentes publicar propiedades, gestionar leads, y a compradores/inversionistas buscar inmuebles con mapa interactivo.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | NestJS 11 (Monolito Modular) |
| HTTP | Express |
| Base de datos | PostgreSQL (Supabase) |
| Auth | Supabase Auth + JWT + RBAC |
| Cola de trabajos | BullMQ + Redis |
| Archivos | S3-compatible + imgproxy-api |
| Traducción | AWS Translate |
| Emails | AWS SES |
| SMS | Twilio |
| Mapas | Google Maps API + Turf.js + Mapbox GL JS |
| CI/CD | Bitbucket Pipelines |
| Hosting | Railway |
| Frontend | Next.js 16 + Mapbox GL JS (repositorio separado) |

## Módulos del sistema

| Módulo | Propósito |
|---|---|
| Auth | Login, registro, JWT, roles y permisos RBAC |
| Properties | CRUD de propiedades inmobiliarias |
| Listings | Publicaciones y anuncios |
| Leads | Gestión de contactos y leads |
| Maps | Búsqueda y verificación geográfica en 2 fases |
| Locations | Jerarquía de zonas (País → Depto → Municipio → Distrito → Barrio) |
| Files | Upload, procesamiento y almacenamiento de archivos |
| Notifications | Emails transaccionales (SES) + SMS (Twilio) |
| Scheduling | Agendamiento de visitas y sincronización con calendarios |
| Amenities | Catálogo de amenities de propiedades |

## Cómo se comunica el sistema

- **Backend → Frontend:** API REST en `api.patioz.co/api/v1`
- **Entre módulos:** Inyección directa (consultas) + BullMQ (eventos y side effects)
- **Archivos:** Frontend → Backend → imgproxy-api → S3
- **Mapas:** Frontend → Google Autocomplete (fase 1) → Backend → Google Place Details (fase 2)

## Idiomas

Todos los contenidos se almacenan en español e inglés (JSONB bilingüe). AWS Translate completa automáticamente el idioma faltante.

## Documentación relacionada

- [Arquitectura](Arquitectura.md) — detalle técnico de módulos y patrones
- [API Reference](API%20Reference.md) — endpoints y autenticación
- [Setup Local](Setup%20Local.md) — cómo levantar el entorno de desarrollo
- [Decision Log](Decision%20Log.md) — historial de decisiones técnicas (para PM/PO)
