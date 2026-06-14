---
title: "ADR-003: Pasos LOCAL — Railway Volumes + S3"
status: accepted
date: 2026-06-14
---

# ADR-003: Pasos LOCAL — Railway Volumes + S3

## Contexto

Los pasos de tipo LOCAL en los playbooks (rsync, scripts de backup, generación de archivos) escriben al disco del panel. Railway ofrece [Volumes](https://docs.railway.com/guides/volumes), que son discos persistentes adjuntos a un servicio. Sobreviven a deploys, restarts, y cambios de entorno.

Se consideró:
- Usar solo Railway Volumes para todo (disco persistente)
- Usar solo S3/B2 para todo (sin depender de disco)
- Híbrido: Volumes como staging + S3/B2 como destino final

## Decisión

**Estrategia híbrida: Railway Volume como staging + S3 como destino final**

- El panel se despliega con un Volume Railway montado en `/data`
- Los steps LOCAL pueden usar `/data` como staging (rsync temporal, descargas, scripts intermedios)
- El destino final de backups y artefactos siempre es S3 (AWS S3, Cloudflare R2, o cualquier S3-compatible externo)
- El Volume es opcional: si no está presente, los steps LOCAL usan `/tmp` (efímero) y el usuario debe asegurar que el resultado final vaya a S3
- Configuración vía variables de entorno `VOLUME_PATH` (default: `/data`) y las S3 credentials

Flujo típico con Volume:

```
SSH step: backup remoto → rsync al panel (VOLUME_PATH)
LOCAL step: rsync -avz remote:backups/ {{volume}}/
LOCAL step: s3cmd put {{volume}}/backups/ s3://control-backups/
```

Flujo típico sin Volume:

```
SSH step: backup remoto → comprimir y enviar directo a S3
LOCAL step: s3cmd put via pipe (sin pasar por disco)
```

## Consecuencias

- Positivas: rsync directo funciona (con Volume montado)
- Positivas: los backups van a S3 desde el origen (3-2-1 rule)
- Positivas: el Volume es un staging/cache, no un destino crítico — si se pierde, el backup está en S3
- Positivas: S3 es el estándar de la industria, cualquier provider lo soporta
- Negativas: si hay Volume, hay que considerar backup de los datos en el Volume (no crítico, pero evita sorpresas)
- Negativas: dependencia de un servicio S3 externo adicional
