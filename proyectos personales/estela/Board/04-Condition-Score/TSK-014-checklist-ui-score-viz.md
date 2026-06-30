---
id: TSK-014
fase: 4
modulo: Condition Score
prioridad: alta
dependencias: ["TSK-008", "TSK-013"]
estimado: 3d
---

# TSK-014: Checklist UI + Score visualization

Interfaz del checklist en el wizard y visualización del score en detalle.

## Entregables
- **Checklist UI** en paso 3 del Publish Wizard:
  - Categorías colapsables (exterior, interior, motor, etc.)
  - Cada item con score 1-5 (estrellas o botones)
  - Subir foto por item (opcional)
  - Nota textual por item (opcional)
- **Score visualization** en Car Detail:
  - Badge grande con score (color: verde >80, amarillo 60-80, rojo <60)
  - Desglose por categoría (barras de progreso)
  - Tooltip explicativo: "Este score se basa en 28 puntos evaluados"

## Criterios de aceptación
- Checklist se guarda por paso (no se pierde al navegar)
- Score se actualiza en tiempo real al llenar items
- Visualización responsiva
- Tooltips informativos
