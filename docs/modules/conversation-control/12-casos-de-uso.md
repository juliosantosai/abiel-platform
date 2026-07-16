Siguiente documento:

`docs/modules/conversation-control/12-casos-de-uso.md`

````md id="58193"
# COPILOT CONTEXT — Casos de Uso
# Módulo Conversation Control

## Objetivo

Definir los casos de uso responsables de coordinar la máquina de estados de conversación.

Los casos de uso pertenecen a la capa Application.

No contienen reglas de negocio profundas.

La lógica de estados pertenece a la entidad ConversationSession.

---

# CrearConversationSessionUseCase

## Objetivo

Crear una nueva sesión de conversación.

---

Entrada:

```js
{
 empresaId,
 clienteId
}
````

---

Proceso:

1. Validar datos requeridos.
2. Crear entidad ConversationSession.
3. Guardar mediante repositorio.
4. Publicar evento.

---

Estado inicial:

```text
BOT_ACTIVE
```

---

Evento:

```text
ConversationCreated
```

---

# RecibirMensajeUseCase

## Objetivo

Procesar un mensaje recibido desde un canal externo.

Ejemplo:

* Evolution API
* WhatsApp
* otros canales futuros

---

Entrada:

```js
{
 conversationId,

 source,

 fromMe,

 message
}
```

---

Proceso:

1. Buscar conversación.
2. Identificar origen.
3. Evaluar estado actual.
4. Ejecutar transición correspondiente.
5. Guardar cambios.
6. Publicar evento.

---

# Detección de mensaje humano

Si:

```text
fromMe=true
```

y corresponde a humano:

Ejecutar:

```text
iniciarIntervencionHumana()
```

---

Resultado:

```text
HUMAN_ACTIVE
```

---

Evento:

```text
HumanInterventionDetected
```

---

# SolicitarBloqueoHumanoUseCase

## Objetivo

Permitir que una persona bloquee la IA.

---

Entrada:

```js
{
 conversationId,

 userId,

 reason
}
```

---

Proceso:

1. Buscar sesión.
2. Ejecutar:

```js
bloquearHumano()
```

3. Guardar.
4. Publicar evento.

---

Resultado:

```text
HUMAN_LOCKED
```

---

Evento:

```text
HumanModeLocked
```

---

# VerificarRespuestaBotUseCase

## Objetivo

Determinar si la IA puede responder.

---

Se ejecuta antes de:

* enviar mensaje
* ejecutar herramienta
* llamar modelo IA

---

Entrada:

```js
{
 conversationId
}
```

---

Proceso:

1. Buscar sesión.
2. Consultar estado.
3. Evaluar permisos.

---

Respuesta permitida:

```json
{
 allowed:true
}
```

---

Respuesta bloqueada:

```json
{
 allowed:false,
 reason:"HUMAN_ACTIVE"
}
```

---

# ProcesarTimeoutHumanoUseCase

## Objetivo

Detectar cuando el humano dejó la conversación.

---

Regla:

Si:

```
estado = HUMAN_ACTIVE
```

y

```
tiempo_sin_actividad >= 5 minutos
```

---

Entonces:

```
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

# ReanudarBotUseCase

## Objetivo

Devolver control al bot.

---

Entrada:

```js
{
 conversationId
}
```

---

Proceso:

1. Buscar sesión.
2. Validar estado.
3. Ejecutar transición.
4. Guardar.
5. Publicar evento.

---

Permitido:

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

Bloqueado:

```text
HUMAN_LOCKED

↓

BOT_ACTIVE
```

---

# RegistrarAprendizajeHumanoUseCase

## Objetivo

Guardar información generada durante atención humana.

---

Importante:

Este caso NO responde al cliente.

---

Puede registrar:

* mensajes humanos
* decisiones tomadas
* soluciones aplicadas
* patrones comerciales

---

Ejemplo:

```
Empleado responde:

"El delivery tarda 24 horas"

↓

Sistema aprende regla
```

---

# Flujo completo

```
Cliente escribe

        ↓

Evolution API

        ↓

RecibirMensajeUseCase

        ↓

ConversationSession

        ↓

¿Humano intervino?

        ↓

SI

        ↓

HUMAN_ACTIVE

        ↓

Esperar 5 minutos

        ↓

BOT_RESUME_PENDING

        ↓

Validación

        ↓

BOT_ACTIVE
```

---

# Dependencias permitidas

Application puede usar:

* repositorios
* servicios de dominio
* event publisher
* clock
* tenant context

---

# Dependencias prohibidas

Application NO debe usar directamente:

* Prisma
* Evolution API
* WhatsApp SDK
* OpenAI SDK
* Redis

---

# Eventos esperados

Casos de uso → eventos:

| Caso de uso     | Evento                    |
| --------------- | ------------------------- |
| Crear sesión    | ConversationCreated       |
| Detectar humano | HumanInterventionDetected |
| Bloquear humano | HumanModeLocked           |
| Timeout         | HumanTimeoutReached       |
| Reanudar bot    | BotResumed                |

---

# Tests obligatorios

## Crear sesión

Debe crear:

```
BOT_ACTIVE
```

---

## Mensaje humano

Debe cambiar:

```
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

## Bloqueo manual

Debe cambiar:

```
HUMAN_ACTIVE

↓

HUMAN_LOCKED
```

---

## Timeout

Debe cambiar:

```
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

## Seguridad

Debe impedir:

```
HUMAN_LOCKED

↓

BOT_ACTIVE
```

---

# Restricciones Copilot

* Use cases coordinan, no deciden reglas.
* Las transiciones viven en dominio.
* Todo cambio genera evento.
* Mantener arquitectura hexagonal.
* Preparar para múltiples canales, no solo WhatsApp.

```
```
