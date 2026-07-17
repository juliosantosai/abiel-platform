# PR15 - Wrapper Migration Execution Plan

## Objetivo

Transformar PR15 en la fase operativa de migración arquitectónica de la capa JS legacy a la arquitectura TS nativa.

Este documento es el plan ejecutable de PR15, con checklist, fases y criterios de éxito. No es un listado estratégico de wrappers; ese trabajo estratégico queda en `pr-15-wrapper-migration.md`.

## PR15 Execution Checklist

### Fase 1 — Core Contracts

Migrar wrappers puros usados que definen contratos de dominio y runtime.

#### DomainEvent.js

- Actual: `src/shared/events/DomainEvent.js`
- Destino final: `src/shared/events/DomainEvent.js`
- Tipo: PURE wrapper
- Riesgo: Bajo
- Refs: 31
- Tests afectados: `EventPublisher.test.ts`, `EventBus.test.ts`, otros tests de eventos
- Commit: pending

#### TenantError.js

- Actual: `src/shared/tenant/TenantError.js`
- Destino final: `src/shared/tenant/TenantError.js`
- Tipo: PURE wrapper
- Riesgo: Bajo
- Refs: 12
- Tests afectados: `TenantContext.test.ts`, `TenantGuard.test.ts`
- Commit: pending

#### AIRequest.js

- Actual: `src/modules/ai/domain/entities/AIRequest.js`
- Destino final: `src/modules/ai/domain/entities/AIRequest.js`
- Tipo: PURE wrapper
- Riesgo: Bajo
- Refs: 1
- Tests afectados: `GenerarRespuestaUseCase.test.ts`
- Commit: pending

#### LLMProvider.js

- Actual: `src/modules/ai/domain/repositories/LLMProvider.js`
- Destino final: `src/modules/ai/domain/repositories/LLMProvider.js`
- Tipo: PURE wrapper
- Riesgo: Bajo
- Refs: 1
- Tests afectados: `GenerarRespuestaUseCase.test.ts`
- Commit: pending

#### BufferState.js

- Actual: `src/modules/buffer/domain/valueObjects/BufferState.js`
- Destino final: `src/modules/buffer/domain/valueObjects/BufferState.js`
- Tipo: PURE wrapper
- Riesgo: Bajo
- Refs: 1
- Tests afectados: state machine y buffer workflows
- Commit: pending

#### Capability.js

- Actual: `src/modules/capability/domain/Capability.js`
- Destino final: `src/modules/capability/domain/Capability.js`
- Tipo: PURE wrapper
- Riesgo: Bajo
- Refs: 1
- Tests afectados: `CapabilityRegistry.test.ts`, `ExecuteCapabilityUseCase.test.ts`
- Commit: pending

#### RetryPolicy.js / TimeoutPolicy.js

- Actual: `src/modules/execution-policy/domain/RetryPolicy.js`
- Actual: `src/modules/execution-policy/domain/TimeoutPolicy.js`
- Destino final: igual
- Tipo: PURE wrappers
- Riesgo: Bajo
- Refs: 1 cada uno
- Tests afectados: políticas de ejecución
- Commit: pending

#### ExecutionContext.js / ExecutionLifecycle.js

- Actual: `src/modules/runtime/domain/ExecutionContext.js`
- Actual: `src/modules/runtime/domain/ExecutionLifecycle.js`
- Destino final: igual
- Tipo: PURE wrappers
- Riesgo: Bajo
- Refs: 1 cada uno
- Tests afectados: runtime core
- Commit: pending

#### FlowStage.js

- Actual: `src/modules/state-machine/domain/valueObjects/FlowStage.js`
- Destino final: igual
- Tipo: PURE wrapper
- Riesgo: Bajo
- Refs: 1
- Tests afectados: state machine
- Commit: pending

#### API wrappers usados

- `src/modules/api/interfaces/controllers/ConversationControlController.js`
- `src/modules/api/interfaces/controllers/EmpresaController.js`
- `src/modules/api/interfaces/controllers/UsuarioController.js`
- `src/modules/api/interfaces/middleware/rateLimit.js`
- `src/modules/api/interfaces/routes/conversacionesRoutes.js`
- `src/modules/api/interfaces/routes/empresasRoutes.js`
- `src/modules/api/interfaces/routes/usuariosRoutes.js`

Tipo: PURE wrappers
Riesgo: Bajo-Medio
Refs: 1 cada uno
Tests afectados: rutas y controladores de API
Commit: pending

### Fase 2 — Runtime Core y artefactos con comportamiento

Estos archivos no deben migrarse como wrappers simples.

#### RuntimeEngine.js

- Actual: `src/modules/runtime/application/RuntimeEngine.js`
- Destino probable: `src/core/runtime/RuntimeEngine.js`
- Riesgo: Alto
- Acción: revisar responsabilidades antes de mover
- Validar: no migrar como wrapper, refactorizar como módulo real
- Commit: pending

#### CapabilityRegistry.js

- Actual: `src/modules/capability/domain/CapabilityRegistry.js`
- Destino probable: `src/core/capabilities/CapabilityRegistry.js`
- Riesgo: Alto
- Acción: convertir en componente nativo de capacidades
- Commit: pending

#### TenantGuard.js

- Actual: `src/shared/tenant/TenantGuard.js`
- Destino probable: `src/shared/security/TenantGuard.js`
- Riesgo: Alto
- Acción: mover comportamiento a un módulo explícito, no mantenerlo como wrapper
- Commit: pending

#### ConversationFlow.js

- Actual: `src/modules/state-machine/domain/entities/ConversationFlow.js`
- Destino probable: `src/core/flow/ConversationFlow.js`
- Riesgo: Medio-Alto
- Acción: evaluar su rol en el motor conversacional
- Commit: pending

### Fase 3 — Dead Code Removal

No eliminar wrappers por lista. El proceso debe ser:

1. grep `git grep "<nombre>"`
2. validar tests
3. eliminar wrapper
4. ejecutar auditoría: `node tools/architecture/audit-wrapper-ts.js`

Objetivo final:

- Antes: `jsWrappers=51`
- Después: `jsWrappers=0`
  - o únicamente wrappers explícitos documentados y necesarios.

## Validación mínima por PR

- `npm test`
- `npm run typecheck`
- `node tools/architecture/audit-wrapper-ts.js`

## Estrategia de commits

Hacer commits pequeños y auditables.

Ejemplos:

```bash
git checkout -b refactor/pr15-wrapper-migration
git add <archivos>
git commit -m "refactor(pr15): migrate DomainEvent wrapper"
```

Otros commits:

- `refactor(pr15): migrate TenantError wrapper`
- `refactor(pr15): migrate AIRequest and LLMProvider wrappers`
- `refactor(pr15): migrate API controller wrappers`
- `refactor(pr15): review RuntimeEngine as runtime module`

## Criterios de éxito de PR15

- Los wrappers usados de core contracts ya no resuelven a `.js`.
- Los imports TS se estabilizan en los módulos migrados.
- No se rompe la suite de pruebas del módulo.
- Los wrappers con lógica extra están documentados y no eliminados sin diseño.
- Se mantiene trazabilidad de decisiones en el PR.

## Enlace con PR16

- `docs/migration/pr-15-wrapper-migration.md`
- `docs/migration/pr-15-pr-16-continuacion.md`

## Notas

PR15 deja de ser limpieza. Es una fase de migración formal con trazabilidad y commits atomizados.
