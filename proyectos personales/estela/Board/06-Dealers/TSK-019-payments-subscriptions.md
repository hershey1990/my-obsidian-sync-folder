---
id: TSK-019
fase: 6
modulo: Dealers
prioridad: alta
dependencias: ["TSK-017"]
estimado: 4d
---

# TSK-019: Payment integration + subscriptions

Sistema de pagos para planes de dealer y listings premium.

## Entregables
- Integración con pasarela de pagos (TBD: Stripe/Pagalo/Simian)
- Webhooks para confirmar pagos
- Planes: Básico ($29/mes), Pro ($99/mes), Enterprise ($199/mes)
- Premium listing para individuos ($9.99 flat)
- Endpoint POST /api/v1/dealers/upgrade
- Endpoint POST /api/v1/cars/{id}/feature
- Feature flag: carros destacados aparecen primero en search
- Estado de suscripción con vencimiento automático

## Criterios de aceptación
- Dealer puede comprar plan y se activa inmediatamente
- Premium listing marca el carro como "Destacado"
- Al vencer la suscripción, el plan vuelve a Free
- Webhook actualiza estado sin intervención manual
- Historial de transacciones visible en dashboard
