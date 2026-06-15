---
tipo: adr
fecha: 2026-06-14
estado: aceptado
tags:
  - adr
---
# ADR-004: Skills Gap & Learning Path

## Contexto
El mercado 2026 para Senior AI Software Engineer requiere habilidades específicas que no forman parte del skill set tradicional de un Software Engineer. Necesito identificar qué gaps tengo vs. lo que pide el mercado, priorizarlos por impacto en contratación, y definir un plan de aprendizaje mínimo viable. La urgencia es inmediata (1-2 meses), por lo que cada hora de estudio debe maximizar ROI en empleabilidad.

## Decisión

### 1. Mapeo: Skillset Actual vs Demanda de Mercado

Basado en investigación de mercado (31+ postings analizados, datos de agentic-engineering-jobs.com, hirequorum, y múltiples boards):

| Skill | Dominio Actual | Demanda Mercado | Gap | Prioridad |
|---|---|---|---|---|
| LLM APIs (OpenAI, Anthropic) | ✅ Uso activo | 90%+ | Cerrado | — |
| RAG Pipelines | ✅ Uso activo | 74% | Cerrado | — |
| MCP (Model Context Protocol) | ✅ Supabase MCP | 16-18% (+$15-35K premium) | Cerrado. Diferenciador | — |
| Agent Orchestration | ✅ Sí (asignación, flujos) | 71% | Cerrado | — |
| LangChain | ✅ Uso activo | 34% (table stakes) | Cerrado | — |
| Cloud (AWS) + Docker + CI/CD | ✅ Fuerte | 90%+ | Cerrado | — |
| TypeScript / Node.js / Go | ✅ Senior | Variable | Cerrado | — |
| **Evals / Evaluation Frameworks** | ❌ No | **61%** | **Crítico** | **🔴 P1** |
| **LangGraph** | ❌ No | 22% (+$30-60K premium) | **Alto** | **🟠 P2** |
| **Vector DBs (pgvector, Pinecone)** | ❌ No | Implícito en RAG (74%) | **Medio** | **🟠 P3** |
| Fine-tuning (LoRA, QLoRA) | ❌ Concepto | 29% (senior) | Bajo | 🟢 P4 |
| Python avanzado | Básico | 77% | Bajo (stack principal TS/Node) | 🟢 P5 |

### 2. Plan de Cierre Priorizado (≈2 semanas total)

**Fase 1 — Evals (P1: 2-3 días)**

Por qué: 61% de postings lo piden explícitamente. Es la pregunta "¿cómo sabes que tu AI system funciona?" que separa candidatos con experiencia real de tutorial-followers.

Acciones:
- Estudiar frameworks: LangSmith, LangFuse, DeepEval, RAGAS
- Entender tipos de eval: exact match, semantic similarity, hallucination detection, faithfulness, answer relevancy
- Armar un eval básico sobre uno de mis proyectos (Patioz o el Omnichannel)
- Documentar el setup en una nota de referencia

**Fase 2 — LangGraph (P2: 1 semana)**

Por qué: 22% de postings, premium salarial de $30-60K sobre LangChain solo. Es la evolución natural de LangChain para flujos multi-agente con estado.

Acciones:
- Tutorial oficial de LangGraph
- Portar un flow simple de LangChain a LangGraph
- Implementar un agente con estado y tool-calling en LangGraph
- Publicar un mini-proyecto o nota técnica

**Fase 3 — Vector DBs (P3: 2-3 días)**

Por qué: RAG sin vector DB es incompleto. pgvector en Supabase (que ya uso) es el entry point natural.

Acciones:
- Implementar pgvector en un proyecto Supabase existente
- Experimentar con embeddings + hybrid search (vector + BM25)
- Probar re-ranking con cross-encoders

**Fase 4 — Fine-tuning (P4: 1 tarde, opcional)**

- Entender cuándo fine-tunear vs RAG vs prompting (decisión: casi siempre RAG primero)
- Leer sobre LoRA/QLoRA (concepto, no implementación)

### 3. Referencias de Aprendizaje

| Gap | Recurso Recomendado |
|---|---|
| Evals | LangSmith docs, DeepEval framework, RAGAS |
| LangGraph | LangGraph official tutorial + LangChain Academy |
| Vector DBs | pgvector docs + Supabase Vector guide |
| Fine-tuning | Databricks LLM Fine-Tuning guide |

### 4. Lo que NO voy a aprender (ahora)

- Matemáticas/ML desde cero (no necesario para AI-augmented engineering)
- PyTorch/TensorFlow (no relevante para mi perfil)
- Data Science / estadística avanzada (otro perfil)
- Kubernetes avanzado (ya tengo Docker, lo justo para AI serving)

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| Bootcamp ML de 6 meses | Cobertura completa | No necesito ML research, sobrecarga, pierdo ventana de mercado |
| Solo mejorar lo que ya sé | Cómodo, rápido | No cierro gaps que preguntan en entrevistas (evals, LangGraph) |
| Estudiar todo en paralelo | Avance simultáneo | Dispersión, avance lento en cada área |

## Consecuencias
- Positivo: Cierro gaps críticos en 2 semanas, no 6 meses
- Positivo: Evals + LangGraph son preguntas frecuentes en entrevistas de AI Engineer
- Riesgo: No estudiar fine-tuning puede cerrar algunas puertas (mitigación: no es prerequisite para la mayoría de roles AI-augmented engineering)
- Riesgo: Sin vector DB experience, la sección de RAG en entrevistas puede sonar a tutorial (mitigación: P3 cubre lo justo)
- Acción: Registrar progreso en notas del vault + actualizar este ADR si cambia prioridad

## Estado
- [x] Aceptado
