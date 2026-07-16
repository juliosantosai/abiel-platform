Siguiente documento:

`docs/modules/conversation-control/10-maquina-estados-intervencion-humana.md`

```md id="27491"
# COPILOT CONTEXT — Máquina de Estados de Intervención Humana
# Módulo Conversation Control

## Objetivo

Definir formalmente la máquina de estados que controla cuándo el bot puede responder y cuándo debe dejar el control a una persona.

La prioridad es:

1. No interrumpir al humano.
2. Evitar respuestas automáticas mientras un humano atiende.
3. Permitir que el bot vuelva cuando corresponda.
4. Aprender de la conversación humana sin intervenir.

---

# Concepto principal

Cada conversación tiene un controlador independiente.

La conversación mantiene:

- estado actual
- última actividad humana
- última actividad del bot
- modo de operación
- reglas de bloqueo

---

# Estados principales

## BOT_ACTIVE

### Descripción

El bot tiene control de la conversación.

Puede:

- responder mensajes
- ejecutar herramientas
- vender
- informar
- asistir al cliente

---

Ejemplo:

```

Cliente escribe

↓

IA responde

```

---

# HUMAN_ACTIVE

## Descripción

Un humano tomó la conversación temporalmente.

El bot:

NO responde.

El bot:

SI observa.

---

Ejemplo:

```

Cliente pregunta

↓

Empleado responde WhatsApp

↓

Bot queda escuchando

```

---

# HUMAN_LOCKED

## Descripción

La conversación queda asignada permanentemente a un humano.

El bot queda bloqueado.

---

Casos:

- vendedor quiere continuar manualmente
- cliente VIP
- problema complejo
- solicitud explícita de atención humana

---

Regla:

Nunca regresar automáticamente.

---

# BOT_RESUME_PENDING

## Descripción

El humano dejó de interactuar.

El sistema detecta que posiblemente puede volver el bot.

Todavía no responde.

---

Ejemplo:

```

Humano deja teléfono

↓

Pasan 5 minutos

↓

Estado pendiente

```

---

# Transiciones permitidas

## Bot → Humano

```

BOT_ACTIVE

```
  |
  |
```

HumanInterventionDetected

```
  ↓
```

HUMAN_ACTIVE

```

---

Condición:

Debe existir evidencia humana.

Ejemplo:

```

fromMe=true

```

con identificación válida.

---

# Humano temporal → Bot pendiente

```

HUMAN_ACTIVE

```
  |
  |
```

HumanTimeoutReached

```
  ↓
```

BOT_RESUME_PENDING

```

---

Condición:

Sin mensajes humanos durante:

```

5 minutos

```

---

# Bot pendiente → Bot activo

```

BOT_RESUME_PENDING

```
  |
  |
```

ResumeApproved

```
  ↓
```

BOT_ACTIVE

```

---

Antes de volver:

Validar:

- no existe bloqueo permanente
- tenant válido
- conversación activa

---

# Bloqueo permanente

```

BOT_ACTIVE

```
   |
   |
```

HumanLockRequested

```
   ↓
```

HUMAN_LOCKED

```

---

También:

```

HUMAN_ACTIVE

```
   |
   |
```

HumanLockRequested

```
   ↓
```

HUMAN_LOCKED

```

---

# Transiciones prohibidas

## Nunca:

```

HUMAN_LOCKED

```
   ↓
```

BOT_ACTIVE

```

---

Motivo:

El humano decidió mantener control.

---

## Nunca:

```

HUMAN_ACTIVE

```
   ↓
```

BOT_ACTIVE

```

sin pasar por:

```

BOT_RESUME_PENDING

````

---

# Eventos de dominio

## HumanInterventionDetected

Se genera cuando:

Un humano interviene.

Payload:

```js
{
 conversationId,
 timestamp,
 source
}
````

---

## HumanModeLocked

Se genera cuando:

El humano bloquea definitivamente.

Payload:

```js
{
 conversationId,
 reason,
 userId
}
```

---

## HumanTimeoutReached

Se genera cuando:

No hubo actividad humana durante el tiempo configurado.

Payload:

```js
{
 conversationId,
 inactiveTime
}
```

---

## BotResumed

Se genera cuando:

El bot recupera control.

Payload:

```js
{
 conversationId
}
```

---

# Regla de los 5 minutos

Configuración inicial:

```
HUMAN_TIMEOUT = 300 segundos
```

---

Importante:

No debe estar escrito dentro del dominio.

Incorrecto:

```js
if(time > 300)
```

---

Correcto:

```js
clock.hasElapsed(timeout)
```

---

# Aprendizaje durante modo humano

Cuando el estado sea:

```
HUMAN_ACTIVE
```

o

```
HUMAN_LOCKED
```

El sistema puede:

* almacenar conversación
* analizar respuestas humanas
* mejorar conocimiento
* crear memoria

---

Pero:

Nunca:

```
Generar respuesta al cliente
```

---

# Prioridad de control

Orden:

```
1. HUMAN_LOCKED

2. HUMAN_ACTIVE

3. BOT_RESUME_PENDING

4. BOT_ACTIVE
```

---

# Verificación antes de responder

Antes de cada respuesta del bot:

Ejecutar:

```
CanBotRespond()
```

---

Resultado:

Permitido:

```json
{
 "allowed":true
}
```

---

Bloqueado:

```json
{
 "allowed":false,
 "reason":"HUMAN_ACTIVE"
}
```

---

# Tests obligatorios

## Cambio correcto

Probar:

```
BOT_ACTIVE
      ↓
HUMAN_ACTIVE
```

---

## Timeout

Probar:

```
HUMAN_ACTIVE
      ↓
BOT_RESUME_PENDING
```

---

## Bloqueo permanente

Probar:

```
HUMAN_ACTIVE
      ↓
HUMAN_LOCKED
```

---

## Seguridad

Probar:

```
HUMAN_LOCKED
      ↓
BOT_ACTIVE
```

debe fallar.

---

# Restricciones Copilot

* La máquina de estados vive en dominio.
* No depende de Evolution API.
* No depende de WhatsApp.
* No depende de Prisma.
* No responder desde eventos.
* Toda transición debe tener una razón.
* Mantener patrón DDD usado en Empresa y Usuario.

```
```
