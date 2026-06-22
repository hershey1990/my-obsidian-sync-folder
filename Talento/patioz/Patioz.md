---
tags:
  - patioz/index
---
# Patioz

Plataforma de gestión inmobiliaria para Nicaragua. Monolito Modular NestJS 11 + Supabase + BullMQ + S3.

## Navegación

| Sección | Archivo | Contenido |
|---|---|---|
| Tracking | [[Tracker]] | ADRs pendientes de copiar, Docs pendientes de publicar |
| ADRs | [[adr/00-index\|adr/]] | 17 Architecture Decision Records (001-016) |
| Docs | [[docs/Overview\|docs/]] | Documentación técnica para exportar a Outline |
| Bases | [[bd/ADRs\|bd/]] | Tablas interactivas (ADRs.base, Docs.base) |
| IA | [[AGENTS.md]] | Guía de navegación para asistentes |

## Stack

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
| **Lead** | Solicitud de un cliente para contactar a un agente o dueño. Estado: new → assigned → contacted → closed. |
| **Visita / Showing** | Cita programada para mostrar una propiedad a un cliente potencial. |
| **Agente** | Usuario con permisos para gestionar propiedades, leads y visitas. Rol del sistema. |

### ⚙️ Dominio Técnico

| Término | Definición |
|---|---|
| **Monolito Modular** | Aplicación NestJS 11 única con todos los módulos de dominio. Un solo deploy, una sola BD. |
| **Módulo NestJS** | Unidad organizativa: `module.ts` + `controller.ts` + `service.ts` + `contracts/` + `adapters/` + `dto/`. |
| **Contracts / Adapters** | `contracts/` define interfaces y DI tokens; `adapters/` implementa infraestructura concreta (Supabase, Redis, SES). |
| **Repository Pattern** | Estructura plana de módulo. Reemplazó Clean Architecture layers en ADR-012. |
| **DI Token** | Constante string (`PROPERTY_REPOSITORY`) para inyección de dependencias vía `@Inject(TOKEN)`. |
| **Adapter naming** | Convención `{implementación}-{rol}.ts`: `supabase-property.repository.ts`, `google-geocoding.provider.ts`. |
| **Supabase Auth** | Servicio de autenticación (GoTrue). Login, signup, sesiones JWT. |
| **RBAC** | Role-Based Access Control vía `@Permission(resource, action)` + `AuthorizeGuard`. |
| **JwtAuthGuard** | Guard global de NestJS que valida JWT. Endpoints públicos con `@Public()`. |
| **BullMQ** | Cola asíncrona sobre Redis. Eventos de dominio y jobs programados. |
| **Redis** | Cache + backend de BullMQ. Misma instancia para ambos usos. |
| **Sync DI** | Comunicación síncrona entre módulos: inyectar repositorio vía DI token para consultas. |
| **QueueService** | Servicio `@Global()` que publica jobs BullMQ con 3 reintentos y backoff exponencial. |
| **S3 / MinIO** | Almacenamiento compatible. MinIO en desarrollo local, Cloudflare R2 en producción. |
| **StorageModule** | Módulo `@Global()` para operaciones S3 (upload, download, delete). |
| **imgproxy-api** | Microservicio Go de procesamiento de imágenes. Redimensionado, WebP, variantes. |
| **IFileApi** | Interfaz en `files/contracts/` que abstrae operaciones de archivos. Implementación: `RemoteFileApi`. |
| **Variantes de imagen** | Resoluciones: `original`, `thumbnail`, `medium`, `full`. |
| **SES** | AWS Simple Email Service. Emails transaccionales. |
| **Twilio** | SMS y WhatsApp para notificaciones. |
| **AWS Translate** | Traducción automática ES↔EN para campos bilingües. |
| **TranslationModule** | Módulo `@Global()` con `TranslationService` y `AwsTranslateProvider`. |
| **TranslationProvider** | Interfaz `ITranslationProvider`. Permite cambiar de proveedor de traducción. |
| **LocalizedString** | Tipo `{ es?: string; en?: string }` en JSONB para campos multilingüe. |
| **fillMissing** | Auto-traduce campos `LocalizedString` cuando falta un idioma vía AWS Translate. |
| **DTO** | Data Transfer Object con decoradores `class-validator` para validación de entrada. |
| **GeoJSON** | Formato estándar para datos geográficos. Usado por `maps` con Turf.js. |
| **Jerarquía de zonas** | 5 niveles: País → Depto → Municipio → Distrito → Zona/Barrio. `parent_id` referencia al nivel superior. |
| **Preservación de geometría** | El polígono catastral local es fuente de verdad. Google nunca reemplaza el `geojson` local. |
| **Verificación espacial** | 3 chequeos: contención de centroid, ratio de áreas, solape. Determina si un polígono local matchea un place_id. |
| **Confidence (geográfico)** | high (0.4-0.95), medium (0.2-0.4\|0.95-1.3), low (fuera de rango). |
| **Geocoding inverso** | Dado un punto (lat, lng), determinar zonas contenedoras vía `turf.booleanPointInPolygon`. |
| **Reconciliación batch** | Job que fusiona duplicados geográficos: Tipo A (mismo place_id) y Tipo B (fragmentos espaciales). |
| **google_viewport** | Rectángulo de Google Place Details. Solo referencia, nunca geometría de pintado. |
| **CalendarSyncAdapter** | Contrato para sincronizar disponibilidad con calendarios externos (Google, Zoho, Outlook) vía OAuth. |
| **TDD pragmático** | Test primero cuando clarifica el contrato, después cuando es obvio. Reglas explícitas de qué testear. |
| **Coverage threshold** | ≥70% statements, ≥60% branches. Services y adapters → 100% branch coverage. |
| **createTestApp** | Factory en `test/helpers/` que botea la app NestJS con mocks de infraestructura externa. |
| **e2e HTTP tests** | Supertest contra la app completa. Validan Guards → Pipes → Controller → Response. |
| **Railway** | Plataforma de hosting. Deploy via Bitbucket Pipelines → `railway up`. |
| **Bitbucket Pipelines** | CI/CD: tests, migraciones Supabase, deploy a Railway. |

> *Actualizar este glosario cuando surja un término nuevo o quede obsoleto.*
