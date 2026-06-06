---
tags:
  - panel
---

# 🎯 Panel de Control de Entrevistas

Este panel centraliza todas las entrevistas realizadas para tus clientes, organizadas por empresa y stack tecnológico. Usa el plugin **Dataview** para mostrar tablas dinámicas.

---

## 📊 Resumen General

```dataview
TABLE WITHOUT ID
  length(rows) AS "Total",
  rows.empresa[0] AS "Cliente"
FROM "Interviews"
WHERE tipo = "entrevista"
GROUP BY empresa
```

---

## 🏆 Ranking General por Puntaje Técnico

```dataview
TABLE
  candidato AS "Candidato",
  empresa AS "Cliente",
  puesto AS "Stack",
  puntaje_tecnico AS "🧠 Técnico",
  puntaje_ingles AS "🌐 Inglés",
  resultado AS "Estado"
FROM "Interviews"
WHERE tipo = "entrevista"
SORT puntaje_tecnico DESC
```

---

## 🔍 Por Cliente y Stack

### 🔷 Leap Tools — Python

```dataview
TABLE
  candidato AS "Candidato",
  puntaje_tecnico AS "🧠 Técnico",
  puntaje_ingles AS "🌐 Inglés",
  resultado AS "Estado",
  fecha AS "Fecha"
FROM "Interviews/Leap Tools/Python"
WHERE tipo = "entrevista"
SORT puntaje_tecnico DESC
```

### 🔷 Leap Tools — Python + React

```dataview
TABLE
  candidato AS "Candidato",
  puntaje_tecnico AS "🧠 Técnico",
  puntaje_ingles AS "🌐 Inglés",
  resultado AS "Estado",
  fecha AS "Fecha"
FROM "Interviews/Leap Tools/Python - React"
WHERE tipo = "entrevista"
SORT puntaje_tecnico DESC
```

### 🔷 Leap Tools — Front-end

```dataview
TABLE
  candidato AS "Candidato",
  puntaje_tecnico AS "🧠 Técnico",
  puntaje_ingles AS "🌐 Inglés",
  resultado AS "Estado",
  fecha AS "Fecha"
FROM "Interviews/Leap Tools/Front-end"
WHERE tipo = "entrevista"
SORT puntaje_tecnico DESC
```

---

## 🚦 Por Estado de Candidato

### ✅ Aprobados

```dataview
TABLE
  candidato AS "Candidato",
  empresa AS "Cliente",
  puesto AS "Stack",
  puntaje_tecnico AS "🧠 Técnico",
  puntaje_ingles AS "🌐 Inglés"
FROM "Interviews"
WHERE tipo = "entrevista" AND resultado = "aprobado"
SORT puntaje_tecnico DESC
```

### ⏳ En Proceso / En Espera

```dataview
TABLE
  candidato AS "Candidato",
  empresa AS "Cliente",
  puesto AS "Stack",
  puntaje_tecnico AS "🧠 Técnico",
  puntaje_ingles AS "🌐 Inglés"
FROM "Interviews"
WHERE tipo = "entrevista" AND (resultado = "en_proceso" OR resultado = "en_espera")
SORT puntaje_tecnico DESC
```

### ❌ Rechazados

```dataview
TABLE
  candidato AS "Candidato",
  empresa AS "Cliente",
  puesto AS "Stack",
  puntaje_tecnico AS "🧠 Técnico",
  puntaje_ingles AS "🌐 Inglés"
FROM "Interviews"
WHERE tipo = "entrevista" AND resultado = "rechazado"
SORT puntaje_tecnico DESC
```

---

## 💡 Cómo usar este sistema

1. **Nueva entrevista:** Usa la plantilla en `Plantillas/Plantilla de Entrevista.md`.
2. **Guardar en el lugar correcto:** `Interviews/[Cliente]/[Stack]/[Nombre Candidato].md`
3. **Llenar el frontmatter:** Completa `puntaje_tecnico`, `puntaje_ingles`, `fecha` y cambia `resultado` a `aprobado`, `rechazado` o `en_espera` cuando termines de evaluar.
4. **Este panel se actualiza solo** — Dataview recopilará la info automáticamente.
