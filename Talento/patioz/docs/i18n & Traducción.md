---
title: "i18n & Traducción — Patioz"
description: "Estrategia de contenido bilingüe: JSONB, AWS Translate y cómo usar LocalizedString"
actualizado: 2026-06-22
---
# i18n — Contenido Bilingüe

## Cómo funciona

Todos los campos de texto visibles al usuario (títulos, descripciones, nombres, palabras clave) se almacenan en **dos idiomas** usando JSONB en PostgreSQL:

```json
{
  "es": "Casa en venta en Managua",
  "en": "House for sale in Managua"
}
```

## Traducción automática

Cuando un usuario crea o actualiza contenido, el sistema detecta si falta un idioma y lo completa automáticamente:

| Situación | Comportamiento |
|---|---|
| Escribe en español, inglés vacío | AWS Translate: ES → EN |
| Escribe en inglés, español vacío | AWS Translate: EN → ES |
| Ambos idiomas presentes | No se traduce (respeta lo que escribió el usuario) |
| Ambos vacíos | No se traduce |

El usuario siempre puede editar manualmente la traducción automática si no es precisa.

## Cómo usarlo en el frontend

### Lectura

La API siempre devuelve el objeto completo:

```json
{
  "title": { "es": "Casa en venta", "en": "House for sale" }
}
```

El frontend elige el idioma según el locale del usuario o el `Accept-Language` header.

### Escritura

El frontend puede enviar uno o ambos idiomas:

```json
// Solo español (inglés se auto-completa)
{ "title": { "es": "Casa en venta" } }

// Ambos idiomas (no se re-traduce)
{ "title": { "es": "Casa en venta", "en": "House for sale" } }
```

## Campos que son bilingües

- `title`, `description` (propiedades, listings)
- `name` (amenities, property types)
- `keywords`, `zoning`, `topography`, `utilities`
- `businessType`, `leaseType`, `buildingClass`

## Stack

| Capa | Tecnología |
|---|---|
| Almacenamiento | PostgreSQL JSONB |
| Traducción | AWS Translate |
| Sanitización HTML | `sanitize-html` (rich text) |
| Módulo | `TranslationModule` (`@Global()`) |

## Costo

AWS Translate cuesta ~$0.000015 por carácter. Para el volumen actual de Patioz, el costo mensual es menor a $5.

## Limitaciones

- La traducción es automática y puede tener errores en textos muy específicos del dominio inmobiliario nicaragüense. Se recomienda que un agente revise el contenido traducido.
- Los campos bilingües no son ideales para búsquedas full-text. Se recomienda usar índices GIN si se necesitan búsquedas.
