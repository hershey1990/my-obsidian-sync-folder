---
tags:
  - patioz/index
---
# Patioz

Plataforma de gestión inmobiliaria para Nicaragua.

- **Backend:** Monolito Modular NestJS 11 + Supabase + BullMQ + S3
- **Frontend:** Monorepo con 4 apps (Next.js + Vite) + 6 packages

## Navegación

| Sección | Archivo | Contenido |
|---|---|---|
| Tracking | [[Tracker]] | Docs pendientes de publicar en Outline |
| ADRs | [[adr/00-index\|adr/]] | 24 Architecture Decision Records (001-024) |
| Docs BE | [[docs/Overview\|docs/]] | Documentación técnica backend |
| Docs FE | [[docs/FE Overview\|docs/FE]] | Documentación técnica frontend |
| Bases | [[bd/ADRs\|bd/]] | Tablas interactivas |

## Stack

### Backend

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 |
| HTTP | Express |
| Base de datos | PostgreSQL (Supabase) |
| Auth | Supabase Auth + JWT + RBAC |
| Cola | BullMQ + Redis |
| Archivos | S3-compatible + imgproxy-api (Go) |
| Traducción | AWS Translate |
| Emails | AWS SES |
| SMS | Twilio |
| Mapas | Google Maps + Turf.js + Mapbox GL JS |
| CI/CD | Bitbucket Pipelines |
| Hosting | Railway |

### Frontend

| Capa | Tecnología |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Frameworks | Next.js 16, Vite 6 |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Server state | TanStack React Query |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| i18n | next-intl, @mapui/i18n |
| Testing | Playwright, Vitest |
| Auth | Supabase Auth (aislado por app) |

---

## 📖 Glosario — Lenguaje Ubicuo

### 📌 Dominio de Real Estate

| Término | Definición |
|---|---|
| **Propiedad / Inmueble** | Unidad inmobiliaria individual (casa, departamento, terreno, local comercial). Entidad raíz del sistema. |
| **Cliente** | Persona o entidad que usa la plataforma para buscar o gestionar propiedades |
| **Dueño / Propietario** | Titular legal del inmueble |
| **Inquilino / Arrendatario** | Persona que alquila la propiedad |
| **Contrato** | Acuerdo legal entre propietario e inquilino (arrendamiento, compra-venta) |
| **Comisión** | Porcentaje o monto fijo que cobra la plataforma por cada transacción |
| **Zona / Barrio** | Área geográfica dentro de una ciudad |
| **Polígono** | Delimitación geográfica (GeoJSON) de una zona en el mapa |
| **Listing / Publicación** | Anuncio de una propiedad disponible en la plataforma. Contiene precio, fotos, descripción, tipo de operación. |
| **Lead** | Solicitud de un cliente para contactar a un agente o dueño. Estados: new → assigned → contacted → closed. |
| **Visita / Showing** | Cita programada para mostrar una propiedad a un cliente potencial. |
| **Agente** | Usuario con permisos para gestionar propiedades, leads y visitas. Rol del sistema. |
| **Tenant / Agencia** | Entidad multi-tenant. Los agentes pertenecen a una agencia. Login requiere `tenantSlug`. |

### ⚙️ Dominio Técnico — Backend

| Término | Definición |
|---|---|
| **Monolito Modular** | Aplicación NestJS 11 única con todos los módulos de dominio. Un solo deploy, una sola BD. |
| **Módulo NestJS** | Unidad organizativa: `module.ts` + `controller.ts` + `service.ts` + `contracts/` + `adapters/` + `dto/`. |
| **Contracts / Adapters** | `contracts/` define interfaces y DI tokens; `adapters/` implementa infraestructura concreta. |
| **Repository Pattern** | Estructura plana de módulo. Reemplazó Clean Architecture layers en ADR-012. |
| **DI Token** | Constante string (`PROPERTY_REPOSITORY`) para inyección de dependencias vía `@Inject(TOKEN)`. |
| **RBAC** | Role-Based Access Control vía `@Permission(resource, action)` + `AuthorizeGuard`. |
| **JwtAuthGuard** | Guard global de NestJS que valida JWT. Endpoints públicos con `@Public()`. |
| **BullMQ** | Cola asíncrona sobre Redis. Eventos de dominio y jobs programados. |
| **Sync DI** | Comunicación síncrona entre módulos: inyectar repositorio vía DI token para consultas. |
| **QueueService** | Servicio `@Global()` que publica jobs BullMQ con 3 reintentos y backoff exponencial. |
| **S3 / MinIO** | Almacenamiento compatible. MinIO local, Cloudflare R2 producción. |
| **imgproxy-api** | Microservicio Go de procesamiento de imágenes. Redimensionado, WebP, variantes. |
| **SES** | AWS Simple Email Service. Emails transaccionales. |
| **AWS Translate** | Traducción automática ES↔EN para campos bilingües. |
| **TranslationModule** | Módulo `@Global()` con `TranslationService` y `AwsTranslateProvider`. |
| **LocalizedString** | Tipo `{ es?: string; en?: string }` en JSONB para campos multilingüe. |
| **fillMissing** | Auto-traduce campos `LocalizedString` cuando falta un idioma vía AWS Translate. |
| **GeoJSON** | Formato estándar para datos geográficos. Usado por `maps` con Turf.js. |
| **Jerarquía de zonas** | 5 niveles: País → Depto → Municipio → Distrito → Zona/Barrio. |
| **Preservación de geometría** | El polígono catastral local es fuente de verdad. Google nunca reemplaza el `geojson`. |
| **Verificación espacial** | 3 chequeos: contención de centroid, ratio de áreas, solape. |
| **Confidence (geográfico)** | high (0.4-0.95), medium (0.2-0.4\|0.95-1.3), low. |
| **TDD pragmático** | Test primero cuando clarifica el contrato, después cuando es obvio. |
| **Coverage threshold** | ≥70% statements, ≥60% branches. |

### ⚙️ Dominio Técnico — Frontend

| Término | Definición |
|---|---|
| **Monorepo** | Un solo repositorio con 4 apps y 6 packages. pnpm workspaces + Turborepo. |
| **mapui** | App pública Next.js 16. Usuarios finales y propietarios. |
| **operations** | App Vite para agentes de agencia. Wizard create-property de 14 pasos. |
| **admin** | App Vite para staff administrativo de Patioz. |
| **basement** | App Vite de showcase del design system. |
| **@mapui/ui-core** | 35 componentes presentacionales compartidos. Cero lógica de negocio. |
| **@mapui/auth** | Lógica de autenticación transversal con aislamiento por app. |
| **Contract implicit** | `services.ts` devuelve mocks hoy → `api.get()` mañana con misma firma. |
| **TanStack React Query** | Server state: caché, re-fetch, deduplicación de requests. |
| **Zustand** | Client state: stores livianas separadas por dominio. |
| **Tailwind CSS v4** | Única fuente de estilos en todas las apps. |
| **Biome** | Lint y format para JS/TS/CSS/JSON. |
| **Wizard** | Flujo guiado de 14 pasos para crear propiedades. Zustand + Zod. |
