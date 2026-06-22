---
aliases:
  - Patioz General
---
# Arquitectura de Patioz

Patioz es un sistema de gestión inmobiliaria (Real Estate) construido sobre un **Monolito Modular**. Los módulos (auth, bff, imgproxy) están separados por Clean Architecture dentro de un mismo proyecto, comunicándose vía llamadas directas o colas asíncronas con **BullMQ (Redis)**. Este enfoque prioriza la simplicidad operativa y la velocidad de entrega, sin sacrificar la opción de extraer módulos a microservicios independientes en el futuro.

## Arquitectura del Sistema

Patioz se ejecuta como un solo proceso Node.js (monolite) que agrupa toda la lógica del servidor. La división en **módulos** es puramente lógica: cada módulo aísla su dominio con Clean Architecture, pero todos comparten el mismo runtime, base de datos (Supabase/PostgreSQL) y Redis (caché + colas BullMQ).

**Capa de entrada HTTP:** Fastify expone las rutas REST. Cada ruta delega al módulo correspondiente vía function calls directas, no HTTP. Esto elimina la latencia de red entre servicios y simplifica el deploy a un solo proceso.

**Comunicación asíncrona:** BullMQ (Redis) maneja tareas pesadas (procesamiento de imágenes, notificaciones). Los workers pueden ejecutarse en el mismo proceso o como procesos separados, sin cambiar la lógica de dominio.

## Índice de Módulos y Componentes

- [[mapui-frontend]]
- [[auth]]
- [[imgproxy]]
- [[patioz/adr/009-scheduling-inhouse|scheduling]] — Módulo de agendamiento de visitas (in-house)
- [[patioz/adr/011-mapas-ubicaciones|locations/maps]] — Módulo de búsqueda y verificación de ubicaciones geográficas

---

## 📐 Architecture Decision Records (ADRs)

Toda decisión arquitectónica importante se documenta como un ADR en [[adr/00-index|patioz/adr/]].
Hacer tracking de copia a repos en [[Tracker]] o [[bd/ADRs]].

---

## 📘 Documentación operativa

- [[docs/Setup Local|Setup Local]] — Levantar el entorno de desarrollo
- [[docs/Deploy|Deploy]] — Pipeline CI/CD y despliegue
- [[docs/Troubleshooting|Troubleshooting]] — Problemas comunes y soluciones

---

## 🗓 Timeline del Proyecto

Línea de tiempo con milestones y roadmap en [[05-timeline]].

---

## 📖 Glosario del Dominio

Lenguaje ubicuo del proyecto en [[06-glosario]].
