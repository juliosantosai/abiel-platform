Siguiente documento:

`docs/modules/conversation-control/03-entidades-y-value-objects.md`

````md
# COPILOT CONTEXT — Entidades y Value Objects
# Módulo Conversation Control

## Objetivo

Definir las entidades y objetos de valor necesarios para modelar el control de una conversación entre inteligencia artificial y humano.

Este módulo debe mantener el dominio independiente de:

- Evolution API
- WhatsApp
- Prisma
- Proveedores externos
- Modelos de IA

---

# Entidad principal

## ConversationSession

Representa la sesión de control de una conversación.

Una conversación pertenece a una empresa (tenant) y mantiene el estado actual de quién tiene permiso para responder.

---

## Responsabilidades

ConversationSession debe controlar:

- Identidad de la conversación.
- Empresa propietaria.
- Cliente asociado.
- Estado actual.
- Última intervención humana.
- Bloqueo permanente.
- Transiciones válidas.

---

# Propiedades

```js
ConversationSession
{
    id,
    empresaId,
    clienteId,
    estado,
    ultimoMensajeHumano,
    creadaEn,
    actualizadaEn
}
````

---

# Reglas de invariantes

## empresaId obligatorio

Toda conversación debe pertenecer a una empresa.

No existe una conversación sin tenant.

---

## Estado obligatorio

Toda sesión debe tener un estado válido.

Estado inicial:

```
BOT_ACTIVE
```

---

## Fechas

Debe registrar:

* fecha de creación
* fecha de actualización
* última actividad humana

---

# Métodos de dominio esperados

## activarBot()

Permite que la IA tome control.

Reglas:

Permitido:

```
HUMAN_ACTIVE
        ↓
BOT_ACTIVE
```

No permitido:

```
HUMAN_LOCKED
        ↓
BOT_ACTIVE
```

---

## detectarIntervencionHumana()

Registra que un humano comenzó a responder.

Acción:

```
BOT_ACTIVE

      ↓

HUMAN_ACTIVE
```

Debe:

* actualizar última intervención humana
* generar evento de dominio

---

## bloquearHumano()

Activa bloqueo permanente.

Transición:

```
BOT_ACTIVE
        ↓
HUMAN_LOCKED
```

o:

```
HUMAN_ACTIVE
        ↓
HUMAN_LOCKED
```

---

## puedeResponderBot()

Método de consulta.

Debe retornar:

true:

```
BOT_ACTIVE
```

false:

```
HUMAN_ACTIVE
BOT_RESUME_PENDING
HUMAN_LOCKED
```

---

## iniciarReanudacion()

Inicia proceso para devolver control al bot.

Solo permitido:

```
HUMAN_ACTIVE
```

Resultado:

```
BOT_RESUME_PENDING
```

---

# Value Objects

---

# ConversationState

Objeto de valor que representa el estado actual.

Estados permitidos:

```js
BOT_ACTIVE
HUMAN_ACTIVE
BOT_RESUME_PENDING
HUMAN_LOCKED
```

---

## Reglas

No aceptar estados desconocidos.

Ejemplo inválido:

```js
{
 estado:"WAITING"
}
```

Debe lanzar:

```
ValidationError
```

---

# TenantId

Representa la empresa propietaria de la conversación.

Responsabilidad:

* Validar existencia.
* Evitar conversaciones sin tenant.

Ejemplo:

```js
new TenantId(empresaId)
```

---

# ClienteId

Identifica al cliente final.

No contiene lógica comercial.

Solo identifica la conversación.

---

# HumanIntervention

Value Object para representar una intervención humana.

Información:

```js
{
 usuarioId,
 fecha,
 origen
}
```

---

## origen permitido

Ejemplos:

```
WHATSAPP_MANUAL
ADMIN_PANEL
API
```

---

# Reglas de dominio

## Nunca modificar estado directamente

Incorrecto:

```js
conversation.estado = "HUMAN_ACTIVE"
```

Correcto:

```js
conversation.detectarIntervencionHumana()
```

---

## La entidad controla las transiciones

Los use cases no deben decidir estados.

Incorrecto:

```js
if(humano)
 estado="HUMAN_LOCKED"
```

Correcto:

```js
session.bloquearHumano()
```

---

# Eventos generados

Las entidades deben producir eventos:

```
HumanInterventionDetected
HumanModeActivated
HumanModeReleased
HumanModeLocked
BotResumed
```

---

# Restricciones para Copilot

Al implementar:

* Mantener lógica en dominio.
* Crear tests de cada transición.
* No usar Prisma dentro de entidades.
* No importar Evolution API.
* No crear dependencias con módulos externos.
* Seguir patrón usado en Empresa y Usuario.

---

# Resultado esperado

La entidad ConversationSession debe funcionar como una máquina de estados pura capaz de decidir:

* cuándo la IA responde
* cuándo debe esperar
* cuándo queda bloqueada
* cuándo puede recuperar control

```
```
