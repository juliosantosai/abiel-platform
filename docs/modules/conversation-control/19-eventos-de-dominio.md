Siguiente documento:

`docs/modules/conversation-control/19-eventos-de-dominio.md`

````md
# COPILOT CONTEXT — Eventos de Dominio
# Módulo Conversation Control

## Objetivo

Definir los eventos de dominio generados por la máquina de estados de conversación.

Los eventos representan hechos ocurridos dentro del sistema.

No ejecutan acciones directamente.

---

# Principio

Un evento significa:

"Algo ocurrió"

Ejemplo:

```text
Un humano tomó control de la conversación
````

↓

Evento:

```text
HumanInterventionDetected
```

---

Los consumidores deciden qué hacer.

---

# Estructura base

Todos los eventos deben heredar de:

```text
DomainEvent
```

---

Ejemplo:

```js
class HumanInterventionDetected
extends DomainEvent
{

}
```

---

# Datos comunes del evento

Todos los eventos deben incluir:

```json
{
 eventId,
 aggregateId,
 empresaId,
 occurredAt,
 version
}
```

---

# HumanInterventionDetected

## Descripción

Se genera cuando un humano empieza a participar en una conversación.

---

Evento:

```text
HumanInterventionDetected
```

---

Payload:

```json
{
 conversationId,
 empresaId,
 humanUserId,
 messageId,
 detectedAt
}
```

---

Ejemplo:

```text
BOT_ACTIVE

↓

Cliente conversa

↓

Vendedor responde

↓

HumanInterventionDetected
```

---

# HumanModeActivated

## Descripción

Confirma que la conversación pasó a modo humano temporal.

---

Cambio:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

Payload:

```json
{
 conversationId,
 empresaId,
 reason,
 activatedBy
}
```

---

# HumanModeLocked

## Descripción

Bloqueo permanente de la IA.

---

Cambio:

```text
*

↓

HUMAN_LOCKED
```

---

Payload:

```json
{
 conversationId,
 empresaId,
 reason,
 userId
}
```

---

Ejemplos:

* cliente VIP
* negociación manual
* soporte especial

---

# HumanTimeoutReached

## Descripción

Indica que terminó el período de actividad humana.

---

Condición:

```text
HUMAN_ACTIVE

+

5 minutos sin actividad
```

---

Cambio:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

Payload:

```json
{
 conversationId,
 empresaId,
 lastHumanActivity,
 timeoutAt
}
```

---

# BotResumeRequested

## Descripción

Solicitud de retorno del bot.

---

Se produce cuando:

* timeout cumplido
* validación aprobada

---

Payload:

```json
{
 conversationId,
 empresaId
}
```

---

# BotResumed

## Descripción

Confirma que el bot recuperó control.

---

Cambio:

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

Payload:

```json
{
 conversationId,
 empresaId,
 resumedAt
}
```

---

# ConversationLocked

## Descripción

Conversación protegida contra automatizaciones.

---

Uso:

Auditoría.

---

Payload:

```json
{
 conversationId,
 empresaId,
 reason
}
```

---

# ConversationUnlocked

## Descripción

Se elimina bloqueo humano permanente.

---

Importante:

No activa IA automáticamente.

---

Cambio:

```text
HUMAN_LOCKED

↓

BOT_RESUME_PENDING
```

---

Payload:

```json
{
 conversationId,
 empresaId,
 unlockedBy
}
```

---

# MessageReceived

## Descripción

Nuevo mensaje recibido.

---

Puede ser:

```text
CUSTOMER
HUMAN
BOT
```

---

Payload:

```json
{
 conversationId,
 empresaId,
 senderType,
 content,
 externalMessageId
}
```

---

# MessageProcessed

## Descripción

Mensaje procesado correctamente.

---

Payload:

```json
{
 messageId,
 conversationId
}
```

---

# LearningDataCaptured

## Descripción

Información útil obtenida durante interacción humana.

---

Importante:

Este evento NO activa respuestas.

---

Ejemplo:

Humano responde:

```text
"Los envíos tardan 24 horas"
```

---

Sistema:

```text
LearningDataCaptured
```

---

Puede alimentar:

* base conocimiento
* entrenamiento
* analytics

---

# Evento prohibido

No crear eventos como:

```text
BotSendMessageNow
```

---

Motivo:

El dominio no debe ordenar acciones externas.

---

Correcto:

```text
BotCanRespond
```

↓

Application decide enviar.

---

# Flujo completo de eventos

Ejemplo:

## Cliente inicia

```text
MessageReceived
```

↓

```text
Bot responde
```

---

## Humano interviene

```text
HumanInterventionDetected
```

↓

```text
HumanModeActivated
```

---

## Cinco minutos sin actividad

```text
HumanTimeoutReached
```

↓

```text
BotResumeRequested
```

---

## Retoma IA

```text
BotResumed
```

---

# Persistencia de eventos

Opcional:

Guardar:

```text
domain_events
```

---

Campos:

```text
id

type

aggregateId

empresaId

payload

createdAt
```

---

Uso:

* auditoría
* integración
* debugging
* analytics

---

# Tests obligatorios

## HumanInterventionDetected

Validar:

* evento creado
* empresa correcta
* conversación correcta

---

## HumanModeLocked

Validar:

* bloqueo permanente
* motivo registrado

---

## HumanTimeoutReached

Validar:

* tiempo correcto
* transición correcta

---

## BotResumed

Validar:

* regreso a BOT_ACTIVE

---

# Restricciones Copilot

* Eventos representan hechos.
* No contienen lógica de negocio.
* No llaman APIs externas.
* No envían mensajes.
* Mantener event-driven.
* Todos los eventos respetan empresaId/tenant.

```
```
