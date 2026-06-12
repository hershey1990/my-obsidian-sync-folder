# ADR-001: Plataforma de Documentación — Outline + Zoho OIDC

**Estado:** Aprobado  
**Fecha:** 2026-06-12  
**Responsable:** (por asignar)  

---

## Contexto

La empresa necesita una plataforma de documentación interna que cubra:

- Documentación de **procesos** (outsourcing, recruitment, projects)
- Documentación de **software** (ARDs, stacks técnicos, diagramas, guías)
- Acceso fácil para todos los miembros de la empresa
- Manejo de usuarios y permisos

### Situación actual

Actualmente usamos **Docusaurus**, pero tiene limitaciones:

- No tiene autenticación nativa (tuvimos que fabricar login)
- No tiene colaboración en tiempo real
- Está orientado a documentación pública/estática, no a wiki interna
- Requiere mantener un pipeline de build/deploy para cada cambio

---

## Alternativas evaluadas

| Herramienta | Tipo | Auth nativa | Colab | Self-host | Costo |
|---|---|---|---|---|---|
| **Notion** | SaaS | ✅ | ✅ | ❌ | $8-15/user/mes |
| **Obsidian** | Local/Sync | ❌ | Limitado | Sync pago | $5/user/mes |
| **Docusaurus** | Static site | ❌ (hecha a mano) | ❌ | ✅ | $0 |
| **Outline** | Wiki OSS | ✅ OIDC/SAML | ✅ Tiempo real | ✅ | $0 + VPS |
| **BookStack** | Wiki OSS | ✅ LDAP/OAuth | ❌ | ✅ | $0 + VPS |
| **Wikso** | Wiki OSS | ✅ JWT/OAuth | ✅ Tiempo real | ✅ | $0 + VPS |

### Decisión: Outline

Se elige **Outline** por:

1. **Auth nativa vía OIDC** — sin fabricar login
2. **Colaboración en tiempo real** — edición simultánea, comentarios
3. **Self-hosted gratis** — BSL 1.1 (convierte a Apache 2.0 a los 4 años)
4. **Permisos granulares** — colecciones, grupos, roles lectura/escritura
5. **UX tipo Notion** — editor WYSIWYG + Markdown, slash commands, embeds
6. **API REST + Webhooks + MCP server** — extensible y automatizable
7. **39K+ estrellas GitHub, desarrollo activo** — v1.6.0 (marzo 2026)

---

## Arquitectura de autenticación

### Opciones consideradas

```
Opción A: Outline → Authentik → Zoho OIDC
Opción B: Outline → Authentik → Zoho OIDC
Opción C: Outline → Zoho OIDC (directo) ← SELECCIONADA
```

**Authelia** fue descartada porque no soporta actuar como Relying Party (no puede consumir un IdP upstream como Zoho).

**Authentik** fue considerado como broker, pero agrega complejidad innecesaria:
- Dos pasos de login (Outline → Authentik → Zoho)
- Un servicio adicional que mantener
- No se necesita gestión de múltiples proveedores de identidad por ahora

### Decisión de autenticación: Outline directo a Zoho OIDC

```
Usuario → docs.gettalento.com → [Login with Zoho] → Zoho Accounts → Outline
```

Zoho Accounts expone endpoints OIDC estándar:

- **Auth URI:** `https://accounts.zoho.com/oauth/v2/auth`
- **Token URI:** `https://accounts.zoho.com/oauth/v2/token`
- **UserInfo URI:** `https://accounts.zoho.com/oauth/user/info`
- **Discovery:** `https://accounts.zoho.com/.well-known/openid-configuration`

**Ventajas:**
- Un solo paso de login
- Sin infraestructura extra de identity provider
- Los usuarios usan sus credenciales corporativas de Zoho
- Outline soporta OIDC nativamente

> **Nota:** Si en el futuro se necesitan más proveedores (Google, GitHub, etc.) o gestión centralizada de sesiones/grupos, se puede insertar Authentik como broker sin migrar datos.

---

## Migración desde Docusaurus

### Consideraciones

1. **Markdown:** Outline usa Markdown nativamente. Los `.md` de Docusaurus migran casi directamente.
2. **MDX:** Si se usan componentes React en MDX (Tabs, admonitions personalizados), deben convertirse a sintaxis nativa de Outline.
3. **Admonitions:** Outline soporta `:::note`, `:::warning`, `:::tip` (compatible con Docusaurus).
4. **Links internos:** Deben reescribirse a las nuevas URLs de Outline.
5. **Imágenes:** Deben subirse como attachments en Outline.

### Estrategia

- **Opción 1 (manual):** Arrastrar archivos `.md` a colecciones en Outline vía UI
- **Opción 2 (masiva):** Usar Outline API con script Python para migración programática
- **Opción 3 (intermedia):** Import masivo desde `Settings → Import → Markdown files`

Se recomienda la **Opción 3** por ser el mejor balance entre esfuerzo y control.

---

## Plan de implementación

### Fase 1: Zoho — Registrar aplicación OIDC

1. Ir a [Zoho API Console](https://api-console.zoho.com/)
2. Crear aplicación tipo **"Server-based Application"**
3. Configurar:
   - **Authorized Redirect URI:** `https://docs.gettalento.com/auth/oidc/callback`
   - **Scopes:** `openid`, `email`, `profile`
4. Copiar **Client ID** y **Client Secret**

### Fase 2: Outline — Configurar OIDC

Agregar al `docker-compose.yml` de Outline:

```yaml
OIDC_CLIENT_ID: <de-zoho>
OIDC_CLIENT_SECRET: <de-zoho>
OIDC_AUTH_URI: https://accounts.zoho.com/oauth/v2/auth
OIDC_TOKEN_URI: https://accounts.zoho.com/oauth/v2/token
OIDC_USERINFO_URI: https://accounts.zoho.com/oauth/user/info
OIDC_USERNAME_CLAIM: email
OIDC_DISPLAY_NAME: Zoho
OIDC_SCOPES: openid email profile
```

Nota: Verificar el data center correcto de Zoho (US, EU, IN, AU, JP, CN).

### Fase 3: Infraestructura

Requisitos del servidor:

- **CPU:** 1 vCPU (mínimo), 2 vCPU (recomendado)
- **RAM:** 1 GB (mínimo), 2 GB (recomendado)
- **Disco:** 20 GB SSD
- **Software:** Docker + Docker Compose, Nginx/Caddy/Traefik (SSL)

Servicios del stack:

| Servicio | Rol |
|---|---|
| `outlinewiki/outline` | Aplicación principal |
| `postgres:16` | Base de datos |
| `redis:7` | Cache + sesiones en tiempo real |
| `minio/minio` | Almacenamiento de archivos (S3-compatible) |
| `nginx` / `caddy` | Reverse proxy + SSL |

### Fase 4: Deploy

1. Aprovisionar servidor con Docker
2. Clonar `docker-compose.yml` de referencia de Outline
3. Configurar variables de entorno (Zoho OIDC, DB, Redis, S3)
4. Configurar dominio `docs.gettalento.com` con SSL
5. `docker-compose up -d`
6. Verificar login con Zoho
7. Crear colecciones iniciales

### Fase 5: Migración de contenido

1. Exportar `docs/` del proyecto Docusaurus actual
2. Identificar archivos MDX con componentes React
3. Convertir componentes MDX a Markdown nativo
4. Importar a Outline (vía UI o import masivo)
5. Revisar y corregir links internos
6. Verificar imágenes y attachments

### Fase 6: Estructura de colecciones

```
docs.gettalento.com/
├── Procesos/
│   ├── Outsourcing
│   ├── Recruitment
│   └── Projects
├── Software/
│   ├── ARDs (Architecture Decision Records)
│   ├── Stacks técnicos
│   ├── Diagramas de arquitectura
│   └── Guías de desarrollo
├── Wiki interna/
│   ├── Políticas
│   ├── Onboarding
│   └── Manual de empleado
└── Plantillas/
    ├── ADR template
    ├── Proceso template
    └── Stack template
```

---

## Stack técnico final

| Componente | Tecnología |
|---|---|
| Wiki | Outline v1.6.0+ |
| Auth | Zoho OIDC |
| Base de datos | PostgreSQL 16 |
| Cache | Redis 7 |
| Archivos | MinIO (S3-compatible) |
| Proxy | Caddy (SSL automático) |
| Infraestructura | Docker Compose |

---

## Próximos pasos

- [ ] Crear aplicación OIDC en Zoho API Console
- [ ] Aprovisionar servidor con Docker
- [ ] Configurar `docker-compose.yml` con variables de entorno
- [ ] Configurar dominio y SSL
- [ ] Hacer deploy de Outline
- [ ] Probar login con Zoho
- [ ] Migrar contenido desde Docusaurus
- [ ] Configurar colecciones y permisos
- [ ] Comunicar a los miembros de la empresa
