# Legacy Wrappers Inventory

Generated at: 2026-07-17T13:16:33.767Z
Total wrappers: 58
Contaminated wrappers: 17

## Wrappers

- src/modules/ai/application/use-cases/GenerarRespuestaUseCase.js
- src/modules/ai/domain/entities/AIRequest.js
- src/modules/ai/domain/events/GeneracionFallida.js
- src/modules/ai/domain/events/RespuestaGenerada.js
- src/modules/ai/domain/repositories/LLMProvider.js
- src/modules/ai/domain/valueObjects/AIRequestState.js
- src/modules/api/infrastructure/ExpressApp.js
- src/modules/api/infrastructure/runApiMock.js
- src/modules/api/interfaces/controllers/ConversationControlController.js
- src/modules/api/interfaces/controllers/EmpresaController.js
- src/modules/api/interfaces/controllers/UsuarioController.js
- src/modules/api/interfaces/middleware/auth.js
- src/modules/api/interfaces/middleware/rateLimit.js
- src/modules/api/interfaces/routes/conversacionesRoutes.js
- src/modules/api/interfaces/routes/empresasRoutes.js
- src/modules/api/interfaces/routes/usuariosRoutes.js
- src/modules/buffer/application/use-cases/AgregarMensajeAlBufferUseCase.js
- src/modules/buffer/application/use-cases/CerrarBufferUseCase.js
- src/modules/buffer/application/use-cases/ProcesarBufferUseCase.js
- src/modules/buffer/application/workers/BufferExpirationWorker.js
- src/modules/buffer/domain/entities/MessageBuffer.js
- src/modules/buffer/domain/events/BufferAbierto.js
- src/modules/buffer/domain/events/BufferListo.js
- src/modules/buffer/domain/events/BufferProcesado.js
- src/modules/buffer/domain/repositories/MessageBufferRepository.js
- src/modules/buffer/domain/valueObjects/BufferState.js
- src/modules/buffer/infrastructure/persistence/FakeMessageBufferRepository.js
- src/modules/capability/application/ExecuteCapabilityUseCase.js
- src/modules/capability/application/RegisterCapabilityUseCase.js
- src/modules/capability/domain/Capability.js
- src/modules/capability/domain/CapabilityRegistry.js
- src/modules/capability/infrastructure/InMemoryCapabilityRepository.js
- src/modules/dashboard/interfaces/controllers/DashboardController.js
- src/modules/dashboard/interfaces/routes/dashboardRoutes.js
- src/modules/execution-policy/domain/ErrorClassifier.js
- src/modules/execution-policy/domain/PermissionChecker.js
- src/modules/execution-policy/domain/RetryPolicy.js
- src/modules/execution-policy/domain/TimeoutPolicy.js
- src/modules/runtime/application/RuntimeEngine.js
- src/modules/runtime/domain/ExecutionContext.js
- src/modules/runtime/domain/ExecutionLifecycle.js
- src/modules/runtime/infrastructure/EventDispatcher.js
- src/modules/state-machine/application/use-cases/AvanzarEtapaUseCase.js
- src/modules/state-machine/application/use-cases/FinalizarFlujoUseCase.js
- src/modules/state-machine/application/use-cases/IniciarFlujoUseCase.js
- src/modules/state-machine/domain/entities/ConversationFlow.js
- src/modules/state-machine/domain/events/EtapaAvanzada.js
- src/modules/state-machine/domain/events/FlujoFinalizado.js
- src/modules/state-machine/domain/events/FlujoIniciado.js
- src/modules/state-machine/domain/repositories/ConversationFlowRepository.js
- src/modules/state-machine/domain/valueObjects/FlowStage.js
- src/modules/state-machine/infrastructure/persistence/FakeConversationFlowRepository.js
- src/shared/events/DomainEvent.js
- src/shared/events/EventBus.js
- src/shared/events/EventPublisher.js
- src/shared/tenant/TenantContext.js
- src/shared/tenant/TenantError.js
- src/shared/tenant/TenantGuard.js

## Contaminated Wrappers (contains legacy trailing code)

- src/modules/ai/application/use-cases/GenerarRespuestaUseCase.js
- src/modules/api/infrastructure/ExpressApp.js
- src/modules/api/infrastructure/runApiMock.js
- src/modules/api/interfaces/middleware/auth.js
- src/modules/buffer/domain/entities/MessageBuffer.js
- src/modules/capability/application/ExecuteCapabilityUseCase.js
- src/modules/capability/domain/CapabilityRegistry.js
- src/modules/capability/infrastructure/InMemoryCapabilityRepository.js
- src/modules/dashboard/interfaces/controllers/DashboardController.js
- src/modules/dashboard/interfaces/routes/dashboardRoutes.js
- src/modules/execution-policy/domain/ErrorClassifier.js
- src/modules/runtime/application/RuntimeEngine.js
- src/modules/state-machine/domain/entities/ConversationFlow.js
- src/shared/events/EventBus.js
- src/shared/events/EventPublisher.js
- src/shared/tenant/TenantContext.js
- src/shared/tenant/TenantGuard.js
