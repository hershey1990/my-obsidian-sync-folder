---
title: ADR-003: Pasos LOCAL en Railway — almacenamiento en S3/B2
status: accepted
date: 2026-06-14
---

# ADR-003: Pasos LOCAL en Railway — almacenamiento en S3/B2

## Contexto

Railway no ofrece disco persistente para la aplicación. Los pasos de tipo LOCAL en los playbooks (rsync, scripts de backup, generación de archivos) no pueden asumir que el disco sobreviva entre ejecuciones o deploys.

Se consideró usar MinIO como S3 local dentro de Railway, pero MinIO también requiere almacenamiento persistente — no resuelve el problema.

## Decisión

Los pasos LOCAL deben escribir siempre a S3 o Backblaze B2 (o cualquier S3-compatible externo).

- No se añade MinIO ni se asume disco persistente
- Las variables de entorno `BACKUP_S3_ENDPOINT`, `BACKUP_S3_BUCKET`, `BACKUP_S3_KEY`, `BACKUP_S3_SECRET` se configuran en el panel
- El helper `{{s3}}` en los steps LOCAL se resuelve a los comandos `s3cmd` o `aws cli` con esas credenciales
- Para scripts que necesiten archivos (ej: un script de backup), el panel los descarga desde S3 al inicio del step

## Consecuencias

- Positivas: los LOCAL steps funcionan idempotentemente en cualquier entorno
- Positivas: los backups quedan en storage externo desde el origen (3-2-1 rule)
- Negativas: no se puede rsync directo a disco local; toca descargar/subir a S3 como intermediario
- Negativas: dependencia de un servicio S3 externo adicional
