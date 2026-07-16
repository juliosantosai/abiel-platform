Siguiente documento:

`docs/modules/conversation-control/24-entidades-y-value-objects-conversation.md`

````md
# COPILOT CONTEXT — Entidades y Value Objects Conversation Control
# Módulo Conversation Control

## Objetivo

Definir las entidades principales y objetos de valor utilizados para controlar conversaciones, estados, mensajes e intervención humana.

La capa dominio contiene las reglas.
No depende de:

- Evolution API
- WhatsApp
- Prisma
- Redis
- proveedores externos

---

# Entidad: Conversation

## Responsabilidad

Representa una conversación entre:

- cliente
- empresa
- asistente IA
- operador humano

---

## Propiedades principales

```text
Conversation
````

Contiene:

```text
id

empresaId

clienteId

estado

createdAt

updatedAt

lastHumanActivity

lastBotActivity
```

---

# Regla principal

Toda conversación pertenece a una empresa.

Obligatorio:

```text
empresaId != null
```

---

# Estados permitidos

La conversación utiliza una máquina de estados.

Estados:

```text
BOT_ACTIVE

HUMAN_ACTIVE

BOT_RESUME_PENDING

HUMAN_LOCKED

CLOSED
```

---

# Estado BOT_ACTIVE

## Significado

El bot tiene control de la conversación.

Puede:

* analizar mensajes
* responder
* ejecutar agentes IA

---

Permite:

```text
CUSTOMER_MESSAGE

↓

AI_PROCESSING
```

---

# Estado HUMAN_ACTIVE

## Significado

Un humano está atendiendo.

El bot:

NO puede:

* responder
* enviar mensajes
* tomar decisiones comerciales

---

El sistema:

SI puede:

* guardar mensajes
* analizar conversación
* aprender

---

# Estado BOT_RESUME_PENDING

## Significado

El humano dejó de interactuar.

El sistema espera confirmar retorno del bot.

---

Condición:

```text
5 minutos sin actividad humana
```

---

# Estado HUMAN_LOCKED

## Significado

El humano bloqueó permanentemente al bot.

---

Características:

* no expira
* requiere desbloqueo manual
* prioridad máxima

---

# Estado CLOSED

## Significado

Conversación finalizada.

---

No permite:

* mensajes automáticos
* cambios de operador

---

# Transiciones permitidas

## Inicio

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

## Timeout humano

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

## Retorno bot

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

## Bloqueo permanente

Desde cualquier estado operativo:

```text
*

↓

HUMAN_LOCKED
```

---

## Cierre

```text
BOT_ACTIVE

↓

CLOSED
```

```text
HUMAN_ACTIVE

↓

CLOSED
```

---

# Métodos de entidad

La entidad debe exponer:

```text
activarBot()

activarModoHumano()

bloquearHumano()

solicitarRetornoBot()

cerrar()
```

---

No permitido:

Modificar:

```text
estado
```

directamente.

---

# Value Object: ConversationId

## Objetivo

Identificador único.

Reglas:

* obligatorio
* formato UUID
* inmutable

---

# Value Object: EmpresaId

Representa:

```text
Tenant propietario
```

---

Reglas:

* obligatorio
* no puede cambiar durante la vida de conversación

---

# Value Object: ConversationState

Representa estados válidos.

Valores:

```text
BOT_ACTIVE

HUMAN_ACTIVE

BOT_RESUME_PENDING

HUMAN_LOCKED

CLOSED
```

---

Responsabilidad:

Evitar estados inválidos.

---

# Value Object: MessageContent

Representa contenido del mensaje.

Reglas:

* no vacío
* longitud máxima configurable
* texto normalizado

---

# Value Object: SenderType

Representa quién envía.

Valores:

```text
CUSTOMER

HUMAN

BOT

SYSTEM
```

---

# Value Object: HumanIntervention

Representa una intervención humana.

Datos:

```text
operatorId

source

timestamp

reason
```

---

# Regla

Una intervención humana siempre debe registrar:

* quién intervino
* cuándo
* origen

---

# Entidad: ConversationMessage

Representa un mensaje individual.

Propiedades:

```text
id

conversationId

senderType

content

externalId

createdAt
```

---

# Reglas

Cada mensaje:

Debe tener:

* conversación
* remitente
* contenido
* fecha

---

# Eventos de dominio relacionados

La entidad puede generar:

```text
ConversationCreated

MessageReceived

HumanInterventionDetected

HumanLocked

BotResumeRequested

BotResumed

ConversationClosed
```

---

# Restricciones de arquitectura

Dominio NO conoce:

❌ Evolution API
❌ WhatsApp
❌ OpenAI
❌ Prisma

---

Dominio SI conoce:

✅ Estados
✅ Reglas
✅ Transiciones
✅ Eventos

---

# Tests obligatorios

Conversation:

Debe probar:

* creación correcta
* estados iniciales
* transiciones válidas
* transiciones inválidas
* bloqueo permanente

---

ConversationMessage:

Debe probar:

* tipos válidos
* contenido obligatorio
* relación con conversación

---

# Reglas Copilot

* No crear lógica fuera de entidad.
* No cambiar estados manualmente.
* Toda transición pasa por métodos del dominio.
* HUMAN_LOCKED siempre tiene prioridad.
* El humano tiene control absoluto.

```
```
