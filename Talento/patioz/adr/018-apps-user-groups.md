---
tipo: adr
fecha: 2026-06-22
estado: aceptado
proyecto: patioz-fe
implementado: si
decision: "4 aplicaciones independientes con autenticación aislada por grupo de usuarios, no una sola app con role-based routing"
tags:
  - adr
---
# ADR-018: 4 Apps para 3 Grupos de Usuarios con Auth Isolation

## Contexto

Patioz tiene 3 grupos de usuarios con necesidades radicalmente distintas:

| Grupo | Necesidad |
|---|---|
| Público / Propietarios | Buscar propiedades en mapa. Experiencia rápida, pública, SEO-friendly |
| Agentes de agencia | Gestionar propiedades, listings, leads. Dashboard multi-tenant, wizard complejo |
| Staff admin | Administrar la plataforma. Funciones internas, sin SEO |

¿Una sola app con role-based routing o apps separadas?

## Decisión

**4 aplicaciones independientes** (una app extra es `basement` para el design system). Autenticación **aislada por grupo**: un token de `operations` no sirve en `admin` y viceversa.

```
mapui        → Auth público/propietarios
operations   → Auth agentes + tenant (multi-tenant login)
admin        → Auth staff admin
basement     → Sin auth (showcase interno)
```

El package `@mapui/auth` provee guards y stores comunes, pero cada app configura su propio endpoint de auth y grupo.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Apps separadas + auth isolation (elegido)** | Cada app optimizada para su usuario, sin riesgo de leak de tokens entre grupos, deploys independientes | Más repos que mantener (mitigado por monorepo ADR-017) |
| **Single app + role-based routing** | Un solo deploy, menos configuración | Next.js para admin (overkill), bundle con código de todos los roles, riesgo de que un bug de ruteo exponga admin a público |
| **Micro-frontends** | Equipos independientes por app | Complejidad de orquestación, sobrekill para el equipo actual |

## Consecuencias

### Positivas
- **Seguridad:** un token de un grupo no puede acceder a otro
- **Stack óptimo por app:** Next.js para SEO, Vite para dashboards
- **Deploy independiente:** un bug en admin no tumba la app pública
- **Bundle size:** cada usuario solo descarga el código de su app

### Negativas
- **Auth más compleja:** 3 sistemas de login, no uno solo
- **El paquete `@mapui/auth` debe contemplar 3 flujos**

### Mitigaciones
- `@mapui/auth` centraliza la lógica de auth. Cada app solo configura endpoint y grupo
- Multi-tenant en operations es un feature, no una complicación: requiere `tenantSlug` en login

## Estado

- [ ] Propuesto
- [x] Aceptado
- [ ] Rechazado
