# Especificación de dominio — Conversation Control

## 1. Entidad principal

### ConversationSession

Representa una sesión de conversación controlada por el módulo Conversation Control.

### Atributos

- id: identificador único
- empresaId: tenant propietario
- clienteId: cliente o contacto asociado
- estado: estado actual de la conversación
- ultimaIntervencionHumana: timestamp de la última intervención humana
- creadoEn: timestamp de creación
- actualizadoEn: timestamp de actualización

### Invariantes

- toda conversación debe pertenecer a una empresa
- el estado debe ser uno de los estados válidos del dominio
- la intervención humana debe registrarse de forma explícita
- una conversación cerrada no debe volver a abrirse automáticamente

## 2. Estados del dominio

### BOT_ACTIVE

El bot tiene el control y puede responder automáticamente.

### HUMAN_ACTIVE

Un humano está atendiendo la conversación, por lo que el bot debe permanecer en silencio.

### BOT_RESUME_PENDING

El humano ya no interviene, pero el sistema espera un momento antes de devolver el control al bot.

### HUMAN_LOCKED

La conversación quedó bloqueada para la IA de forma permanente o de alto riesgo.

### CLOSED

La conversación finalizó.

## 3. Reglas de transición

### Desde BOT_ACTIVE

- a HUMAN_ACTIVE cuando detecta intervención humana
- a HUMAN_LOCKED si el administrador o el flujo lo bloquea
- a CLOSED si finaliza la conversación

### Desde HUMAN_ACTIVE

- a BOT_RESUME_PENDING cuando se cumple la condición de reanudación
- a HUMAN_LOCKED si el flujo lo exige
- a CLOSED si se cierra la conversación

### Desde BOT_RESUME_PENDING

- a BOT_ACTIVE cuando se confirma la reanudación
- a HUMAN_LOCKED si se impone bloqueo
- a CLOSED si termina la sesión

### Desde HUMAN_LOCKED

- solo puede pasar a CLOSED si finaliza la conversación
- no debe volver a BOT_ACTIVE automáticamente

### Desde CLOSED

- no debe reabrirse automáticamente

## 4. Eventos de dominio

### ConversationCreated

Se publica cuando se crea una sesión de conversación.

Datos esperados:
- conversationId
- empresaId
- estado inicial

### HumanInterventionDetected

Se publica cuando se detecta que un humano comenzó a intervenir.

Datos esperados:
- conversationId
- empresaId
- estado anterior
- estado nuevo

### BotResumeRequested

Se publica cuando se solicita la reanudación del bot.

Datos esperados:
- conversationId
- empresaId
- estado anterior
- estado nuevo

### BotResumed

Se publica cuando se devuelve el control al bot.

Datos esperados:
- conversationId
- empresaId
- estado

### ConversationLocked

Se publica cuando la conversación queda bloqueada para la IA.

Datos esperados:
- conversationId
- empresaId
- motivo

### ConversationClosed

Se publica cuando finaliza la sesión.

Datos esperados:
- conversationId
- empresaId
- estado

## 5. Casos de uso del dominio

### CrearConversationSessionUseCase

Crea una sesión inicial en estado BOT_ACTIVE.

### DetectarIntervencionHumanaUseCase

Cambia el estado de la conversación a HUMAN_ACTIVE.

### EvaluarReanudacionBotUseCase

Evalúa si puede pasar a BOT_RESUME_PENDING.

### ReanudarBotUseCase

Devuelve el control al bot.

### BloquearConversacionUseCase

Bloquea la conversación para la IA.

### CerrarConversacionUseCase

Cierra la sesión.

## 6. Recomendación de implementación

La implementación inicial debe priorizar:

1. la entidad ConversationSession,
2. los value objects de estado,
3. los eventos de dominio,
4. los casos de uso principales,
5. los repositorios abstractos.
