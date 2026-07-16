Siguiente documento:

`docs/modules/conversation-control/25-eventos-de-dominio.md`

````md id="72mqa"
# COPILOT CONTEXT — Eventos de Dominio Conversation Control
# Módulo Conversation Control

## Objetivo

Definir los eventos de dominio utilizados para comunicar cambios importantes dentro del sistema de conversaciones.

Los eventos representan hechos que ya ocurrieron.

Ejemplo:

Correcto:

```text
HumanInterventionDetected
````

Incorrecto:

```text
ActivateHumanModeCommand
```

---

# Principio

El dominio genera eventos.

Los consumidores reaccionan.

Flujo:

```text
Entidad

↓

Evento de Dominio

↓

Event Bus

↓

Handlers

↓

Acciones secundarias
```

---

# Evento: ConversationCreated

## Descripción

Se genera cuando una nueva conversación es creada.

---

Payload:

```json
{
 conversationId,
 empresaId,
 clienteId,
 createdAt
}
```

---

Consumidores posibles:

* analytics
* métricas
* bienvenida inicial

---

# Evento: MessageReceived

## Descripción

Se genera cuando un mensaje ingresa al sistema.

---

Payload:

```json
{
 conversationId,
 senderType,
 content,
 timestamp
}
```

---

Puede provenir de:

* cliente
* humano
* bot
* sistema

---

# Evento: HumanInterventionDetected

## Descripción

Indica que un humano tomó control de la conversación.

---

Cuándo ocurre:

```text
BOT_ACTIVE

+

mensaje humano detectado

↓

HumanInterventionDetected
```

---

Payload:

```json
{
 conversationId,
 operatorId,
 source,
 timestamp
}
```

---

Consumidores:

* cambiar estado conversación
* detener respuestas IA
* registrar métrica

---

# Evento: HumanModeActivated

## Descripción

La conversación entró oficialmente en modo humano.

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
activatedAt,
reason
}
```

---

# Evento: HumanModeLocked

## Descripción

El humano bloqueó permanentemente el bot.

---

Estado:

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
operatorId,
reason,
timestamp
}
```

---

Prioridad:

MÁXIMA.

---

# Evento: HumanTimeoutReached

## Descripción

Se detectó que el humano dejó de interactuar.

---

Condición:

```text
HUMAN_ACTIVE

+

5 minutos sin actividad
```

---

Payload:

```json
{
conversationId,
lastHumanActivity,
detectedAt
}
```

---

Resultado esperado:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

# Evento: BotResumeRequested

## Descripción

El sistema solicita que el bot vuelva.

---

Antes:

```text
BOT_RESUME_PENDING
```

---

Payload:

```json
{
conversationId,
requestedAt
}
```

---

# Evento: BotResumed

## Descripción

El bot recuperó el control.

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
resumedAt
}
```

---

# Evento: LearningCaptured

## Descripción

Se registró aprendizaje proveniente de intervención humana.

---

Importante:

Este evento NO activa respuestas.

---

Payload:

```json
{
conversationId,
source,
data,
capturedAt
}
```

---

Ejemplos:

* respuesta comercial
* solución frecuente
* objeción
* intención cliente

---

# Evento: ConversationClosed

## Descripción

Conversación finalizada.

---

Payload:

```json
{
conversationId,
closedAt,
reason
}
```

---

# Orden de prioridad de eventos

En caso de conflicto:

```text
1. HumanModeLocked

2. HumanModeActivated

3. BotResume

4. BotMessage
```

---

Nunca:

```text
BotResumed
```

puede ejecutarse si existe:

```text
HumanModeLocked
```

---

# Persistencia de eventos

Los eventos deben poder almacenarse.

Recomendado:

```text
Outbox Pattern
```

---

Flujo:

```text
Cambio dominio

↓

Guardar entidad

↓

Guardar evento

↓

Publicador

↓

Consumidores
```

---

# Metadata obligatoria

Todos los eventos deben incluir:

```json
{
eventId,
aggregateId,
occurredAt,
tenantId,
version
}
```

---

# Reglas multi-tenant

Todo evento debe contener:

```text
empresaId
```

o:

```text
tenantId
```

---

Nunca publicar eventos sin tenant.

---

# Tests obligatorios

Cada evento debe validar:

* creación correcta
* payload completo
* tenant presente
* fecha generada

---

# Restricciones Copilot

* Eventos representan hechos.
* No ejecutar lógica dentro del evento.
* No llamar APIs externas desde eventos.
* No cambiar estados directamente desde handlers.
* Todo pasa por casos de uso.
* Mantener trazabilidad completa.

```
```
