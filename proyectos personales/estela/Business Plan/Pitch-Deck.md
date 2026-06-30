---
title: "Estela — Pitch Deck"
subtitle: "Seed Round | $150K-$250K | Nicaragua"
date: "2026-06-09"
version: "2.0 — 10-slide YC format"
status: "✅ Completo (preparado para exportar a Google Slides/PPT)"
---

# Estela
## El marketplace de autos que Nicaragua necesita

**Seed Round — $150,000 - $250,000**
**Pre-money: $700K | Instrumento: SAFE (Cap $1.5M, 20% discount)**

---

## Slide 1: El Problema

**Comprar un auto usado en Nicaragua es una apuesta.**

| Canal | Share del mercado | El problema |
|-------|:-----------------:|-------------|
| Facebook Marketplace | **~60%** | Sin filtros de auto, estafas, perfiles falsos, fotos malas, sin reputación |
| Encuentra24 | **~25%** | UX de 2010, mobile horrible, spam, anuncios duplicados, publicidad invasiva |
| Boca a boca / dealers | **~15%** | No escala, inventario limitado a un local |

**Resultado:** Un mercado de **$400-800M al año** operando con herramientas genéricas que no fueron hechas para autos.

> 🎙️ **Speaker note:** "Nicaragua compra entre 64K y 112K autos usados al año, por $400 a $800 millones. Y el 85% de esas transacciones se hacen por Facebook o Encuentra24 — plataformas donde no podés ni filtrar por transmisión. No hay score de condición, no hay comparación, no hay confianza. Es una lotería."

---

## Slide 2: La Solución + Demo

**Estela es un marketplace 100% especializado en autos.**

### Comparación: Lo que nadie ofrece vs Estela

| Funcionalidad | FB/Encuentra24 | **Estela** |
|---------------|:--------------:|:-----------:|
| Búsqueda con filtros reales de auto (transmisión, motor, combustible, tracción) | ❌ | ✅ |
| Score de condición digital (checklist 30+ puntos con fotos) | ❌ | ✅ |
| Comparación de modelos lado a lado (Yaris vs City vs Rio) | ❌ | ✅ |
| Comparación de ofertas (todos los Yaris 2018 en una tabla) | ❌ | ✅ |
| Perfiles profesionales de dealer con analytics y badges | ❌ | ✅ |
| Inspección programada (red de inspectores bajo demanda) | ❌ | ✅ (Fase 3) |
| Intermediación escrow (protección comprador-vendedor) | ❌ | ✅ (Fase 3) |

### Demo — Wireframes del MVP

```
┌─────────────────────┐  ┌─────────────────────┐
│   BÚSQUEDA          │  │   CAR DETAIL +       │
│   CON FILTROS       │  │   CONDITION SCORE    │
│                     │  │                      │
│  [Marca ▼] [Año ▼] │  │  [Fotos del auto]    │
│  [Transmisión ▼]   │  │  Precio: $12,500     │
│  [Combustible ▼]   │  │  Score: 87/100 ━━━━░ │
│  [Tracción ▼]      │  │                      │
│                     │  │  Exterior ████████░░ │
│  ┌──────┐ ┌──────┐ │  │  Interior ██████░░░░ │
│  │Auto A│ │Auto B│ │  │  Mecánico ███████░░░ │
│  │Score │ │Score │ │  │  Docs    ██████████░ │
│  │  92  │ │  78  │ │  │                      │
│  └──────┘ └──────┘ │  │  [Contactar vendedor]│
└─────────────────────┘  └─────────────────────┘
```

> 📸 Ver `Technical/Wireframes/` para las 4 pantallas completas (Landing, Search, Car Detail + Score, Publish Wizard).

> 🎙️ **Speaker note:** "Mientras que en Facebook buscás autos como buscás una lámpara usada, en Estela podés filtrar por transmisión, combustible, tracción. Cada auto tiene un Score de Condición basado en un checklist de 30+ puntos con fotos. Podés comparar modelos lado a lado — un Yaris 2018 vs un City 2018 — y también comparar todas las ofertas del mismo modelo en una tabla. Esto no existe hoy en Nicaragua."

---

## Slide 3: Cómo funciona

```
               ┌──────────────────────┐
               │     VENDEDOR         │
               │  (particular/dealer) │
               └──────────┬───────────┘
                          │ Publica auto + fotos
                          │ + checklist condición
                          ▼
           ┌───────────────────────────────┐
           │          ESTELA                │
           │  • Búsqueda inteligente        │
           │  • Score de condición 1-100   │
           │  • Comparación modelos/ofertas │
           │  • Contacto seguro            │
           └───────────────────────────────┘
                          ▲
                          │ Busca, compara,
                          │ contacta
               ┌──────────┴───────────┐
               │     COMPRADOR        │
               └──────────────────────┘
```

### Evolución en 3 fases

| Fase | Timeline | Features | Ingresos |
|:----:|:--------:|----------|:--------:|
| **1** | Mes 0-6 | MVP: CRUD + búsqueda + score + comparación | **$0** (tracción) |
| **2** | Mes 4-9 | +Suscripciones dealers + Premium particulares | **$500-2K MRR** |
| **3** | Mes 9+ | +Escrow + Inspecciones + Publicidad | **$5-15K MRR** |

> 🎙️ **Speaker note:** "El flujo es simple: el vendedor publica su auto con fotos y un checklist de condición. El comprador busca con filtros reales, ve el Score de Condición, compara modelos y ofertas, y contacta al vendedor. En Fase 3 agregamos escrow — el comprador deposita, se hace una inspección, y solo entonces se libera el pago."

---

## Slide 4: Mercado

```
┌─────────────────────────────────────────────────────────────┐
│                    TAM $400-800M (Nicaragua)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            TAM Regional $7B+ (Centroamérica)          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  SAM Digital $320-640M (80% del mercado online)  │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │  SOM Año 3: ~$500K (2% del mercado)      │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Datos clave del mercado

| Indicador | Valor | Fuente |
|-----------|:-----:|--------|
| Parque vehicular Nicaragua | 1.6M (560K autos) | Tránsito Nacional |
| % comprados usados | **57%** | Investigación Interactiva |
| Transacciones usadas/año | 64K-112K | Estimación conservadora |
| Usuarios internet | **4.89M (69.6%)** | DataReportal 2026 |
| Crecimiento internet anual | **+9.9%** | DataReportal |
| Remesas (2024) | **$5,243M** → motor de demanda | BCN |
| Crecimiento mercado usado | **CAGR 28.35%** | 6Wresearch |

### Potencial regional

| País | Mercado usado estimado |
|------|:----------------------:|
| Guatemala | $4B+ |
| Costa Rica | $1.2B+ |
| Honduras | $800M+ |
| El Salvador | $700M+ |

> 🎙️ **Speaker note:** "El mercado de autos usados en Nicaragua mueve entre 400 y 800 millones de dólares al año. Crece al 28% anual compuesto. El 80% de los compradores usa canales digitales — pero las herramientas son genéricas. Y esto es solo Nicaragua: Centroamérica suma más de 7 mil millones de dólares. Nicaragua además tiene un motor de demanda único: más de 5 mil millones de dólares en remesas al año, y una parte significativa se destina a comprar autos."

---

## Slide 5: Modelo de Negocio

### 3 fases de monetización (ingresos progresivos)

| Fase | Producto | Precio | Margen |
|:----:|----------|:------:|:------:|
| **Fase 1** (Mes 0-6) | **Gratis** — ganar mercado, no cobrar | **$0** | — |
| **Fase 2** (Mes 4-9) | Suscripción dealer Básico | $29/mes | 95%+ |
| | Suscripción dealer Pro | $79/mes | 95%+ |
| | Suscripción dealer Enterprise | $199/mes | 95%+ |
| | Listing Premium particular | $9.99 | 95%+ |
| **Fase 3** (Mes 9+) | Escrow (intermediación) | 3-5% del precio | 90%+ |
| | Inspección presencial | $30-100 | 70%+ |
| | Publicidad / leads | $200-500/mes | 95%+ |

### Unit Economics destacados

| Segmento | CAC | LTV (base) | LTV/CAC | Payback |
|----------|:---:|:----------:|:-------:|:-------:|
| Dealer Pro | $70 | **$790** | **11.3x** | ~1 mes |
| Dealer Básico | $40 | **$232** | **5.8x** | ~1.4 meses |
| Comprador (escrow) | $150 | **$350** | 2.3x | — |

> 💡 Nicaragua tiene **CPM de $0.40** (uno de los más bajos del mundo) — cada dólar de marketing rinde mucho más que en mercados desarrollados.

> 🎙️ **Speaker note:** "Primero usuarios, después ingresos. Los primeros 6 meses todo es gratis. En Fase 2 activamos suscripciones para dealers con LTV/CAC de 5.8x a 11.3x — los dealers que pagan se recuperan en menos de 2 meses. En Fase 3 llegamos a márgenes del 90% con escrow e inspecciones. Y como el CPM en Nicaragua es de solo 40 centavos, adquirir usuarios cuesta una fracción de lo que costaría en otros mercados."

---

## Slide 6: Competencia

```
                    ESPECIALIZACIÓN EN AUTOS
                     BAJA              ALTA
                ┌──────────────────────────┐
             ALTA│  Facebook     │  ESTELA  │
                │  Marketplace  │   (nos)  │
CONFIANZA       │               │          │
+ CALIDAD       │───────────────│──────────│
                │  Encuentra24  │ Kavak    │
             BAJA│  (genérico)  │ (no en   │
                │               │ Nicaragua│
                └──────────────────────────┘
```

### ¿Por qué no nos copian fácil?

1. **Efecto de red:** Más autos → más compradores → más vendedores. El que llega primero gana.
2. **Datos del mercado:** Precios reales de transacciones, valores de reventa, tendencias — base de datos única.
3. **Reputación:** Historial de transacciones y scores que no se transfieren a otra plataforma.
4. **Especialización:** Facebook es genérico por diseño. Construir filtros de auto va contra su modelo.

> 🎙️ **Speaker note:** "Hoy competimos contra dos gigantes que no están hechos para autos. Facebook tiene el share pero es una hoja de papel — ponés fotos y precio y rezá. Encuentra24 tiene la marca pero su UX es de 2010. Estela llega como el primer marketplace 100% especializado: filtros reales, score de condición, comparación. Kavak opera en México, Brasil, Colombia — pero Nicaragua es muy pequeño para ellos. Y aunque llegaran, no tienen nuestro conocimiento local ni nuestra red."

---

## Slide 7: El Equipo

### Gershell Lopez — CEO & Lead Architect

| Fortaleza | Detalle |
|-----------|---------|
| Full-stack developer | TypeScript, React, Node.js, Laravel |
| Arquitecto de software | Experiencia en sistemas productivos |
| **Fanático de autos** | Inspecciona autos por hobby — conoce el dolor del comprador |
| Lidera equipo | 7 personas trabajando juntas hoy (2026) |

### Equipo disponible (7 personas)

| Rol | Cant. | Experiencia |
|-----|:-----:|-------------|
| Backend | 2 | Node.js, PostgreSQL, APIs |
| Frontend Sr | 1 | React, Next.js, UI/UX |
| Frontend Jr | 2 | React, shadcn/ui, Tailwind |
| QA / HR / Admin | 1 | Testing, operaciones |

**Ventaja:** El equipo ya trabaja junto. No hay curvas de aprendizaje ni fricción de arranque. Pasamos de seed a código en semana 1, no en mes 3.

> 🎙️ **Speaker note:** "Yo soy Gershell. Soy desarrollador full-stack, arquitecto de software, y fanático de autos — inspecciono por hobby. Conozco el dolor de comprar un auto usado porque lo he vivido. Mi equipo de 7 personas ya trabaja junta hoy. No tenemos que contratar, no tenemos que formar, no tenemos que descubrir cómo trabajar juntos. El día que cerremos el seed, empezamos a escribir código."

---

## Slide 8: Roadmap + Tracción

```
Mes 0   ──── Seed cerrado
            │
Mes 1-4 ──── Desarrollo MVP (part-time 50%)
            │ Setup → CRUD → Búsqueda → Checklist → Comparación
            │ (4 meses + 1 mes buffer)
Mes 4   ──── 🚀 LANZAMIENTO PÚBLICO
            │
Mes 5-6 ──── Onboarding dealers + primeras transacciones
            │
Mes 7-9 ──── Escrow + inspecciones + IA fotos
            │
Mes 10-12 ── App nativa + expansión regional inicio
            │
Mes 12   ──── 🏁 2,000 autos + $1,500+/mes MRR
```

### Tracción proyectada — Año 1

| Métrica | Mes 4 | Mes 6 | Mes 9 | Mes 12 |
|---------|:-----:|:-----:|:-----:|:------:|
| Autos publicados | 100 | 500 | 1,000 | **2,000** |
| Dealers activos | 5 | 15 | 30 | **50+** |
| Usuarios registrados | 500 | 2,000 | 5,000 | **10,000** |
| MRR | $0 | $200 | $800 | **$1,500+** |

> 🎙️ **Speaker note:** "El MVP se construye en 4 meses con el equipo part-time — mantenemos nuestros trabajos actuales durante el desarrollo para no quemar efectivo. Al mes 4 lanzamos. Al mes 12 tenemos 2,000 autos, 50 dealers activos, y más de $1,500 mensuales recurrentes. El buffer de 1 mes nos protege si algo se atrasa."

---

## Slide 9: Proyecciones Financieras

### P&L Proyectado (3 años)

| | Año 1 | Año 2 | Año 3 |
|---|:-----:|:-----:|:-----:|
| **Ingresos** | **$12,000** | **$112,000** | **$410,000** |
| Costos operativos | $111,740 | $140,000 | $175,000 |
| **Utilidad / (Pérdida)** | **($99,740)** | **($28,000)** | **+$235,000** |
| Margen neto | -831% | -25% | **+57%** |

### Detalle Año 3

| Fuente de ingreso | Ingreso |
|-------------------|:-------:|
| Premium particulares | $60,000 |
| Suscripción dealers | $120,000 |
| Comisión escrow (3-5%) | $150,000 |
| Inspecciones | $50,000 |
| Publicidad | $30,000 |
| **Total** | **$410,000** |

### 3 escenarios de sensibilidad

| Escenario | Ingreso Año 3 | Resultado Año 3 |
|:---------:|:-------------:|:----------------:|
| Pesimista (CAC 2x, conversiones 50%) | $165,000 | ~($10,000) — cerca de break-even |
| **Base** (plan actual) | **$410,000** | **+$235,000** |
| Optimista (conversiones 1.5x) | $700,000 | +$525,000 |

> 🎙️ **Speaker note:** "Llegamos a break-even al final del año 2 y somos rentables en año 3 con margen del 57%. Incluso en el escenario pesimista — con el doble de CAC y la mitad de conversiones — el negocio no quiebra. Las 5 fuentes de ingreso nos protegen: no dependemos de una sola línea. Esto no es humo: los números están modelados con supuestos conservadores y respaldados por research con fuentes citadas."

---

## Slide 10: El Ask + Términos + Salida

### Solicitamos $150,000 - $250,000 (Seed)

```
Uso de fondos:

Salarios (7 personas, 12 meses)  ████████████████████████░ 78%
Marketing + adquisición           ████████░░░░░░░░░░░░░░░░░ 9%
Infraestructura + herramientas    ████░░░░░░░░░░░░░░░░░░░░ 4%
Legal + constitución              ███░░░░░░░░░░░░░░░░░░░░░ 3%
Reserva                           ██████░░░░░░░░░░░░░░░░░░░ 6%
```

### Términos de inversión

| Concepto | Valor |
|----------|-------|
| Pre-money valuation | **$700K** |
| Inversión objetivo | **$200K** |
| Dilución al inversor | **22.2%** |
| Instrumento | **SAFE (YC standard)** |
| Valuation Cap | **$1.5M** |
| Discount Rate | 20% |
| Runway | **18-24 meses** |

### ¿Cómo gana plata el inversor?

| Escenario | Probabilidad | Retorno al inversor | Múltiplo |
|:---------:|:-----------:|:-------------------:|:--------:|
| Serie A ($5M pre) | 40% | **$1.1M** | **5.5x** |
| Adquisición ($2-5M) | 25% | **$500K-850K** | **2.5-4.3x** |
| Dividendos / Buyback | 35% | **$200-400K** | **1-2x** |
| **Expected Value** | | **~$1.15M** | **~5.8x** |

### 6 razones para invertir

1. **Mercado real:** $400-800M en Nicaragua, $7B+ en Centroamérica. Sin competidor especializado.
2. **Founder-market fit:** Developer + fanático de autos + ya inspecciona. Nadie más combina eso.
3. **Equipo listo:** 7 personas que ya trabajan juntas. Cero riesgo de contratación.
4. **Ejecución lean:** MVP en 4 meses part-time. Oficina en $0. Quemamos en lo que importa.
5. **Múltiples fuentes de ingreso:** Marketplace + suscripciones + escrow + inspecciones + ads.
6. **Camino a rentabilidad:** Año 3 con margen del 57%. EV de **~5.8x** para el inversor seed.

---

## Contacto

**Gershell Lopez** — CEO & Lead Architect

- LinkedIn: [linkedin.com/in/gershell-lopez](https://www.linkedin.com/in/gershell-lopez/)
- Email: —

---

*Estela — El marketplace de autos que Nicaragua merece.*

---

## 📋 Instrucciones para exportar a Google Slides / PowerPoint

### Estilo visual recomendado
- **Fondo:** Blanco o gris muy claro (#f8f9fa)
- **Color primario:** Azul corporativo (#2563eb o similar)
- **Color secundario:** Verde para datos positivos (#16a34a)
- **Tipografía:** Inter (sistema) para slides, Mono para tablas/datos
- **Formato:** 16:9 widescreen

### Para cada slide:
1. Crear slide en blanco 16:9
2. Título en左上, contenido centrado
3. Tablas con bordes finos, celdas alternadas
4. Speaker notes en la sección "Notas del orador" de cada slide

### Imágenes a incluir:
- **Slide 2 (Demo):** Insertar screenshots de:
  - `Technical/Wireframes/02-search.png` (búsqueda con filtros)
  - `Technical/Wireframes/03-car-detail.png` (car detail + condition score)
- **Slide 2 (opcional):** `Technical/Wireframes/01-landing.png` (hero section)
- **Slide 2 (opcional):** `Technical/Wireframes/04-publish-wizard.png` (publish flow)

### Material adicional para data room:
- `Business Plan/09-Financial-Projections.md` — detalle de ingresos
- `Business Plan/12-Unit-Economics.md` — CAC/LTV por segmento
- `Business Plan/13-Cap-Table.md` — estructura legal y SAFE
- `Business Plan/14-Exit-Strategy.md` — escenarios de salida detallados
- `Business Plan/Investor-One-Pager.md` — resumen de 1 página
