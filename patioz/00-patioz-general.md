---
aliases:
  - Patioz General
---
# Arquitectura de Patioz

Patioz es un sistema de gestión inmobiliaria (Real Estate) fundamentado en una arquitectura de microservicios. Este enfoque de diseño nos permite desarrollar, desplegar y escalar componentes del sistema de forma independiente, otorgando a cada microservicio una autonomía arquitectónica completa.

## BFF (Backend for Frontend)

El núcleo de la orquestación en Patioz es el **Backend for Frontend (BFF)**. Este patrón de diseño actúa como una capa de intermediación entre el cliente (la aplicación de frontend) y los microservicios internos.

Sus responsabilidades principales son:

- **Orquestación y Agregación:** El BFF recibe peticiones desde el frontend y las traduce en una o varias llamadas a los microservicios correspondientes (`auth`, `imgproxy-api`, etc.). Posteriormente, agrega y transforma las respuestas de estos servicios en una única carga útil (payload) optimizada para la vista que la solicitó.
- **Punto de Entrada Único (Single Entry Point):** Expone una API unificada y cohesiva para el cliente. Esto desacopla al frontend de la complejidad y la estructura interna del ecosistema de microservicios. El cliente no necesita conocer la ubicación ni el contrato de cada servicio individual.
- **Optimización para el Cliente:** Permite adaptar las respuestas a las necesidades específicas de la interfaz de usuario, reduciendo la cantidad de datos transferidos y minimizando la lógica de negocio en el lado del cliente.

## Índice de Microservicios y Componentes

- [[mapui-frontend]]
- [[bff]]
- [[auth]]
- [[imgproxy-api]]
