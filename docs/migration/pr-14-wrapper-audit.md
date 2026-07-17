# PR14: Wrapper Audit Report

## Executive Summary

- Total TypeScript wrapper files detected: **160**
- Total JS files: **289**; total TS files: **299**
- JS files compose **49.1%** of mixed source files, while TS files compose **50.9%.
- JS LOC: **12550**; TS LOC: **2912**. JS dominates at **81.2%** of source lines.
- Imports resolving directly to `.js`: **73** of **737** analyzed imports (**9.9%**).
- Unused wrappers by direct import count: **106**. These are strong candidates for removal after verification.

## Wrapper Distribution by Layer

| Layer | Wrapper Count |
| --- | ---: |
| Core | 0 |
| Shared | 6 |
| Infrastructure | 29 |
| Engines | 6 |
| Modules | 119 |
| Other | 0 |

## Wrapper Distribution by Module

| Module | Wrapper Count |
| --- | ---: |
| human-intervention | 18 |
| usuario | 17 |
| empresa | 16 |
| buffer | 11 |
| api | 10 |
| dashboard | 10 |
| state-machine | 10 |
| ai | 7 |
| whatsapp-sender | 7 |
| capability | 5 |
| execution-policy | 4 |
| runtime | 4 |

## Key Findings

- Modules and infrastructure are the main wrapper risk areas: **119** wrappers in `src/modules`, **29** in `src/infrastructure`.
- `src/shared` still has **6** wrappers, likely around cross-cutting concerns such as tenant/context boundaries.
- No wrappers found in `src/core` by the detection heuristic, indicating core has likely already migrated cleanly or does not rely on the wrapper pattern.

## Unused Wrapper Candidates

 - engines/ai-engine/domain/entities/AIRequest.ts
 - engines/ai-engine/domain/events/GeneracionFallida.ts
 - engines/ai-engine/domain/events/RespuestaGenerada.ts
 - engines/ai-engine/domain/repositories/LLMProvider.ts
 - engines/ai-engine/domain/valueObjects/AIRequestState.ts
 - infrastructure/api/errors/mapErrorToHttp.ts
 - infrastructure/api/health/healthController.ts
 - infrastructure/api/infrastructure/runApiMock.ts
 - infrastructure/api/interfaces/routes/conversacionesRoutes.ts
 - infrastructure/api/interfaces/routes/dashboardRoutes.ts
 - infrastructure/api/interfaces/routes/empresasRoutes.ts
 - infrastructure/api/interfaces/routes/usuariosRoutes.ts
 - infrastructure/api/mappers/conversationHttpMapper.ts
 - infrastructure/api/mappers/dashboardHttpMapper.ts
 - infrastructure/api/mappers/empresaHttpMapper.ts
 - infrastructure/api/mappers/usuarioHttpMapper.ts
 - infrastructure/api/middleware/pipeline.ts
 - infrastructure/api/observability/requestContext.ts
 - infrastructure/api/openapi/OpenApiController.ts
 - infrastructure/api/validators/conversationValidators.ts
 - infrastructure/api/validators/dashboardValidators.ts
 - infrastructure/api/validators/empresaValidators.ts
 - infrastructure/api/validators/usuarioValidators.ts
 - infrastructure/api/versioning/ApiVersioning.ts
 - modules/ai/application/use-cases/GenerarRespuestaUseCase.ts
 - modules/ai/domain/entities/AIRequest.ts
 - modules/ai/domain/events/GeneracionFallida.ts
 - modules/ai/domain/events/RespuestaGenerada.ts
 - modules/ai/domain/repositories/LLMProvider.ts
 - modules/ai/domain/valueObjects/AIRequestState.ts
 - modules/ai/infrastructure/adapters/FakeLLMProvider.ts
 - modules/api/infrastructure/runApiMock.ts
 - modules/api/interfaces/controllers/ConversationControlController.ts
 - modules/api/interfaces/controllers/EmpresaController.ts
 - modules/api/interfaces/controllers/UsuarioController.ts
 - modules/api/interfaces/middleware/auth.ts
 - modules/api/interfaces/middleware/rateLimit.ts
 - modules/api/interfaces/routes/conversacionesRoutes.ts
 - modules/api/interfaces/routes/empresasRoutes.ts
 - modules/api/interfaces/routes/usuariosRoutes.ts
 - modules/buffer/application/use-cases/AgregarMensajeAlBufferUseCase.ts
 - modules/buffer/application/use-cases/CerrarBufferUseCase.ts
 - modules/buffer/application/use-cases/ProcesarBufferUseCase.ts
 - modules/buffer/application/workers/BufferExpirationWorker.ts
 - modules/buffer/domain/entities/MessageBuffer.ts
 - modules/buffer/domain/events/BufferAbierto.ts
 - modules/buffer/domain/events/BufferListo.ts
 - modules/buffer/domain/events/BufferProcesado.ts
 - modules/buffer/domain/repositories/MessageBufferRepository.ts
 - modules/buffer/domain/valueObjects/BufferState.ts
 - modules/buffer/infrastructure/persistence/FakeMessageBufferRepository.ts
 - modules/capability/application/ExecuteCapabilityUseCase.ts
 - modules/capability/application/RegisterCapabilityUseCase.ts
 - modules/capability/domain/CapabilityRegistry.ts
 - modules/capability/infrastructure/InMemoryCapabilityRepository.ts
 - modules/dashboard/domain/entities/DashboardMetrics.ts
 - modules/dashboard/domain/repositories/DashboardRepository.ts
 - modules/dashboard/interfaces/controllers/DashboardController.ts
 - modules/dashboard/interfaces/routes/dashboardRoutes.ts
 - modules/empresa/domain/events/EmpresaActivada.ts
 - modules/empresa/domain/events/EmpresaActualizada.ts
 - modules/empresa/domain/events/EmpresaCancelada.ts
 - modules/empresa/domain/events/EmpresaCreada.ts
 - modules/empresa/domain/events/EmpresaSuspendida.ts
 - modules/empresa/domain/valueObjects/NombreEmpresa.ts
 - modules/empresa/interfaces/EmpresaController.ts
 - modules/execution-policy/domain/ErrorClassifier.ts
 - modules/execution-policy/domain/PermissionChecker.ts
 - modules/execution-policy/domain/RetryPolicy.ts
 - modules/execution-policy/domain/TimeoutPolicy.ts
 - modules/human-intervention/domain/events/BotResumed.ts
 - modules/human-intervention/domain/events/ConversationClosed.ts
 - modules/human-intervention/domain/events/ConversationCreated.ts
 - modules/human-intervention/domain/events/ConversationLocked.ts
 - modules/human-intervention/domain/events/HumanInterventionDetected.ts
 - modules/human-intervention/domain/repositories/ConversationSessionRepository.ts
 - modules/runtime/application/RuntimeEngine.ts
 - modules/runtime/domain/ExecutionContext.ts
 - modules/runtime/domain/ExecutionLifecycle.ts
 - modules/runtime/infrastructure/EventDispatcher.ts
 - modules/state-machine/application/use-cases/AvanzarEtapaUseCase.ts
 - modules/state-machine/application/use-cases/FinalizarFlujoUseCase.ts
 - modules/state-machine/application/use-cases/IniciarFlujoUseCase.ts
 - modules/state-machine/domain/entities/ConversationFlow.ts
 - modules/state-machine/domain/events/EtapaAvanzada.ts
 - modules/state-machine/domain/events/FlujoFinalizado.ts
 - modules/state-machine/domain/events/FlujoIniciado.ts
 - modules/state-machine/domain/repositories/ConversationFlowRepository.ts
 - modules/state-machine/domain/valueObjects/FlowStage.ts
 - modules/state-machine/infrastructure/persistence/FakeConversationFlowRepository.ts
 - modules/usuario/domain/events/UsuarioActivado.ts
 - modules/usuario/domain/events/UsuarioActualizado.ts
 - modules/usuario/domain/events/UsuarioCancelado.ts
 - modules/usuario/domain/events/UsuarioCreado.ts
 - modules/usuario/domain/events/UsuarioSuspendido.ts
 - modules/usuario/domain/repositories/UsuarioRepository.ts
 - modules/usuario/domain/valueObjects/EmailUsuario.ts
 - modules/usuario/domain/valueObjects/NombreUsuario.ts
 - modules/usuario/domain/valueObjects/RolUsuario.ts
 - modules/whatsapp-sender/domain/entities/OutboundMessage.ts
 - modules/whatsapp-sender/domain/events/EnvioFallido.ts
 - modules/whatsapp-sender/domain/events/MensajeEnviado.ts
 - modules/whatsapp-sender/domain/repositories/MessageSender.ts
 - modules/whatsapp-sender/domain/valueObjects/OutboundState.ts
 - modules/whatsapp-sender/infrastructure/adapters/FakeMessageSender.ts
 - shared/tenant/TenantGuard.ts

## Imports Resolving to .js

| Source File | Import Target | Resolved File |
| --- | --- | --- |
| e2e/database.e2e.test.ts | `./database.e2e.test.js` | e2e/database.e2e.test.js |
| e2e/api.e2e.test.ts | `./api.e2e.test.js` | e2e/api.e2e.test.js |
| engines/ai-engine/application/use-cases/GenerarRespuestaUseCase.test.ts | `./GenerarRespuestaUseCase.test.js` | engines/ai-engine/application/use-cases/GenerarRespuestaUseCase.test.js |
| engines/agent-runtime/application/RuntimeEngine.integration.test.ts | `./RuntimeEngine.integration.test.js` | engines/agent-runtime/application/RuntimeEngine.integration.test.js |
| engines/agent-runtime/application/RuntimeEngine.contract.test.ts | `./RuntimeEngine.contract.test.js` | engines/agent-runtime/application/RuntimeEngine.contract.test.js |
| engines/agent-runtime/application/RuntimeEngine.test.ts | `./RuntimeEngine.test.js` | engines/agent-runtime/application/RuntimeEngine.test.js |
| engines/agent-runtime/domain/ExecutionLifecycle.test.ts | `./ExecutionLifecycle.test.js` | engines/agent-runtime/domain/ExecutionLifecycle.test.js |
| engines/agent-runtime/domain/ExecutionContext.test.ts | `./ExecutionContext.test.js` | engines/agent-runtime/domain/ExecutionContext.test.js |
| engines/agent-runtime/infrastructure/EventDispatcher.test.ts | `./EventDispatcher.test.js` | engines/agent-runtime/infrastructure/EventDispatcher.test.js |
| engines/conversation-engine/buffer/domain/entities/MessageBuffer.test.ts | `./MessageBuffer.test.js` | engines/conversation-engine/buffer/domain/entities/MessageBuffer.test.js |
| engines/conversation-engine/buffer/application/workers/BufferExpirationWorker.test.ts | `./BufferExpirationWorker.test.js` | engines/conversation-engine/buffer/application/workers/BufferExpirationWorker.test.js |
| engines/conversation-engine/buffer/application/use-cases/AgregarMensajeAlBufferUseCase.test.ts | `./AgregarMensajeAlBufferUseCase.test.js` | engines/conversation-engine/buffer/application/use-cases/AgregarMensajeAlBufferUseCase.test.js |
| engines/conversation-engine/buffer/application/use-cases/CerrarProcesarBufferUseCase.test.ts | `./CerrarProcesarBufferUseCase.test.js` | engines/conversation-engine/buffer/application/use-cases/CerrarProcesarBufferUseCase.test.js |
| engines/conversation-engine/state-machine/domain/entities/ConversationFlow.test.ts | `./ConversationFlow.test.js` | engines/conversation-engine/state-machine/domain/entities/ConversationFlow.test.js |
| core/security/TenantContext.test.ts | `./TenantContext.test.js` | core/security/TenantContext.test.js |
| core/security/TenantGuard.test.ts | `./TenantGuard.test.js` | core/security/TenantGuard.test.js |
| core/capability/application/RegisterCapabilityUseCase.test.ts | `./RegisterCapabilityUseCase.test.js` | core/capability/application/RegisterCapabilityUseCase.test.js |
| core/capability/application/ExecuteCapabilityUseCase.test.ts | `./ExecuteCapabilityUseCase.test.js` | core/capability/application/ExecuteCapabilityUseCase.test.js |
| core/capability/domain/CapabilityRegistry.test.ts | `./CapabilityRegistry.test.js` | core/capability/domain/CapabilityRegistry.test.js |
| core/kernel/events/EventPublisher.test.ts | `./EventPublisher.test.js` | core/kernel/events/EventPublisher.test.js |
| core/kernel/events/EventBus.test.ts | `./EventBus.test.js` | core/kernel/events/EventBus.test.js |
| core/execution-policy/domain/TimeoutPolicy.test.ts | `./TimeoutPolicy.test.js` | core/execution-policy/domain/TimeoutPolicy.test.js |
| core/execution-policy/domain/RetryPolicy.test.ts | `./RetryPolicy.test.js` | core/execution-policy/domain/RetryPolicy.test.js |
| core/execution-policy/domain/PermissionChecker.test.ts | `./PermissionChecker.test.js` | core/execution-policy/domain/PermissionChecker.test.js |
| core/execution-policy/domain/ErrorClassifier.test.ts | `./ErrorClassifier.test.js` | core/execution-policy/domain/ErrorClassifier.test.js |
| shared/events/EventSubscriber.test.ts | `./EventSubscriber.test.js` | shared/events/EventSubscriber.test.js |
| shared/uuid/UuidGenerator.test.ts | `./UuidGenerator.test.js` | shared/uuid/UuidGenerator.test.js |
| shared/config/env.test.ts | `./env.test.js` | shared/config/env.test.js |
| shared/errors/NotFoundError.test.ts | `./NotFoundError.test.js` | shared/errors/NotFoundError.test.js |
| shared/errors/DomainError.test.ts | `./DomainError.test.js` | shared/errors/DomainError.test.js |
| shared/errors/ValidationError.test.ts | `./ValidationError.test.js` | shared/errors/ValidationError.test.js |
| shared/logger/logger.test.ts | `./logger.test.js` | shared/logger/logger.test.js |
| shared/database/prisma.test.ts | `./prisma.test.js` | shared/database/prisma.test.js |
| infrastructure/api/infrastructure/ExpressApp.test.ts | `./ExpressApp.test.js` | infrastructure/api/infrastructure/ExpressApp.test.js |
| infrastructure/api/interfaces/middleware/auth.test.ts | `./auth.test.js` | infrastructure/api/interfaces/middleware/auth.test.js |
| infrastructure/api/interfaces/middleware/rateLimit.test.ts | `./rateLimit.test.js` | infrastructure/api/interfaces/middleware/rateLimit.test.js |
| infrastructure/api/interfaces/controllers/DashboardController.test.ts | `./DashboardController.test.js` | infrastructure/api/interfaces/controllers/DashboardController.test.js |
| infrastructure/api/interfaces/controllers/UsuarioController.test.ts | `./UsuarioController.test.js` | infrastructure/api/interfaces/controllers/UsuarioController.test.js |
| infrastructure/api/interfaces/controllers/ConversationControlController.test.ts | `./ConversationControlController.test.js` | infrastructure/api/interfaces/controllers/ConversationControlController.test.js |
| infrastructure/api/interfaces/controllers/EmpresaController.test.ts | `./EmpresaController.test.js` | infrastructure/api/interfaces/controllers/EmpresaController.test.js |
| modules/usuario/infrastructure/persistence/PrismaUsuarioRepository.test.ts | `./PrismaUsuarioRepository.test.js` | modules/usuario/infrastructure/persistence/PrismaUsuarioRepository.test.js |
| modules/usuario/infrastructure/persistence/PrismaUsuarioRepository.integration.test.ts | `./PrismaUsuarioRepository.integration.test.js` | modules/usuario/infrastructure/persistence/PrismaUsuarioRepository.integration.test.js |
| modules/usuario/infrastructure/persistence/FakeUsuarioRepository.test.ts | `./FakeUsuarioRepository.test.js` | modules/usuario/infrastructure/persistence/FakeUsuarioRepository.test.js |
| modules/usuario/domain/entities/Usuario.test.ts | `./Usuario.test.js` | modules/usuario/domain/entities/Usuario.test.js |
| modules/usuario/application/use-cases/SuspenderUsuarioUseCase.test.ts | `./SuspenderUsuarioUseCase.test.js` | modules/usuario/application/use-cases/SuspenderUsuarioUseCase.test.js |
| modules/usuario/application/use-cases/ActualizarUsuarioUseCase.test.ts | `./ActualizarUsuarioUseCase.test.js` | modules/usuario/application/use-cases/ActualizarUsuarioUseCase.test.js |
| modules/usuario/application/use-cases/CrearUsuarioUseCase.test.ts | `./CrearUsuarioUseCase.test.js` | modules/usuario/application/use-cases/CrearUsuarioUseCase.test.js |
| modules/usuario/application/use-cases/CancelarUsuarioUseCase.test.ts | `./CancelarUsuarioUseCase.test.js` | modules/usuario/application/use-cases/CancelarUsuarioUseCase.test.js |
| modules/usuario/application/use-cases/ActivarUsuarioUseCase.test.ts | `./ActivarUsuarioUseCase.test.js` | modules/usuario/application/use-cases/ActivarUsuarioUseCase.test.js |
| modules/human-intervention/infrastructure/adapters/EvolutionWebhookAdapter.test.ts | `./EvolutionWebhookAdapter.test.js` | modules/human-intervention/infrastructure/adapters/EvolutionWebhookAdapter.test.js |
| modules/human-intervention/infrastructure/adapters/EvolutionWebhookHandler.test.ts | `./EvolutionWebhookHandler.test.js` | modules/human-intervention/infrastructure/adapters/EvolutionWebhookHandler.test.js |
| modules/human-intervention/infrastructure/persistence/FakeConversationSessionRepository.test.ts | `./FakeConversationSessionRepository.test.js` | modules/human-intervention/infrastructure/persistence/FakeConversationSessionRepository.test.js |
| modules/human-intervention/infrastructure/persistence/PrismaConversationSessionRepository.test.ts | `./PrismaConversationSessionRepository.test.js` | modules/human-intervention/infrastructure/persistence/PrismaConversationSessionRepository.test.js |
| modules/human-intervention/domain/valueObjects/ConversationState.test.ts | `./ConversationState.test.js` | modules/human-intervention/domain/valueObjects/ConversationState.test.js |
| modules/human-intervention/domain/entities/ConversationSession.test.ts | `./ConversationSession.test.js` | modules/human-intervention/domain/entities/ConversationSession.test.js |
| modules/human-intervention/application/workers/BotResumptionWorker.test.ts | `./BotResumptionWorker.test.js` | modules/human-intervention/application/workers/BotResumptionWorker.test.js |
| modules/human-intervention/application/use-cases/CrearConversationSessionUseCase.test.ts | `./CrearConversationSessionUseCase.test.js` | modules/human-intervention/application/use-cases/CrearConversationSessionUseCase.test.js |
| modules/human-intervention/application/use-cases/DetectarIntervencionHumanaUseCase.test.ts | `./DetectarIntervencionHumanaUseCase.test.js` | modules/human-intervention/application/use-cases/DetectarIntervencionHumanaUseCase.test.js |
| modules/human-intervention/application/use-cases/BloquearCerrarConversacionUseCase.test.ts | `./BloquearCerrarConversacionUseCase.test.js` | modules/human-intervention/application/use-cases/BloquearCerrarConversacionUseCase.test.js |
| modules/human-intervention/application/use-cases/EvaluarReanudacionBotUseCase.test.ts | `./EvaluarReanudacionBotUseCase.test.js` | modules/human-intervention/application/use-cases/EvaluarReanudacionBotUseCase.test.js |
| modules/dashboard/infrastructure/persistence/PrismaDashboardRepository.test.ts | `./PrismaDashboardRepository.test.js` | modules/dashboard/infrastructure/persistence/PrismaDashboardRepository.test.js |
| modules/dashboard/domain/valueObjects/ValueObjects.test.ts | `./ValueObjects.test.js` | modules/dashboard/domain/valueObjects/ValueObjects.test.js |
| modules/dashboard/application/use-cases/UseCases.test.ts | `./UseCases.test.js` | modules/dashboard/application/use-cases/UseCases.test.js |
| modules/whatsapp-sender/application/use-cases/EnviarMensajeUseCase.test.ts | `./EnviarMensajeUseCase.test.js` | modules/whatsapp-sender/application/use-cases/EnviarMensajeUseCase.test.js |
| modules/empresa/infrastructure/persistence/FakeEmpresaRepository.test.ts | `./FakeEmpresaRepository.test.js` | modules/empresa/infrastructure/persistence/FakeEmpresaRepository.test.js |
| modules/empresa/infrastructure/persistence/PrismaEmpresaRepository.test.ts | `./PrismaEmpresaRepository.test.js` | modules/empresa/infrastructure/persistence/PrismaEmpresaRepository.test.js |
| modules/empresa/domain/repositories/EmpresaRepository.test.ts | `./EmpresaRepository.test.js` | modules/empresa/domain/repositories/EmpresaRepository.test.js |
| modules/empresa/domain/entities/Empresa.test.ts | `./Empresa.test.js` | modules/empresa/domain/entities/Empresa.test.js |
| modules/empresa/application/use-cases/CancelarEmpresaUseCase.test.ts | `./CancelarEmpresaUseCase.test.js` | modules/empresa/application/use-cases/CancelarEmpresaUseCase.test.js |
| modules/empresa/application/use-cases/ActualizarEmpresaUseCase.test.ts | `./ActualizarEmpresaUseCase.test.js` | modules/empresa/application/use-cases/ActualizarEmpresaUseCase.test.js |
| modules/empresa/application/use-cases/SuspenderEmpresaUseCase.test.ts | `./SuspenderEmpresaUseCase.test.js` | modules/empresa/application/use-cases/SuspenderEmpresaUseCase.test.js |
| modules/empresa/application/use-cases/CrearEmpresaUseCase.test.ts | `./CrearEmpresaUseCase.test.js` | modules/empresa/application/use-cases/CrearEmpresaUseCase.test.js |
| modules/empresa/application/use-cases/ActivarEmpresaUseCase.test.ts | `./ActivarEmpresaUseCase.test.js` | modules/empresa/application/use-cases/ActivarEmpresaUseCase.test.js |

## Recommendations

- Keep JS wrappers in place until module-level migration and runtime validation are complete.
- Focus PR15 on modules with the highest wrapper counts first (top module wrappers).
- Validate and remove unused wrappers in a dedicated follow-up PR once the call graph is confirmed. This reduces risk of premature cleanup.
- Address imports resolving to `.js` in tests and runtime code before deleting corresponding JS files. Many are tests, but some may indicate still-active JS dependency paths.

## Notes

- The wrapper detection uses a strict pattern matching `const impl = require(__filename.replace(/\.ts$/, ".js")); export = impl;` in TS files.
- There may be additional custom wrapper patterns not captured by this heuristic; a manual review of `src/modules` and `src/infrastructure` is recommended.