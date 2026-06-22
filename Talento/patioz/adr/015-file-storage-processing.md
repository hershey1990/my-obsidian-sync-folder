---
tipo: adr
fecha: 2026-06-22
estado: aceptado
decision: "Almacenamiento de archivos en S3-compatible + delegación de procesamiento a imgproxy-api como servicio externo"
proyecto: patioz-be
sync_backend: pendiente
sync_frontend: no_aplica
tags:
  - adr
---
# ADR-015: Arquitectura de Almacenamiento y Procesamiento de Archivos

## Contexto

Patioz necesita gestionar archivos (principalmente imágenes de propiedades y listings) con los siguientes requisitos:

1. **Upload** de imágenes desde el frontend (multipart/form-data)
2. **Procesamiento** — redimensionado, generación de variantes (thumbnail, medium, full), conversión de formato (WebP)
3. **Almacenamiento** duradero y escalable
4. **Serving** — URLs públicas o firmadas para consumo en el frontend

El monolite NestJS (ADR-010) no debe procesar imágenes en su propio runtime por las siguientes razones:

- **CPU-bound:** el procesamiento de imágenes (redimensionado, re-encoding) es intensivo en CPU y bloquearía el event loop de Node.js
- **Memoria:** imágenes grandes consumen buffers que compiten con el heap de la aplicación
- **Separación de concerns:** el monolite es una API de negocio, no un servidor de medios

El proyecto legado ya contaba con `imgproxy-api`, un microservicio Go especializado en procesamiento de imágenes. La decisión era si integrarlo, reemplazarlo, o absorber su funcionalidad.

## Decisión

Se adopta una **arquitectura de dos componentes**:

### 1. Almacenamiento: S3-compatible (`@aws-sdk/client-s3`)

El monolite interactúa directamente con S3 para operaciones de almacenamiento:

```
Monolite (StorageService) → S3 API (putObject, getObject, deleteObject)
```

- **Desarrollo local:** MinIO (S3-compatible, via Docker Compose)
- **Producción:** Cloudflare R2 o AWS S3 (misma API, solo cambia endpoint/credentials)
- Módulo: `StorageModule` (`@Global()`) en `src/infrastructure/storage/`

### 2. Procesamiento: imgproxy-api (servicio externo)

El monolite **delega** el procesamiento de imágenes a `imgproxy-api` vía HTTP:

```
Frontend → Monolite (FilesController) → FilesService → RemoteFileApi → imgproxy-api HTTP
```

- `imgproxy-api` es un servicio Go que expone endpoints REST para upload, redimensionado, y generación de variantes
- La comunicación es vía HTTP usando el adapter `RemoteFileApi` que implementa `IFileApi`
- El monolite **nunca** procesa imágenes en su propio runtime

### Flujo completo

```
1. Frontend: POST /api/v1/files/upload (multipart/form-data)
2. Monolite FilesController → FilesService
3. FilesService → RemoteFileApi.upload(file, dto)
4. RemoteFileApi → HTTP POST imgproxy-api (upload + processing params)
5. imgproxy-api:
   a. Recibe el archivo
   b. Lo sube a S3 (original)
   c. Genera variantes (thumbnail, medium, full) y las sube a S3
   d. Retorna URLs de todas las variantes
6. FilesService → QueueService.publish('file.uploaded', {...})
7. Respuesta al frontend: { urls: { original, thumbnail, medium, full } }
```

### Módulo `files`

```
modules/files/
├── files.module.ts
├── files.controller.ts          # POST /files/upload, GET /files/:id, DELETE /files/:id
├── files.service.ts             # Orquestación: upload → evento → respuesta
├── types.ts                     # File, UploadFileResult, FileVariant
├── dto/
│   ├── upload-file.dto.ts
│   └── file-query.dto.ts
├── contracts/
│   └── file-api.interface.ts    # IFileApi + FILE_API token
└── adapters/
    └── remote-file-api.ts       # HTTP client a imgproxy-api
```

### Stack de archivos

| Capa | Tecnología | Propósito |
|---|---|---|
| API de archivos | NestJS `files` module | Endpoints REST de upload/download/delete |
| Procesamiento | imgproxy-api (Go) | Redimensionado, WebP, variantes |
| Almacenamiento | S3-compatible (MinIO/R2/S3) | Almacenamiento duradero de originales + variantes |
| Comunicación | HTTP entre monolite e imgproxy-api | Delegación de procesamiento |
| Eventos | BullMQ (`file.uploaded`) | Notificar a otros módulos |

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **S3 + imgproxy-api externo (elegido)** | Separación de concerns, sin CPU-bound en Node.js, imgproxy-api ya existía y es maduro | Dos servicios que mantener. Latencia HTTP extra entre monolite e imgproxy-api. |
| **Procesamiento in-app con Sharp** | Sin servicio externo, menos latencia | CPU-bound en event loop de Node.js. Memoria para buffers de imágenes grandes. Mezcla API de negocio con procesamiento de medios. |
| **S3 + Lambda de procesamiento** | Serverless, escala a cero | Cold starts. Otro proveedor (AWS Lambda) en el stack. Complejidad de despliegue. |
| **Cloudinary / Imgix (SaaS)** | Zero maintenance, features avanzadas (face detection, CDN) | Costo recurrente alto a escala. Datos fuera de nuestra infraestructura. Vendor lock-in. |
| **Todo en imgproxy-api** (upload directo desde frontend) | Sin intermediario, menor latencia | El frontend necesitaría credenciales de imgproxy-api. Sin registro de uploads en la BD del monolite. Sin eventos de dominio. |

## Consecuencias

### Positivas
- **Sin CPU-bound en Node.js:** el event loop del monolite no se bloquea procesando imágenes.
- **Reutilización de imgproxy-api:** el servicio ya existía y está probado. No se reescribe funcionalidad existente.
- **Almacenamiento commodity:** S3-compatible permite cambiar de proveedor (MinIO → R2 → S3) sin cambios de código.
- **Eventos de dominio:** `file.uploaded` permite que otros módulos reaccionen (ej. `listings` asocia archivos a un listing).
- **Responsabilidad clara:** el monolite es dueño de los metadatos y la lógica de negocio; imgproxy-api es dueño del procesamiento binario.

### Negativas
- **Dos servicios que operar:** si imgproxy-api está caído, los uploads de archivos fallan.
- **Latencia extra:** cada upload pasa por Monolite → imgproxy-api → S3, vs upload directo a S3.
- **Estado distribuido:** los archivos están en S3, los metadatos en PostgreSQL. Consistencia eventual (mitigado por eventos BullMQ).

### Mitigaciones
- `RemoteFileApi` implementa `IFileApi`. Si imgproxy-api se reemplaza, solo cambia el adapter.
- Health check (`GET /health`) monitorea conectividad con imgproxy-api.
- BullMQ con reintentos garantiza que los eventos `file.uploaded` se procesen aunque haya fallos temporales.

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este ADR formaliza la arquitectura de archivos que ya está implementada. La decisión de mantener imgproxy-api como servicio externo en lugar de absorber su funcionalidad en el monolite es deliberada: separa el procesamiento CPU-bound de la API de negocio y reutiliza un componente existente y probado.*

## Referencias

- Depende de ADR-006 (Monolito Modular + BullMQ) — eventos de archivos
- Depende de ADR-010 (NestJS 11) — módulo `files` en el monolite
- Complementa a ADR-013 (Inter-Module Communication) — `files` publica eventos vía BullMQ
- Relacionado con ADR-008 (Email SES) — ambos usan infraestructura AWS
