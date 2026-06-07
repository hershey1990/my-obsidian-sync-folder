---
aliases:
  - Patioz General
---
# Arquitectura de Patioz

Patioz es un sistema de gestión inmobiliaria (Real Estate) construido sobre un **Monolito Modular**. Los módulos (auth, bff, imgproxy) están separados por Clean Architecture dentro de un mismo proyecto, comunicándose vía llamadas directas o colas asíncronas con **BullMQ (Redis)**. Este enfoque prioriza la simplicidad operativa y la velocidad de entrega, sin sacrificar la opción de extraer módulos a microservicios independientes en el futuro.

## API Gateway (BFF)

El núcleo de la orquestación en Patioz es el **API Gateway**. Actúa como una capa de intermediación entre el cliente (la aplicación de frontend) y los módulos internos.

Sus responsabilidades principales son:

- **Orquestación y Agregación:** Recibe peticiones desde el frontend y las traduce en una o varias llamadas a los módulos correspondientes (`auth`, `imgproxy`, etc.). Posteriormente, agrega y transforma las respuestas en una única carga útil (payload) optimizada para la vista que la solicitó.
- **Punto de Entrada Único (Single Entry Point):** Expone una API unificada y cohesiva para el cliente. Esto desacopla al frontend de la complejidad interna del sistema.
- **Optimización para el Cliente:** Permite adaptar las respuestas a las necesidades específicas de la interfaz de usuario, reduciendo la cantidad de datos transferidos y minimizando la lógica de negocio en el lado del cliente.

## Índice de Módulos y Componentes

- [[mapui-frontend]]
- [[bff]]
- [[auth]]
- [[imgproxy-api]]

---

## 📐 Architecture Decision Records (ADRs)

Toda decisión arquitectónica importante se documenta como un ADR en [[adr/00-index|patioz/adr/]].

```dataview
TABLE fecha AS "Fecha", decision AS "Decisión", estado AS "Estado"
FROM "patioz/adr"
WHERE tipo = "adr"
SORT file.name ASC
```

---

## 📘 Runbooks

Procedimientos operativos y operaciones del día a día en [[runbooks/00-index|patioz/runbooks/]].

---

## 🗓 Timeline del Proyecto

Línea de tiempo con milestones y roadmap en [[05-timeline]].

---

## 📖 Glosario del Dominio

Lenguaje ubicuo del proyecto en [[06-glosario]].
