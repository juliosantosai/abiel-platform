Siguiente documento:

`docs/modules/conversation-control/18-casos-de-uso-maquina-estados.md`

````md
# COPILOT CONTEXT — Casos de Uso Máquina de Estados
# Módulo Conversation Control

## Objetivo

Definir los casos de uso que controlan la máquina de estados de conversación.

Los casos de uso son la única entrada permitida para cambiar el estado de una conversación.

---

# Principio

Ningún adapter externo cambia estados directamente.

Incorrecto:

```text
Evolution API

↓

Cambiar estado
````

Correcto:

```text
Evolution API

↓

Evento

↓

Use Case

↓

Máquina de estados

↓

Nuevo estado
```

---

# Caso de uso: Detectar intervención humana

## Nombre

```text
DetectHumanInterventionUseCase
```

---

## Objetivo

Detectar cuándo una persona tomó control de una conversación.

---

## Entrada

Evento:

```json
{
 conversationId,
 empresaId,
 messageId,
 fromMe:true,
 sender
}
```

---

## Proceso

1. Buscar conversación.
2. Verificar origen del mensaje.
3. Confirmar que no pertenece al bot.
4. Validar tenant.
5. Cambiar estado.

---

## Resultado

Antes:

```text
BOT_ACTIVE
```

Después:

```text
HUMAN_ACTIVE
```

---

## Evento generado

```text
HumanInterventionDetected
```

---

# Caso de uso: Verificar permiso del bot

## Nombre

```text
CanBotRespondUseCase
```

---

## Objetivo

Determinar si la IA puede responder.

---

## Entrada

```json
{
 conversationId
}
```

---

## Reglas

Permitir:

```text
BOT_ACTIVE
```

---

Bloquear:

```text
HUMAN_ACTIVE
HUMAN_LOCKED
```

---

Esperar:

```text
BOT_RESUME_PENDING
```

---

## Resultado

Retorna:

```json
{
 allowed:true
}
```

o

```json
{
 allowed:false
}
```

---

# Caso de uso: Procesar timeout humano

## Nombre

```text
ProcessHumanTimeoutUseCase
```

---

## Objetivo

Detectar cuando el humano dejó la conversación.

---

## Regla:

Si:

```text
estado = HUMAN_ACTIVE
```

y:

```text
ahora - lastHumanActivity >= 5 minutos
```

---

Cambiar:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

Evento:

```text
HumanTimeoutReached
```

---

# Caso de uso: Reanudar bot

## Nombre

```text
ResumeBotUseCase
```

---

## Objetivo

Devolver control a la IA.

---

Entrada:

```text
conversationId
```

---

Validación:

Solo permitido:

```text
BOT_RESUME_PENDING
```

---

Cambio:

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

Evento:

```text
BotResumed
```

---

# Caso de uso: Bloquear conversación manualmente

## Nombre

```text
LockHumanModeUseCase
```

---

## Objetivo

Permitir que un operador bloquee la IA.

---

Ejemplo:

Vendedor:

"Esta venta la sigo yo."

---

Entrada:

```json
{
 conversationId,
 reason,
 userId
}
```

---

Cambio:

```text
BOT_ACTIVE

↓

HUMAN_LOCKED
```

---

Evento:

```text
HumanModeLocked
```

---

# Caso de uso: Desbloquear humano

## Nombre

```text
UnlockHumanModeUseCase
```

---

## Objetivo

Liberar una conversación bloqueada.

---

Importante:

No activa directamente el bot.

Flujo:

```text
HUMAN_LOCKED

↓

BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

Motivo:

Evitar respuestas inesperadas.

---

# Caso de uso: Registrar aprendizaje humano

## Nombre

```text
RegisterHumanLearningUseCase
```

---

## Objetivo

Guardar información generada durante atención humana.

---

Cuando:

```text
HUMAN_ACTIVE
```

---

El sistema:

* guarda mensajes
* analiza respuestas
* extrae patrones
* genera conocimiento

---

Pero:

Nunca:

```text
Enviar respuesta automática
```

---

# Caso de uso: Registrar mensaje

## Nombre

```text
ReceiveConversationMessageUseCase
```

---

Responsabilidad:

Registrar cualquier mensaje:

* cliente
* bot
* humano

---

Tipos:

```text
CUSTOMER
BOT
HUMAN
```

---

Después:

Evalúa máquina de estados.

---

# Flujo completo ejemplo

## Cliente pregunta

```text
Cliente:
¿Precio?
```

---

Estado:

```text
BOT_ACTIVE
```

---

Resultado:

```text
IA responde
```

---

## Humano interviene

```text
Vendedor:
Te ayudo con eso
```

---

Sistema:

```text
DetectHumanIntervention
```

---

Estado:

```text
HUMAN_ACTIVE
```

---

Bot:

```text
Bloqueado
```

---

## Después de 5 minutos

Worker:

```text
ProcessHumanTimeout
```

---

Estado:

```text
BOT_RESUME_PENDING
```

---

## Validación

```text
ResumeBot
```

---

Estado:

```text
BOT_ACTIVE
```

---

# Errores de dominio

Debe existir:

```text
InvalidConversationStateError
```

---

Ejemplos:

Intentar:

```text
HUMAN_LOCKED

↓

BOT_ACTIVE
```

---

Resultado:

Error.

---

# Tests obligatorios

## Detectar humano

Debe:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

## Bot bloqueado

Debe:

```text
HUMAN_ACTIVE

↓

No responder
```

---

## Timeout

Debe:

```text
5 minutos

↓

BOT_RESUME_PENDING
```

---

## Resume

Debe:

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

## Lock permanente

Debe:

```text
HUMAN_LOCKED

↓

Bloquear IA
```

---

# Restricciones Copilot

* Los casos de uso controlan cambios.
* La entidad decide transiciones válidas.
* Los adapters no cambian estados.
* Registrar aprendizaje sin responder.
* Nunca pisar atención humana.

```
```
