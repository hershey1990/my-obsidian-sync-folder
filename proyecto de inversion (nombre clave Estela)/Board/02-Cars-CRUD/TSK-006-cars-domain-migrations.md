---
id: TSK-006
fase: 2
modulo: Cars CRUD
prioridad: alta
dependencias: ["TSK-002"]
estimado: 2d
---

# TSK-006: Cars domain + migrations

Modelo de carros, fotos y enums del dominio.

## Entregables
- Car model con todos los campos (brand, model, year, version, transmission, fuel, engine, traction, doors, color, kilometers, price, negotiable, description, location PostGIS, city, department, status, condition_score)
- CarPhoto model (car_id, url, order, section)
- Enums: CarStatus (draft, published, sold, hidden), TransmissionType, FuelType, TractionType, ConditionCategory
- ValueObjects: ConditionScore, Price, Location, Kilometers
- Migraciones para cars, car_photos

## Criterios de aceptación
- Migraciones crean tablas correctamente
- PostGIS column funciona (ST_GeomFromText)
- Relaciones Eloquent: Car hasMany CarPhoto, Car belongsTo User
- Enums con valores correctos en español para frontend
