Siguiente documento:

`docs/modules/conversation-control/04-reglas-de-transicion.md`

````md
# COPILOT CONTEXT — Reglas de Transición
# Módulo Conversation Control

## Objetivo

Definir las reglas exactas que controlan los cambios de estado de una conversación.

Copilot debe implementar estas reglas como lógica de dominio, evitando condicionales dispersos en casos de uso.

---

# Máquina de estados oficial

Estados disponibles:

```text
BOT_ACTIVE
HUMAN_ACTIVE
BOT_RESUME_PENDING
HUMAN_LOCKED
````

---

# Estado BOT_ACTIVE

## Descripción

La inteligencia artificial tiene control total de la conversación.

La IA puede:

* responder mensajes
* ejecutar automatizaciones
* enviar seguimientos
* utilizar herramientas disponibles

---

## Transiciones permitidas

### 1. Intervención humana detectada

Evento:

```
HumanInterventionDetected
```

Cambio:

```
BOT_ACTIVE
      |
      ↓
HUMAN_ACTIVE
```

Condición:

* Existe mensaje humano confirmado.
* El mensaje no fue generado por el bot.

---

### 2. Bloqueo manual

Evento:

```
HumanModeLocked
```

Cambio:

```
BOT_ACTIVE
      |
      ↓
HUMAN_LOCKED
```

---

# Estado HUMAN_ACTIVE

## Descripción

Un humano está atendiendo la conversación.

La IA queda en modo observación.

---

## Comportamiento permitido

La IA puede:

* leer mensajes
* analizar intención
* actualizar memoria
* aprender contexto

La IA no puede:

* responder
* enviar mensajes
* ejecutar ventas automáticas

---

## Transiciones permitidas

### 1. Sin actividad humana durante 5 minutos

Evento:

```
HumanTimeoutReached
```

Cambio:

```
HUMAN_ACTIVE
        |
        ↓
BOT_RESUME_PENDING
```

---

### 2. Bloqueo permanente

Evento:

```
HumanModeLocked
```

Cambio:

```
HUMAN_ACTIVE
        |
        ↓
HUMAN_LOCKED
```

---

# Estado BOT_RESUME_PENDING

## Descripción

Estado intermedio de seguridad.

Evita que la IA vuelva inmediatamente después de una intervención humana.

---

## Objetivo

Evitar conflictos:

Ejemplo:

```
Humano:
"Estoy revisando tu pedido"

(2 segundos después)

IA:
"Hola, puedo ayudarte..."
```

Esto nunca debe ocurrir.

---

## Transiciones permitidas

### Reanudación aprobada

Evento:

```
BotResumed
```

Cambio:

```
BOT_RESUME_PENDING
          |
          ↓
BOT_ACTIVE
```

Condiciones:

* Pasaron 5 minutos.
* No hubo nuevos mensajes humanos.
* No existe bloqueo permanente.

---

### Nueva intervención humana

Evento:

```
HumanInterventionDetected
```

Cambio:

```
BOT_RESUME_PENDING
          |
          ↓
HUMAN_ACTIVE
```

---

### Bloqueo permanente

Evento:

```
HumanModeLocked
```

Cambio:

```
BOT_RESUME_PENDING
          |
          ↓
HUMAN_LOCKED
```

---

# Estado HUMAN_LOCKED

## Descripción

Estado final de control humano.

La IA nunca debe recuperar control automáticamente.

---

## Comportamiento

Permitido:

* almacenar conversación
* analizar datos
* generar métricas
* aprender patrones

Bloqueado:

* responder
* enviar mensajes
* iniciar automatizaciones

---

## Transiciones

No existen transiciones automáticas.

```
HUMAN_LOCKED
       |
       X
```

Solo una acción administrativa explícita podría modificarlo.

---

# Tabla oficial de transición

| Estado actual      | Evento                      | Nuevo estado       |
| ------------------ | --------------------------- | ------------------ |
| BOT_ACTIVE         | HumanInterventionDetected   | HUMAN_ACTIVE       |
| BOT_ACTIVE         | HumanModeLocked             | HUMAN_LOCKED       |
| HUMAN_ACTIVE       | HumanTimeoutReached         | BOT_RESUME_PENDING |
| HUMAN_ACTIVE       | HumanModeLocked             | HUMAN_LOCKED       |
| BOT_RESUME_PENDING | BotResumed                  | BOT_ACTIVE         |
| BOT_RESUME_PENDING | HumanInterventionDetected   | HUMAN_ACTIVE       |
| BOT_RESUME_PENDING | HumanModeLocked             | HUMAN_LOCKED       |
| HUMAN_LOCKED       | Cualquier evento automático | HUMAN_LOCKED       |

---

# Reglas críticas

## Regla 1 — Nunca pisar al humano

Si existe posibilidad de intervención humana:

```
NO responder
```

---

## Regla 2 — fromMe=true no significa siempre humano

Evolution API puede enviar:

* mensajes del bot
* mensajes manuales

Debe existir un mecanismo para diferenciar origen.

---

## Regla 3 — La IA aprende mientras está bloqueada

El bloqueo solo afecta:

```
RESPONDER
```

No afecta:

```
OBSERVAR
ANALIZAR
APRENDER
```

---

## Regla 4 — La máquina de estados es autoridad

Ningún módulo externo puede cambiar estados directamente.

Incorrecto:

```js
conversation.status = "BOT_ACTIVE"
```

Correcto:

```js
conversation.resumeBot()
```

---

# Tests obligatorios

Copilot debe crear pruebas para:

## BOT_ACTIVE

* permite respuesta IA
* cambia a humano cuando existe intervención

## HUMAN_ACTIVE

* bloquea respuestas
* inicia temporizador

## BOT_RESUME_PENDING

* vuelve a IA después de 5 minutos
* vuelve a humano si escribe operador

## HUMAN_LOCKED

* nunca vuelve automáticamente
* rechaza respuestas IA

---

# Restricciones de implementación

* No poner lógica en controladores.
* No poner lógica en Evolution adapter.
* No poner lógica en Prisma.
* Mantener la máquina de estados dentro del dominio.
* Usar eventos de dominio para comunicar cambios.

```
```
