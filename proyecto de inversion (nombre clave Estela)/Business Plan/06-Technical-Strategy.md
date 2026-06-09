---
section: "business-plan"
order: 6
title: "Estrategia Técnica"
status: "borrador"
---

# Estrategia Técnica

## Stack tecnológico

### Frontend (ver ADR-003 para arquitectura detallada)
- **Next.js 14+** (App Router, React Server Components)
- **Tailwind CSS** + **shadcn/ui**
- Hosting: **Vercel** (serverless)
- Mapas (post-MVP): **Leaflet** + **OpenStreetMap**

### Backend
- **Laravel 11** (PHP 8.3)
- ORM: **Eloquent**
- Auth: **Sanctum** (token-based, vía BFF Proxy)
- Colas: **Database driver** (jobs table)
- Tests: **Pest**

### Base de Datos
- **Supabase PostgreSQL 15** + **PostGIS**
- DB as a Service (plan Pro: 8GB RAM, 100GB storage)
- Búsqueda: **PostgreSQL tsvector** (índice GIN en Spanish)
- Ubicación: **GEOGRAPHY(Point, 4326)** con índice GIST

### Storage
- **Supabase Storage** (100GB incluidos en plan Pro)
- Imágenes: Frontend → Laravel → Supabase (validación en backend)

### Infraestructura
| Servicio | Uso | Costo |
|----------|-----|-------|
| Vercel Pro | Frontend hosting | $20/mo |
| Laravel Forge + DO VPS | Backend API (USA) | $24/mo |
| Supabase Pro | PostgreSQL + PostGIS + Storage | $25/mo |
| Resend | Email transaccional | $0-20/mo |
| Sentry | Error tracking | $0/mo |
| Upstash Redis | Cache (post-MVP) | $0-5/mo |
| GitHub Actions | CI/CD (lint + tests) | $0/mo |
| **Total** | | **~$55-80/mo** |

## Arquitectura General

```
[Browser] → Next.js (Vercel)
              │
              │ BFF Proxy (httpOnly cookie con Sanctum token)
              ▼
         Laravel API (Forge + DO VPS)
              │
              ├──→ Supabase PostgreSQL + PostGIS
              ├──→ Supabase Storage (fotos)
              ├──→ Resend (emails)
              └──→ Nominatim (geocoding)
```

### Patrón: Clean Architecture Light

```
app/
  Domain/           ← Eloquent Models, Value Objects, Enums
  Application/      ← Services (Use Cases con lógica de negocio)
  Infrastructure/   ← Repositories (queries complejas), External APIs
  Presentation/     ← Controllers, Form Requests, API Resources
```

Ver `Decisiones/ADR-002-Arquitectura-Stack.md` para la estructura completa de carpetas.

## Database Schema

```sql
-- Extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    phone       VARCHAR(20),
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'buyer',
    avatar      TEXT,
    verified_at TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dealers (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id),
    business_name VARCHAR(255) NOT NULL,
    address       TEXT,
    logo          TEXT,
    years_active  INT DEFAULT 0,
    plan          VARCHAR(20) DEFAULT 'free',
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cars (
    id              BIGSERIAL PRIMARY KEY,
    owner_id        BIGINT NOT NULL REFERENCES users(id),
    dealer_id       BIGINT REFERENCES dealers(id),
    brand           VARCHAR(100) NOT NULL,
    model           VARCHAR(100) NOT NULL,
    year            INT NOT NULL,
    version         VARCHAR(100),
    transmission    VARCHAR(20) NOT NULL,
    fuel            VARCHAR(20) NOT NULL,
    engine          VARCHAR(100),
    traction        VARCHAR(20),
    doors           INT,
    color           VARCHAR(50),
    kilometers      INT NOT NULL,
    price           DECIMAL(12,2) NOT NULL,
    negotiable      BOOLEAN DEFAULT TRUE,
    description     TEXT,
    condition_score INT CHECK (condition_score BETWEEN 1 AND 100),
    status          VARCHAR(20) DEFAULT 'active',
    location        GEOGRAPHY(Point, 4326),
    city            VARCHAR(100),
    department      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Full-text search index
ALTER TABLE cars ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (to_tsvector('spanish',
        coalesce(brand,'') || ' ' || coalesce(model,'') || ' ' || coalesce(description,'')
    )) STORED;
CREATE INDEX idx_cars_search ON cars USING GIN(search_vector);

-- Spatial index
CREATE INDEX idx_cars_location ON cars USING GIST(location);

CREATE TABLE car_photos (
    id       BIGSERIAL PRIMARY KEY,
    car_id   BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    url      TEXT NOT NULL,
    order    INT DEFAULT 0,
    section  VARCHAR(20)
);

CREATE TABLE condition_checklist (
    id       BIGSERIAL PRIMARY KEY,
    car_id   BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    item     VARCHAR(255) NOT NULL,
    score    INT CHECK (score BETWEEN 1 AND 5),
    photo_url TEXT,
    notes    TEXT
);

CREATE TABLE car_model_specs (
    id              BIGSERIAL PRIMARY KEY,
    brand           VARCHAR(100) NOT NULL,
    model           VARCHAR(100) NOT NULL,
    year            INT NOT NULL,
    engine          VARCHAR(100),
    hp              INT,
    torque          INT,
    fuel_consumption DECIMAL(5,2),
    dimensions      VARCHAR(255),
    weight          INT,
    features        JSONB,
    UNIQUE(brand, model, year)
);

CREATE TABLE comparisons (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id),
    primary_car_id BIGINT NOT NULL REFERENCES cars(id),
    compared_cars BIGINT[] NOT NULL DEFAULT '{}',
    created_at   TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

```
Base: /api/v1

# Auth
POST   /api/v1/auth/register        → Register
POST   /api/v1/auth/login           → Login (devuelve token Sanctum)
POST   /api/v1/auth/logout          → Revocar token
GET    /api/v1/auth/me              → Perfil actual

# Cars
GET    /api/v1/cars                 → Listar + buscar + filtrar (PostGIS + tsvector)
GET    /api/v1/cars/{car}           → Detalle con fotos + checklist
POST   /api/v1/cars                 → Publicar (encola geocoding)
PUT    /api/v1/cars/{car}           → Editar
DELETE /api/v1/cars/{car}           → Eliminar / marcar vendido

# Models
GET    /api/v1/models               → Catálogo (marca, modelo, año)
GET    /api/v1/models/{model}       → Specs detalladas
GET    /api/v1/models/{model}/offers → Listings activos de ese modelo

# Dealers
GET    /api/v1/dealers              → Listar dealers
GET    /api/v1/dealers/{dealer}     → Perfil + inventario

# Contact
POST   /api/v1/contact              → Contactar vendedor (lead + email)

# Search
GET    /api/v1/search/suggestions   → Autocomplete (marca/modelo)
```

### Response format
```json
// Lista
{ "data": [...], "meta": { "current_page": 1, "per_page": 20, "total": 150, "last_page": 8 } }

// Recurso individual
{ "data": { ... } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": { "field": ["msg"] } } }
```

## Auth Flow (BFF Proxy)

```
Browser → Next.js API Route → Laravel API

1. Login: POST /api/auth/login (Next.js)
   → Next.js proxy a POST /api/v1/auth/login (Laravel)
   → Laravel devuelve Sanctum token
   → Next.js guarda en httpOnly cookie

2. Cada request autenticado:
   → Next.js lee httpOnly cookie
   → Adjunta Authorization: Bearer {token}
   → Forward a Laravel

3. Logout: Next.js llama a Laravel → revoca token → elimina cookie
```

## Jobs (Queue)

| Job | Trigger | Driver |
|-----|---------|--------|
| `GeocodeCarLocation` | Al crear/actualizar auto | Database |
| `SendContactNotification` | Al enviar contacto | Database |

Queue driver: **Database** (simple, sin Redis). Migrar a Redis si el volumen lo requiere.

## Plan de desarrollo (4 meses + buffer)

| Sprint | Semanas | Backend | Frontend |
|--------|:-------:|---------|----------|
| 1 | 1-2 | Setup: Laravel + Forge + Supabase + DB schema + migrations | Setup: Next.js + Tailwind + shadcn/ui + diseño system |
| 2 | 3-4 | Auth (Sanctum + Register/Login), CRUD Cars + Photos + Checklist | Auth pages, Landing, formulario publicar auto |
| 3 | 5-6 | Búsqueda tsvector + filtros + PostGIS, CarQueryRepository, Geocoding job | Página de resultados + detalle del auto |
| 4 | 7-8 | Condition Score Service, Model Specs CRUD, Comparación de modelos | Checklist UI + score visual, comparación de modelos |
| 5 | 9-10 | Dealer profiles + planes, Dashboard endpoints | Perfiles dealer, dashboard usuario |
| 6 | 11-12 | Contact system + email jobs, SearchService polishing | Contactar vendedor, dashboard dealer |
| 7 | 13-14 | Beta: fixes, performance, logs, Sentry | Beta: polish UX/UI, responsive |
| 8 | 15-16 | 🚀 Lanzamiento público | 🚀 Lanzamiento público |
| _9_ | _17-20_ | _Buffer: fixes post-lanzamiento, features críticas pendientes_ | _Buffer: polish, correcciones_ |

> **Nota:** El plan es de 4 meses (16 semanas) con 1 mes de buffer. Si el MVP está listo en semana 16, se lanza. Si necesita ajustes, el buffer evita retrasar el launch público.

## Decisiones técnicas clave

| Decisión | Por qué |
|----------|---------|
| **Laravel + Eloquent** | Preferencia del fundador, madurez del ecosistema, Eloquent es productivo |
| **Next.js en frontend** | Lo que el equipo conoce de TS/React, server components para SEO |
| **Supabase (no Neon)** | DB + Storage + PostGIS en un solo servicio por $25/mo. Neon requeriría storage aparte |
| **Clean Architecture Light** | Estructura suficiente para equipo de 7 sin el overhead de Clean puro |
| **BFF Proxy** | Auth seguro con httpOnly cookies a pesar de dominios distintos (Vercel + DO) |
| **PostGIS desde MVP** | Guardar ubicación desde el día 1; mapas se habilitan cuando toque sin migración de datos |
| **Sin app nativa en MVP** | PWA + web responsivo cubre el 95% de usuarios mobile en Nicaragua |
| **Sin IA en MVP** | Se agrega en fase 2 (detección de daños en fotos, score automático) |
| **Queue con Database** | Suficiente para volumen MVP, sin depender de Redis |
