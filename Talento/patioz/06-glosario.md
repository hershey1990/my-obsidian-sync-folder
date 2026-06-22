---
tags:
  - patioz/glosario
actualizado: 2026-06-22
---
# 📖 Glosario de Patioz — Lenguaje Ubicuo

## 📌 Dominio de Real Estate

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
| **Visita / Showing** | Cita programada para mostrar una propiedad a un cliente potencial. Se agenda entre un agente y un cliente. |
| **Agente** | Usuario con permisos para gestionar propiedades, leads y visitas. Rol del sistema. |

## ⚙️ Dominio Técnico

| Término | Definición |
|---|---|
| **Monolito Modular** | Aplicación NestJS 11 única que contiene todos los módulos de dominio (auth, properties, listings, leads, maps, files, notifications, locations). Un solo deploy, una sola BD. |
| **Módulo NestJS** | Unidad organizativa del monolite: `module.ts` + `controller.ts` + `service.ts` + `contracts/` + `adapters/` + `dto/`. Cada módulo representa un contexto delimitado. |
| **Contracts / Adapters** | Patrón de puertos y adaptadores: `contracts/` define interfaces y DI tokens; `adapters/` implementa la infraestructura concreta (Supabase, Redis, SES, etc.). |
| **Supabase Auth** | Servicio de autenticación de Supabase (GoTrue). Maneja login, signup, sesiones JWT. Se integra con el módulo `auth` del monolite. |
| **RBAC** | Role-Based Access Control. Implementado via `@Permission(resource, action)` + `AuthorizeGuard`. Los permisos se verifican contra el microservicio `auth` remoto. |
| **JwtAuthGuard** | Guard global de NestJS que valida el JWT en cada request. Endpoints públicos se marcan con `@Public()`. |
| **BullMQ** | Cola de mensajería asíncrona sobre Redis. Reemplazó a QStash. Se usa para eventos de dominio (listing.created, lead.assigned) y jobs programados (recordatorios). |
| **Supabase (BD)** | PostgreSQL administrado. Contiene todo el schema del monolite en `public`. Migraciones con `supabase migration`. |
| **Redis** | Cache (sesiones, disponibilidad) + backend de BullMQ. Misma instancia para ambos usos. |
| **MinIO** | Almacenamiento S3-compatible para desarrollo local. En producción se usa Cloudflare R2 o AWS S3. |
| **imgproxy-api** | Microservicio externo de procesamiento de imágenes. El monolite le delega upload, redimensionado y generación de variantes. |
| **Railway** | Plataforma de hosting del monolite. Deploy via Bitbucket Pipelines → `railway up`. |
| **Bitbucket Pipelines** | CI/CD del proyecto. Corre tests, migraciones de Supabase y deploy a Railway. |
| **SES** | AWS Simple Email Service. Envío de emails transaccionales (confirmaciones, recordatorios, notificaciones). |
| **Twilio** | Servicio de SMS y WhatsApp. Notificaciones al cliente via `TemplateNotificationService`. |
| **MapUI** | Frontend principal con mapa interactivo. Consume la API del monolite en `/api/v1/*`. |
| **GeoJSON** | Formato estándar para datos geográficos (polígonos, puntos, líneas). Usado por el módulo `maps` con Turf.js. |
| **maps module** | Módulo NestJS del monolite que expone endpoints REST para polígonos, geocoding fallback y consultas geográficas con Turf.js. Cachea polígonos frecuentes en Redis. |
| **locations module** | Módulo NestJS del monolite que gestiona coordenadas de propiedades y entidades. Tabla `locations` con datos geográficos en JSONB. |
| **Jerarquía de zonas** | Estructura de 5 niveles: País(1) → Departamento(2) → Municipio(3) → Distrito(4) → Zona/Barrio(5). Cada nivel tiene un `parent_id` que referencia al nivel superior. |
| **Preservación de geometría** | Principio arquitectónico: el polígono catastral local es la fuente de verdad geográfica. Google nunca reemplaza el `geojson` local, solo ajusta metadatos de verificación (verified, confidence, verifiedAt). |
| **Verificación espacial** | Algoritmo de 3 chequeos encadenados (contención de centroid, ratio de áreas, solape) que determina si un polígono local corresponde a un place_id de Google. |
| **Confidence (geográfico)** | Nivel de confianza de verificación: high (0.4-0.95 ratio), medium (0.2-0.4\|0.95-1.3), low (fuera de rango o centroid no contenido). |
| **Geocoding inverso** | Dado un punto (lat, lng), determinar en qué zona(s) de la jerarquía se encuentra usando turf.booleanPointInPolygon. Endpoint: `GET /locations/containing`. |
| **Reconciliación batch** | Job administrativo que detecta y fusiona duplicados geográficos: Tipo A (mismo google_place_id) y Tipo B (fragmentos espaciales contiguos fusionables vía turf.union). |
| **google_viewport** | Rectángulo de encuadre devuelto por Google Place Details (north, south, east, west). Se almacena solo como referencia, nunca como geometría de pintado. |
| **DTO** | Data Transfer Object. Clase con decoradores `class-validator` que define y valida la estructura de entrada de cada endpoint. |
| **LocalizedString** | Tipo `{ es?: string; en?: string }` usado para todos los campos multilingüe (títulos, descripciones). Almacenado como JSONB en PostgreSQL. |

> *Actualizar este glosario cada vez que surja un término nuevo del dominio o del sistema, o cuando un término quede obsoleto.*
