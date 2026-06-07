---
tipo: runbook
descripcion: Problemas comunes y soluciones
tags:
  - patioz/runbook
---
# Runbook: Troubleshooting

## 🔴 Error: Conexión a Supabase falla

**Síntoma:** `Error: connect ECONNREFUSED` o `timeout`.

**Causas posibles:**
1. Supabase local no está corriendo → `npx supabase start`
2. Variables de entorno mal configuradas → verificar `.env`
3. Puerto ocupado → cambiar puerto en `supabase/config.toml`

---

## 🔴 Error: Upload a S3 falla

**Síntoma:** `403 AccessDenied` en imgproxy-api.

**Causas posibles:**
1. AWS credentials expiradas → renovar en IAM
2. Bucket policy incorrecta → verificar `s3:PutObject` permissions
3. CORS mal configurado → revisar `AllowedOrigins` del bucket

---

## 🔴 Error: Build de Next.js falla

**Síntoma:** `Build failed` con error de TypeScript.

**Causas posibles:**
1. Tipo incorrecto → ejecutar `npx tsc --noEmit` para identificar
2. Import circular → revisar dependencias entre componentes
3. Módulo faltante → `npm install`

---

## 🔴 Error: localStash no funciona

**Síntoma:** Las colas no procesan mensajes en local.

**Causas posibles:**
1. `QUEUE_PROVIDER` no está en `local` → `export QUEUE_PROVIDER=local`
2. El endpoint del webhook no es accesible desde el contenedor → usar `host.docker.internal`

---

## 🔴 Error: Leaflet no renderiza el mapa

**Síntoma:** Cuadrícula gris en lugar del mapa.

**Causas posibles:**
1. API key de tiles faltante → configurar `NEXT_PUBLIC_OPENSTREETMAP_URL`
2. CORS del tile server → probar con tiles públicos de OpenStreetMap

---

## ⚠️ Performance: BFF lento

**Síntoma:** Tiempos de respuesta > 500ms.

**Acciones:**
1. Verificar que QStash esté procesando mensajes → dashboard de Upstash
2. Revisar si hay N+1 queries en el BFF
3. Agregar caché con TTL para endpoints de alta demanda

---

## 📝 Cómo agregar un nuevo troubleshooting

1. Agregar una entrada con el formato `## 🔴 Error: <título>`
2. Describir síntoma, causas posibles y solución
3. Mantenerlo actualizado a medida que aparecen nuevos problemas
