# 📊 Panel de Control de Reportes

Este panel utiliza **Dataview** para recopilar, organizar y clasificar automáticamente todos los reportes de tu empresa que guardes en la carpeta `Reportes`.

---

## 📑 Índice de Reportes Recientes

A continuación se listan todos los reportes en tu carpeta `Reportes`, ordenados por fecha de forma descendente.

```dataview
TABLE 
    fecha AS "Fecha", 
    proyecto AS "Proyecto", 
    destinatario AS "Destinatario", 
    tipo AS "Tipo", 
    estado AS "Estado"
FROM "Reportes"
SORT fecha DESC
```

---

## 🛠️ Reportes por Estado

### 📝 En Desarrollo / Revisión
```dataview
TABLE 
    fecha AS "Fecha", 
    proyecto AS "Proyecto",
    estado AS "Estado"
FROM "Reportes"
WHERE (estado = "borrador" OR estado = "revision")
SORT fecha DESC
```

### ✉️ Enviados / Presentados
```dataview
TABLE 
    fecha AS "Fecha", 
    proyecto AS "Proyecto", 
    destinatario AS "Destinatario"
FROM "Reportes"
WHERE estado = "enviado"
SORT fecha DESC
```

---

## ⏳ Tareas de Seguimiento Pendientes

Esta lista extrae dinámicamente las tareas pendientes (`- [ ]`) dentro de todos tus reportes. Al completarlas aquí o en el reporte original, se actualizarán automáticamente.

```dataview
TASK
FROM "Reportes"
WHERE !completed
```

---

## 💡 Cómo usar este Sistema

1. **Usa la Plantilla:** Al crear un nuevo reporte, usa la plantilla en `Plantillas/Plantilla de Reporte.md`.
2. **Completa las Propiedades:** Asegúrate de llenar las propiedades (YAML Frontmatter) al principio de la nota (ej. `proyecto`, `fecha`, `estado`, `destinatario`).
3. **Seguimiento Automatizado:** Agrega tareas con `- [ ]` en la sección de *Próximos Pasos* de cada reporte. Aparecerán de forma automática en este panel.
