Siguiente documento:

`docs/modules/conversation-control/09-integracion-evolution-api.md`

```md
# COPILOT CONTEXT — Integración Evolution API
# Módulo Conversation Control

## Objetivo

Definir la integración entre Evolution API y la máquina de estados de conversación.

Evolution API es solamente una fuente de eventos externos.

No controla reglas de negocio.

---

# Principio fundamental

Evolution API informa:

- llegó un mensaje
- quién lo envió
- si fue enviado por la instancia

El dominio decide:

- si es humano
- si bloquear bot
- si permitir IA
- si aprender
- si reanudar

---

# Flujo general

```

WhatsApp

```
↓
```

Evolution API

```
↓
```

Evolution Adapter

```
↓
```

MessageReceived Event

```
↓
```

Conversation Control

```
↓
```

State Machine

```
↓
```

Bot / Human / Learning

````

---

# Evento recibido desde Evolution

Ejemplo:

```json
{
  "instance": "empresa_demo",
  "remoteJid": "cliente@s.whatsapp.net",
  "fromMe": true,
  "message": {
      "text": "Hola, te ayudo"
  },
  "timestamp": 123456789
}
````

---

# Campos importantes

## fromMe

Campo crítico.

Indica si el mensaje fue enviado desde la cuenta conectada.

---

Valores:

```text
true
```

Puede indicar:

* humano usando WhatsApp
* bot enviando mensaje
* automatización externa

---

```text
false
```

Indica:

* mensaje recibido del cliente

---

# Regla importante

Nunca asumir:

```
fromMe=true
```

significa siempre humano.

Debe existir una capa de identificación.

---

# Human Intervention Detector

## Objetivo

Determinar si existe intervención humana.

---

Entrada:

```js
{
 fromMe,
 message,
 metadata
}
```

---

Salida:

```js
{
 type:"HUMAN_MESSAGE_DETECTED"
}
```

o

```js
{
 type:"BOT_MESSAGE"
}
```

---

# Señales de humano

## Caso 1

Mensaje enviado manualmente desde WhatsApp.

Ejemplo:

```
Empleado toma teléfono
        |
        ↓
Responde cliente
```

Resultado:

```
HumanInterventionDetected
```

---

# Caso 2

Bloqueo manual

Ejemplo:

Administrador indica:

```
No responder automáticamente
```

Resultado:

```
HumanModeLocked
```

---

# Caso 3

Aprendizaje

Humano responde mientras IA observa.

Resultado:

```
ConversationObserved
```

---

# Máquina de estados

Estados involucrados:

```
BOT_ACTIVE
```

Bot tiene control.

---

```
HUMAN_ACTIVE
```

Humano atendiendo temporalmente.

---

```
HUMAN_LOCKED
```

Humano tiene control permanente.

---

```
BOT_RESUME_PENDING
```

Esperando validación para devolver IA.

---

# Flujo intervención temporal

Ejemplo:

## Paso 1

Bot conversando:

```
BOT_ACTIVE
```

---

## Paso 2

Humano responde:

```
fromMe=true
```

---

## Paso 3

Sistema genera:

```
HumanInterventionDetected
```

---

## Paso 4

Estado:

```
HUMAN_ACTIVE
```

---

## Paso 5

Esperar:

```
5 minutos
```

sin actividad humana.

---

## Paso 6

Generar:

```
HumanTimeoutReached
```

---

## Paso 7

Evaluar:

```
BotResumeRequested
```

---

# Flujo bloqueo permanente

Ejemplo:

Humano escribe:

```
Yo sigo con este cliente
```

o activa botón manual.

---

Resultado:

```
HUMAN_LOCKED
```

---

Regla:

Nunca volver automáticamente a:

```
BOT_ACTIVE
```

---

# Separación Bot / Humano

El sistema debe identificar origen.

Ejemplo:

Mensaje generado por IA:

```json
{
 "source":"AI"
}
```

---

Mensaje humano:

```json
{
 "source":"HUMAN"
}
```

---

Mensaje externo:

```json
{
 "source":"CUSTOMER"
}
```

---

# Aprendizaje durante intervención humana

Cuando humano responde:

El bot:

NO responde.

Pero:

SI puede:

* analizar conversación
* extraer conocimiento
* detectar intención
* mejorar prompts
* actualizar memoria

---

# Restricciones Copilot

Al implementar:

* No colocar lógica de estado dentro del adapter.
* No usar fromMe como única regla.
* No bloquear por mensaje del cliente.
* No permitir que Evolution cambie estados directamente.
* Toda transición pasa por ConversationSession.
* Mantener eventos desacoplados.

```
```
