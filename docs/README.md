# Abiel Core — Índice de documentación

**Status:** ✅ 266/270 Tests Passing | Migrations Applied | E2E Tests Created

## Arquitectura general

| Documento | Contenido |
|-----------|-----------|
| [arquitectura/vision.md](arquitectura/vision.md) | Qué es Abiel Core, tecnologías, principios y capas |
| [arquitectura/modulos.md](arquitectura/modulos.md) | Bounded contexts, módulos implementados y pendientes |
| [arquitectura/estructura.md](arquitectura/estructura.md) | Estructura de carpetas y convenciones de nombres |
| [arquitectura/flujos.md](arquitectura/flujos.md) | Flujo entre módulos y flujo de eventos |
| [arquitectura/desarrollo.md](arquitectura/desarrollo.md) | Reglas de desarrollo, pruebas y escalabilidad |

## Capa shared

| Documento | Contenido |
|-----------|-----------|
| [shared/vision.md](shared/vision.md) | Visión general y estructura de la capa compartida |
| [shared/errors.md](shared/errors.md) | DomainError, ValidationError, NotFoundError |
| [shared/events.md](shared/events.md) | DomainEvent, EventBus, EventPublisher |
| [shared/tenant.md](shared/tenant.md) | TenantContext, TenantGuard, TenantError |
| [shared/infraestructura.md](shared/infraestructura.md) | Prisma, Logger, UuidGenerator, Config |

## Módulos

| Documento | Estado |
|-----------|--------|
| [modules/empresa/README.md](modules/empresa/README.md) | ✅ Implementado (+ PrismaRepository) |
| [modules/usuario/README.md](modules/usuario/README.md) | ✅ Implementado (+ PrismaRepository) |
| [modules/conversation-control/README.md](modules/conversation-control/README.md) | ✅ Implementado |
| [modules/buffer/README.md](modules/buffer/README.md) | ⬜ Documentado — pendiente implementación |
| [modules/state-machine/README.md](modules/state-machine/README.md) | ⬜ Documentado — pendiente implementación |
| [modules/ai/README.md](modules/ai/README.md) | ⬜ Documentado — pendiente implementación |
| [modules/whatsapp-sender/README.md](modules/whatsapp-sender/README.md) | ⬜ Documentado — pendiente implementación |
| [modules/api/README.md](modules/api/README.md) | ⬜ Documentado — pendiente implementación |
| [modules/dashboard/README.md](modules/dashboard/README.md) | ⬜ Documentado — pendiente implementación |
