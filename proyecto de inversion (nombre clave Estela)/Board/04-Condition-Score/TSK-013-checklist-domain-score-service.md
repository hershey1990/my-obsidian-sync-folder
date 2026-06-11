---
id: TSK-013
fase: 4
modulo: Condition Score
prioridad: alta
dependencias: ["TSK-006"]
estimado: 3d
---

# TSK-013: ConditionChecklist domain + CalculateScoreService

Checklist digital de 30+ puntos para evaluar condición del carro.

## Entregables
- ConditionChecklist model (car_id, category, item, score 1-5, photo_url, notes)
- ConditionCategory enum (exterior, interior, motor, transmisión, suspensión, eléctrico, llantas, documentos)
- CalculateScoreService: ponderación por categoría → score 1-100
- Algoritmo de penalización por gravedad (ej: score 1 en motor pesa más que score 1 en llantas)
- GET /api/v1/cars/{id}/checklist endpoint

## Criterios de aceptación
- Score 1-100 se calcula correctamente
- Items críticos (motor, transmisión) tienen mayor peso
- Checklist completa → score más preciso
- Checklist parcial → score con badge "evaluación parcial"
- Se almacena en condición_checklist y se refleja en cars.condition_score
