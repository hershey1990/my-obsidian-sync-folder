---
title: ADR-004: Autenticación
status: accepted
date: 2026-06-14
---

# ADR-004: Autenticación

## Contexto

El panel necesita autenticación de usuarios. Se requiere soporte para email/password, OAuth (GitHub), y magic links.

## Decisión

**MVP (Fase 1): Laravel Breeze con email/password**

- Ya incluido en el stack (Breeze + Inertia + React)
- Login, registro, olvidé contraseña, verificación de email
- Sesiones con Sanctum
- Cero configuración extra

**Fase 2 (post-MVP): GitHub OAuth con Laravel Socialite**

- Agregar `laravel/socialite` + provider de GitHub
- Botón "Iniciar sesión con GitHub" en login
- Vincular cuenta de GitHub a cuenta existente

**Fase 3 (futuro): Magic links**

- Evaluar `laravel/fortify` que tiene login links nativo
- Alternativa: implementación simple con token firmado + expiración
- Se pospone hasta que sea necesario

## Consecuencias

- Positivas: Breeze da auth completa desde el día 1 sin esfuerzo
- Positivas: Socialite es bien conocido y documentado
- Negativas: Magic links no tienen paquete oficial liviano; requiere investigación adicional cuando se implemente
