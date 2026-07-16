Siguiente documento:

`docs/modules/conversation-control/21-workers-y-procesos-automaticos.md`

````md id="84k21"
# COPILOT CONTEXT — Workers y Procesos Automáticos
# Módulo Conversation Control

## Objetivo

Definir los procesos automáticos que ejecutan tareas de mantenimiento de la máquina de estados de conversación.

Los workers NO contienen reglas de negocio.

Su función es detectar situaciones y llamar casos de uso.

---

# Principio

Incorrecto:

```text
Worker

↓

Cambiar estado conversación
````

---

Correcto:

```text
Worker

↓

Detecta condición

↓

Use Case

↓

Máquina de estados

↓

Cambio de estado
```

---

# Worker: Human Timeout Checker

## Nombre

```text
HumanTimeoutWorker
```

---

## Objetivo

Detectar conversaciones donde el humano dejó de interactuar.

---

## Frecuencia recomendada

Ejemplo:

```text
Cada 1 minuto
```

---

## Proceso

1. Buscar conversaciones HUMAN_ACTIVE.
2. Revisar última actividad humana.
3. Comparar tiempo actual.
4. Ejecutar ProcessHumanTimeoutUseCase.

---

# Regla principal

Si:

```text
estado = HUMAN_ACTIVE
```

y:

```text
ahora - lastHumanActivity >= 5 minutos
```

Entonces:

```text
HUMAN_ACTIVE

↓

BOT_RESUME_PENDING
```

---

# Ejemplo

Hora:

```text
10:00
```

Humano escribe:

```text
10:02
```

Estado:

```text
HUMAN_ACTIVE
```

---

Worker revisa:

```text
10:07
```

Resultado:

```text
BOT_RESUME_PENDING
```

---

# Worker: Bot Resume Processor

## Nombre

```text
BotResumeWorker
```

---

## Objetivo

Procesar conversaciones listas para regresar al bot.

---

Proceso:

1. Buscar BOT_RESUME_PENDING.
2. Ejecutar validaciones.
3. Ejecutar ResumeBotUseCase.
4. Cambiar a BOT_ACTIVE.

---

# Validaciones antes de activar

Verificar:

* tenant correcto
* conversación existente
* no existe bloqueo permanente
* no hay humano activo

---

# Worker: Conversation Cleanup

## Nombre

```text
ConversationCleanupWorker
```

---

## Objetivo

Mantenimiento de datos antiguos.

---

Funciones:

* archivar conversaciones antiguas
* limpiar sesiones temporales
* liberar memoria

---

No debe:

* borrar conversaciones activas
* cambiar estados de negocio

---

# Worker: Learning Processor

## Nombre

```text
HumanLearningWorker
```

---

## Objetivo

Procesar conversaciones humanas para aprendizaje.

---

Entrada:

Eventos:

```text
MessageReceived
```

con:

```text
senderType = HUMAN
```

---

Procesa:

* respuestas frecuentes
* soluciones dadas
* información comercial
* objeciones

---

Resultado:

Genera:

```text
LearningDataCaptured
```

---

Importante:

Nunca:

```text
Responder cliente
```

---

# Integración con colas

Recomendado:

```text
BullMQ
```

---

Arquitectura:

```text
Event

↓

Queue

↓

Worker

↓

Use Case

↓

Domain
```

---

Ejemplo:

```text
HumanTimeoutReached

↓

Queue

↓

HumanTimeoutWorker

↓

ProcessHumanTimeoutUseCase
```

---

# Redis

Uso:

* colas
* locks temporales
* procesamiento distribuido

---

No usar Redis como fuente principal del estado.

---

Fuente oficial:

```text
PostgreSQL
```

---

# Control de concurrencia

Problema:

Dos workers procesan la misma conversación.

Solución:

Lock temporal.

Ejemplo:

```text
conversation-lock:{id}
```

---

Flujo:

```text
Worker A obtiene lock

↓

Procesa

↓

Libera lock
```

---

# Reintentos

Los workers deben soportar errores temporales.

Ejemplo:

Error:

```text
Database timeout
```

---

Acción:

```text
Retry automático
```

---

No repetir:

Errores de dominio.

Ejemplo:

```text
Estado inválido
```

---

# Métricas

Registrar:

## Human takeover

Cantidad:

```text
human_intervention_total
```

---

## Tiempo humano

Medir:

```text
human_duration_seconds
```

---

## Retorno bot

Medir:

```text
bot_resume_total
```

---

## Aprendizaje

Medir:

```text
learning_events_total
```

---

# Tests obligatorios

## HumanTimeoutWorker

Debe:

* detectar timeout
* llamar use case correcto

---

## BotResumeWorker

Debe:

* procesar pendientes
* no activar bloqueados

---

## LearningWorker

Debe:

* guardar aprendizaje
* no enviar mensajes

---

# Restricciones Copilot

* Worker no contiene reglas.
* Worker no modifica entidades directamente.
* Worker llama Use Cases.
* Workers deben ser idempotentes.
* Respetar tenant.
* Nunca pisar intervención humana.

```
```
