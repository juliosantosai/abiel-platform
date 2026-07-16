# Módulo AI

## Propósito

Orquesta las llamadas al modelo de lenguaje (LLM). Construye el contexto de la conversación, genera la respuesta y la entrega al módulo de envío. No envía mensajes directamente; solo produce texto.

**Responsabilidad única:** dado un lote de mensajes y el contexto de la conversación, producir una respuesta textual apropiada.

---

## Modelo de dominio

**Entidad: AIRequest**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID único |
| empresaId | string | Tenant propietario |
| conversationId | string | Conversación origen |
| mensajes | Message[] | Lote del buffer a procesar |
| etapa | string | Etapa actual del flujo (de State Machine) |
| contexto | object | Historial y datos del cliente |
| respuesta | string? | Texto generado por el modelo |
| estado | string | PENDIENTE, PROCESANDO, COMPLETADO, FALLIDO |
| creadoEn | Date | Momento de la solicitud |
| completadoEn | Date? | Momento de la respuesta |

**Value Object:** `AIRequestState` — acepta: `PENDIENTE`, `PROCESANDO`, `COMPLETADO`, `FALLIDO`

---

## Casos de uso

| Use case | Descripción |
|----------|-------------|
| `GenerarRespuestaUseCase` | Construye el prompt con contexto + etapa + mensajes, llama al LLM, guarda la respuesta |
| `ReintentarRespuestaUseCase` | Reintenta una solicitud FALLIDA |
| `ObtenerRespuestaUseCase` | Consulta el resultado de una solicitud completada |

---

## Eventos de dominio

| Evento | Datos | Cuándo |
|--------|-------|--------|
| `RespuestaGenerada` | requestId, conversationId, empresaId, respuesta | Al completar exitosamente |
| `GeneracionFallida` | requestId, conversationId, empresaId, error | Al fallar después de reintentos |

---

## Adaptador: LLM Provider

El módulo define un contrato abstracto `LLMProvider`:

```js
class LLMProvider {
    async generate({ prompt, model, maxTokens }) → { text, usage }
}
```

Implementaciones concretas (en infrastructure/adapters/):
- `OpenAIAdapter` — GPT-4 / GPT-4o via API de OpenAI
- `AnthropicAdapter` — Claude via API de Anthropic
- `FakeLLMAdapter` — respuesta fija para tests

---

## Construcción del prompt

El prompt se construye combinando:
1. **System prompt** de la empresa (personalidad y reglas del asistente)
2. **Etapa actual** del flujo (contexto de negocio)
3. **Historial** de la conversación (últimos N mensajes)
4. **Mensajes del buffer** (input actual del cliente)

---

## Integraciones

- **Recibe de:** Buffer (`BufferListo`) + State Machine (etapa actual)
- **Entrega a:** WhatsApp Sender (`RespuestaGenerada`)
- **Dependencia externa:** proveedor LLM (OpenAI, Anthropic, etc.)

---

## Tests

```
npx jest src/modules/ai --runInBand
```
