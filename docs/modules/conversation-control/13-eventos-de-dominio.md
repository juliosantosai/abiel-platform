Siguiente documento:

`docs/modules/conversation-control/13-eventos-de-dominio.md`

````md id="74291"
# COPILOT CONTEXT — Eventos de Dominio
# Módulo Conversation Control

## Objetivo

Definir los eventos de dominio generados por la máquina de estados de conversación.

Los eventos representan hechos que ya ocurrieron.

No ejecutan lógica directamente.

---

# Principio

Incorrecto:

```text
Evento → cambia estado
````

Correcto:

```text
Entidad cambia estado

↓

Entidad genera evento

↓

Sistema reacciona
```

---

# ConversationCreated

## Descripción

Se genera cuando una nueva conversación es creada.

---

Payload:

```js
{
 conversationId,

 empresaId,

 clienteId,

 timestamp
}
```

---

Consumidores posibles:

* Analytics
* CRM
* Métricas
* Memoria conversacional

---

# HumanInterventionDetected

## Descripción

Indica que un humano tomó participación en la conversación.

---

Cuándo ocurre:

Ejemplo:

```
BOT_ACTIVE

↓

Empleado responde WhatsApp

↓

HUMAN_ACTIVE
```

---

Payload:

```js
{
 conversationId,

 empresaId,

 source,

 detectedAt
}
```

---

# HumanModeLocked

## Descripción

Indica que la conversación queda bajo control humano permanente.

---

Ejemplos:

* vendedor toma cliente
* caso especial
* cliente importante
* soporte avanzado

---

Payload:

```js
{
 conversationId,

 empresaId,

 userId,

 reason,

 lockedAt
}
```

---

# HumanTimeoutReached

## Descripción

Indica que terminó el período de espera después de una intervención humana.

---

Regla:

```
Sin actividad humana

+

5 minutos

=

Timeout
```

---

Payload:

```js
{
 conversationId,

 empresaId,

 lastHumanActivity,

 detectedAt
}
```

---

# BotResumeAvailable

## Descripción

Indica que el bot puede volver a tomar control.

---

Importante:

Este evento NO activa el bot.

Solo informa.

---

Ejemplo:

```
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING

↓

BotResumeAvailable
```

---

Payload:

```js
{
 conversationId,

 availableAt
}
```

---

# BotResumed

## Descripción

Indica que el bot recuperó control.

---

Transición:

```
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

Payload:

```js
{
 conversationId,

 resumedAt
}
```

---

# HumanMessageObserved

## Descripción

Representa un mensaje humano observado para aprendizaje.

---

Importante:

No cambia estado.

---

Uso:

* entrenamiento
* análisis
* mejora comercial

---

Payload:

```js
{
 conversationId,

 messageId,

 content,

 userId,

 timestamp
}
```

---

# ConversationLearningUpdated

## Descripción

Indica que el sistema aprendió información de una conversación humana.

---

Ejemplo:

Humano responde:

```
Nuestro delivery demora 24 horas
```

---

Sistema genera:

```
Nueva regla detectada
```

---

Payload:

```js
{
 conversationId,

 knowledgeId,

 source
}
```

---

# Reglas de eventos

Todos los eventos deben contener:

```js
{
 eventId,

 aggregateId,

 occurredAt,

 version
}
```

---

Ejemplo:

```json
{
 "eventId":"uuid",

 "aggregateId":"conversation-id",

 "occurredAt":"date",

 "version":1
}
```

---

# Reglas de publicación

Los eventos:

SI:

* salen desde dominio/application
* pasan por EventPublisher
* permiten comunicación desacoplada

---

NO:

* llamar APIs externas
* enviar WhatsApp
* modificar base directamente

---

# Flujo ejemplo completo

```
Cliente escribe

↓

BOT_ACTIVE


Humano responde

↓

HumanInterventionDetected


Estado:

HUMAN_ACTIVE


5 minutos sin humano

↓

HumanTimeoutReached


Estado:

BOT_RESUME_PENDING


Validación

↓

BotResumed


Estado:

BOT_ACTIVE
```

---

# Consumidores futuros

Estos eventos pueden alimentar:

* Analytics
* Auditoría
* CRM
* Aprendizaje IA
* Métricas comerciales
* Historial de atención

---

# Tests obligatorios

Validar:

## Creación

Debe emitir:

```
ConversationCreated
```

---

## Intervención

Debe emitir:

```
HumanInterventionDetected
```

---

## Bloqueo

Debe emitir:

```
HumanModeLocked
```

---

## Timeout

Debe emitir:

```
HumanTimeoutReached
```

---

## Reanudación

Debe emitir:

```
BotResumed
```

---

# Restricciones Copilot

* Eventos representan hechos.
* No contienen reglas de transición.
* No contienen llamadas externas.
* Mantener patrón usado en Empresa y Usuario.
* Preparar para arquitectura event-driven.

```
```
