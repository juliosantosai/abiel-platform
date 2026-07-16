# Módulo Human Intervention

## Propósito

Gestiona la intervención humana en conversaciones: escalado a operadores, bloqueo, cierre y validación de transiciones. Es el punto de entrada para que operadores tomen control manual de una conversación.

---

## Modelo de dominio

**Entidad: ConversationSession**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID único |
| empresaId | string | Tenant propietario |
| clienteId | string | Cliente o contacto de la conversación |
| estado | string | Estado actual de control |
| ultimaIntervencionHumana | Date? | Timestamp de la última actividad humana |
| creadoEn | Date | Fecha de creación |
| actualizadoEn | Date | Última actualización |

**Value Object:** `ConversationState` — acepta: `BOT_ACTIVE`, `HUMAN_ACTIVE`, `BOT_RESUME_PENDING`, `HUMAN_LOCKED`, `CLOSED`

---

## Máquina de estados

```
BOT_ACTIVE ──humano──→ HUMAN_ACTIVE ──5 min──→ BOT_RESUME_PENDING ──confirmar──→ BOT_ACTIVE

Desde cualquier estado (excepto CLOSED) ──bloquear()──→ HUMAN_LOCKED
Desde cualquier estado ──cerrar()──→ CLOSED
```

| Método | Transición |
|--------|-----------|
| `detectarIntervencionHumana()` | BOT_ACTIVE → HUMAN_ACTIVE |
| `iniciarReanudacion()` | HUMAN_ACTIVE → BOT_RESUME_PENDING |
| `reanudarBot()` | BOT_RESUME_PENDING → BOT_ACTIVE |
| `bloquear()` | cualquier → HUMAN_LOCKED |
| `cerrar()` | cualquier → CLOSED |
| `puedeResponderBot()` | true solo si BOT_ACTIVE |

---

## Casos de uso

| Use case | Descripción |
|----------|-------------|
| `CrearConversationSessionUseCase` | Crea sesión en BOT_ACTIVE |
| `DetectarIntervencionHumanaUseCase` | Cambia a HUMAN_ACTIVE, valida tenant |
| `EvaluarReanudacionBotUseCase` | Si pasaron ≥ 5 min sin humano, reanuda bot |
| `BloquearConversacionUseCase` | → HUMAN_LOCKED, valida tenant |
| `CerrarConversacionUseCase` | → CLOSED, valida tenant |

---

## Eventos de dominio

| Evento | Datos |
|--------|-------|
| `ConversationCreated` | conversationId, empresaId, clienteId, estado |
| `HumanInterventionDetected` | conversationId, empresaId, estadoAnterior, estadoNuevo |
| `BotResumed` | conversationId, empresaId, estado |
| `ConversationLocked` | conversationId, empresaId, estado |
| `ConversationClosed` | conversationId, empresaId, estado |

---

## Worker: BotResumptionWorker

Evalúa periódicamente sesiones en `HUMAN_ACTIVE`. Si la última intervención supera el tiempo configurado (default 5 min), reanuda el bot.

---

## Adaptador: Evolution API

`EvolutionWebhookAdapter` normaliza el payload de Evolution API a un comando interno con `senderType`: `CUSTOMER`, `HUMAN` o `BOT`.

`EvolutionWebhookHandler` orquesta: normalizar → buscar/crear sesión → disparar use case si es HUMAN.

---

## Tests

```
npx jest src/modules/human-intervention --runInBand
```
