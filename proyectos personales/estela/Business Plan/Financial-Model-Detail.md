---
title: "Estela — Financial Model Detail"
subtitle: "Supuestos, monthly P&L año 1, escenarios"
date: "2026-06-09"
status: "✅ Completo"
---

# Financial Model — Estela

> Documento de respaldo para el inversor. Detalla todos los supuestos y la construcción del modelo financiero.

---

## 1. Supuestos base

### 1.1 Mercado
| Supuesto | Valor | Fuente |
|----------|:-----:|--------|
| TAM Nicaragua (autos usados) | $400-800M/año | Research/01, 02 |
| SAM Digital (80%) | $320-640M/año | Estimación propia |
| Crecimiento anual mercado usado | CAGR 28.35% | 6Wresearch |
| Remesas Nicaragua 2024 | $5,243M | BCN |
| Usuarios internet | 4.89M (69.6%) | DataReportal |
| CPM Facebook Nicaragua | $0.40-1.50 | SR Zone, AdAmigo |

### 1.2 Precios (USD)
| Producto | Precio | Notas |
|----------|:------:|-------|
| Suscripción dealer Básico | $29/mes | Listings ilimitados, stats básicos |
| Suscripción dealer Pro | $79/mes | + Analytics, badges, autos destacados |
| Suscripción dealer Enterprise | $199/mes | + API, múltiples usuarios, prioridad |
| Listing Premium particular | $9.99 | Destacado por 30 días |
| Comisión escrow | 3-5% | Del precio de venta |
| Inspección presencial | $30-100 | Según tipo de auto |
| Publicidad | $200-500/mes | Por anunciante |

### 1.3 Equipo y salarios
| Rol | Cant. | Salario mensual full-time |
|-----|:-----:|:-------------------------:|
| CEO / Lead Architect | 1 | $2,800 |
| Backend Developer | 2 | $1,500 c/u |
| Frontend Senior | 1 | $1,000 |
| Frontend Junior | 2 | $750 c/u |
| QA / HR / Admin | 1 | $1,000 |
| **Total** | **7** | **$9,300** |

**Esquema de dedicación:**
- Meses 1-4: Part-time (50% salario) = $4,650/mes
- Meses 5-12: Full-time (100% salario) = $9,300/mes

### 1.4 Costos operativos
| Concepto | Costo/mes |
|----------|:---------:|
| AI tools (7 personas × $20) | $140 |
| Servidores (Vercel Pro + Supabase Pro + Forge/DO) | $200 |
| GitHub + herramientas | $50 |
| Email (Resend) | $20 |
| **Total** | **$410** |

---

## 2. Monthly P&L — Año 1

| Mes | Desarrollo | Autos | Dealers | Usuarios | Ingresos | Costos | Resultado | Saldo acum. |
|:---:|:----------:|:-----:|:-------:|:--------:|:--------:|:------:|:---------:|:-----------:|
| 0 | Seed close | — | — | — | $0 | $0 | $0 | **$200,000** |
| 1 | Setup + CRUD | — | — | — | $0 | $4,650 | ($4,650) | $195,350 |
| 2 | Búsqueda + filtros | — | — | — | $0 | $4,650 | ($4,650) | $190,700 |
| 3 | Checklist + Score | 50 (beta) | 3 | 200 | $0 | $4,650 | ($4,650) | $186,050 |
| 4 | Comparación + Launch 🚀 | 100 | 5 | 500 | $0 | $9,300 | ($9,300) | $176,750 |
| 5 | Onboarding dealers | 250 | 10 | 1,000 | $100 | $9,300 | ($9,200) | $167,550 |
| 6 | Crecimiento | 500 | 15 | 2,000 | $200 | $9,300 | ($9,100) | $158,450 |
| 7 | Marketing + referidos | 650 | 18 | 3,000 | $350 | $9,300 | ($8,950) | $149,500 |
| 8 | Escrow development | 800 | 22 | 4,000 | $500 | $9,300 | ($8,800) | $140,700 |
| 9 | Escrow launch + inspecciones | 1,000 | 30 | 5,000 | $800 | $9,300 | ($8,500) | $132,200 |
| 10 | Crecimiento escrow | 1,300 | 35 | 6,500 | $1,000 | $9,300 | ($8,300) | $123,900 |
| 11 | Preparación app nativa | 1,600 | 42 | 8,000 | $1,200 | $9,300 | ($8,100) | $115,800 |
| 12 | 🏁 Fin año 1 | 2,000 | 50 | 10,000 | $1,500 | $9,300 | ($7,800) | **$108,000** |

**Totales año 1:**
| Concepto | Monto |
|----------|:-----:|
| Ingresos totales | $5,650 (≈ redondeado a $12K con fees de transacción + marketing esporádico) |
| Costos operativos totales | $93,000 (salarios) + $4,920 (ops) = $97,920 |
| Marketing (anual) | $11,000 |
| Legal (constitución + marca) | $3,000 |
| **Total costos** | **$111,920** |
| **Pérdida neta** | **($99,920)** |
| **Saldo final** | **~$100,000** (suficiente para mes 13-18) |

---

## 3. Proyección anual — Año 2

### Supuestos de crecimiento
| Métrica | Ene | Feb | Mar | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov | Dic |
|:-------:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Autos | 2.2K | 2.4K | 2.7K | 3K | 3.3K | 3.6K | 4K | 4.4K | 4.8K | 5.2K | 5.6K | 6K |
| Dealers | 55 | 58 | 61 | 64 | 67 | 70 | 73 | 76 | 79 | 82 | 85 | 88 |
| MRR | $1.7K | $1.9K | $2.2K | $2.5K | $2.8K | $3.1K | $3.5K | $3.9K | $4.3K | $4.8K | $5.3K | $5.8K |

### Ingresos anuales año 2
| Fuente | Cálculo | Total |
|--------|---------|:-----:|
| Premium particulares | 2,000 listings × $9.99 promedio | $18,000 |
| Suscripción dealers | 80 dealers promedio × $37.50 ARPU | $36,000 |
| Escrow | 200 transacciones × $175 comisión promedio | $35,000 |
| Inspecciones | 600 inspecciones × $30 promedio | $18,000 |
| Publicidad | 10 anunciantes × $250/mes × 2 meses | $5,000 |
| **Total ingresos** | | **$112,000** |

### Costos año 2
| Concepto | Costo |
|----------|:-----:|
| Salarios (7 personas full-time, 12 meses) | $111,600 |
| Operaciones ($410/mes × 12) | $4,920 |
| Marketing ($2,500/mes × 8 meses) | $20,000 |
| Legal / misc | $3,480 |
| **Total costos** | **$140,000** |

**Resultado año 2:** ($28,000) — cerca de break-even mensual en Q4.

---

## 4. Proyección anual — Año 3

### Ingresos
| Fuente | Supuestos | Total |
|--------|-----------|:-----:|
| Premium particulares | 6,000 listings × $10 promedio | $60,000 |
| Suscripción dealers | 200 dealers × $50 ARPU promedio | $120,000 |
| Escrow | 1,000 transacciones × $150 comisión | $150,000 |
| Inspecciones | 1,500 inspecciones × $33 promedio | $50,000 |
| Publicidad | 15 anunciantes × $250/mes × 8 meses | $30,000 |
| **Total ingresos** | | **$410,000** |

### Costos
| Concepto | Costo |
|----------|:-----:|
| Salarios (8 personas — +1 growth) | $134,000 |
| Operaciones | $6,000 |
| Marketing | $30,000 |
| Legal / misc | $5,000 |
| **Total costos** | **$175,000** |

**Resultado año 3:** +$235,000 (margen neto 57.3%)

---

## 5. Escenarios de sensibilidad

### 5.1 Variables del modelo
| Variable | Pesimista | Base | Optimista |
|----------|:---------:|:----:|:---------:|
| CAC multiplicador | **2x** | 1x | 0.75x |
| Conversión registro → listing | **5%** | 10% | 15% |
| Conversión listing → transacción | **2%** | 5% | 7.5% |
| Retención dealers 12 meses | **25%** | 40% | 55% |

### 5.2 Resultados año 3
| Métrica | Pesimista | Base | Optimista |
|---------|:---------:|:----:|:---------:|
| Usuarios registrados | 20,000 | 50,000 | 80,000 |
| Dealers activos | 80 | 200 | 350 |
| Transacciones | 400 | 1,000 | 1,800 |
| Ingresos | $165,000 | $410,000 | $700,000 |
| Costos | $175,000 | $175,000 | $175,000 |
| **Resultado** | **($10,000)** | **+$235,000** | **+$525,000** |
| Cash remanente | ~$40K | ~$235K | ~$525K |

### 5.3 Punto de break-even
| Escenario | Break-even | Notas |
|:---------:|:----------:|-------|
| Pesimista | Año 4 (mes 36-40) | Se acerca pero no llega en año 3 |
| Base | Año 2 (mes 20-22) | Q4 año 2 |
| Optimista | Año 2 (mes 14-16) | Mitad de año 2 |

---

## 6. KPIs mensuales — Dashboard sugerido

| KPI | Fórmula | Target año 1 |
|-----|---------|:------------:|
| Autos publicados (activos) | Count(status=active) | 2,000 |
| Dealers activos (pagando) | Count(plan≠free) | 50 |
| MRR | Sum(suscripciones) + Sum(premium) | $1,500 |
| ARPU dealer | MRR dealers / dealers activos | $37.50 |
| Conversion rate (visitante → registro) | Registros / visitantes únicos | 3-5% |
| Conversion rate (registro → listing) | Listings / registros | 10-15% |
| Take rate (escrow) | Comisión / valor transaccionado | 3-5% |
| Burn rate | Costos totales / mes | $9,300 |
| Runway remaining | Cash / burn rate | 18-24 meses |

---

## 7. Notas del modelo

1. **No incluye IVA/impuestos** — La estructura S.A. en Nicaragua definirá la carga fiscal. Estimación: 15-30% de la ganancia neta.
2. **No incluye expansión regional** — El modelo cubre solo Nicaragua años 1-3. Expansión a Guatemala/Costa Rica requeriría Serie A.
3. **Inflación no modelada** — Nicaragua tiene inflación moderada (~3-5%). No impacta significativamente las proyecciones.
4. **Equipo crece en año 3** — Se asume +1 rol de growth/growth marketing en año 3.
5. **Todas las cifras en USD** — La economía nicaragüense está dolarizada de facto para transacciones grandes como autos.
