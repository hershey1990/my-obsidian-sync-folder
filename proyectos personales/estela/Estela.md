---
tags:
  - estela/index
---
# Estela

Marketplace de autos para Nicaragua. Plataforma de compra, venta e intercambio de vehículos con verificación de condición.

- **Backend:** Laravel 11 + Supabase PostgreSQL + PostGIS + Sanctum
- **Frontend:** Monorepo Next.js 14+ con 2 apps (web + admin) + 4 packages

## Navegación

| Sección | Archivo | Contenido |
|---|---|---|
| Tracking | [[Tracker]] | ADRs y Docs pendientes |
| ADRs | [[adr/00-index\|adr/]] | Architecture Decision Records |
| Docs | [[docs/Overview\|docs/]] | Documentación técnica |
| Board | [[Board/Kanban\|Board/]] | Kanban de desarrollo (9 fases) |
| Business Plan | [[Business Plan/00-Index\|Business Plan/]] | Plan de negocios + Pitch Deck |
| Research | [[Research/]] | Investigación de mercado con fuentes |
| Bases | [[bd/ADRs\|bd/]] | Tablas interactivas |

## Stack

### Backend

| Capa | Tecnología |
|---|---|
| Framework | Laravel 11 (PHP 8.3) |
| HTTP | Laravel Sanctum (API) |
| Base de datos | Supabase PostgreSQL 15 + PostGIS |
| Auth | Laravel Sanctum + spatie/laravel-permission (RBAC) |
| ORM | Eloquent |
| Cola | Database queue driver (post-MVP: Redis/Upstash) |
| Email | Resend |
| Storage | Supabase Storage (fotos de autos) |
| Error tracking | Sentry |
| Hosting | Laravel Forge + DigitalOcean VPS |
| CI/CD | GitHub Actions |

### Frontend

| Capa | Tecnología |
|---|---|
| Monorepo | 2 apps Next.js 14+ + 4 packages |
| Framework | Next.js 14+ (App Router) |
| UI | React 18+, Tailwind CSS, shadcn/ui |
| State | TanStack Query (server), Zustand (client) |
| Forms | React Hook Form + Zod |
| Hosting | Vercel |

---

## 📖 Glosario — Lenguaje Ubicuo

### 📌 Dominio de Marketplace de Autos

| Término | Definición |
|---|---|
| **Auto / Vehículo** | Unidad listada en la plataforma. Entidad raíz del sistema. |
| **Comprador (buyer)** | Usuario que busca y contacta vendedores. |
| **Vendedor (dealer)** | Usuario con perfil profesional. Puede publicar autos y gestionar inventario. |
| **Concesionario** | Dealer con plan de pago (basic/pro). |
| **Listing / Publicación** | Anuncio de un auto con fotos, precio, descripción y condición. |
| **Condition Score** | Puntaje 1-100 basado en checklist de 4 categorías. |
| **Comparación** | Tabla lado a lado de specs de modelos. |
| **Lead / Contacto** | Solicitud de un comprador para contactar al vendedor. |
| **Favorito** | Auto guardado por el comprador para seguimiento. |
| **Admin** | Moderador del backoffice. |
| **Super-admin** | Dueño del sistema. Acceso total. |

### ⚙️ Dominio Técnico

| Término | Definición |
|---|---|
| **Clean Architecture Light** | Híbrido Clean Architecture + Service Layer. Controllers → Services → Models. |
| **BFF Proxy** | Next.js API Route que recibe requests del browser y forwardea a Laravel con httpOnly cookie. |
| **Sanctum** | Token-based auth de Laravel. Tokens via httpOnly cookies. |
| **spatie/laravel-permission** | RBAC con roles + permisos granulares. |
| **PostGIS** | Extensión espacial de PostgreSQL para consultas geográficas. |
| **tsvector** | Búsqueda full-text en español para autos. |
| **Wizard** | Flujo multi-step para publicar un auto (4 pasos). |
| **ISR** | Incremental Static Regeneration. Páginas cacheadas que se revalidan. |
