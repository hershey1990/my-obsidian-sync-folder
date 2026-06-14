# DOX — Job Search Strategy

## Purpose
Busqueda activa de nueva oportunidad laboral como **Senior AI Software Engineer (AI-Enabled)**. Combina 15+ años de experiencia en arquitectura de software con integración de AI tooling (LLMs, RAG, MCP, agentes).

## Core Strategy
- **Positioning**: Senior AI Software Engineer — no "AI Native Engineer" (título no estandarizado). La narrativa AI-Enabled va en el contenido del CV, no en el título.
- **Timeline**: Inmediata (1-2 meses)
- **Mercado**: USA remoto (cliente actual), empresas tech/fintech/SaaS
- **Diferenciador**: Arquitecto senior que programa CON IA y diseña sistemas que INTEGRAN IA

## Structure

```
Job Search/
├── ADR/                         ← Decisiones documentadas (formato existing template)
│   ├── ADR-001-Posicionamiento.md
│   ├── ADR-002-Estructura-CV.md
│   ├── ADR-003-Mercado-Objetivo.md
│   ├── ADR-004-Skills-Gap.md
│   └── ADR-005-Sistema-Seguimiento.md
├── CV/
│   └── CV-Gershell-Lopez.md    ← CV vivo en Markdown
├── Companies/                   ← Una nota por aplicación con frontmatter
├── Dashboard.md                 ← Dataview TABLE de todas las aplicaciones
├── Kanban.md                    ← Dataview agrupado por estado
└── Retrospectivas.md            ← Entradas post-entrevista (qué salió bien/mal/mejorar)
```

## Application Note Frontmatter Convention

Every note in `Companies/` must have:

```yaml
---
tipo: aplicacion
empresa: ""
puesto: ""
url: ""
salario: ""
fecha_aplicacion: YYYY-MM-DD
estado: applied  # applied | screening | technical | cultural | offer | rejected | declined
feedback_tecnico: ""
feedback_ingles: ""
proximo_paso: ""
tags:
  - aplicacion
---
```

## Estado Tracking Workflow

Estados en orden: `applied → screening → technical → cultural → offer → accepted/declined`
También puede terminal en: `rejected` desde cualquier estado.

Después de cada entrevista, registrar entrada en `Retrospectivas.md`.

## ADR Status

| ADR | Título | Estado |
|---|---|---|
| 001 | Posicionamiento Profesional | Aceptado |
| 002 | Estructura y Narrativa del CV | Pendiente |
| 003 | Mercado Objetivo | Pendiente |
| 004 | Skills Gap & Learning Path | Pendiente |
| 005 | Sistema de Seguimiento | Pendiente |

## Key Decisions (resumen ejecutivo de ADR-001)
- **Título target**: "Senior AI Software Engineer" (no "AI Native Engineer" — término no estandarizado en el mercado)
- **Narrativa CV**: Logros reescritos con métricas y angle AI (no solo "usé IA" sino "incorporé IA para lograr X con Y% mejora")
- **Secciones CV**: Profile AI-native → Core Competencies (incluye AI Tooling) → AI-Enhanced Projects → Experience → Education
- **Keywords críticas**: LLM, RAG, MCP, agentes, AI-augmented development, context engineering, evals, LangChain, vector databases

## Background Context
- 15+ años como Software Engineer
- Stack: Go, Node.js, PHP (Laravel), React, TypeScript, Flutter
- Arqui: Microservicios, Hexagonal, Event-Driven, Cloud (AWS)
- AI experience real: Apollo.ai API, Supabase MCP, GitHub Copilot CLI, refactors con LLMs
- Experiencia entrevistando candidatos para Leap Tools (Python, React, Full-stack)
- Inglés profesional, cliente USA
- Nicaragua (remote-first)

## Templates Reference
- ADR template: `Plantillas/Plantilla de ADR.md`
- Application template: inline frontmatter convention above
- Retrospectiva template: free-form, fecha + empresa + bullet de bien/mal/mejorar
