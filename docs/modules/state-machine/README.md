# Módulo State Machine

## Propósito

Controla en qué **etapa del proceso de atención** se encuentra una conversación. No gestiona quién responde (eso es Conversation Control); gestiona **qué debe hacer el sistema** en cada momento del flujo de negocio.

**Ejemplo de flujo:** saludo → calificación → presentación de oferta → negociación → cierre → postventa.

---

## Modelo de dominio

**Entidad: ConversationFlow**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID único |
| empresaId | string | Tenant propietario |
| conversationId | string | Conversación controlada |
| etapa | string | Etapa actual del flujo |
| etapaAnterior | string? | Etapa previa (para auditoría) |
| contexto | object | Datos acumulados durante el flujo |
| creadoEn | Date | Inicio del flujo |
| actualizadoEn | Date | Última transición |

**Value Object:** `FlowStage` — valida que la etapa sea una de las configuradas para la empresa.

---

## Etapas estándar (configurables por empresa)

| Etapa | Descripción |
|-------|-------------|
| `SALUDO` | Primer contacto, identificación del cliente |
| `CALIFICACION` | Entender la necesidad del cliente |
| `PRESENTACION` | Mostrar producto o servicio |
| `NEGOCIACION` | Resolver objeciones, ajustar oferta |
| `CIERRE` | Confirmar compra o acción deseada |
| `POSTVENTA` | Seguimiento posterior |
| `SOPORTE` | Atención de problemas o reclamos |
| `FINALIZADO` | Flujo completado |

Las etapas son configurables por empresa. Las transiciones son definidas por reglas de negocio de cada empresa.

---

## Casos de uso

| Use case | Descripción |
|----------|-------------|
| `IniciarFlujoUseCase` | Crea un ConversationFlow en la etapa inicial configurada |
| `AvanzarEtapaUseCase` | Transiciona a la siguiente etapa según las reglas del flujo |
| `RetrocederEtapaUseCase` | Retrocede a una etapa anterior (para correcciones) |
| `FinalizarFlujoUseCase` | Marca el flujo como FINALIZADO |
| `ObtenerEtapaActualUseCase` | Consulta sin mutación la etapa actual de un flujo |

---

## Eventos de dominio

| Evento | Datos | Cuándo |
|--------|-------|--------|
| `FlujoIniciado` | flowId, conversationId, empresaId, etapa | Al crear el flujo |
| `EtapaAvanzada` | flowId, empresaId, etapaAnterior, etapaNueva | En cada transición hacia adelante |
| `EtapaRetrocedida` | flowId, empresaId, etapaAnterior, etapaNueva | En retrocesos |
| `FlujoFinalizado` | flowId, conversationId, empresaId | Al finalizar |

---

## Integraciones

- **Recibe de:** Buffer (`BufferListo`) — decide cómo procesar el lote de mensajes según la etapa
- **Entrega a:** AI — con contexto de etapa para ajustar el comportamiento del modelo
- **Configuración por empresa:** cada empresa puede definir sus propias etapas y reglas de transición

---

## Tests

```
npx jest src/modules/state-machine --runInBand
```
