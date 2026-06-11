---
id: TSK-007
fase: 2
modulo: Cars CRUD
prioridad: alta
dependencias: ["TSK-004", "TSK-006"]
estimado: 3d
---

# TSK-007: Car CRUD API + photo upload

Endpoints RESTful para crear, leer, actualizar y eliminar carros + subida de fotos vía proxy.

## Entregables
- CarController: GET list (paginated), GET detail, POST create, PUT update, DELETE
- StoreCarRequest, UpdateCarRequest con validación
- CarResource, CarCollection (formato JSON consistente)
- Photo upload vía Laravel proxy → Supabase Storage
- Políticas de autorización (solo dueño edita/elimina)
- PublishCarService

## Criterios de aceptación
- POST /api/v1/cars crea carro con fotos
- GET /api/v1/cars/{id} devuelve carro con fotos y checklist
- PUT /api/v1/cars/{id} actualiza solo campos permitidos
- DELETE /api/v1/cars/{id} elimina carro y fotos de Supabase
- Usuario no autenticado no puede crear/editar
- Validaciones: precio > 0, año 1990-actual, fotos máximo 20
