# Módulo WhatsApp Sender

## Propósito

Envía mensajes salientes al cliente a través de Evolution API. Es el único módulo que interactúa directamente con la API de envío. No decide qué enviar; solo ejecuta el envío de lo que otros módulos producen.

---

## Modelo de dominio

**Entidad: OutboundMessage**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID único |
| empresaId | string | Tenant propietario |
| conversationId | string | Conversación destino |
| clienteId | string | Número de destino |
| contenido | string | Texto o referencia del contenido |
| tipo | string | TEXT, IMAGE, AUDIO, DOCUMENT |
| estado | string | PENDIENTE, ENVIADO, FALLIDO |
| intentos | number | Contador de reintentos |
| creadoEn | Date | Momento de creación |
| enviadoEn | Date? | Momento de envío exitoso |

**Value Object:** `MessageType` — acepta: `TEXT`, `IMAGE`, `AUDIO`, `DOCUMENT`
**Value Object:** `OutboundState` — acepta: `PENDIENTE`, `ENVIADO`, `FALLIDO`

---

## Casos de uso

| Use case | Descripción |
|----------|-------------|
| `EnviarMensajeUseCase` | Crea OutboundMessage, llama al adapter de Evolution API, actualiza estado |
| `ReintentarEnvioUseCase` | Reintenta mensajes FALLIDO (hasta máximo de intentos) |

---

## Eventos de dominio

| Evento | Datos | Cuándo |
|--------|-------|--------|
| `MensajeEnviado` | messageId, conversationId, empresaId, clienteId | Al confirmar envío exitoso |
| `EnvioFallido` | messageId, conversationId, empresaId, error, intentos | Al agotar reintentos |

---

## Adaptador: Evolution API Sender

El módulo define un contrato abstracto `MessageSender`:

```js
class MessageSender {
    async send({ instance, remoteJid, message }) → { success, messageId }
}
```

Implementaciones:
- `EvolutionSenderAdapter` — llama al endpoint POST de Evolution API
- `FakeMessageSender` — registra los mensajes sin enviarlos (tests)

---

## Configuración por empresa

Cada empresa tiene una `whatsappInstanceId` (almacenada en el módulo Empresa). El sender la usa como identificador de instancia en Evolution API.

---

## Política de reintentos

| Parámetro | Valor |
|-----------|-------|
| Máximo intentos | 3 |
| Espera entre intentos | exponencial (1s, 2s, 4s) |
| Estado final si falla | FALLIDO + evento `EnvioFallido` |

---

## Integraciones

- **Recibe de:** AI (`RespuestaGenerada`) — envía la respuesta al cliente
- **Depende de:** Evolution API (externo)
- **Lee de:** Empresa — `whatsappInstanceId`

---

## Tests

```
npx jest src/modules/whatsapp-sender --runInBand
```
