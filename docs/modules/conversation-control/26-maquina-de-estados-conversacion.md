Siguiente documento:

`docs/modules/conversation-control/26-maquina-de-estados-conversacion.md`

````md
# COPILOT CONTEXT — Máquina de Estados Conversación
# Módulo Conversation Control

## Objetivo

Definir formalmente la máquina de estados que controla cuándo responde el bot, cuándo tiene control un humano y cuándo el sistema debe permanecer bloqueado.

La máquina de estados es la autoridad sobre la conversación.

Ningún módulo externo puede cambiar estados directamente.

---

# Estados principales

La conversación tiene los siguientes estados:

```text
BOT_ACTIVE

HUMAN_ACTIVE

BOT_RESUME_PENDING

HUMAN_LOCKED

CLOSED
````

---

# Estado: BOT_ACTIVE

## Descripción

El asistente IA tiene el control.

---

Permite:

* recibir mensajes del cliente
* analizar intención
* responder automáticamente
* ejecutar herramientas IA

---

Ejemplo:

Cliente:

```text
"Necesito información sobre el producto"
```

Sistema:

```text
IA procesa y responde
```

---

# Estado: HUMAN_ACTIVE

## Descripción

Un humano está atendiendo la conversación.

---

Regla principal:

El bot queda en silencio.

---

El sistema:

SI puede:

* guardar mensajes
* analizar conversación
* aprender patrones
* generar métricas

NO puede:

* responder cliente
* enviar promociones
* ejecutar ventas automáticas

---

Entrada al estado:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

Motivos:

* vendedor escribió desde WhatsApp
* operador tomó conversación
* atención manual detectada

---

# Estado: BOT_RESUME_PENDING

## Descripción

El humano dejó de intervenir y el sistema espera confirmar retorno.

---

Condición:

```text
HUMAN_ACTIVE

+

5 minutos sin mensaje humano

=
BOT_RESUME_PENDING
```

---

Durante este estado:

El bot:

NO responde todavía.

---

Motivo:

Evitar que interrumpa una atención humana que todavía continúa.

---

# Estado: HUMAN_LOCKED

## Descripción

Bloqueo permanente del bot.

---

Características:

* máxima prioridad
* no expira
* requiere acción manual

---

Ejemplos:

Administrador:

```text
Desactivar IA para este cliente
```

o comando:

```text
.paused
```

---

Resultado:

```text
Cualquier estado

↓

HUMAN_LOCKED
```

---

# Estado: CLOSED

## Descripción

Conversación terminada.

---

No permite:

* respuestas automáticas
* intervención nueva
* reactivación automática

---

# Diagrama de transición

```text

                 +----------------+
                 |                |
                 |  BOT_ACTIVE    |
                 |                |
                 +-------+--------+
                         |
                         |
              humano detectado
                         |
                         v

                 +----------------+
                 |                |
                 | HUMAN_ACTIVE   |
                 |                |
                 +-------+--------+
                         |
                         |
              5 minutos sin humano
                         |
                         v

             +---------------------+
             |                     |
             | BOT_RESUME_PENDING  |
             |                     |
             +----------+----------+
                        |
                        |
                confirmar retorno
                        |
                        v

                 +----------------+
                 |                |
                 |  BOT_ACTIVE    |
                 |                |
                 +----------------+



Desde cualquier estado:

                 |
                 v

          +---------------+
          | HUMAN_LOCKED  |
          +---------------+

```

---

# Reglas de prioridad

Orden obligatorio:

```text
1. HUMAN_LOCKED

2. HUMAN_ACTIVE

3. BOT_RESUME_PENDING

4. BOT_ACTIVE
```

---

Ejemplo:

Si ocurre:

```text
Bot listo para responder
```

pero existe:

```text
HUMAN_LOCKED
```

Resultado:

```text
NO RESPONDER
```

---

# Detección humana

Nunca utilizar solamente:

```text
fromMe=true
```

porque:

* el bot también envía mensajes
* existen mensajes automáticos

---

La detección debe evaluar:

```text
fromMe

+

origen del mensaje

+

identidad del operador

+

contexto sesión
```

---

# Reglas de seguridad

El bot nunca puede:

* cambiar HUMAN_ACTIVE a BOT_ACTIVE directamente
* ignorar HUMAN_LOCKED
* responder mientras humano atiende

---

# Máquina de decisión

Entrada:

```text
Nuevo mensaje
```

Proceso:

```text
¿Está bloqueado?

SI
 |
NO responder


NO

¿Humano activo?

SI
 |
Guardar y aprender


NO

¿Bot activo?

SI
 |
Procesar IA

```

---

# Integración con aprendizaje

Mientras:

```text
HUMAN_ACTIVE
```

el sistema puede:

* observar conversación
* extraer respuestas
* identificar soluciones
* mejorar conocimiento

Pero:

NO modifica:

* respuesta actual
* control humano
* estado conversación

---

# Eventos asociados

Estados generan:

```text
BOT_ACTIVE
    |
    MessageProcessed


HUMAN_ACTIVE
    |
    HumanInterventionDetected


BOT_RESUME_PENDING
    |
    HumanTimeoutReached


HUMAN_LOCKED
    |
    HumanModeLocked


CLOSED
    |
    ConversationClosed
```

---

# Tests obligatorios

## Cambio a humano

Debe validar:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

## Timeout

Debe validar:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

## Retorno bot

Debe validar:

```text
BOT_RESUME_PENDING

↓

BOT_ACTIVE
```

---

## Bloqueo permanente

Debe validar:

```text
Cualquier estado

↓

HUMAN_LOCKED
```

---

# Restricciones Copilot

* La máquina de estados es la única autoridad.
* No cambiar estados desde controllers.
* No poner reglas en Evolution adapter.
* No usar if aislados repartidos por el código.
* Toda transición debe estar documentada y testeada.
* El humano siempre tiene prioridad sobre la IA.

```
```
