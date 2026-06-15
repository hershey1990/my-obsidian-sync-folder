---
tipo: adr
fecha: 2026-06-14
estado: aceptado
tags:
  - adr
---
# ADR-002: Estructura y Narrativa del CV

## Contexto
El CV actual está escrito como Software Engineer clásico: párrafos densos, sin métricas de IA, sin diferenciación. Para reposicionarme como Senior AI Software Engineer, necesito un CV que:
- Refleje mi experiencia con AI tooling e integración de IA
- Sea escaneable por recruiters y ATS en segundos
- Cuantifique logros con impacto
- Diferencie mi perfil del mar de "Software Engineers"

## Decisión

### 1. Orden de Secciones (definitivo)

1. **PROFILE** — 3 líneas máx. Narrativa AI-native
2. **CORE COMPETENCIES** — 3 columnas: Arquitectura & Cloud / AI Tooling / Stacks
3. **AI-ENHANCED PROJECTS** — Proyectos personales/internos con IA (sección nueva)
4. **PROFESSIONAL EXPERIENCE** — Empleos agrupados, bullets reescritos con angle AI
5. **EDUCATION + LANGUAGES**

### 2. Tratamiento de Experiencia Laboral

Se agrupa la experiencia en dos categorías:

**Roles principales (sección principal, bullets detallados):**

| Empresa | Periodo | Notas |
|---|---|---|
| SMBS (talent formed SMBS) — NJ, USA | 2018-Present | Rol principal. Más reciente, más relevante |
| Eagle View — USA | 2023 | Go + 3D modeling con IA |
| Cencosud — Chile | 2023 | Go + hexagonal + retail |
| SEO Optimization Project | 2024 | Apollo.ai API (IA real) |
| Shesbirdie — USA | 2024-2025 | Flutter (sin IA, pero reciente) |

**Roles secundarios → "Additional Experience" (1 bullet c/u, compacto):**
Vinoshipper, Multi Money, King County, Tummi Staffing, Beonshop, Comisión de Toxicología

### 3. Framework de Narrativa

Todo logro en Experience se reescribe con la fórmula:

> **\[Verbo\] + \[qué\] + \[con qué AI/tooling\] + \[resultado cuantificable\]**

Ejemplos de transformación:

- *Antes:* "Designed scalable architectures in Node.js and React on AWS, improving response times by 35%."
- *Después:* "Designed scalable architectures in Node.js/React on AWS; integrated AI-assisted code review pipeline reducing defect rate by 40% and accelerating delivery by 30%."

- *Antes:* "Automated user actions via Apollo.ai API to enhance personalization and marketing funnels."
- *Después:* "Built AI-driven personalization layer via Apollo.ai API, automating user segmentation and reducing manual funnel optimization effort by 80%."

### 4. Profile (borrador inicial)

> *AI-Augmented Software Architect with 15+ years designing scalable systems across Go, Node.js, and cloud-native stacks. Combines deep architecture experience (microservices, hexagonal, event-driven, AWS) with AI tooling integration (LLMs, RAG, MCP, agents) to deliver systems that ship faster, scale reliably, and improve continuously.*

### 5. Core Competencies (3 columnas)

```
Arquitectura & Cloud:     Microservicios, Hexagonal, Event-Driven, AWS,
                           CI/CD, Docker, SQL/NoSQL optimization

AI Tooling & Workflow:    LLM Integration (OpenAI, Anthropic), RAG Pipelines,
                           MCP, AI Agents, AI-Assisted Development (Copilot CLI),
                           Context Engineering, Prompt Engineering

Development Stacks:       Go (Golang), Node.js, TypeScript, React, PHP (Laravel),
                           Python, Flutter, REST, GraphQL, gRPC
```

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| Perfil clásico SWE | Seguro, conocido | No diferencia, compite en pool masivo |
| CV funcional (sin cronología) | Enfoca skills | Red flag para recruiters, ATS lo penaliza |
| CV con foto/diseño | Visualmente distinto | ATS lo rompe, no recomendado para USA |

## Consecuencias
- Positivo: CV escaneable, keywords correctas, diferenciación inmediata
- Positivo: Sección AI-Enhanced Projects compensa falta de título "AI" en experiencia laboral
- Riesgo: "Additional Experience" puede verse como ocultar empleos cortos (mitigación: se mantienen visibles, solo más concisos)
- Pendiente: Los AI-Enhanced Projects se documentarán cuando el autor los proporcione

## Estado
- [x] Aceptado
