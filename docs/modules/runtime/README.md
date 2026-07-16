# Runtime Module (Core Runtime V1)

## Objetivo

Orquestar la ejecucion del flujo principal de Abiel Core v1 sin acoplarse a tecnologia especifica.

## Componentes implementados

- RuntimeEngine
- ExecutionContext
- ExecutionLifecycle
- EventDispatcher

## Flujo operativo

```
Event
  ↓
RuntimeEngine
  ↓
ExecutionContext
  ↓
Policy Check
  ↓
Execution Pipeline
  ↓
Capability
  ↓
ResultEvent
```

## Responsabilidades

- Construir contexto de ejecucion inmutable por request.
- Validar permisos efectivos con execution-policy.
- Ejecutar capability con timeout y retry definidos por policy.
- Soportar cancelacion explicita por `executionId` cuando la ejecucion esta en `running`.
- Emitir eventos `ExecutionStarted`, `ExecutionCancelled` y `ResultEvent`.
- Consolidar estado final de ejecucion (`success`, `blocked`, `failed`, `timeout`, `cancelled`).

## Tests

- Unit tests de dominio e infraestructura.
- Contract tests para estructura de eventos.
- Integration tests con EventBus real.
