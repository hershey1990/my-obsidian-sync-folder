---
marp: true
theme: uncover
class:
  - lead
  - invert
paginate: true
style: |
  section {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 28px;
    padding: 25px 60px;
  }
  h1 { font-size: 2em; margin-bottom: 0.15em; }
  h2 { font-size: 1.3em; margin-bottom: 0.3em; }
  h3 { font-size: 1em; margin-bottom: 0.2em; }
  p { margin: 0.3em 0; }
  table { font-size: 0.6em; }
  table td, table th { padding: 3px 8px; }
  li { font-size: 0.7em; margin: 0.15em 0; }
  blockquote { font-size: 0.65em; margin: 0.3em 0; padding: 5px 15px; }
  .columns { display: flex; gap: 1.5em; }
  .columns > div { flex: 1; }
  .highlight { color: #3b82f6; font-weight: bold; }
  .green { color: #22c55e; font-weight: bold; }
  .big { font-size: 1.8em; font-weight: bold; }
  .small { font-size: 0.55em; color: #94a3b8; }
---

# Estela

## El marketplace de autos que Nicaragua necesita

Seed Round — **$150,000 - $250,000**

Pre-money: **$700K** | SAFE (Cap **$1.5M**, 20% discount)

<!-- speaker: Buenos días. Hoy vengo a presentarles Estela — el marketplace de autos que Nicaragua necesita. Estamos levantando una ronda seed de 150 a 250 mil dólares en SAFE con pre-money de 700 mil y cap de millón y medio. -->

---

<!-- _class: default -->

## Slide 1: El Problema

**Comprar un auto usado en Nicaragua es una apuesta.**

| Canal | Share | El problema |
|-------|:-----:|-------------|
| Facebook Marketplace | ~60% | Sin filtros de auto, estafas, perfiles falsos |
| Encuentra24 | ~25% | UX de 2010, mobile horrible, spam |
| Boca a boca / dealers | ~15% | No escala, inventario limitado |

**Resultado:** Un mercado de **$400-800M al año** operando con herramientas genéricas.

<!-- speaker: Nicaragua compra entre 64K y 112K autos usados al año, por $400 a $800 millones. Y el 85% de esas transacciones se hacen por Facebook o Encuentra24 — plataformas donde no podés ni filtrar por transmisión. No hay score de condición, no hay comparación, no hay confianza. Es una lotería. -->

---

<!-- _class: default -->

## Slide 2: La Solución + Demo

**Estela es un marketplace 100% especializado en autos.**

| Funcionalidad | FB/Encuentra24 | **Estela** |
|---------------|:--------------:|:-----------:|
| Filtros reales (transmisión, motor, combustible, tracción) | ❌ | ✅ |
| Score de condición digital (checklist 30+ puntos con fotos) | ❌ | ✅ |
| Comparación de modelos y ofertas lado a lado | ❌ | ✅ |
| Perfiles profesionales de dealer con analytics | ❌ | ✅ |
| Escrow + Inspecciones programadas | ❌ | ✅ (Fase 3) |

> 🔗 Wireframes (mostrar manualmente): `Technical/Wireframes/02-search.png` (búsqueda) · `Technical/Wireframes/03-car-detail.png` (detalle + score) · `Technical/Wireframes/01-landing.png` · `Technical/Wireframes/04-publish-wizard.png`

<!-- speaker: Mientras que en Facebook buscás autos como buscás una lámpara usada, en Estela podés filtrar por transmisión, combustible, tracción. Cada auto tiene un Score de Condición basado en un checklist de 30+ puntos con fotos. Podés comparar modelos lado a lado — un Yaris 2018 vs un City 2018. Esto no existe hoy en Nicaragua. Enseñar los wireframes manualmente durante esta slide. -->

---

<!-- _class: default -->

## Slide 3: Cómo funciona

**Vendedor** (particular o dealer) → publica auto + fotos + checklist de condición

**Estela** → búsqueda inteligente + score 1-100 + comparación + contacto

**Comprador** → busca, compara, contacta

### Evolución en 3 fases

| Fase | Timeline | Features | Ingresos |
|:----:|:--------:|----------|:--------:|
| **1** | Mes 0-6 | MVP: CRUD + búsqueda + score + comparación | **$0** (tracción) |
| **2** | Mes 4-9 | +Suscripciones dealers + Premium | **$500-2K MRR** |
| **3** | Mes 9+ | +Escrow + Inspecciones + Publicidad | **$5-15K MRR** |

<!-- speaker: El flujo es simple: el vendedor publica su auto con fotos y un checklist de condición. El comprador busca con filtros reales, ve el Score de Condición, compara modelos y ofertas, y contacta al vendedor. En Fase 3 agregamos escrow — el comprador deposita, se hace una inspección, y solo entonces se libera el pago. -->

---

<!-- _class: default -->

## Slide 4: Mercado

**TAM $400-800M** (Nicaragua) → **$7B+** (Centroamérica)
→ **SAM Digital $320-640M** (80% online) → **SOM Año 3: ~$500K** (2%)

| Indicador | Valor | Fuente |
|-----------|:-----:|--------|
| Parque vehicular | 1.6M (560K autos) | Tránsito Nacional |
| % comprados usados | **57%** | Investigación Interactiva |
| Usuarios internet | **4.89M (69.6%)** | DataReportal 2026 |
| Remesas (2024) | **$5,243M** → motor de demanda | BCN |
| Crecimiento mercado usado | **CAGR 28.35%** | 6Wresearch |

| País | Mercado usado |
|------|:--------------:|
| Guatemala $4B+ · Costa Rica $1.2B+ · Honduras $800M+ · El Salvador $700M+ |

<!-- speaker: El mercado de autos usados en Nicaragua mueve entre 400 y 800 millones de dólares al año. Crece al 28% anual. El 80% de los compradores usa canales digitales — pero las herramientas son genéricas. Centroamérica suma más de 7 mil millones. Nicaragua además recibe más de 5 mil millones en remesas al año — parte importante se destina a autos. -->

---

<!-- _class: default -->

## Slide 5: Modelo de Negocio

| Fase | Producto | Precio | Margen |
|:----:|----------|:------:|:------:|
| **1** Mes 0-6 | **Gratis** — ganar mercado | **$0** | — |
| **2** Mes 4-9 | Suscripción dealer Básico | $29/mes | 95%+ |
| | Suscripción dealer Pro | $79/mes | 95%+ |
| | Listing Premium particular | $9.99 | 95%+ |
| **3** Mes 9+ | Escrow (intermediación) | 3-5% | 90%+ |
| | Inspección presencial | $30-100 | 70%+ |
| | Publicidad / leads | $200-500/mes | 95%+ |

### Unit Economics

| Segmento | CAC | LTV | LTV/CAC | Payback |
|----------|:---:|:---:|:-------:|:-------:|
| Dealer Pro | $70 | **$790** | **11.3x** | ~1 mes |
| Dealer Básico | $40 | **$232** | **5.8x** | ~1.4 meses |

> CPM Nicaragua: **$0.40** — cada dólar de marketing rinde más que en cualquier mercado desarrollado.

<!-- speaker: Primero usuarios, después ingresos. Los primeros 6 meses todo es gratis. En Fase 2 activamos suscripciones para dealers con LTV/CAC de 5.8x a 11.3x — los dealers que pagan se recuperan en menos de 2 meses. En Fase 3 llegamos a márgenes del 90% con escrow e inspecciones. Y el CPM es de solo 40 centavos. -->

---

<!-- _class: default -->

## Slide 6: Competencia

**Mapa competitivo:** Alta especialización + alta confianza

| Baja especialización | **Alta especialización** |
|:--------------------:|:------------------------:|
| Facebook Marketplace (alta confianza) | **★ ESTELA (alta confianza)** |
| Encuentra24 (baja confianza) | Kavak (no en Nicaragua) |

### ¿Por qué no nos copian fácil?

1. **Efecto de red** — más autos → más compradores → más vendedores
2. **Datos del mercado** — precios reales, tendencias, base única
3. **Reputación** — historial de transacciones no transferible
4. **Especialización** — Facebook es genérico por diseño

<!-- speaker: Hoy competimos contra dos gigantes que no están hechos para autos. Facebook tiene el share pero es una hoja de papel. Encuentra24 tiene la marca pero su UX es de 2010. Kavak opera en México, Brasil, Colombia — Nicaragua es muy pequeño para ellos. -->

---

<!-- _class: default -->

## Slide 7: El Equipo

**Gershell Lopez** — CEO & Lead Architect

| Fortaleza | Detalle |
|-----------|---------|
| Full-stack developer | TypeScript, React, Node.js, Laravel |
| Arquitecto de software | Experiencia en sistemas productivos |
| **Fanático de autos** | Inspecciona por hobby — conoce el dolor del comprador |
| Lidera equipo | 7 personas trabajando juntas hoy |

| Rol | Cant. | Experiencia |
|-----|:-----:|-------------|
| Backend | 2 | Node.js, PostgreSQL, APIs |
| Frontend Sr | 1 | React, Next.js, UI/UX |
| Frontend Jr | 2 | React, shadcn/ui, Tailwind |
| QA / Admin | 1 | Testing, operaciones |

<!-- speaker: Yo soy Gershell. Full-stack developer, arquitecto de software, y fanático de autos — inspecciono por hobby. Conozco el dolor de comprar un auto usado porque lo he vivido. Mi equipo de 7 personas ya trabaja junta. No tenemos que contratar, no tenemos que formar. El día que cerremos el seed, empezamos a escribir código. -->

---

<!-- _class: default -->

## Slide 8: Roadmap + Tracción

**Mes 0** — Seed cerrado · **Mes 1-4** — Desarrollo MVP part-time (50%) + 1 mes buffer
**Mes 4** — 🚀 **Lanzamiento público** (full-time)
**Mes 5-6** — Onboarding dealers · **Mes 7-9** — Escrow + inspecciones
**Mes 10-12** — App nativa + inicio expansión regional
**Mes 12** — 🏁 **2,000 autos + $1,500+/mes MRR**

### Tracción proyectada

| Métrica | Mes 4 | Mes 6 | Mes 9 | Mes 12 |
|---------|:-----:|:-----:|:-----:|:------:|
| Autos publicados | 100 | 500 | 1,000 | **2,000** |
| Dealers activos | 5 | 15 | 30 | **50+** |
| Usuarios registrados | 500 | 2,000 | 5,000 | **10,000** |
| MRR | $0 | $200 | $800 | **$1,500+** |

<!-- speaker: El MVP se construye en 4 meses con el equipo part-time para no quemar efectivo. Al mes 4 lanzamos. Al mes 12 tenemos 2,000 autos, 50 dealers activos, y más de $1,500 mensuales recurrentes. El buffer de 1 mes protege si algo se atrasa. -->

---

<!-- _class: default -->

## Slide 9: Proyecciones Financieras

| | Año 1 | Año 2 | Año 3 |
|---|:-----:|:-----:|:-----:|
| **Ingresos** | **$12K** | **$112K** | **$410K** |
| Costos | $112K | $140K | $175K |
| **Resultado** | **($100K)** | **($28K)** | **+$235K** |
| Margen | -831% | -25% | **+57%** |

| Fuente Año 3 | Ingreso |
|--------------|:-------:|
| Premium particulares $60K · Suscripción dealers $120K · Escrow $150K | |
| Inspecciones $50K · Publicidad $30K | **Total $410K** |

| Escenario | Ingreso Año 3 |
|:---------:|:-------------:|
| Pesimista | $165K (~break-even) |
| **Base** | **$410K (+$235K)** |
| Optimista | $700K (+$525K) |

<!-- speaker: Llegamos a break-even al final del año 2 y somos rentables en año 3 con margen del 57%. Incluso en el escenario pesimista — con el doble de CAC y la mitad de conversiones — el negocio no quiebra. Las 5 fuentes de ingreso nos protegen: no dependemos de una sola línea. -->

---

<!-- _class: default -->

## Slide 10: El Ask + Términos + Salida

**Solicitamos $150,000 - $250,000 (Seed)**
Salarios 78% · Marketing 9% · Infra 4% · Legal 3% · Reserva 6%

| Término | Valor |
|---------|-------|
| Pre-money **$700K** · Inversión **$200K** · Dilución **22.2%** |
| Instrumento **SAFE** (YC) · Cap **$1.5M** · Discount 20% · Runway **18-24m** |

| Escenario | Prob. | Retorno inversor |
|:---------:|:-----:|:----------------:|
| Serie A ($5M pre) | 40% | **$1.1M (5.5x)** |
| Adquisición ($2-5M) | 25% | **$500-850K (2.5-4.3x)** |
| Dividendos/Buyback | 35% | **$200-400K (1-2x)** |
| **Expected Value** | | **~$1.15M (5.8x)** |

<!-- speaker: Estamos levantando entre 150 y 250 mil dólares en SAFE con pre-money de 700K y cap de millón y medio. 78% va a salarios del equipo por 12 meses. Runway de 18-24 meses. El valor esperado para el inversor es de 5.8x en 3-5 años. Mercado real de $400M, founder-market fit, equipo listo, ejecución lean, múltiples fuentes de ingreso, y camino claro a rentabilidad. -->

---

<!-- _class: lead invert -->

## Contacto

**Gershell Lopez** — CEO & Lead Architect

LinkedIn: [linkedin.com/in/gershell-lopez](https://www.linkedin.com/in/gershell-lopez/)

---

*Estela — El marketplace de autos que Nicaragua merece.*
