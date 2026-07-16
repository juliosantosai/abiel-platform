# PR 02 - Core Platform Promotion

## Objetivo

Promover componentes reutilizables de plataforma a `src/core` sin cambiar el comportamiento de V1.

## Archivos movidos

### Capability

- `src/modules/capability/application/ExecuteCapabilityUseCase.js` -> `src/core/capability/application/ExecuteCapabilityUseCase.js`
- `src/modules/capability/application/ExecuteCapabilityUseCase.test.js` -> `src/core/capability/application/ExecuteCapabilityUseCase.test.js`
- `src/modules/capability/application/RegisterCapabilityUseCase.js` -> `src/core/capability/application/RegisterCapabilityUseCase.js`
- `src/modules/capability/application/RegisterCapabilityUseCase.test.js` -> `src/core/capability/application/RegisterCapabilityUseCase.test.js`
- `src/modules/capability/domain/Capability.js` -> `src/core/capability/domain/Capability.js`
- `src/modules/capability/domain/CapabilityRegistry.js` -> `src/core/capability/domain/CapabilityRegistry.js`
- `src/modules/capability/domain/CapabilityRegistry.test.js` -> `src/core/capability/domain/CapabilityRegistry.test.js`
- `src/modules/capability/infrastructure/InMemoryCapabilityRepository.js` -> `src/core/capability/infrastructure/InMemoryCapabilityRepository.js`

### Execution Policy

- `src/modules/execution-policy/domain/ErrorClassifier.js` -> `src/core/execution-policy/domain/ErrorClassifier.js`
- `src/modules/execution-policy/domain/ErrorClassifier.test.js` -> `src/core/execution-policy/domain/ErrorClassifier.test.js`
- `src/modules/execution-policy/domain/PermissionChecker.js` -> `src/core/execution-policy/domain/PermissionChecker.js`
- `src/modules/execution-policy/domain/PermissionChecker.test.js` -> `src/core/execution-policy/domain/PermissionChecker.test.js`
- `src/modules/execution-policy/domain/RetryPolicy.js` -> `src/core/execution-policy/domain/RetryPolicy.js`
- `src/modules/execution-policy/domain/RetryPolicy.test.js` -> `src/core/execution-policy/domain/RetryPolicy.test.js`
- `src/modules/execution-policy/domain/TimeoutPolicy.js` -> `src/core/execution-policy/domain/TimeoutPolicy.js`
- `src/modules/execution-policy/domain/TimeoutPolicy.test.js` -> `src/core/execution-policy/domain/TimeoutPolicy.test.js`

### Event Kernel

- `src/shared/events/DomainEvent.js` -> `src/core/kernel/events/DomainEvent.js`
- `src/shared/events/EventBus.js` -> `src/core/kernel/events/EventBus.js`
- `src/shared/events/EventBus.test.js` -> `src/core/kernel/events/EventBus.test.js`
- `src/shared/events/EventPublisher.js` -> `src/core/kernel/events/EventPublisher.js`
- `src/shared/events/EventPublisher.test.js` -> `src/core/kernel/events/EventPublisher.test.js`

### Tenant Security

- `src/shared/tenant/TenantContext.js` -> `src/core/security/TenantContext.js`
- `src/shared/tenant/TenantContext.test.js` -> `src/core/security/TenantContext.test.js`
- `src/shared/tenant/TenantError.js` -> `src/core/security/TenantError.js`
- `src/shared/tenant/TenantGuard.js` -> `src/core/security/TenantGuard.js`
- `src/shared/tenant/TenantGuard.test.js` -> `src/core/security/TenantGuard.test.js`

## Imports modificados

- `app.js` ahora importa `EventBus` desde `src/core/kernel/events/EventBus`.
- `src/core/kernel/events/EventPublisher.js` actualiza su import del logger hacia `src/shared/logger/Logger`.
- `src/shared/events/EventSubscriber.js` apunta directamente al nuevo `src/core/kernel/events/EventBus`.

## Wrappers temporales creados

Se dejaron wrappers de compatibilidad en:

- `src/modules/capability/**`
- `src/modules/execution-policy/**`
- `src/shared/events/DomainEvent.js`
- `src/shared/events/EventBus.js`
- `src/shared/events/EventPublisher.js`
- `src/shared/tenant/TenantContext.js`
- `src/shared/tenant/TenantError.js`
- `src/shared/tenant/TenantGuard.js`

Estos wrappers permiten mantener imports legacy mientras PRs posteriores migran referencias directas al árbol `src/core/**`.

## Tests afectados

- Los tests de `capability`, `execution-policy`, `EventBus`, `EventPublisher`, `TenantContext` y `TenantGuard` se movieron junto a sus archivos fuente.
- `EventSubscriber.test.js` permanece en `src/shared/events` porque `EventSubscriber.js` no fue promovido en este PR.

## Problemas encontrados

- `EventSubscriber.js` dependía de la ubicación anterior de `EventBus`; se mantuvo en `shared` y se redirigió al nuevo core kernel para compatibilidad.
- Los imports legacy a `shared/events` y `shared/tenant` están ampliamente distribuidos por el repo, por lo que se decidió mantener wrappers temporales en lugar de reescribir masivamente referencias en este PR.
- La suite ya tenía una falla preexistente en `src/shared/config/env.test.js` no relacionada con esta migración.

## Decisiones tomadas

- No se movió `EventSubscriber.js` para evitar ampliar el alcance del PR y mantener compatibilidad retroactiva.
- No se reescribieron imports de todo el repositorio hacia `src/core/**`; se priorizó un cambio pequeño con wrappers temporales.
- No se cambió ninguna clase, contrato o comportamiento observable.