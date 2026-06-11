---
id: TSK-020
fase: 7
modulo: Contacto
prioridad: alta
dependencias: ["TSK-004", "TSK-007"]
estimado: 2d
---

# TSK-020: Contact seller API + email notification

Sistema de contacto entre comprador y vendedor sin revelar datos personales.

## Entregables
- ContactSellerService
- POST /api/v1/contact (desde car detail)
- SendContactNotification job (cola database)
- Email al vendedor con mensaje del comprador (email anonimizado)
- Rate limiting: máximo 5 contactos/día por comprador
- Log de contactos para analytics del dealer

## Criterios de aceptación
- Comprador envía mensaje → vendedor recibe email en < 1 min
- Email del comprador no se revela al vendedor (intermediación)
- Rate limit previene spam
- Dealer ve conteo de contactos en dashboard
