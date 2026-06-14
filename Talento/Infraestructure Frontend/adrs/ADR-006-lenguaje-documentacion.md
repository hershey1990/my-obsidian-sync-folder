---
title: ADR-006: Lenguaje de documentación
status: accepted
date: 2026-06-14
---

# ADR-006: Lenguaje de documentación

## Contexto

El proyecto comienza con el creador y su equipo inmediato, quienes trabajan en español. A futuro se planea abrir a comunidad global open source.

## Decisión

**Fase inicial: documentación en español**

- README, docs, ADRs, y comentarios de código en español
- El equipo objetivo habla español, no hay razón para escribir en inglés todavía

**Futuro (cuando haya tracción internacional):**

- README principal en inglés
- Documentación bilingüe o conota principal en inglés
- El código (variables, funciones, commits) idealmente en inglés desde el inicio para no requerir refactor después

## Consecuencias

- Positivas: velocidad de desarrollo al escribir en idioma nativo
- Positivas: documentación clara para el equipo actual
- Negativas: requerirá traducción al inglés cuando el proyecto tenga alcance global
- Negativas: contribuyentes internacionales no podrán leer la documentación inicial
