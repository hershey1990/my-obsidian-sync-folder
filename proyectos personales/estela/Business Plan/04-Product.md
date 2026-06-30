---
section: "business-plan"
order: 4
title: "Producto"
status: "borrador"
---

# Producto

## Visión

Ser la plataforma de referencia en Nicaragua (y luego Centroamérica) para comprar, vender e intercambiar autos — donde los usuarios van primero cuando necesitan un auto, no después de revisar Facebook.

## MVP (3-4 meses)

### Core features

1. **Registro de usuarios** — comprador, vendedor particular, dealer
   - Verificación de identidad (cédula + selfie)
   - Perfil con foto, teléfono, reputación

2. **Publicación de autos (vendedor particular)**
   - Catálogo de modelos precargado (marca, modelo, año, versión)
   - Campos específicos de auto: km, transmisión, motor, combustible, tracción, color, puertas, etc.
   - Carga de fotos (múltiples, obligatorias)
   - Checklist de condición digital (score de 1-100)
   - Precio + negociable/no negociable

3. **Publicación de autos (dealer)**
   - Perfil de concesionario (logo, dirección, años de operación)
   - Inventario múltiple
   - Badge de "Dealer Verificado"
   - Plan gratuito (5 autos) + planes pagos (ilimitado)

4. **Búsqueda y descubrimiento**
   - Búsqueda por palabra clave
   - Filtros: marca, modelo, año (rango), km (rango), precio (rango), transmisión, combustible, condición, ubicación
   - Vista de resultados con fotos grandes, precio, km, score de condición

5. **Página de detalle del auto**
   - Galería de fotos
   - Score de condición desglosado (exterior, interior, mecánica, documentos)
   - Precio, km, año, transmisión, todos los detalles
   - Información del vendedor (particular vs dealer, reputación)
   - Botón de contacto / WhatsApp

6. **Comparación de modelos** ⭐
   - Desde la ficha de un auto, botón "Comparar con..."
   - Base de datos de modelos con specs (independiente de listings)
   - Ej: Yaris 2018 vs Honda City 2018 vs Kia Rio 2018
   - Tabla lado a lado: precio de mercado, dimensiones, motor, consumo, etc.

7. **Comparación de ofertas** ⭐
   - Todos los listados activos de un mismo modelo lado a lado
   - Precio, km, año, condición score — ordenable

8. **Score de condición digital** ⭐
   - Checklist estandarizado de 30-40 puntos
   - Categorías: Exterior (rayones, abolladuras, pintura, llantas), Interior (asientos, tablero, aire, stereo), Mecánica (motor, transmisión, frenos, suspensión), Documentación (marchamo, multas, gravámenes)
   - Score ponderado 1-100 con breakdown visual
   - Fotos vinculadas a cada sección

### Plataforma
- Web responsiva (PWA) para MVP
- App nativa (post-MVP, si hay tracción)
- Chat integrado (WhatsApp API o chat propio)

## Post-MVP (6-12 meses)

### Servicio de intermediación (Escrow) ⭐
Protección comprador-vendedor:
1. Comprador deposita el dinero en Estela
2. Se realiza inspección y transferencia legal del auto
3. Estela libera el pago al vendedor
4. Comisión: 3-5% del precio de venta

### Inspección presencial programada ⭐
- **Básica** ($30): exterior, interior, mecánica general, documentos
- **Completa** ($50): + prueba de manejo, scanner OBD2, diagnóstico transmisión
- **Certificación Estela** ($100): + garantía de condición (si no corresponde, respondemos)

### Otras features
- **Historial del vehículo**: integración con tránsito/registro para multas, robos, gravámenes
- **IA en fotos**: detección automática de daños, puntuación automática del score
- **Calculadora de financiamiento**: cuánto pagarías con cada banco
- **Valor de reventa estimado**: basado en datos de la plataforma
- **Subastas**: ofertas en tiempo real por autos específicos
- **App móvil nativa**: iOS + Android
- **Marketplace de servicios**: talleres, seguros, detailing (referral fee)

## Roadmap visual

```
Mes 1-4:  Desarrollo MVP + beta (backend + frontend web)
          Incluye 1 mes de buffer para imprevistos
Mes 4:    🚀 Lanzamiento público MVP
Mes 5-6:  Iteración + onboarding de dealers
Mes 7-9:  Escrow + inspecciones programadas + IA fotos
Mes 10-12: App nativa + historial vehicular + expansión
```

## Métricas objetivo (primer año)

| Métrica | Meta |
|---------|------|
| Autos publicados | 1,000+ |
| Transacciones completadas | 100+ |
| Usuarios registrados | 10,000+ |
| Dealers activos | 30+ |
| Score de condición completados | 500+ |
