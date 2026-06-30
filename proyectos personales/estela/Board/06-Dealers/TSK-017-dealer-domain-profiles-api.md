---
id: TSK-017
fase: 6
modulo: Dealers
prioridad: alta
dependencias: ["TSK-004"]
estimado: 2d
---

# TSK-017: Dealer domain + profiles API

Perfiles profesionales de concesionarios con planes y analytics.

## Entregables
- Dealer model (user_id, business_name, address, logo, years_active, plan, phone, website, verified_at)
- Enum DealerPlan (basico, pro, enterprise)
- DealerController: GET list, GET detail+inventory, PUT update
- DealerProfileResource
- Dashboard endpoints: total cars, active cars, views, contacts (30d)
- Políticas: solo dealer puede editar su perfil

## Criterios de aceptación
- GET /api/v1/dealers devuelve dealers verificados
- GET /api/v1/dealers/{id} devuelve perfil + inventario activo
- Dashboard stats se calculan correctamente
- Upgrade de plan funcional (basado en TSK-019)
- Dealer puede tener múltiples usuarios (staff) — opcional MVP
