---
tipo: adr
fecha: 2026-06-09
estado: aceptado
proyecto: estela-be
implementado: pendiente
decision: "Laravel 11 + Supabase PostgreSQL + Next.js 14+ con Clean Architecture Light"
tags:
  - adr
  - estela
  - arquitectura
  - backend
  - stack
---
# ADR-002: Arquitectura de Software Stack

## Contexto
Se requiere definir la arquitectura de software para el Marketplace de Autos (Proyecto Estela) que permita a un equipo de 7 personas construir y escalar el producto. Las decisiones deben balancear velocidad de desarrollo inicial con capacidad de escalar sin reescribir.

## Stack tecnológico

### Frontend
- **Next.js 14+** (App Router, React Server Components)
- **Tailwind CSS + shadcn/ui**
- Hosting: **Vercel** (serverless)
- *Nota: La arquitectura detallada del frontend se cubre en ADR-003*

### Backend
- **Laravel 11** (PHP 8.3)
- ORM: **Eloquent**
- Hosting: **Laravel Forge + DigitalOcean VPS** (USA)
- Auth: **Laravel Sanctum** (tokens, vía BFF Proxy)

### Base de datos
- **Supabase PostgreSQL 15** + **PostGIS**
- DB as a Service (plan Pro: 8GB RAM, 100GB storage)
- Incluye Storage para fotos de autos (Supabase Storage, 100GB)

### Infraestructura adicional
| Servicio | Propósito | Costo |
|----------|-----------|-------|
| **Supabase Pro** | DB + PostGIS + Storage | $25/mo |
| **Vercel Pro** | Frontend hosting | $20/mo |
| **Forge + DO** | Backend VPS (USA) | $24/mo |
| **Resend** | Email transaccional | $0-20/mo |
| **Sentry** | Error tracking | $0/mo (free) |
| **Upstash Redis** | Cache (post-MVP) | $0-5/mo |
| **GitHub** | Repositorio + CI/CD | $0/mo (free) |
| **Total** | | **~$55-80/mo** |

## Decisión arquitectónica: Clean Architecture Light

Se opta por un híbrido entre Clean Architecture y Service Layer, denominado **Clean Architecture Light**:

```
┌──────────────────────────────────────────┐
│           Presentation/                   │
│  Controllers, Requests, Resources         │
│  (Solo orquestan HTTP → delegan)          │
└──────────────────┬───────────────────────┘
                   │ llama
┌──────────────────▼───────────────────────┐
│           Application/                     │
│  Services (Use Cases)                     │
│  Lógica de negocio, orquestación          │
└──────────────────┬───────────────────────┘
                   │ usa
┌──────────────────▼───────────────────────┐
│           Domain/                          │
│  Eloquent Models, Value Objects, Enums    │
│  Reglas de dominio, relaciones            │
└──────────────────┬───────────────────────┘
                   │ queries complejas
┌──────────────────▼───────────────────────┐
│        Infrastructure/                     │
│  Repositories (solo búsqueda/reportes)    │
│  External APIs (Nominatim, Supabase)      │
└──────────────────────────────────────────┘
```

### ¿Por qué no Clean Architecture puro?
- El equipo conoce Eloquent y no vamos a cambiar de ORM
- Las interfaces para repositorios serían código muerto
- Los DTOs para cada request duplican Form Requests
- Se prioriza velocidad sobre abstracción

### ¿Por qué no Service Layer plano?
- Equipo de 7 personas necesita boundaries claros
- 2 backends trabajando en paralelo requieren separación por contexto
- Los juniors necesitan saber exactamente dónde poner cada cosa
- Value Objects protegen reglas de dominio (Price, ConditionScore, Location)

## Estructura de carpetas (Backend)

```
app/
  Domain/
    Cars/
      Car.php, CarPhoto.php, ConditionChecklist.php  → Eloquent Models
      ValueObjects/
        ConditionScore.php    → 1-100 inmutable con breakdown
        Price.php             → Money value object
        Location.php          → PostGIS Point wrapper
        Kilometers.php        → Entero positivo
      Enums/
        CarStatus.php         → active, sold, pending
        TransmissionType.php  → manual, automatic, cvt
        FuelType.php          → gasoline, diesel, electric, hybrid
        ConditionCategory.php → exterior, interior, mechanical, docs
    Users/
      User.php, Dealer.php    → Eloquent Models
      ValueObjects/
        PhoneNumber.php       → Formateado + validado
      Enums/
        UserRole.php          → buyer, seller, dealer, admin
    Models/
      CarModelSpec.php        → Eloquent Model (catálogo precargado)
      Comparison.php          → Eloquent Model

  Application/
    Cars/
      PublishCarService.php        → Validar + crear + geocode encolado
      SearchCarsService.php        → Búsqueda con filtros y PostGIS
      CompareModelsService.php     → Comparación specs lado a lado
      CalculateScoreService.php    → Ponderar checklist → score 1-100
    Users/
      RegisterUserService.php      → Crear usuario + asignar role
      LoginService.php             → Autenticar + emitir token Sanctum
    Contact/
      ContactSellerService.php     → Guardar lead + notificar vía email
    Shared/
      GeocodingService.php         → Nominatim HTTP + coordenadas

  Infrastructure/
    Persistence/
      CarQueryRepository.php       → Queries complejas: PostGIS + tsvector + filtros
    External/
      SupabaseStorage.php          → Upload imágenes (Frontend → Laravel → Supabase)
      NominatimGeocoder.php        → Cliente HTTP para geocoding
    Queue/
      GeocodeCarLocation.php       → Job: convertir address → Point
      SendContactNotification.php  → Job: email al vendedor

  Presentation/
    Http/
      Controllers/Api/V1/
        AuthController.php
        CarController.php
        ModelController.php
        DealerController.php
        SearchController.php
        ContactController.php
      Requests/
        StoreCarRequest.php
        UpdateCarRequest.php
        SearchCarRequest.php
        ContactSellerRequest.php
        RegisterUserRequest.php
      Resources/
        CarResource.php
        CarCollection.php
        DealerResource.php
        ModelResource.php
```

## Database Schema

```sql
-- migrations

-- Extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- users
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    phone       VARCHAR(20),
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'buyer', -- buyer, seller, dealer, admin
    avatar      TEXT,
    verified_at TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- dealers
CREATE TABLE dealers (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id),
    business_name VARCHAR(255) NOT NULL,
    address       TEXT,
    logo          TEXT,
    years_active  INT DEFAULT 0,
    plan          VARCHAR(20) DEFAULT 'free', -- free, basic, pro
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

-- cars
CREATE TABLE cars (
    id              BIGSERIAL PRIMARY KEY,
    owner_id        BIGINT NOT NULL REFERENCES users(id),
    dealer_id       BIGINT REFERENCES dealers(id),
    brand           VARCHAR(100) NOT NULL,
    model           VARCHAR(100) NOT NULL,
    year            INT NOT NULL,
    version         VARCHAR(100),
    transmission    VARCHAR(20) NOT NULL,  -- manual, automatic, cvt
    fuel            VARCHAR(20) NOT NULL,  -- gasoline, diesel, electric, hybrid
    engine          VARCHAR(100),
    traction        VARCHAR(20),
    doors           INT,
    color           VARCHAR(50),
    kilometers      INT NOT NULL,
    price           DECIMAL(12,2) NOT NULL,
    negotiable      BOOLEAN DEFAULT TRUE,
    description     TEXT,
    condition_score INT CHECK (condition_score BETWEEN 1 AND 100),
    status          VARCHAR(20) DEFAULT 'active', -- active, sold, pending
    location        GEOGRAPHY(Point, 4326),       -- PostGIS
    city            VARCHAR(100),
    department      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Index for full-text search
ALTER TABLE cars ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(brand,'') || ' ' || coalesce(model,'') || ' ' || coalesce(description,''))) STORED;
CREATE INDEX idx_cars_search ON cars USING GIN(search_vector);

-- Index for PostGIS spatial queries
CREATE INDEX idx_cars_location ON cars USING GIST(location);

-- car_photos
CREATE TABLE car_photos (
    id       BIGSERIAL PRIMARY KEY,
    car_id   BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    url      TEXT NOT NULL,
    order    INT DEFAULT 0,
    section  VARCHAR(20) -- exterior, interior, mechanical, docs
);

-- condition_checklist
CREATE TABLE condition_checklist (
    id       BIGSERIAL PRIMARY KEY,
    car_id   BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,  -- exterior, interior, mechanical, docs
    item     VARCHAR(255) NOT NULL,
    score    INT CHECK (score BETWEEN 1 AND 5),
    photo_url TEXT,
    notes    TEXT
);

-- car_model_specs (catálogo precargado para comparación)
CREATE TABLE car_model_specs (
    id              BIGSERIAL PRIMARY KEY,
    brand           VARCHAR(100) NOT NULL,
    model           VARCHAR(100) NOT NULL,
    year            INT NOT NULL,
    engine          VARCHAR(100),
    hp              INT,
    torque          INT,
    fuel_consumption DECIMAL(5,2), -- km/l
    dimensions      VARCHAR(255),
    weight          INT,
    features        JSONB,
    UNIQUE(brand, model, year)
);

-- comparisons (guardadas por usuario)
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
POST   /api/v1/auth/register        → RegisterUserService
POST   /api/v1/auth/login           → LoginService (returns Sanctum token)
POST   /api/v1/auth/logout          → Revoke token
GET    /api/v1/auth/me              → Current user profile

# Cars
GET    /api/v1/cars                 → SearchCarsService (filtros, PostGIS, tsvector)
GET    /api/v1/cars/{car}           → Car detail with photos + checklist
POST   /api/v1/cars                 → PublishCarService (encola geocoding)
PUT    /api/v1/cars/{car}           → Update car
DELETE /api/v1/cars/{car}           → Soft delete / mark sold

# Models (catálogo)
GET    /api/v1/models               → List models (marca, modelo, año)
GET    /api/v1/models/{model}       → Specs detalladas
GET    /api/v1/models/{model}/offers → Active listings for that model

# Dealers
GET    /api/v1/dealers              → List dealers
GET    /api/v1/dealers/{dealer}     → Dealer profile + inventory

# Contact
POST   /api/v1/contact              → ContactSellerService (lead + email)

# Search helpers
GET    /api/v1/search/suggestions   → Autocomplete (brand, model)
```

### Formato de respuesta consistente
```json
// Éxito (lista)
{
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  }
}

// Éxito (recurso individual)
{
  "data": { ... }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descripción legible",
    "details": { "field": ["error msg"] }
  }
}
```

## Auth Flow (BFF Proxy)

```
[Browser] → Next.js (Vercel) → API Route (BFF) → Laravel API (DO)

1. User login en Next.js: POST /api/auth/login
   → Next.js API route hace POST a Laravel /api/v1/auth/login
   → Laravel valida credenciales, devuelve Sanctum token
   → Next.js guarda token en httpOnly cookie (secure, same-site=lax)

2. Cada request del frontend a Laravel:
   → Next.js API route lee httpOnly cookie
   → Adjunta Authorization: Bearer {token}
   → Forward al endpoint de Laravel
   → Devuelve respuesta al browser

3. Logout:
   → Next.js API route llama a POST /api/v1/auth/logout
   → Laravel revoca token
   → Next.js elimina cookie
```

## Job Queue

| Job | Disparador | Propósito |
|-----|-----------|-----------|
| `GeocodeCarLocation` | After car created/updated | Convertir city+department → Point (lat,lng) vía Nominatim |
| `SendContactNotification` | After contact form submitted | Email al vendedor con datos del comprador |

Queue driver: **Database** (tabla `jobs`). Suficiente para volumen MVP. Migrar a Redis si escala.

## Testing (Pest)

- **Unit tests**: Value Objects, Services (lógica pura)
- **Feature tests**: API endpoints con HTTP assertions
- **Database tests**: SQLite in-memory o PostgreSQL test

Estructura:
```
tests/
  Unit/
    Domain/
      Cars/
        ConditionScoreTest.php
        PriceTest.php
    Application/
      Cars/
        CalculateScoreServiceTest.php
  Feature/
    Api/
      V1/
        CarControllerTest.php
        AuthControllerTest.php
  Pest.php
```

## Consecuencias

1. **Dos deploys** — Frontend en Vercel, Backend en Forge/DO. Se requiren dos pipelines CI/CD separados.
2. **Latencia red** — Next.js → Laravel agrega ~20-50ms vs monolito. Aceptable para MVP.
3. **Clean Architecture Light** — Balance entre velocidad y estructura para equipo de 7.
4. **Costo mensual ~$55-80** — Escalable: DO VPS se upgradea según demanda, Supabase se escala.
5. **Frontend architecture pendiente** — Se documenta en ADR-003.
6. **PostGIS listo** — Ubicación de autos almacenada desde MVP, mapas se habilitan en frontend cuando se necesiten.
7. **TypeScript types** — No hay tipos compartidos automáticos entre Laravel y Next.js. Se escriben interfaces a mano o se genera desde OpenAPI (post-MVP con Scribe/L5-Swagger).
