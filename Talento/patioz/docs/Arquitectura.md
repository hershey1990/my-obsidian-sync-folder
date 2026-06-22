---
title: "Arquitectura de Patioz"
description: "Arquitectura general del sistema Patioz: Monolito Modular NestJS 11 + Supabase + BullMQ + S3"
actualizado: 2026-06-22
---
# Arquitectura de Patioz

## Visión General

Patioz es una plataforma de gestión inmobiliaria para el mercado nicaragüense. El backend es un **Monolito Modular** construido con NestJS 11 que contiene todos los módulos de dominio en una sola aplicación desplegable.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 (`@nestjs/core`) |
| HTTP | Express (`@nestjs/platform-express`) |
| Base de datos | PostgreSQL (Supabase) |
| Auth | Supabase Auth + JWT (Passport) + RBAC |
| Cola de trabajos | BullMQ + Redis |
| Cache | Redis (ioredis) |
| File storage | S3-compatible (MinIO local / R2 producción) |
| Procesamiento de imágenes | imgproxy-api (Go) |
| Traducción | AWS Translate |
| Emails | AWS SES |
| SMS | Twilio |
| Mapas | Google Maps API + Turf.js |
| Mapas (frontend) | Mapbox GL JS |
| CI/CD | Bitbucket Pipelines |
| Hosting | Railway |

## Estructura de Módulos

Cada módulo de dominio sigue el Repository Pattern con estructura plana:

```
modules/{name}/
├── {name}.module.ts
├── {name}.controller.ts
├── {name}.service.ts
├── types.ts
├── dto/
├── contracts/
└── adapters/
```

### Módulos del sistema

| Módulo | Propósito |
|---|---|
| `auth` | Autenticación JWT, guards, decoradores, RBAC |
| `properties` | CRUD de propiedades inmobiliarias |
| `listings` | Publicaciones y anuncios |
| `leads` | Gestión de leads y contactos |
| `maps` | Búsqueda y verificación geográfica |
| `locations` | Jerarquía de zonas (5 niveles) |
| `files` | Upload y gestión de archivos |
| `notifications` | Emails (SES) + SMS (Twilio) |
| `amenities` | Catálogo de amenities |
| `property-types` | Tipos de propiedad |
| `health` | Health checks de dependencias |

## Comunicación entre Módulos

- **Síncrono:** Inyección directa de repositorios vía DI tokens para consultas
- **Asíncrono:** BullMQ vía `QueueService.publish()` para side effects y notificaciones

## i18n

Todos los campos de texto usan JSONB bilingüe (`{ es, en }`). AWS Translate auto-completa el idioma faltante en escritura vía `TranslationService.fillMissing()`.

## ADRs

Las decisiones arquitectónicas están documentadas en `adr/`. Ver `adr/00-index.md` para el índice completo.
