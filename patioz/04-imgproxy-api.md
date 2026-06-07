# imgproxy — Módulo de Subida Archivos y CDN

Módulo encargado de la recepción, procesamiento y almacenamiento de archivos (imágenes, documentos) en **Amazon S3**, actuando como **CDN** interno del ecosistema Patioz. Es parte del monolite y se comunica con los demás módulos a través de llamadas directas o colas BullMQ.

## Stack Tecnológico

- **Runtime:** Node.js / TypeScript
- **Framework:** Fastify (consistente con el BFF)
- **Storage:** Amazon S3 (buckets públicos/privados según el recurso)
- **CDN:** CloudFront (o S3 Transfer Acceleration) para distribución global
- **Procesamiento de Imágenes:** Sharp (thumbnails, redimensionado, compresión)
- **Validación:** Zod (schemas de tipo de archivo, tamaño, dimensiones)
- **Cola:** BullMQ (Redis) para procesamiento asíncrono de archivos pesados

## Responsabilidades

1. **Upload de archivos:** Recibe archivos desde el BFF o directamente desde el frontend (presigned URLs).
2. **Procesamiento:** Redimensiona, comprime y convierte imágenes a formatos óptimos (WebP, AVIF).
3. **Almacenamiento:** Persiste en S3 con una estructura de carpetas predecible (`/{tenant}/{tipo}/{uuid}.{ext}`).
4. **Entrega:** Sirve los archivos a través de CloudFront con caché y transformaciones on-the-fly.
5. **Limpieza:** Gestión de ciclo de vida (archivos temporales, expiración de assets no referenciados).

## Flujo de Subida

```mermaid
sequenceDiagram
    participant Client as Cliente (Frontend / BFF)
    participant API as imgproxy-api
    participant S3 as Amazon S3
    participant CDN as CloudFront

    Client->>+API: 1. POST /upload (multipart)
    API->>API: 2. Valida tipo, tamaño, sanitiza nombre
    API->>API: 3. Procesa (redimensiona, comprime)
    API->>+S3: 4. PUT objeto en bucket
    S3-->>-API: 5. Devuelve ETag / URL
    API-->>-Client: 6. Responde con URL pública del CDN
    Client->>CDN: 7. GET /{uuid}.webp
    CDN->>+S3: 8. Fetch desde origin (cache miss)
    S3-->>-CDN: 9. Devuelve objeto
    CDN-->>-Client: 10. Sirve archivo cachead
```

## Endpoints

### `POST /upload`
- **Content-Type:** `multipart/form-data`
- **Body:** `file` (archivo), `tenant` (string), `type` ("image" | "document")
- **Respuesta:** `{ url, thumbnailUrl, size, mimeType }`

### `DELETE /files/:id`
- Elimina un archivo del bucket.
- **Respuesta:** `204 No Content`

## Variables de Entorno Clave

| Variable | Descripción |
|---|---|
| `AWS_REGION` | Región de S3 (ej. `us-east-1`) |
| `S3_BUCKET_NAME` | Nombre del bucket principal |
| `S3_PUBLIC_BASE_URL` | URL base del CDN (ej. `https://cdn.patioz.com`) |
| `MAX_FILE_SIZE_MB` | Tamaño máximo permitido (ej. `10`) |
| `ALLOWED_MIME_TYPES` | Tipos permitidos separados por coma |
