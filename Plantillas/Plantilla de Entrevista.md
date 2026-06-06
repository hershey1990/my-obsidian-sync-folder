---
tipo: entrevista
candidato: "{{title}}"
fecha: {{date:YYYY-MM-DD}}
puesto: 
empresa: 
puntaje_tecnico: null
puntaje_ingles: null
resultado: por_entrevistar
tags:
  - entrevista
---

# {{title}}

> **Puesto:** `=this.puesto` | **Empresa:** `=this.empresa` | **Fecha:** `=this.fecha`

---

## 🧠 Technical Interview

> **Puntaje Global:** **X / 10**

| Área | Puntaje | Notas |
|---|---|---|
| **Lenguaje Principal** | — / 10 | |
| **Framework** | — / 10 | |
| **Base de Datos / SQL** | — / 10 | |
| **APIs y Arquitectura** | — / 10 | |
| **Resolución de Problemas** | — / 10 | |

### 📋 Notas Técnicas
*Observaciones generales de la entrevista técnica, fortalezas y áreas de mejora.*

---

## 🌐 English Interview

> **Puntaje Global:** **X / 10**

| Área | Puntaje | Notas |
|---|---|---|
| **Understanding** | — / 10 | |
| **Fluency** | — / 10 | |
| **Grammar** | — / 10 | |
| **Pronunciation** | — / 10 | |

### 📋 Notas de Inglés
*Observaciones generales sobre el manejo del idioma.*

---

## ✅ Veredicto Final

**Puntaje Técnico:** `=this.puntaje_tecnico` / 10
**Puntaje Inglés:** `=this.puntaje_ingles` / 10

### 💡 Recomendación
> *¿Recomiendas al candidato? ¿Para qué rol o nivel? ¿Qué tan urgente es contratarlo?*

### 🚦 Resultado
- [ ] 📋 **Por Entrevistar** — Agendado, pendiente de realizar
- [ ] 🎙️ **Entrevistado** — Entrevista realizada, en elaboración de reporte
- [ ] ✅ **Reporte Entregado** — Reporte enviado al cliente
