Siguiente documento:

`docs/modules/conversation-control/11-entidades-y-value-objects.md`

````md id="39184"
# COPILOT CONTEXT — Entidades y Value Objects
# Módulo Conversation Control

## Objetivo

Definir las entidades y objetos de valor principales del módulo Conversation Control.

La responsabilidad es modelar el comportamiento de una conversación dentro del sistema Abiel Core.

---

# Entidad principal

# ConversationSession

## Descripción

Representa una conversación activa entre:

- empresa (tenant)
- cliente
- asistente IA
- humano

Es el agregado principal del módulo.

---

# Responsabilidades

ConversationSession controla:

- estado actual
- cambios de control
- intervención humana
- permisos de respuesta
- eventos generados

---

# Datos principales

```js
ConversationSession
{
    id,

    empresaId,

    clienteId,

    estado,

    modo,

    ultimaActividadHumana,

    ultimaActividadBot,

    createdAt,

    updatedAt
}
````

---

# Reglas de negocio

La entidad debe garantizar:

* siempre pertenece a una empresa
* siempre tiene un cliente
* siempre tiene un estado válido
* no permite transiciones inválidas
* no permite que el bot responda cuando el humano tiene control

---

# Estados

Valores permitidos:

```text
BOT_ACTIVE

HUMAN_ACTIVE

HUMAN_LOCKED

BOT_RESUME_PENDING
```

---

# Creación

Una nueva conversación inicia:

```text
BOT_ACTIVE
```

---

Ejemplo:

```
Cliente nuevo

↓

Crear ConversationSession

↓

Bot comienza atención
```

---

# Métodos de dominio

## activarBot()

Responsabilidad:

Dar control al bot.

---

Permitido:

```text
BOT_RESUME_PENDING

        ↓

BOT_ACTIVE
```

---

No permitido:

```text
HUMAN_LOCKED

        ↓

BOT_ACTIVE
```

---

# iniciarIntervencionHumana()

Responsabilidad:

Cambiar control al humano.

---

Ejemplo:

```text
BOT_ACTIVE

      ↓

HUMAN_ACTIVE
```

---

Debe registrar:

* fecha
* origen
* motivo

---

# bloquearHumano()

Responsabilidad:

Bloqueo permanente.

---

Resultado:

```text
HUMAN_LOCKED
```

---

Regla:

Es irreversible automáticamente.

---

# verificarRespuestaBot()

Responsabilidad:

Determinar si el bot puede actuar.

---

Ejemplo:

```js
conversation.puedeResponderBot()
```

---

Resultado:

true:

```json
{
 "allowed": true
}
```

---

false:

```json
{
 "allowed": false,
 "reason":"HUMAN_ACTIVE"
}
```

---

# Value Object: ConversationStatus

## Objetivo

Representar el estado válido de la conversación.

---

Valores:

```text
BOT_ACTIVE

HUMAN_ACTIVE

HUMAN_LOCKED

BOT_RESUME_PENDING
```

---

Responsabilidades:

* validar estado
* evitar valores incorrectos
* comparar estados

---

Ejemplo:

Incorrecto:

```js
status="PAUSED"
```

---

Correcto:

```js
status="HUMAN_ACTIVE"
```

---

# Value Object: TenantConversationId

## Objetivo

Identificar conversación dentro del tenant.

---

Regla:

Una conversación pertenece a una empresa.

---

Formato:

```text
empresaId + conversationId
```

---

Evita:

```
Empresa A

consultando

Conversación Empresa B
```

---

# Value Object: HumanIntervention

## Objetivo

Representar una intervención humana.

---

Datos:

```js
{
 source,

 userId,

 timestamp,

 reason
}
```

---

Ejemplo:

```text
Empleado Juan respondió manualmente
```

---

# Value Object: ConversationMode

## Valores

```text
AI

HUMAN

HYBRID
```

---

Descripción:

## AI

Bot controla.

---

## HUMAN

Humano controla.

---

## HYBRID

Humano y bot colaboran mediante aprendizaje.

---

# Regla HYBRID

En modo híbrido:

Bot:

NO responde.

Bot:

SI aprende.

---

# Eventos producidos por la entidad

La entidad puede generar:

```text
HumanInterventionDetected

HumanModeLocked

BotResumeAvailable

BotResumed
```

---

# Restricciones

La entidad NO conoce:

* Evolution API
* WhatsApp
* OpenAI
* Redis
* Prisma

---

Solo conoce:

* conversación
* estados
* reglas
* eventos

---

# Tests obligatorios

Probar:

## Creación

Debe iniciar:

```text
BOT_ACTIVE
```

---

## Intervención humana

Debe cambiar:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

## Bloqueo permanente

Debe cambiar:

```text
HUMAN_ACTIVE

↓

HUMAN_LOCKED
```

---

## Seguridad

Debe rechazar:

```text
HUMAN_LOCKED

↓

BOT_ACTIVE
```

---

# Restricciones Copilot

Al implementar:

* Crear entidad antes de casos de uso.
* Mantener lógica dentro del agregado.
* No usar condicionales externos para estados.
* No conectar con infraestructura.
* Seguir patrón de Empresa y Usuario.

```
```
