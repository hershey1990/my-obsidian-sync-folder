---
section: "business-plan"
order: 11
title: "Análisis de Riesgos"
status: "completado"
date: "2026-06-09"
---

# Análisis de Riesgos

> **Propósito:** Identificar los riesgos clave del proyecto, evaluar su probabilidad e impacto, y documentar la estrategia de mitigación para cada uno. Esto demuestra al inversor que el equipo piensa en escenarios adversos y tiene planes concretos.

---

## 1. Riesgos de Mercado

| # | Riesgo | P | I | Severidad | Mitigación |
|:-:|--------|:-:|:-:|:---------:|------------|
| 1.1 | **Cold start:** El marketplace no alcanza masa crítica. Sin suficientes autos, no hay compradores; sin compradores, no hay vendedores. | 🟡 Media | 🔴 Alto | 🔴 Crítico | **Estrategia de siembra:** El fundador y el equipo publican autos de conocidos para poblar la plataforma antes del launch público. Onboarding proactivo de dealers (plan gratuito 3 meses). Meta: 100 autos en beta cerrada. |
| 1.2 | **Facebook mejora:** Meta agrega filtros de auto y estandarización a Marketplace, reduciendo el diferenciador de Estela. | 🟡 Media | 🟡 Medio | 🟡 Significativo | **Velocidad de ejecución:** La ventaja de Estela no son solo los filtros — es el ecosistema completo (score, comparación, inspección, escrow). Facebook no va a construir eso. Además, Facebook es genérico por diseño; especializarse en autos va contra su modelo. |
| 1.3 | **Encuentra24 se moderniza:** Invierten en UX, filtros, app mobile. | 🟢 Baja | 🟡 Medio | 🟡 Significativo | Encuentra24 no ha cambiado significativamente en 10+ años. No hay señal de que vayan a hacerlo. Aun si lo hicieran, Estela compite en confianza (score, inspección, escrow), no solo en UX. |
| 1.4 | **Llega competidor regional:** Kavak, OLX Autos, o similar entra a Nicaragua. | 🟢 Baja | 🟡 Medio | 🟡 Significativo | Nicaragua es un mercado pequeño para jugadores regionales. Kavak opera en países con >50M habitantes. La barrera de entrada (regulatoria, logística) es alta. Además, el conocimiento local del fundador es una ventaja. |
| 1.5 | **TAM sobreestimado:** El mercado de autos usados digital es menor de lo proyectado. | 🟡 Media | 🔴 Alto | 🔴 Crítico | **Validación temprana:** Las Research/ con fuentes citadas respaldan las cifras. El 57% de autos comprados usados es dato duro de Investigación Interactiva (518 encuestas). Aun si el TAM es 50% menor, sigue siendo un mercado de $200M+. |

---

## 2. Riesgos Regulatorios / Legales

| # | Riesgo | P | I | Severidad | Mitigación |
|:-:|--------|:-:|:-:|:---------:|------------|
| 2.1 | **Estabilidad política:** Nicaragua enfrenta sanciones internacionales, clima de inversión adverso. | 🟡 Media | 🔴 Alto | 🔴 Crítico | **Estructura offshore:** Constituir la empresa en Delaware o Panamá, operación en Nicaragua. El equipo y el mercado están en Nicaragua, pero la persona jurídica está fuera. El runway de 18-24 meses da margen para navegar ciclos políticos. |
| 2.2 | **Escrow sin licencia:** Intermediación de pagos puede requerir regulación financiera. | 🟡 Media | 🟡 Medio | 🟡 Significativo | **Fase 1-2 sin escrow:** El escrow no está planificado hasta la Fase 3 (mes 9+). En ese momento, se evalúa: (a) alianza con un banco/local fintech con licencia, (b) estructura donde Estela no retiene fondos (contrato de depósito en garantía con un banco), o (c) operar como referral a un servicio de escrow existente. |
| 2.3 | **Protección de datos:** Fuga de información de usuarios (identidad, fotos, datos de contacto). | 🟢 Baja | 🔴 Alto | 🟡 Significativo | **Seguridad por diseño:** Autenticación vía BFF con httpOnly cookies (sin exposición de tokens al browser). Fotos validadas por Laravel antes de subir a Supabase. Encriptación en tránsito y reposo. Política de privacidad y términos de servicio desde el día 1. |
| 2.4 | **Propiedad intelectual:** El nombre "Estela" o el concepto pueden ser disputados. | 🟢 Baja | 🟡 Medio | 🟢 Bajo | Registro de marca en Nicaragua y USPTO (si aplica). La competencia es baja en clasificados de autos. |

---

## 3. Riesgos Técnicos

| # | Riesgo | P | I | Severidad | Mitigación |
|:-:|--------|:-:|:-:|:---------:|------------|
| 3.1 | **Latencia BFF Proxy:** Next.js → Laravel agrega ~20-50ms por request vs monolito. | 🟡 Media | 🟢 Bajo | 🟢 Bajo | Aceptable para MVP. Nicaragua tiene velocidades de internet moderadas (~16 Mbps móvil, ~51 Mbps fijo) — 50ms adicionales no son perceptibles frente a otros cuellos de botella. Post-MVP se puede optimizar con caching (Redis). |
| 3.2 | **Supabase como cuello de botella:** Plan Pro ($25/mo) se queda corto si la plataforma escala rápido. | 🟢 Baja | 🟡 Medio | 🟡 Significativo | Supabase escala verticalmente (planes superiores) y horizontalmente (read replicas). El MVP no va a generar tráfico que sature 8GB RAM. Cuando se necesite, se migra a un plan mayor o a PostgreSQL administrado directo. |
| 3.3 | **Seguridad / Fraude:** Publicación de autos falsos, estafas, fotos inapropiadas. | 🟡 Media | 🟡 Medio | 🟡 Significativo | **Validación en múltiples capas:** (a) verificación de identidad del vendedor (cédula + selfie), (b) moderación de listings (manual en MVP, algoritmos post-MVP), (c) sistema de reportes, (d) el score de condición expone inconsistencias. |
| 3.4 | **Dependencia de vendors:** Vercel + Supabase + Forge/DO. Si uno falla o cambia términos, afecta la operación. | 🟢 Baja | 🟡 Medio | 🟡 Significativo | Stack open-source: Next.js, Laravel, PostgreSQL se pueden hostear en cualquier proveedor. La dependencia es de conveniencia, no técnica. Migrar de Vercel a Cloudflare Pages o de Supabase a Neon+R2 es factible en días, no meses. |

---

## 4. Riesgos de Ejecución

| # | Riesgo | P | I | Severidad | Mitigación |
|:-:|--------|:-:|:-:|:---------:|------------|
| 4.1 | **Timeline MVP agresivo:** 4 meses part-time para entregar el alcance completo del MVP. | 🟡 Media | 🟡 Medio | 🟡 Significativo | **Plan de 4 meses con buffer de 1 mes.** El sprint plan (ADR-002) tiene 8 sprints (16 semanas). Si algún sprint se atasca, se tiene un mes de buffer antes de que el inversor vea desviación. Las features post-MVP (escrow, inspecciones, IA) son flexibles — se recortan antes que retrasar el launch. |
| 4.2 | **Coordinación remota:** 7 personas part-time con otros trabajos. | 🟡 Media | 🟡 Medio | 🟡 Significativo | El equipo ya trabaja junto en proyectos actuales — la coordinación no es nueva. Ritmo: 3 reuniones semanales (planificación lunes, sync miércoles, demo viernes). Uso de GitHub Projects para tracking. Comunicación asíncrona vía WhatsApp/Discord. |
| 4.3 | **Part-time = riesgo de distracción:** Los miembros del equipo priorizan su trabajo actual sobre Estela. | 🟡 Media | 🟡 Medio | 🟡 Significativo | **Compromiso parcial pero claro:** Cada miembro dedicará horas fijas acordadas (ej: 20h/semana). El fundador lidera con el ejemplo. Post-seed, todos pasan a full-time — este riesgo se elimina. |
| 4.4 | **Retención del equipo:** Si el seed se retrasa, el equipo se desarma o busca otras oportunidades. | 🟢 Baja | 🔴 Alto | 🔴 Crítico | El seed está presupuestado para 12 meses de salarios. Si el seed se retrasa, el equipo sigue trabajando part-time como en los primeros 4 meses. El fundador ha trabajado con este equipo antes — hay lealtad y visión compartida. |

---

## 5. Riesgos Financieros

| # | Riesgo | P | I | Severidad | Mitigación |
|:-:|--------|:-:|:-:|:---------:|------------|
| 5.1 | **No levantar el seed:** El inversor no se compromete o el monto es menor al solicitado. | 🟡 Media | 🔴 Alto | 🔴 Crítico | **Opción lean (A):** $50-75K para desarrollo MVP part-time sin comprometer al equipo full-time. El plan contempla dos escenarios de funding. Si solo se consiguen $75K, se construye el MVP y se vuelve a levantar con tracción. |
| 5.2 | **Dealers no pagan:** $29-199/mes es demasiado para un lotero en Nicaragua. | 🟡 Media | 🟡 Medio | 🟡 Significativo | **Fase gratis primero:** Los dealers usan la plataforma gratis durante 3-6 meses y ven leads reales. La disposición a pagar se valida con datos antes de activar cobros. Si no pagan, se ajustan precios (ej: $15/mes básico). El modelo no depende de suscripciones de dealers — escrow e inspecciones son las fuentes principales en fase 3. |
| 5.3 | **Proyecciones demasiado optimistas:** Año 3 con $410K requiere crecimiento acelerado. | 🟡 Media | 🟡 Medio | 🟡 Significativo | Las proyecciones son aspiracionales (para mostrar potencial al inversor). El plan financiero incluye dos escenarios: el principal y el lean. El break-even real puede llegar en año 4 en lugar de año 3 — el runway de 18-24 meses da margen para ajustar. |
| 5.4 | **Burn rate mayor al estimado:** Infraestructura, marketing, costos legales superan lo presupuestado. | 🟢 Baja | 🟡 Medio | 🟡 Significativo | Presupuesto con 6% de reserva. Los costos de infraestructura real son ~$55-80/mes — el mayor riesgo es que el equipo necesite más tiempo del estimado (cubierto en 4.1). |

---

## Matriz de riesgos priorizada

| Severidad | Riesgos |
|:---------:|---------|
| 🔴 Crítico | Cold start (1.1), TAM sobreestimado (1.5), Estabilidad política (2.1), No levantar seed (5.1), Retención del equipo (4.4) |
| 🟡 Significativo | Facebook mejora (1.2), Escrow sin licencia (2.2), Seguridad/Fraude (3.3), Timeline MVP (4.1), Dealers no pagan (5.2), Proyecciones optimistas (5.3) |
| 🟢 Bajo | Encuentra24 moderniza (1.3), Latencia BFF (3.1), Propiedad intelectual (2.4), Dependencia vendors (3.4) |

---

## Plan de contingencia — Escenarios

### Escenario A: El seed se cierra en $200K (esperado)

Ejecución normal del plan. Equipo pasa a full-time post-MVP. Timeline de 18-24 meses para break-even o Serie A.

### Escenario B: El seed se cierra en $75K (lean)

- Desarrollo MVP en 4 meses part-time (como está planeado)
- NO se compromete al equipo full-time post-MVP
- Se lanza con el equipo part-time y se busca tracción para levantar Serie A o un segundo seed
- Se priorizan features que generan tracción (búsqueda, publicación, score) sobre las que generan ingresos (escrow, inspecciones)
- Timeline extendido a 24-30 meses

### Escenario C: No se levanta seed

- El fundador desarrolla el MVP solo o con 1-2 personas del equipo
- Se lanza una versión ultra-lean (sin dealers, sin comparación, solo CRUD básico + búsqueda)
- Se busca tracción orgánica y revenue desde el día 1 (modelo de suscripción dealer desde el inicio)
- No hay salary burn — el equipo mantiene sus trabajos actuales
- Si hay tracción real, se puede levantar seed posteriormente

---

## Monitoreo de riesgos

Los riesgos se revisan **cada 2 semanas** en la reunión de retrospectiva del equipo:

| Frecuencia | Acción |
|:----------:|--------|
| Quincenal | Revisión de riesgos activos. ¿Algún riesgo se materializó? ¿Alguna mitigación necesita ajuste? |
| Mensual | Actualización de probabilidades. ¿Cambió algo en el mercado/regulación/equipo? |
| Trimestral | Revisión completa de la matriz. ¿Nuevos riesgos? ¿Riesgos que ya no aplican? |
