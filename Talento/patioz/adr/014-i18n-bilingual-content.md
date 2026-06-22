---
tipo: adr
fecha: 2026-06-22
estado: aceptado
decision: Contenido multilingüe con campos JSONB bilingües (es/en) y traducción automática vía AWS Translate
proyecto: patioz-be
sync_backend: copiado
sync_frontend: no_aplica
tags:
  - adr
---
# ADR-014: Estrategia de Contenido Bilingüe (i18n)

## Contexto

Patioz opera en Nicaragua, donde el español es el idioma principal. Sin embargo, la plataforma necesita soporte en inglés para:

- Inversionistas internacionales que buscan propiedades en la región
- Expansión futura a otros países de habla inglesa
- Agentes y dueños que publican contenido en inglés
- Consistencia con el stack (documentación, código, APIs en español/inglés)

El sistema ya existía con todos los campos de texto en español (`text` en PostgreSQL). Migrar a un esquema multilingüe requería una decisión sobre el modelo de datos, la estrategia de traducción, y el impacto en el código existente.

## Decisión

Se adopta una estrategia de **JSONB bilingüe con traducción automática**:

### Modelo de datos

Todos los campos de texto visibles al usuario se almacenan como `jsonb` con la estructura `{ es?: string; en?: string }`:

```typescript
// src/shared/types/i18n.types.ts
export interface LocalizedString {
  es?: string;
  en?: string;
}

export interface LocalizedKeywords {
  es?: string[];
  en?: string[];
}
```

**Campos afectados:** `title`, `description`, `name`, `keywords`, `zoning`, `topography`, `utilities`, `businessType`, `leaseType`, `buildingClass`, y cualquier otro campo human-readable.

### Traducción automática (fillMissing)

Un `TranslationService` global (`@Global()`) provee `fillMissing(field: LocalizedString)` que delega a AWS Translate:

```
Reglas de fillMissing:
  - es presente, en ausente → auto-traduce es → en
  - en presente, es ausente → auto-traduce en → es
  - ambos presentes o ambos ausentes → no-op
```

Los services llaman `fillMissing` en todos los paths de escritura (`create`, `update`, `updateContent`) para cada campo `LocalizedString`.

### Stack de traducción

| Capa | Tecnología | Propósito |
|---|---|---|
| Almacenamiento | PostgreSQL JSONB | Campos bilingües |
| Traducción | AWS Translate | Auto-traducción en escritura |
| Sanitización HTML | `sanitize-html` (extendido con img, h1, h2, span) | Campos rich text |
| DTOs | `LocalizedStringDto`, `LocalizedKeywordsDto` | Validación de entrada |
| Módulo | `TranslationModule` (`@Global()`) | Provee `TranslationService` |

### Migración de datos existentes

Migración `supabase/migrations/00019_i18n_jsonb_migration.sql` que altera 10 tablas:

```sql
ALTER TABLE properties ALTER COLUMN title TYPE jsonb USING jsonb_build_object('es', title);
```

Los datos existentes en español se envuelven automáticamente en `{ "es": value }`.

### DTOs de validación

```typescript
// LocalizedStringDto
@IsOptional() @IsString() @MaxLength(500) es?: string;
@IsOptional() @IsString() @MaxLength(500) en?: string;

// LocalizedKeywordsDto
@IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(100, { each: true }) es?: string[];
@IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(100, { each: true }) en?: string[];
```

### Endpoints

Las APIs de lectura devuelven el objeto JSONB completo (`{ "es": "...", "en": "..." }`). El frontend elige el idioma según el perfil del usuario o el locale del navegador.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **JSONB bilingüe + AWS Translate (elegido)** | Sin tablas extra, flexible para nuevos idiomas, traducción automática sin fricción para el usuario | JSONB es menos consultable que texto plano. AWS Translate tiene costo marginal. |
| **Tabla separada por idioma** (`property_translations`) | Normalizado, consultable con JOINs | Complejidad de queries (N+1). Cada campo traducible requiere JOIN a tabla de traducciones. |
| **Columna por idioma** (`title_es`, `title_en`) | Simple de consultar, indexable | Explosión de columnas (cada campo × cada idioma). Agregar un idioma requiere ALTER TABLE. |
| **i18n library (i18next)** | Maduro, ecosistema amplio | Orientado a UI/etiquetas estáticas, no a contenido de usuario generado dinámicamente. |
| **Texto plano + columna `language`** | Máxima simplicidad | Duplicación de registros. Una propiedad en 2 idiomas = 2 rows. Complejidad de unicidad y referencias. |
| **Servicio externo de traducción on-read** (Google Cloud Translation) | Sin lógica de traducción en el monolite | Latencia en cada lectura. Costo por request de lectura. Sin control sobre la traducción generada. |

## Consecuencias

### Positivas
- **Flexibilidad:** agregar un tercer idioma en el futuro es agregar una key al JSONB, no nuevas columnas ni tablas.
- **Zero-friction:** el usuario escribe en un idioma y el sistema se encarga del otro.
- **Control:** la traducción ocurre en escritura (`fillMissing`), no en lectura. El usuario puede editar la traducción automática si no es precisa.
- **Consistencia:** todas las entidades usan el mismo tipo (`LocalizedString`), mismo DTO, mismo servicio de traducción.

### Negativas
- **JSONB no es ideal para búsquedas full-text:** `WHERE title->>'es' ILIKE '%casa%'` no usa índices btree estándar. Se requiere índice GIN para búsquedas eficientes.
- **Dependencia de AWS Translate:** si el servicio está caído, `fillMissing` falla y los campos quedan en un solo idioma. Mitigado por el hecho de que `fillMissing` es best-effort (el campo se guarda igual).
- **Tamaño de almacenamiento:** JSONB ocupa más que `text`. Con 10+ tablas y miles de registros, el overhead es marginal para el volumen actual.

### Mitigaciones
- `fillMissing` maneja errores de AWS Translate con try/catch y log — la operación principal (guardar el campo) no falla si la traducción falla.
- El `TranslationModule` es `@Global()` — cualquier módulo puede inyectar `TranslationService` sin imports adicionales.
- El `TranslationProvider` es una interfaz (`ITranslationProvider`) con adapter `AwsTranslateProvider`. Cambiar de proveedor de traducción solo requiere implementar la interfaz.

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX

---

> *Este ADR documenta una decisión de modelo de datos con impacto transversal en todas las entidades del sistema. La migración de `text` a `jsonb` ya se ejecutó en producción (migración 00019).*

## Referencias

- Depende de ADR-010 (NestJS 11) — `TranslationModule` como módulo `@Global()`
- Complementa a ADR-012 (Estructura de Módulo) — `TranslationModule` está en `src/infrastructure/translation/`
- Relacionado con ADR-015 (File Storage) — las URLs de imágenes también son bilingües en algunos casos
