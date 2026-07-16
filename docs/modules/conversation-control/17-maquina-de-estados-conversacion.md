Siguiente documento:

`docs/modules/conversation-control/17-maquina-de-estados-conversacion.md`

````md
# COPILOT CONTEXT — Máquina de Estados de Conversación
# Módulo Conversation Control

## Objetivo

Definir la máquina de estados responsable de controlar cuándo el bot puede responder y cuándo debe permanecer bloqueado por intervención humana.

La máquina de estados evita que la inteligencia artificial pise una conversación humana.

---

# Principio principal

El bot nunca decide tomar control.

La máquina de estados decide si el bot tiene permiso.

---

Flujo:

```text
Mensaje recibido

↓

Evaluar estado actual

↓

Evaluar permisos

↓

Decidir si puede responder
````

---

# Estados principales

## BOT_ACTIVE

Estado normal.

Significa:

```text
El bot tiene control de la conversación
```

---

Permite:

* responder mensajes
* usar IA
* consultar conocimiento
* ejecutar automatizaciones

---

Ejemplo:

```text
Cliente:
¿Cuánto cuesta?

Bot:
El producto cuesta...
```

---

# HUMAN_ACTIVE

Estado temporal de intervención humana.

Significa:

```text
Un humano está atendiendo actualmente
```

---

Se activa cuando:

* humano responde desde WhatsApp
* operador toma conversación
* sistema detecta intervención

---

Comportamiento:

Bot:

* no responde
* no envía mensajes
* no interrumpe

---

Se registra:

```json
{
 lastHumanActivity,
 humanUserId,
 startedAt
}
```

---

# HUMAN_LOCKED

Estado permanente.

Significa:

```text
Esta conversación pertenece al humano
```

---

Ejemplos:

* cliente importante
* venta personalizada
* soporte complejo
* decisión manual del vendedor

---

Comportamiento:

Bloqueado:

* IA
* respuestas automáticas
* campañas automáticas

---

Solo sale mediante:

```text
Desbloqueo manual
```

---

# BOT_RESUME_PENDING

Estado intermedio.

Significa:

```text
El humano dejó de participar,
pero todavía no retomamos el bot
```

---

Se produce:

```text
HUMAN_ACTIVE

+

5 minutos sin mensajes humanos

↓

BOT_RESUME_PENDING
```

---

Objetivo:

Permitir una última validación antes de activar IA.

---

# Transiciones permitidas

## Inicio conversación

```text
NEW

↓

BOT_ACTIVE
```

---

## Intervención humana

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

Evento:

```text
HumanInterventionDetected
```

---

## Timeout humano

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

## Reanudar bot

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

## Bloqueo permanente

Desde:

```text
BOT_ACTIVE

o

HUMAN_ACTIVE
```

---

Hacia:

```text
HUMAN_LOCKED
```

---

Evento:

```text
HumanModeLocked
```

---

# Transiciones prohibidas

## Nunca:

```text
HUMAN_LOCKED

↓

BOT_ACTIVE
```

Automáticamente.

---

## Nunca:

```text
HUMAN_ACTIVE

↓

BOT_ACTIVE
```

Sin timeout.

---

## Nunca:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

por un mensaje enviado por el propio bot.

---

# Regla fromMe

Campo Evolution:

```json
{
 fromMe:true
}
```

---

No significa automáticamente:

```text
Humano
```

---

Debe verificarse:

Origen del mensaje.

---

Ejemplo:

Bot:

```text
messageId registrado por Abiel
```

Resultado:

```text
BOT_ACTIVE
```

---

Humano:

```text
mensaje no registrado como bot
```

Resultado:

```text
HUMAN_ACTIVE
```

---

# Máquina de decisión

Antes de responder:

```text
¿Estado actual?
```

---

Si:

```text
BOT_ACTIVE
```

Continuar.

---

Si:

```text
HUMAN_ACTIVE
```

Bloquear.

---

Si:

```text
HUMAN_LOCKED
```

Bloquear permanentemente.

---

Si:

```text
BOT_RESUME_PENDING
```

Esperar validación.

---

# Aprendizaje durante intervención humana

Importante:

Bloquear bot NO significa dejar de escuchar.

Mientras:

```text
HUMAN_ACTIVE
```

El sistema:

* guarda mensajes
* analiza conversación
* aprende patrones
* actualiza conocimiento

---

Pero:

```text
NO responde
```

---

# Eventos generados

Cambio:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

Genera:

```text
HumanInterventionDetected
```

---

Cambio:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

Genera:

```text
HumanTimeoutReached
```

---

Cambio:

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

Genera:

```text
BotResumed
```

---

Cambio:

```text
*

↓

HUMAN_LOCKED
```

Genera:

```text
HumanModeLocked
```

---

# Datos mínimos de estado

La entidad debe mantener:

```js
{
 conversationId,

 empresaId,

 state,

 lastHumanActivity,

 lastBotActivity,

 lockedReason
}
```

---

# Tests obligatorios

## Bot responde

Estado:

```text
BOT_ACTIVE
```

Resultado:

```text
Permitir
```

---

## Humano interviene

Estado:

```text
HUMAN_ACTIVE
```

Resultado:

```text
Bloquear bot
```

---

## Espera 5 minutos

Resultado:

```text
BOT_RESUME_PENDING
```

---

## Lock manual

Resultado:

```text
HUMAN_LOCKED
```

---

## Bot no se bloquea solo

Validar:

```text
fromMe=true

+

mensaje generado por IA

=

BOT_ACTIVE
```

---

# Restricciones Copilot

* La máquina de estados es la autoridad.
* Nunca inferir humano solo por fromMe.
* Nunca interrumpir una conversación humana.
* Escuchar y aprender mientras está bloqueado.
* Mantener eventos desacoplados.
* Preparado para múltiples canales.

```
```
