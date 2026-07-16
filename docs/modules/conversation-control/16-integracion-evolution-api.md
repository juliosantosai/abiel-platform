Siguiente documento:

`docs/modules/conversation-control/16-integracion-evolution-api.md`

````md
# COPILOT CONTEXT — Integración Evolution API
# Módulo Conversation Control

## Objetivo

Definir la integración entre Abiel Core y Evolution API para recibir y enviar mensajes de WhatsApp sin romper la arquitectura hexagonal.

Evolution API es solamente un canal de comunicación.

No controla reglas de negocio.

---

# Principio principal

Evolution API:

```text
Recibe mensajes
Envía mensajes
Entrega eventos
````

Abiel Core:

```text
Decide estados
Decide respuestas
Decide comportamiento IA
```

---

# Flujo de entrada de mensajes

## Mensaje recibido desde WhatsApp

Flujo:

```text
WhatsApp

↓

Evolution API

↓

Webhook Adapter

↓

IncomingMessageCommand

↓

ReceiveMessageUseCase

↓

ConversationSession

↓

Machine State

↓

Bot responde o queda bloqueado
```

---

# Payload esperado de Evolution

Ejemplo:

```json
{
  "event": "messages.upsert",
  "instance": "empresa-instance",
  "data": {
    "key": {
      "remoteJid": "cliente@s.whatsapp.net",
      "fromMe": false
    },
    "message": {
      "conversation": "Hola"
    }
  }
}
```

---

# Campo importante: fromMe

## fromMe = false

Significa:

```text
Mensaje enviado por cliente
```

Ejemplo:

```text
Cliente:
"Quiero información"
```

---

Acción:

```text
Procesar mensaje normalmente
```

---

## fromMe = true

Significa:

```text
Mensaje enviado desde el teléfono conectado
```

Puede ser:

* Bot
* Humano

---

NO asumir:

```text
fromMe=true = humano
```

---

Debe existir una segunda validación.

---

# Detección de humano

## Caso 1 — Humano responde desde WhatsApp

Ejemplo:

```text
Cliente:
¿Cuánto cuesta?

Humano:
Cuesta 100.000 Gs
```

Evolution envía:

```json
{
 "fromMe": true
}
```

---

Sistema:

```text
Detecta intervención humana

↓

HUMAN_ACTIVE
```

---

# Caso 2 — Bot envía mensaje

Ejemplo:

```text
IA:
Hola, ¿en qué puedo ayudarte?
```

También:

```json
{
 "fromMe": true
}
```

---

Debe diferenciarse mediante:

* metadata interna
* messageId
* sender
* origen del envío

---

# Regla crítica

Nunca bloquear el bot porque él mismo respondió.

Incorrecto:

```text
Bot responde

↓

fromMe=true

↓

Bloquear bot
```

---

Correcto:

```text
Bot responde

↓

Registrar mensaje

↓

Continuar BOT_ACTIVE
```

---

# Modo Human Lock permanente

Existe una activación manual.

Ejemplo:

Vendedor decide:

"Este cliente lo atiendo yo"

---

Acción:

```text
HUMAN_LOCKED
```

---

Comportamiento:

El bot:

* no responde
* no ejecuta IA
* no envía mensajes automáticos

---

Hasta:

* desbloqueo manual
* nueva política definida

---

# Temporizador humano

Cuando:

```text
HUMAN_ACTIVE
```

---

Registrar:

```json
{
 lastHumanMessageAt:"timestamp"
}
```

---

Worker revisa:

```text
Ahora - lastHumanMessageAt >= 5 minutos
```

---

Resultado:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

# Envío de mensajes

Antes de enviar WhatsApp:

Siempre ejecutar:

```text
CanBotRespond()
```

---

Estados permitidos:

```text
BOT_ACTIVE
```

---

Estados bloqueados:

```text
HUMAN_ACTIVE

HUMAN_LOCKED
```

---

# Adaptador Evolution

Responsabilidades:

## Permitido

* recibir webhook
* validar firma
* transformar payload
* enviar mensajes

---

## Prohibido

* cambiar estados
* decidir intervención humana
* llamar IA directamente

---

# Eventos internos generados

Evolution puede producir:

```text
IncomingMessageReceived
```

---

Application puede producir:

```text
HumanInterventionDetected
```

---

Dominio produce:

```text
HumanModeLocked
```

---

# Manejo de errores

Casos:

## Evolution caído

Acción:

* guardar evento pendiente
* reintentar cola

---

## WhatsApp desconectado

Acción:

* evento de conexión
* alertar empresa

---

## Mensaje duplicado

Acción:

* usar messageId
* evitar procesamiento doble

---

# Idempotencia

Cada mensaje externo debe tener:

```text
externalMessageId
```

---

Antes de procesar:

Consultar:

```text
¿Ya existe?
```

---

Si existe:

```text
Ignorar duplicado
```

---

# Seguridad

Validar:

* empresa asociada
* instancia correcta
* tenant
* autorización

---

Nunca permitir:

```text
Instancia Empresa A

↓

Procesar conversación Empresa B
```

---

# Tests obligatorios

## Mensaje cliente

Debe:

```text
fromMe=false

↓

Procesar conversación
```

---

## Mensaje humano

Debe:

```text
fromMe=true

↓

Detectar humano
```

---

## Mensaje bot

Debe:

```text
fromMe=true

↓

No bloquear
```

---

## Human Lock

Debe:

```text
Bloquear respuestas IA
```

---

## Timeout

Debe:

```text
5 minutos

↓

Permitir reanudación
```

---

# Restricciones Copilot

* Evolution API es solamente transporte.
* No contiene lógica de negocio.
* fromMe=true requiere análisis adicional.
* Nunca pisar intervención humana.
* Mantener arquitectura event-driven.

```
```
