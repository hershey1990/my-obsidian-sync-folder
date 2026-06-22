---
title: "File Processing — Patioz"
description: "Arquitectura de archivos: upload, procesamiento vía imgproxy-api y almacenamiento en S3"
actualizado: 2026-06-22
---
# File Processing — Archivos e Imágenes

## Arquitectura

Patioz separa el almacenamiento del procesamiento de archivos:

```
Frontend → Monolito (FilesController) → RemoteFileApi → imgproxy-api (Go) → S3
```

- **Monolito:** dueño de la lógica de negocio y metadatos de archivos
- **imgproxy-api:** servicio Go especializado en procesamiento de imágenes (redimensionado, WebP, variantes)
- **S3:** almacenamiento duradero de originales y variantes

## Por qué separado

Procesar imágenes en Node.js bloquearía el event loop (CPU-bound). imgproxy-api está optimizado en Go para procesamiento de imágenes sin afectar la API de negocio.

## Flujo de upload

```
1. Frontend: POST /api/v1/files/upload (multipart/form-data)
2. Monolito: FilesService orquesta la operación
3. RemoteFileApi: HTTP POST a imgproxy-api
4. imgproxy-api:
   a. Recibe el archivo
   b. Sube el original a S3
   c. Genera variantes (thumbnail, medium, full)
   d. Sube las variantes a S3
   e. Retorna URLs
5. Monolito: publica evento file.uploaded vía BullMQ
6. Respuesta al frontend con las URLs
```

## Variantes de imagen

| Variante | Dimensiones | Uso |
|---|---|---|
| `original` | Sin cambios | Descarga, backup |
| `full` | 1920px ancho máx | Detalle de propiedad |
| `medium` | 800px ancho máx | Listado, card |
| `thumbnail` | 300px ancho máx | Miniaturas, mapa |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/files/upload` | Subir archivo (multipart) |
| `GET` | `/api/v1/files/:id` | Obtener metadatos y URLs |
| `DELETE` | `/api/v1/files/:id` | Eliminar archivo y variantes |

## Almacenamiento

- **Desarrollo:** MinIO (S3-compatible, Docker)
- **Producción:** Cloudflare R2 (S3-compatible)
- **Estructura:** `/{bucket}/{entity}/{uuid}.{ext}`

## Eventos

Cada upload publica un evento `file.uploaded` vía BullMQ. Otros módulos pueden reaccionar (ej. `listings` asocia archivos a una publicación).

## Limitaciones

- Si imgproxy-api está caído, los uploads fallan. El health check monitorea esta dependencia.
- Tamaño máximo de archivo: 10 MB (configurable vía `MAX_FILE_SIZE_MB`)
- Formatos aceptados: JPEG, PNG, WebP, PDF
