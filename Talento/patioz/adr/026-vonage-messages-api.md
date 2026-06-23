---
tipo: adr
fecha: 2026-06-22
estado: propuesto
proyecto: patioz-be
implementado: pendiente
tags:
  - adr
decision: "Reemplazar Twilio por Vonage Messages API como proveedor único de SMS + WhatsApp"
reemplaza: [ADR-008]
---

# ADR-026: Vonage Messages API para Notificaciones SMS + WhatsApp

## Contexto

Actualmente las notificaciones SMS se envían mediante Twilio, utilizado exclusivamente para recordatorios de visitas (24h y 1h antes). El envío es asíncrono vía BullMQ siguiendo el patrón contracts/adapters definido en ADR-012.

No existe actualmente un canal de WhatsApp implementado, pero se desea agregarlo.

Twilio resulta **overengineering** para el volumen y simplicidad del caso de uso: su SDK es pesado, su modelo de pricing es caro para el volumen actual, y mantenerlo solo para SMS no justifica la complejidad.

## Decisión

Migrar de Twilio a **Vonage Messages API** como proveedor único de notificaciones.

Vonage (antes Nexmo, adquirido por Ericsson en 2022) ofrece una API unificada que cubre SMS + WhatsApp a través de un solo endpoint y un solo SDK (`@vonage/server-sdk`). No requiere verificaciones externas ni procesos de onboarding complejos — solo una API key.

## Alternativas Consideradas

| Alternativa | Pros | Contras |
|---|---|---|
| **Vonage Messages API** | Un solo SDK para SMS+WhatsApp; 15+ años de trayectoria (Nexmo → Vonage → Ericsson); 1.6M+ developers; pay-as-you-go sin mínimos; Node.js SDK maduro; sin verificación de negocio | Nueva dependencia externa |
| **Twilio (status quo)** | Battle-tested; ya implementado; un solo provider | Caro; SDK pesado; overengineering para el volumen actual; WhatsApp ni siquiera se usa |
| **Sent.dm** | API moderna; channel routing automático; maneja compliance | Poco track record (~2024); empresa nueva sin respaldo grande |
| **AWS SNS + WhatsApp Cloud API** | Sin nuevas dependencias AWS (aws-sdk ya existe); SNS es trivial | Meta requiere verificación de negocio (días/semanas); dos integraciones separadas; compliance manual |

## Consecuencias

### Positivas
- Se elimina la dependencia `twilio` del `package.json`
- Se simplifica el adapter a una sola implementación (`vonage-messages.adapter.ts`) que maneja ambos canales
- Vonage no requiere verificación de negocio ni procesos de aprobación de templates externos
- Sin cambios en el flujo BullMQ ni en la estructura del módulo de notificaciones
- Costo menor: SMS ~$0.008/msg (vs Twilio que suele ser más caro); WhatsApp: platform fee desde €0.0001/msg + Meta conversation fee (~$0.015/conv utility)

### Negativas
- Dependencia de un nuevo proveedor externo
- Requiere migrar los templates de SMS actuales al formato de Vonage
- Se necesita una API key de Vonage y configurarla en el entorno

### Riesgos
- Bajo: Vonage tiene alta disponibilidad y track record; el cambio es localizado al adapter
- El contrato `IMessageSender` (o `INotificationSender`) abstrae al proveedor, el resto del sistema no se entera del cambio

## Estado

- [x] Propuesto
- [ ] Aceptado
- [ ] Rechazado
- [ ] Reemplazado por ADR-XXX
