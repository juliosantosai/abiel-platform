Siguiente documento:

`docs/modules/conversation-control/23-casos-de-uso-control-conversacion.md`

````md id="q4n8x"
# COPILOT CONTEXT — Casos de Uso Control Conversación
# Módulo Conversation Control

## Objetivo

Definir los casos de uso principales que controlan la interacción entre:

- cliente
- humano
- bot
- sistema de aprendizaje

La capa Application coordina los procesos.
La lógica de transición pertenece al dominio.

---

# Caso de uso: Recibir Mensaje

## Nombre

```text
ReceiveMessageUseCase
````

---

## Objetivo

Procesar cualquier mensaje recibido desde un canal externo.

---

Entrada:

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

Proceso:

1. Validar tenant.
2. Buscar conversación.
3. Registrar mensaje.
4. Evaluar estado actual.
5. Ejecutar acción correspondiente.

---

# Reglas

## Si mensaje del cliente

```text
senderType = CUSTOMER
```

y estado:

```text
BOT_ACTIVE
```

Resultado:

```text
Enviar al motor IA
```

---

Si estado:

```text
HUMAN_ACTIVE
```

Resultado:

```text
Guardar mensaje
No responder
```

---

Si estado:

```text
HUMAN_LOCKED
```

Resultado:

```text
Guardar mensaje
No responder
```

---

# Caso de uso: Detectar Intervención Humana

## Nombre

```text
DetectHumanInterventionUseCase
```

---

## Objetivo

Detectar cuándo un humano toma control.

---

Entrada:

```json
{
conversationId,
messageId,
source
}
```

---

Condición:

```text
Mensaje enviado desde WhatsApp humano
```

---

Acción:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

Genera evento:

```text
HumanInterventionDetected
```

---

# Caso de uso: Activar Bloqueo Permanente

## Nombre

```text
LockConversationHumanUseCase
```

---

## Objetivo

Permitir que un humano bloquee el bot definitivamente.

---

Ejemplos:

Comando:

```text
.paused
```

o acción desde panel.

---

Cambio:

```text
BOT_ACTIVE

↓

HUMAN_LOCKED
```

---

Genera:

```text
ConversationHumanLocked
```

---

# Caso de uso: Procesar Timeout Humano

## Nombre

```text
ProcessHumanTimeoutUseCase
```

---

## Objetivo

Evaluar si el bot puede volver después de intervención.

---

Entrada:

```json
{
conversationId
}
```

---

Regla:

Si:

```text
estado = HUMAN_ACTIVE
```

y:

```text
5 minutos sin mensajes humanos
```

Entonces:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

# Caso de uso: Retomar Bot

## Nombre

```text
ResumeBotUseCase
```

---

## Objetivo

Activar nuevamente la inteligencia artificial.

---

Validaciones:

* conversación existe
* tenant correcto
* no está bloqueada permanentemente
* no existe humano activo

---

Cambio:

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

Genera:

```text
BotResumed
```

---

# Caso de uso: Registrar Aprendizaje Humano

## Nombre

```text
CaptureHumanLearningUseCase
```

---

## Objetivo

Aprender de conversaciones humanas.

---

Entrada:

```json
{
conversationId,
messages,
resolution
}
```

---

Guarda:

* respuestas humanas
* soluciones
* palabras clave
* intención detectada

---

Importante:

No modifica:

* estados
* respuestas activas
* conversación actual

---

# Caso de uso: Obtener Estado Conversación

## Nombre

```text
GetConversationStatusUseCase
```

---

Objetivo:

Consultar estado actual.

---

Respuesta:

```json
{
state,
locked,
lastHumanActivity,
lastBotActivity
}
```

---

# Máquina de decisiones

```text
Mensaje recibido

        |
        v

¿Quién envió?

        |
 ----------------
 |              |
Cliente       Humano
 |
 |
Estado?
 |
BOT_ACTIVE
 |
Responder IA


HUMAN_ACTIVE
 |
Guardar


HUMAN_LOCKED
 |
Guardar
```

---

# Reglas de prioridad

Orden:

1. HUMAN_LOCKED
2. HUMAN_ACTIVE
3. BOT_RESUME_PENDING
4. BOT_ACTIVE

---

Nunca:

```text
BOT_ACTIVE
```

puede sobrescribir:

```text
HUMAN_ACTIVE
```

---

# Eventos publicados

Casos de uso pueden generar:

```text
MessageReceived

HumanInterventionDetected

HumanModeActivated

HumanModeLocked

BotResumeRequested

BotResumed

LearningCaptured
```

---

# Dependencias permitidas

Application puede conocer:

✅ Repository
✅ EventBus
✅ TenantContext
✅ AI Gateway

---

Application NO debe conocer:

❌ Evolution API
❌ Prisma
❌ Redis directamente

---

# Tests obligatorios

## ReceiveMessage

Validar:

* cliente recibe bot
* humano bloquea respuesta

---

## DetectHumanIntervention

Validar:

* cambia estado
* genera evento

---

## ResumeBot

Validar:

* vuelve después de timeout
* no vuelve si está bloqueado

---

## Learning

Validar:

* guarda aprendizaje
* no responde cliente

---

# Restricciones Copilot

* Los casos de uso coordinan.
* La máquina de estados decide.
* El humano siempre tiene prioridad.
* El bot nunca pisa una conversación humana.
* Todo debe respetar tenant.

```
```
