# PR15 Wrapper Migration

## Objetivo

Eliminar la capa de compatibilidad JS legacy en `src` mediante una migración controlada de wrappers.

En lugar de una limpieza masiva, PR15 debe ser una serie de fases con commits pequeños, validación de runtime y preservación de wrappers en duda.

## Estado actual

- Wrappers JS detectados: `51`
- Wrappers usados: `24`
- Wrappers sin referencias directas: `27`
- Wrappers con lógica extra: `10`

> El foco no es la cantidad, sino la dependencia activa y el riesgo de cada wrapper.

## PR15.1 — Migración de wrappers PURE usados

### Objetivo

Eliminar wrappers simples `module.exports = require(...)` que todavía están siendo referenciados.

### Priorización recomendada

#### Nivel 1: Core domain

1. `src/shared/events/DomainEvent.js` — `31` referencias
2. `src/shared/tenant/TenantError.js` — `12` referencias

> `TenantGuard.js` tiene lógica extra y se trata en PR15.3.

#### Nivel 2: Contratos de runtime e infraestructura de dominio

- `src/modules/execution-policy/domain/PermissionChecker.js`
- `src/modules/execution-policy/domain/RetryPolicy.js`
- `src/modules/execution-policy/domain/TimeoutPolicy.js`
- `src/modules/runtime/domain/ExecutionContext.js`
- `src/modules/runtime/domain/ExecutionLifecycle.js`
- `src/modules/buffer/domain/valueObjects/BufferState.js`
- `src/modules/capability/domain/Capability.js`
- `src/modules/state-machine/domain/valueObjects/FlowStage.js`
- `src/modules/ai/domain/entities/AIRequest.js`
- `src/modules/ai/domain/events/GeneracionFallida.js`
- `src/modules/ai/domain/events/RespuestaGenerada.js`
- `src/modules/ai/domain/repositories/LLMProvider.js`

#### Nivel 3: API productiva

- `src/modules/api/interfaces/controllers/ConversationControlController.js`
- `src/modules/api/interfaces/controllers/EmpresaController.js`
- `src/modules/api/interfaces/controllers/UsuarioController.js`
- `src/modules/api/interfaces/middleware/rateLimit.js`
- `src/modules/api/interfaces/routes/conversacionesRoutes.js`
- `src/modules/api/interfaces/routes/empresasRoutes.js`
- `src/modules/api/interfaces/routes/usuariosRoutes.js`

### Cómo trabajar

- Migrar primero wrappers puros y validarlos con tests.
- Actualizar imports que ya pueden apuntar a TS cuando exista el artefacto TS real.
- Si el wrapper es usado por tests, migrar el test y luego el wrapper.

## PR15.2 — Wrappers muertos

### Objetivo

Identificar wrappers que no tienen referencias directas y validar si están muertos o se usan indirectamente.

### Lista de candidatos

- `src/modules/ai/application/use-cases/GenerarRespuestaUseCase.js`
- `src/modules/ai/domain/valueObjects/AIRequestState.js`
- `src/modules/api/infrastructure/runApiMock.js`
- `src/modules/buffer/application/use-cases/AgregarMensajeAlBufferUseCase.js`
- `src/modules/buffer/application/use-cases/CerrarBufferUseCase.js`
- `src/modules/buffer/application/use-cases/ProcesarBufferUseCase.js`
- `src/modules/buffer/application/workers/BufferExpirationWorker.js`
- `src/modules/buffer/domain/entities/MessageBuffer.js`
- `src/modules/buffer/domain/events/BufferAbierto.js`
- `src/modules/buffer/domain/events/BufferListo.js`
- `src/modules/buffer/domain/events/BufferProcesado.js`
- `src/modules/buffer/domain/repositories/MessageBufferRepository.js`
- `src/modules/buffer/infrastructure/persistence/FakeMessageBufferRepository.js`
- `src/modules/capability/application/ExecuteCapabilityUseCase.js`
- `src/modules/capability/application/RegisterCapabilityUseCase.js`
- `src/modules/capability/domain/CapabilityRegistry.js`
- `src/modules/runtime/application/RuntimeEngine.js`
- `src/modules/runtime/infrastructure/EventDispatcher.js`
- `src/modules/state-machine/application/use-cases/AvanzarEtapaUseCase.js`
- `src/modules/state-machine/application/use-cases/FinalizarFlujoUseCase.js`
- `src/modules/state-machine/application/use-cases/IniciarFlujoUseCase.js`
- `src/modules/state-machine/domain/entities/ConversationFlow.js`
- `src/modules/state-machine/domain/events/EtapaAvanzada.js`
- `src/modules/state-machine/domain/events/FlujoFinalizado.js`
- `src/modules/state-machine/domain/events/FlujoIniciado.js`
- `src/modules/state-machine/domain/repositories/ConversationFlowRepository.js`
- `src/modules/state-machine/infrastructure/persistence/FakeConversationFlowRepository.js`

### Validación previa a eliminación

Ejecutar:

```bash
git grep "GenerarRespuestaUseCase"
git grep "AIRequestState"
git grep "RuntimeEngine"
```

Verificar:

- imports dinámicos
- require construidos en strings
- tests ocultos
- scripts y tooling

### Estrategia de commits

- `chore(wrapper): remove unused buffer wrappers`
- `chore(wrapper): remove unused flow wrappers`
- `chore(wrapper): remove unused capability wrappers`

No borrar todos juntos; hacer commits pequeños y separados.

## PR15.3 — Wrappers con lógica extra

### Objetivo

Tratar wrappers que ya son artefactos con comportamiento y no deben eliminarse sin rediseño.

### Wrappers a revisar con cuidado

- `src/shared/tenant/TenantGuard.js`
- `src/modules/runtime/application/RuntimeEngine.js`
- `src/modules/capability/domain/CapabilityRegistry.js`
- `src/modules/state-machine/domain/entities/ConversationFlow.js`

### Propósito

Estos archivos no son wrappers puros. El objetivo es moverlos a su ubicación arquitectónica correcta y decidir si se mantienen como código JS temporal o se migran a TS.

#### TenantGuard

No es wrapper real. Debe transformarse en un módulo de comportamiento:

- `src/shared/security/TenantGuard.js`
- o `src/modules/tenant/application/TenantGuard.js`

#### RuntimeEngine

Revisar si es runtime real, fachada vieja o mock.

Posible destino:

- `src/core/runtime/RuntimeEngine.js`

#### CapabilityRegistry

Debe quedar en una ubicación de dominio/clases centrales:

- `src/core/capabilities/CapabilityRegistry.js`

#### ConversationFlow

Puede ser parte del motor conversacional y merece su propia ubicación:

- `src/core/flow/ConversationFlow.js`

## Documentación y comunicación

No generar aún un listado final de PR15 como `pr15-wrapper-list.md`.

En su lugar, crear:

- `docs/migration/PR15-wrapper-migration.md`

con:

- objetivo
- estado inicial
- fases de migración
- riesgos
- riesgos críticos de wrappers con lógica extra

## Recomendación operativa

- PR15 no es “borrar wrappers”.
- PR15 es una migración de la capa de compatibilidad JS hacia el árbol TS nativo.
- Mantener la arquitectura estable durante la migración.
- Documentar cada decisión de eliminar o conservar.

## Estimación de esfuerzo

Aproximación rápida:

- Auditoría y preparación: 4-6 horas senior
- Migración de PR15: 20-35 horas senior
- Limpieza final y regresión: 8-12 horas senior

Total: `30-50` horas senior.

## Estado actual de la migración

El proyecto ya no está en una limpieza puramente técnica. Está en una fase de maduración de lenguaje: eliminar la capa JS legacy y consolidar el runtime TS.
