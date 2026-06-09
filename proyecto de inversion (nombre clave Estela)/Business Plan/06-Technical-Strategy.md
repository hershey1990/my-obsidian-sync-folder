---
section: "business-plan"
order: 6
title: "Estrategia Técnica"
status: "borrador"
---

# Estrategia Técnica

## Stack tecnológico propuesto

Basado en la experiencia del fundador (full-stack TS/React/Node.js):

### Frontend
- **Next.js 14+** (App Router, React Server Components)
- **Tailwind CSS** (diseño rápido, responsivo)
- **shadcn/ui** (componentes base)

### Backend
- **Next.js API routes** (BFF — Backend for Frontend) para MVP
- **PostgreSQL** (base de datos principal)
- **Prisma ORM** (type-safe, migrations)

### Infraestructura
- **Vercel** (hosting frontend + API, serverless)
- **Supabase** (PostgreSQL + auth + storage)
- **Uploadthing** o **Supabase Storage** (fotos de autos)

### Features clave
- **Búsqueda**: PostgreSQL全文検索 (tsvector) para MVP
- **Geolocalización**: PosGIS en Supabase o Google Maps API
- **IA para fotos**: TensorFlow.js o API de Google Cloud Vision (post-MVP)
- **Cache**: Redis (Upstash) para búsquedas frecuentes

## Arquitectura MVP (3-4 meses)

```
[Browser] → Next.js (App Router) → API Routes
                ↓
         Supabase (PostgreSQL + Auth + Storage)
```

### Database schema (core MVP)

```
users
  id, name, email, phone, role (buyer/seller/dealer), verified, avatar

dealers
  id, user_id, business_name, address, logo, years_active, plan

cars
  id, owner_id, dealer_id?, brand, model, year, version, 
  transmission, fuel, engine, traction, doors, color, 
  kilometers, price, negotiable, description, 
  condition_score, status (active/sold/pending), 
  location, created_at

car_photos
  id, car_id, url, order, section (exterior/interior/mechanical/docs)

condition_checklist
  id, car_id, category, item, score, photo_url?, notes

car_model_specs (DB de modelos para comparación)
  id, brand, model, year, engine, hp, torque, 
  fuel_consumption, dimensions, weight, features

comparisons (guardadas por usuario)
  id, user_id, primary_car_id, compared_cars[]
```

### API endpoints (MVP)

```
GET    /api/cars                    # Listar autos (búsqueda + filtros)
GET    /api/cars/:id                # Detalle del auto
POST   /api/cars                    # Publicar auto
PUT    /api/cars/:id                # Editar auto
DELETE /api/cars/:id                # Eliminar auto

GET    /api/models                  # Listar modelos (para comparación)
GET    /api/models/:id/compare/:id2 # Comparar 2 modelos

GET    /api/dealers                 # Listar dealers
GET    /api/dealers/:id             # Perfil de dealer + inventario

POST   /api/auth/register           # Registro
POST   /api/auth/login              # Login

POST   /api/contact                 # Contactar vendedor (genera lead)
```

### Páginas del frontend

```
/                          → Landing + búsqueda destacada
/cars                      → Resultados de búsqueda
/cars/:id                  → Detalle del auto
/cars/new                  → Publicar auto (auth required)
/cars/:id/edit             → Editar auto (auth required)

/compare/models/:id1/:id2  → Comparación de modelos
/compare/offers/:model     → Comparación de ofertas del mismo modelo

/dealers                   → Directorio de dealers
/dealers/:id               → Perfil de dealer + inventario

/dashboard                 → Dashboard del usuario (auth required)
/dashboard/my-cars         → Mis autos publicados
/dashboard/dealer          → Dashboard de dealer (auth required)

/auth/login
/auth/register
```

## Plan de desarrollo

| Sprint | Semanas | Entregable |
|--------|:-------:|------------|
| 1 | 1-2 | Setup: Next.js, Supabase, auth, DB schema |
| 2 | 3-4 | Catálogo de modelos + CRUD de autos |
| 3 | 5-6 | Búsqueda + filtros + página de detalle |
| 4 | 7-8 | Checklist de condición + score + fotos |
| 5 | 9-10 | Perfiles de dealer + dashboards |
| 6 | 11-12 | Comparación de modelos + ofertas |
| 7 | 13-14 | Beta cerrada + fixes + pulido |
| 8 | 15-16 | 🚀 Lanzamiento público |

## ¿Por qué este stack?

| Decisión | Por qué |
|----------|---------|
| Next.js + Supabase | El fundador ya conoce TS/React/Node.js — maximiza velocidad |
| Monolito en Next.js | Un solo deploy, simplicidad, escalable hasta ~10K usuarios |
| PostgreSQL | Datos relacionales (autos, modelos, comparaciones) |
| Sin app nativa en MVP | PWA + web responsivo llega al 95% de usuarios mobile |
| Sin IA en MVP | Se agrega en fase 2 cuando hay data |
