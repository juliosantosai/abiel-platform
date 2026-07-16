Siguiente documento:

`docs/modules/conversation-control/06-casos-de-uso.md`

````md
# COPILOT CONTEXT — Casos de Uso
# Módulo Conversation Control

## Objetivo

Definir los casos de uso responsables de coordinar la máquina de estados de intervención humana.

La lógica de negocio permanece en la entidad `ConversationSession`.

Los casos de uso solo:

- reciben comandos
- cargan entidades
- ejecutan acciones del dominio
- guardan cambios
- publican eventos

---

# CrearConversationSessionUseCase

## Objetivo

Crear una nueva sesión de conversación.

---

## Entrada

```js
{
    empresaId,
    clienteId
}
````

---

## Reglas

Al crear:

* estado inicial:

```
BOT_ACTIVE
```

* debe existir empresa.
* debe existir cliente.

---

## Flujo

```
Request
   |
   ↓
Crear entidad ConversationSession
   |
   ↓
Guardar repositorio
   |
   ↓
Publicar ConversationCreated
```

---

# DetectarIntervencionHumanaUseCase

## Objetivo

Procesar un mensaje identificado como humano.

---

## Entrada

```js
{
    conversationId,
    source,
    usuarioHumanoId
}
```

---

## Flujo

```
Buscar conversación

       ↓

Validar estado actual

       ↓

conversation.detectarIntervencionHumana()

       ↓

Guardar

       ↓

Publicar HumanInterventionDetected
```

---

## Reglas

Si estado:

```
BOT_ACTIVE
```

Permitir:

```
HUMAN_ACTIVE
```

---

Si estado:

```
HUMAN_LOCKED
```

No modificar.

---

# EvaluarReanudacionBotUseCase

## Objetivo

Evaluar si el bot puede recuperar control después de intervención humana.

---

## Entrada

```js
{
    conversationId,
    currentTime
}
```

---

## Flujo

```
Buscar conversación

       ↓

Revisar última intervención humana

       ↓

Validar tiempo

       ↓

Cambiar estado
```

---

## Regla de tiempo

Configuración inicial:

```
5 minutos
```

---

## Cambio permitido

```
HUMAN_ACTIVE

       ↓

BOT_RESUME_PENDING
```

---

# ReanudarBotUseCase

## Objetivo

Devolver control a la inteligencia artificial.

---

## Entrada

```js
{
    conversationId
}
```

---

## Flujo

```
Buscar sesión

       ↓

Validar estado

       ↓

conversation.resumeBot()

       ↓

Guardar

       ↓

Publicar BotResumed
```

---

## Reglas

Permitido:

```
BOT_RESUME_PENDING
        ↓
BOT_ACTIVE
```

---

Prohibido:

```
HUMAN_LOCKED
        ↓
BOT_ACTIVE
```

---

# BloquearHumanoUseCase

## Objetivo

Activar atención humana permanente.

---

## Entrada

```js
{
    conversationId,
    reason,
    lockedBy
}
```

---

## Flujo

```
Buscar conversación

       ↓

conversation.lockHuman()

       ↓

Guardar

       ↓

Publicar HumanModeLocked
```

---

## Casos permitidos

Desde:

```
BOT_ACTIVE
```

o

```
HUMAN_ACTIVE
```

---

# VerificarEstadoBotUseCase

## Objetivo

Consultar si la IA tiene permiso para responder.

---

## Entrada

```js
{
    conversationId
}
```

---

## Salida

```js
{
    canRespond:true|false,
    state
}
```

---

## Ejemplo

Estado:

```
BOT_ACTIVE
```

Respuesta:

```json
{
 "canRespond":true
}
```

---

Estado:

```
HUMAN_ACTIVE
```

Respuesta:

```json
{
 "canRespond":false
}
```

---

# RegistrarObservacionIAUseCase

## Objetivo

Permitir que la IA observe conversaciones humanas.

---

## Importante

Este caso de uso NO responde mensajes.

Solo:

* analiza
* guarda conocimiento
* genera aprendizaje

---

## Entrada

```js
{
 conversationId,
 messageId,
 analysis
}
```

---

# Reglas generales para todos los Use Cases

## Nunca cambiar estado directamente

Incorrecto:

```js
session.estado = "BOT_ACTIVE"
```

Correcto:

```js
session.resumeBot()
```

---

## Nunca decidir reglas de negocio

Incorrecto:

```js
if(minutes > 5)
```

Correcto:

```js
session.canResumeBot()
```

---

## Nunca depender de Evolution API

Incorrecto:

```js
import EvolutionAPI
```

---

## Dependencias permitidas

Los casos de uso pueden recibir:

```js
constructor(
 repository,
 eventPublisher,
 clock
)
```

---

# Interfaces necesarias

## ConversationRepository

Debe permitir:

```js
guardar()
buscarPorId()
actualizar()
```

---

## EventPublisher

Debe permitir:

```js
publish(event)
```

---

# Tests obligatorios

Cada caso de uso debe probar:

## Caso correcto

Ejemplo:

```
BOT_ACTIVE
       ↓
HUMAN_ACTIVE
```

---

## Caso prohibido

Ejemplo:

```
HUMAN_LOCKED
       ↓
BOT_ACTIVE
```

---

## Multi tenant

Validar:

```
empresa A
   X
empresa B
```

---

# Restricciones Copilot

* Seguir patrón de Empresa y Usuario.
* Mantener arquitectura DDD.
* No mezclar dominio con infraestructura.
* No crear endpoints todavía.
* No implementar Evolution dentro del módulo.

```
```
