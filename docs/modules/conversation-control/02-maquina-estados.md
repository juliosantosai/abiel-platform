Siguiente documento:

`docs/modules/conversation-control/02-maquina-de-estados.md`

```md id="58491"
# Máquina de Estados — Conversation Control

## 1. Objetivo

Este documento define la máquina de estados responsable de controlar cuándo la inteligencia artificial puede responder y cuándo debe permanecer en modo escucha debido a una intervención humana.

La máquina de estados es el núcleo del módulo Conversation Control.

---

# 2. Concepto general

Cada conversación tiene un estado actual.

El estado determina:

- Si la IA puede responder.
- Si debe esperar.
- Si está bloqueada.
- Qué eventos pueden cambiar su comportamiento.

Modelo:

```

Conversación

```
    |
    ↓
```

Estado actual

```
    |
    ↓
```

Decisión

```
    |
    ↓
```

IA responde
o
IA espera

```

---

# 3. Estados principales

El sistema tendrá los siguientes estados:

- BOT_ACTIVE
- HUMAN_ACTIVE
- BOT_RESUME_PENDING
- HUMAN_LOCKED

---

# 4. Estado BOT_ACTIVE

## Descripción

Estado normal de operación.

La inteligencia artificial tiene permiso para responder.

---

## Comportamiento

Permitido:

- Analizar mensajes del cliente.
- Generar respuestas.
- Enviar mensajes.
- Ejecutar automatizaciones.

---

## Ejemplo

Cliente:

"¿Cuánto cuesta la cámara?"

Sistema:

```

BOT_ACTIVE

IA responde automáticamente

```

---

## Transiciones permitidas

Puede pasar a:

```

BOT_ACTIVE

```
    |
    |
```

humano interviene

```
    ↓
```

HUMAN_ACTIVE

```

o:

```

BOT_ACTIVE

```
    |
    |
```

bloqueo manual

```
    ↓
```

HUMAN_LOCKED

```

---

# 5. Estado HUMAN_ACTIVE

## Descripción

Un humano tomó el control temporal de la conversación.

---

## Comportamiento

La IA:

Puede:

- Leer mensajes.
- Analizar conversación.
- Aprender información.
- Actualizar contexto.

No puede:

- Responder.
- Enviar mensajes.
- Ejecutar acciones automáticas.

---

## Entrada al estado

Evento:

```

HumanInterventionDetected

````

Ejemplo:

Operador escribe:

"Hola, soy Juan, te ayudo personalmente"

Evolution:

```json
{
 "fromMe": true
}
````

Resultado:

```
BOT_ACTIVE

       ↓

HUMAN_ACTIVE
```

---

# 6. Estado BOT_RESUME_PENDING

## Descripción

Estado de espera antes de devolver el control a la IA.

Existe para evitar que la IA vuelva demasiado rápido.

---

## Objetivo

Evitar:

Humano escribe:

"Un momento"

IA vuelve inmediatamente.

---

## Funcionamiento

Cuando el humano deja de escribir:

Se inicia temporizador:

```
5 minutos
```

Durante este tiempo:

La IA sigue bloqueada.

---

## Transición

```
HUMAN_ACTIVE

      |
      |
sin mensajes humanos 5 minutos

      ↓

BOT_RESUME_PENDING
```

---

# 7. Estado BOT_ACTIVE después de espera

Cuando finaliza correctamente:

```
BOT_RESUME_PENDING

        ↓

BOT_ACTIVE
```

Evento:

```
BotResumed
```

---

# 8. Estado HUMAN_LOCKED

## Descripción

Estado permanente de control humano.

La IA queda deshabilitada para esa conversación.

---

## Características

Es un estado especial.

La IA:

Nunca vuelve automáticamente.

---

## Ejemplo

Cliente con reclamo:

Administrador decide:

"Este cliente siempre será atendido por una persona"

Resultado:

```
HUMAN_LOCKED
```

---

# 9. Diagrama completo

```
                     humano escribe
                          |
                          ↓

                    BOT_ACTIVE
                          |
                          |
                          ↓

                  HUMAN_ACTIVE
                          |
                          |
              5 minutos sin humano
                          |
                          ↓

              BOT_RESUME_PENDING
                          |
                          |
                          ↓

                    BOT_ACTIVE



Desde cualquier estado:

        bloqueo manual

              ↓

        HUMAN_LOCKED
```

---

# 10. Tabla de transiciones

| Estado actual      | Evento                    | Nuevo estado       |
| ------------------ | ------------------------- | ------------------ |
| BOT_ACTIVE         | HumanInterventionDetected | HUMAN_ACTIVE       |
| HUMAN_ACTIVE       | TimerExpired              | BOT_RESUME_PENDING |
| BOT_RESUME_PENDING | ResumeApproved            | BOT_ACTIVE         |
| BOT_ACTIVE         | LockHumanMode             | HUMAN_LOCKED       |
| HUMAN_ACTIVE       | LockHumanMode             | HUMAN_LOCKED       |
| BOT_RESUME_PENDING | LockHumanMode             | HUMAN_LOCKED       |
| HUMAN_LOCKED       | Cualquier evento IA       | HUMAN_LOCKED       |

---

# 11. Estados finales

## HUMAN_LOCKED

Es un estado final.

No permite:

* volver a BOT_ACTIVE
* volver a HUMAN_ACTIVE
* reactivar automáticamente

Solo una acción administrativa explícita podría modificarlo.

---

# 12. Reglas de seguridad

Antes de responder:

La IA debe preguntar:

```
¿La conversación está en BOT_ACTIVE?
```

Si la respuesta es:

NO

La IA no puede enviar mensajes.

---

# 13. Principio arquitectónico

La máquina de estados debe estar separada de:

* WhatsApp
* Evolution API
* Modelo IA
* Base de datos

Debe existir como lógica pura de dominio.

---

# 14. Objetivo final

Esta máquina permite que Abiel Core tenga un comportamiento profesional:

* Automatiza cuando corresponde.
* Respeta humanos.
* Aprende durante atención humana.
* Nunca interrumpe una venta.
* Escala a múltiples empresas.

```

---

## Estimación del trabajo

Documento máquina de estados:

- Diseño de estados: 3 h
- Validación de escenarios: 2 h
- Documentación técnica: 1 h

**Total: 6 horas hombre**

Costo estimado:

- Semi Senior: **USD 180**
- Senior: **USD 480**

---

## Acumulado Abiel Core

Anterior:
**194 - 255 horas hombre**

Nuevo documento:
**+6 horas**

Total:

# **200 - 261 horas hombre**
```
