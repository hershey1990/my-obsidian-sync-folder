---
section: "technical"
title: "Wireframes — MVP Estela"
status: "completado"
date: "2026-06-09"
---

# Wireframes del MVP

> 4 pantallas clave generadas como mockups funcionales con Next.js + shadcn/ui. Capturas de pantalla para el pitch deck y alineación del equipo.

## Pantallas

| # | Pantalla | Archivo | Descripción |
|:-:|----------|---------|-------------|
| 1 | **Landing + Hero** | `01-landing.png` | Hero section con búsqueda, 3 pilares (búsqueda, score, comparación), autos destacados. Base del marketing site. |
| 2 | **Search + resultados** | `02-search.png` | Filtros reales de auto (marca, transmisión, combustible, precio), grilla de resultados con score de condición, paginación. |
| 3 | **Car Detail + Condition Score** | `03-car-detail.png` | Galería de fotos, tabs (detalles, condición con Progress bars, comparación), sidebar con precio, contacto vendedor, perfil. |
| 4 | **Publish Wizard** | `04-publish-wizard.png` | Multi-step: datos básicos → fotos → checklist condición → revisar y publicar. Barra de progreso, sugerencias. |

## Stack usado para los mockups

| Componente | Tecnología |
|------------|------------|
| Framework | Next.js 16 (App Router) |
| UI Components | shadcn/ui (Card, Button, Badge, Input, Select, Tabs, Progress, Avatar, Separator) |
| Estilos | Tailwind CSS v4 |
| Fuente | Inter |

> **Nota:** El código fuente de estos mockups fue generado en un directorio temporal y eliminado. No hay archivos `.tsx` en el vault — solo las capturas de pantalla. El frontend del equipo puede reconstruir estas pantallas usando los mismos componentes shadcn/ui en el repositorio real.
