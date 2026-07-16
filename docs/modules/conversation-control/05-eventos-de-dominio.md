Siguiente documento:

`docs/modules/conversation-control/05-eventos-de-dominio.md`

````md
# COPILOT CONTEXT — Eventos de Dominio
# Módulo Conversation Control

## Objetivo

Definir los eventos de dominio generados por la máquina de estados de intervención humana.

Los eventos representan hechos ocurridos dentro del dominio.

No son comandos.

Ejemplo correcto:

```js
HumanInterventionDetected
````

Ejemplo incorrecto:

```js
DetectHuman()
```

---

# Principio

La entidad ConversationSession cambia su estado y genera eventos.

Los eventos serán consumidos por:

* motor de IA
* sistema de aprendizaje
* analytics
* notificaciones
* automatizaciones

---

# Evento: HumanInterventionDetected

## Descripción

Indica que un humano comenzó a participar en una conversación.

---

## Cuándo ocurre

Cuando:

* llega un mensaje humano real
* la conversación estaba controlada por el bot
* el dominio confirma que debe entregar control

---

## Cambio de estado

```text
BOT_ACTIVE

      ↓

HUMAN_ACTIVE
```

---

## Payload

```js
{
    conversationId,
    empresaId,
    clienteId,
    usuarioHumanoId,
    detectedAt,
    source
}
```

---

## Source permitido

Ejemplos:

```text
WHATSAPP_MANUAL
ADMIN_PANEL
EVOLUTION_API
```

---

# Evento: HumanModeActivated

## Descripción

Confirma que la conversación está oficialmente bajo control humano.

---

## Payload

```js
{
    conversationId,
    empresaId,
    activatedAt
}
```

---

## Consumidores

Puede activar:

* bloqueo del bot
* pausa de automatizaciones
* registro de atención humana

---

# Evento: HumanTimeoutReached

## Descripción

Indica que pasó el tiempo configurado sin actividad humana.

Tiempo inicial:

```text
5 minutos
```

---

## Cambio esperado

```text
HUMAN_ACTIVE

       ↓

BOT_RESUME_PENDING
```

---

## Payload

```js
{
    conversationId,
    empresaId,
    lastHumanMessageAt,
    timeoutAt
}
```

---

# Evento: BotResumeRequested

## Descripción

Indica que el sistema puede evaluar devolver control a la IA.

No significa que el bot ya está activo.

---

## Payload

```js
{
    conversationId,
    empresaId,
    requestedAt
}
```

---

# Evento: BotResumed

## Descripción

Confirma que la IA recuperó control.

---

## Cambio de estado

```text
BOT_RESUME_PENDING

          ↓

BOT_ACTIVE
```

---

## Payload

```js
{
    conversationId,
    empresaId,
    resumedAt
}
```

---

# Evento: HumanModeLocked

## Descripción

Representa una intervención humana permanente.

La IA no debe recuperar control automáticamente.

---

## Casos que generan este evento

Ejemplo:

Un operador escribe manualmente:

```text
"Yo continúo la atención"
```

o activa bloqueo desde una herramienta administrativa.

---

## Cambio de estado

```text
BOT_ACTIVE
        ↓
HUMAN_LOCKED
```

o

```text
HUMAN_ACTIVE
        ↓
HUMAN_LOCKED
```

---

## Payload

```js
{
    conversationId,
    empresaId,
    reason,
    lockedAt,
    lockedBy
}
```

---

# Evento: ConversationObserved

## Descripción

Indica que la IA está observando una conversación humana.

No permite responder.

---

## Objetivo

Permitir aprendizaje:

* analizar preguntas
* identificar respuestas humanas
* mejorar conocimiento empresarial
* entrenar memoria

---

## Payload

```js
{
    conversationId,
    empresaId,
    messageId,
    analyzedAt
}
```

---

# Evento: BotResponseBlocked

## Descripción

Se genera cuando una solicitud de respuesta IA es rechazada por la máquina de estados.

---

## Ejemplo

Motor IA intenta responder:

```text
Cliente pregunta precio
```

Estado:

```text
HUMAN_ACTIVE
```

Resultado:

```text
Respuesta bloqueada
```

---

## Payload

```js
{
    conversationId,
    empresaId,
    currentState,
    blockedAt,
    reason
}
```

---

# Reglas para eventos

## Los eventos son inmutables

Nunca modificar:

```js
event.state = "nuevo"
```

---

## Los eventos contienen hechos

Correcto:

```js
BotResumed
```

Incorrecto:

```js
ResumeBotCommand
```

---

## Los eventos no conocen infraestructura

No importar:

* Prisma
* Evolution API
* WhatsApp SDK
* OpenAI SDK

---

# Integración esperada

Flujo completo:

```text
Evolution API
        |
        ↓
Message Adapter
        |
        ↓
ConversationSession
        |
        ↓
Domain Event
        |
        ↓
Event Bus
        |
        ↓
IA / Learning / Analytics
```

---

# Restricciones para Copilot

Al implementar:

* Crear cada evento como clase independiente.
* Heredar de DomainEvent compartido.
* Mantener payload mínimo.
* No colocar lógica dentro del evento.
* La entidad genera eventos.
* Los casos de uso publican eventos.
* Los consumidores reaccionan a eventos.

```
```
