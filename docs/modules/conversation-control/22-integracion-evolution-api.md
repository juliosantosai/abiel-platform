Siguiente documento:

`docs/modules/conversation-control/22-integracion-evolution-api.md`

````md
# COPILOT CONTEXT — Integración Evolution API
# Módulo Conversation Control

## Objetivo

Definir cómo Conversation Control recibe eventos desde Evolution API y cómo estos eventos alimentan la máquina de estados sin acoplar el dominio al proveedor externo.

---

# Principio arquitectónico

Evolution API es un adaptador externo.

El dominio NO conoce:

- Evolution API
- WhatsApp
- Webhooks
- Tokens
- Instancias

---

Flujo:

```text
Evolution API

↓

Webhook Adapter

↓

Application

↓

Conversation Control

↓

Domain
````

---

# Responsabilidad del Adapter

El adapter debe:

* recibir webhook
* validar estructura
* transformar datos externos
* crear comandos/eventos internos

---

No debe:

* cambiar estados
* decidir si responde el bot
* activar/desactivar IA

---

# Evento recibido desde Evolution

Ejemplo:

```json
{
  "event": "messages.upsert",
  "instance": "empresa01",
  "data": {
    "key": {
      "remoteJid": "595981234567@s.whatsapp.net",
      "fromMe": false
    },
    "message": {
      "conversation": "Hola"
    }
  }
}
```

---

# Normalización interna

Evolution envía:

```text
fromMe
```

El sistema transforma a:

```text
senderType
```

Valores:

```text
CUSTOMER

HUMAN

BOT
```

---

# Regla importante: fromMe

## Caso 1

```text
fromMe = false
```

Significa:

Mensaje externo.

Puede ser:

```text
CUSTOMER
```

---

Ejemplo:

Cliente:

"Quiero comprar"

↓

Conversation Control recibe:

```text
MessageReceived
```

---

# Caso 2

```text
fromMe = true
```

No significa automáticamente bot.

Puede ser:

* humano usando WhatsApp
* bot enviando mensaje
* sistema automático

---

Debe combinarse con:

* metadata del mensaje
* sesión activa
* estado conversación

---

# Detección de intervención humana

La intervención humana ocurre cuando:

```text
fromMe = true

+

mensaje enviado desde WhatsApp humano
```

---

Ejemplo:

Vendedor abre WhatsApp:

"Hola, te ayudo"

---

Evento:

```text
HumanInterventionDetected
```

---

# No bloquear por cualquier fromMe

Incorrecto:

```text
fromMe=true

↓

bloquear bot
```

---

Porque:

El bot también envía mensajes.

---

Correcto:

```text
fromMe=true

+

origen humano confirmado

↓

HumanModeActivated
```

---

# Bloqueo temporal

Cuando humano interviene:

Estado:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

Durante:

```text
5 minutos
```

sin actividad humana.

---

El bot:

* no responde
* escucha
* registra conversación

---

# Bloqueo permanente

Caso:

Humano escribe comando especial.

Ejemplo:

```text
.paused
```

o acción administrativa.

---

Resultado:

```text
HUMAN_LOCKED
```

---

Características:

* no expira
* requiere acción humana
* bot no responde

---

# Mensajes del bot durante bloqueo

Si:

```text
HUMAN_ACTIVE
```

o:

```text
HUMAN_LOCKED
```

Entonces:

```text
NO_RESPONDER
```

---

Pero:

seguir:

* guardando mensajes
* aprendiendo
* generando analytics

---

# Webhook Adapter

Ubicación:

```text
interfaces/webhooks/evolution
```

---

Responsabilidades:

```text
EvolutionWebhookController

↓

EvolutionMessageMapper

↓

ConversationService
```

---

# Mapper

Convierte:

Entrada:

```json
EvolutionPayload
```

Salida:

```json
MessageReceivedCommand
```

---

Ejemplo:

```json
{
 conversationId,
 empresaId,
 senderType,
 content,
 externalId
}
```

---

# Seguridad

Validar:

* firma webhook
* instancia válida
* empresa asociada
* token correcto

---

Nunca confiar directamente en:

```text
empresaId
```

enviado por cliente externo.

---

# Multi-tenancy

Cada instancia Evolution pertenece a:

```text
Empresa
```

---

Relación:

```text
Evolution Instance

↓

Empresa

↓

Conversaciones
```

---

# Estados relacionados

Máquina:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE

↓

BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

Bloqueo:

```text
*

↓

HUMAN_LOCKED
```

---

# Eventos generados

Después de procesar:

Puede generar:

```text
MessageReceived

HumanInterventionDetected

HumanModeLocked
```

---

# Tests obligatorios

## Webhook Adapter

Validar:

* recibe evento Evolution
* transforma correctamente

---

## fromMe=false

Validar:

* mensaje cliente

---

## fromMe=true humano

Validar:

* detecta intervención

---

## fromMe=true bot

Validar:

* no bloquea conversación

---

# Restricciones Copilot

* Evolution API es reemplazable.
* No poner lógica de negocio en webhook.
* No usar fromMe como única regla.
* Siempre respetar estados humanos.
* Nunca pisar al operador.
* Continuar aprendiendo durante intervención humana.

```
```
