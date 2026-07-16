# Módulo Buffer

## Propósito

Acumula mensajes consecutivos de un mismo cliente dentro de una ventana de tiempo antes de entregarlos como un lote al procesamiento. Evita que la IA responda a cada fragmento de un pensamiento del usuario por separado.

**Regla principal:** si el cliente escribe varios mensajes en menos de N segundos, el sistema los agrupa y los trata como un solo input.

---

## Modelo de dominio

**Entidad: MessageBuffer**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID único |
| empresaId | string | Tenant propietario |
| conversationId | string | Conversación a la que pertenece |
| mensajes | Message[] | Lista de mensajes acumulados |
| estado | string | ABIERTO, LISTO, PROCESADO |
| creadoEn | Date | Apertura del buffer |
| expiraEn | Date | Momento en que el buffer cierra y libera |

**Value Object:** `BufferState` — acepta: `ABIERTO`, `LISTO`, `PROCESADO`

**Entidad interna: Message** (value object embebido)

| Campo | Tipo |
|-------|------|
| id | string |
| texto | string |
| tipo | TEXT, AUDIO, IMAGE |
| timestamp | Date |

---

## Máquina de estados

```
ABIERTO ──ventana expira──→ LISTO ──procesado──→ PROCESADO
   │
   └──nuevos mensajes extienden la ventana (reset del timer)
```

---

## Casos de uso

| Use case | Descripción |
|----------|-------------|
| `AgregarMensajeAlBufferUseCase` | Añade mensaje al buffer activo o crea uno nuevo. Resetea la ventana de tiempo. |
| `CerrarBufferUseCase` | Marca el buffer como LISTO cuando expira la ventana. |
| `ProcesarBufferUseCase` | Entrega el lote de mensajes al siguiente módulo (AI/State Machine) y marca como PROCESADO. |

---

## Eventos de dominio

| Evento | Datos | Cuándo |
|--------|-------|--------|
| `BufferAbierto` | bufferId, conversationId, empresaId | Al crear el primer buffer |
| `MensajeAgregadoAlBuffer` | bufferId, messageId, empresaId | Por cada mensaje añadido |
| `BufferListo` | bufferId, conversationId, empresaId, mensajes[] | Cuando la ventana expira |
| `BufferProcesado` | bufferId, conversationId, empresaId | Al entregar al siguiente módulo |

---

## Worker: BufferExpirationWorker

Evalúa periódicamente los buffers en estado `ABIERTO` con `expiraEn < ahora`. Los cierra y publica `BufferListo`.

---

## Configuración

| Parámetro | Default | Descripción |
|-----------|---------|-------------|
| `ventanaMs` | 3000 | Milisegundos de inactividad para cerrar el buffer |
| `maxMensajes` | 10 | Máximo de mensajes por buffer antes de forzar cierre |

---

## Integraciones

- **Recibe de:** Conversation Control / EvolutionWebhookHandler (mensajes CUSTOMER)
- **Entrega a:** State Machine / AI (evento `BufferListo`)
- **Tenant isolation:** validada en todos los use cases de modificación

---

## Tests

```
npx jest src/modules/buffer --runInBand
```
