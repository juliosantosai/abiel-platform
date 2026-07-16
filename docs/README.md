# Abiel Core - Indice de documentacion

**Status:** Architecture hardening active | V1 compatibility preserved | CI architecture checks enabled

## Arquitectura general

| Documento | Contenido |
|-----------|-----------|
| [arquitectura/vision.md](arquitectura/vision.md) | Qué es Abiel Core, tecnologías, principios y capas |
| [arquitectura/modulos.md](arquitectura/modulos.md) | Bounded contexts, módulos implementados y pendientes |
| [arquitectura/estructura.md](arquitectura/estructura.md) | Estructura de carpetas y convenciones de nombres |
| [arquitectura/flujos.md](arquitectura/flujos.md) | Flujo entre módulos y flujo de eventos |
| [arquitectura/desarrollo.md](arquitectura/desarrollo.md) | Reglas de desarrollo, pruebas y escalabilidad |
| [arquitectura/fitness-checks.md](arquitectura/fitness-checks.md) | Reglas y validaciones automáticas de arquitectura |
| [arquitectura/wrappers-legacy-inventory.md](arquitectura/wrappers-legacy-inventory.md) | Inventario actualizado de wrappers legacy |
| [arquitectura/politica-deprecacion-wrappers.md](arquitectura/politica-deprecacion-wrappers.md) | Política de deprecación gradual sin romper V1 |
| [arquitectura/core-boundary-hardening-pr.md](arquitectura/core-boundary-hardening-pr.md) | Informe técnico del PR de hardening |
| [arquitectura/api-transport-adapter-roadmap.md](arquitectura/api-transport-adapter-roadmap.md) | Maduración de API como adaptador de transporte |

## ADRs

| Documento | Contenido |
|-----------|-----------|
| [adr/0001-core-boundary-hardening.md](adr/0001-core-boundary-hardening.md) | Decisión de fronteras, enforcement y compatibilidad |

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
| [modules/empresa/README.md](modules/empresa/README.md) | Activo |
| [modules/usuario/README.md](modules/usuario/README.md) | Activo |
| [modules/human-intervention/README.md](modules/human-intervention/README.md) | Activo |
| [modules/runtime/README.md](modules/runtime/README.md) | Migrado a engines, mantenido por compatibilidad |
| [modules/execution-policy/README.md](modules/execution-policy/README.md) | Migrado a core, mantenido por compatibilidad |
| [modules/buffer/README.md](modules/buffer/README.md) | Migrado a engines, mantenido por compatibilidad |
| [modules/state-machine/README.md](modules/state-machine/README.md) | Migrado a engines, mantenido por compatibilidad |
| [modules/ai/README.md](modules/ai/README.md) | Migrado a engines, mantenido por compatibilidad |
| [modules/whatsapp-sender/README.md](modules/whatsapp-sender/README.md) | Activo |
| [modules/api/README.md](modules/api/README.md) | HTTP principal en infrastructure, wrappers de compatibilidad en modules |
| [modules/dashboard/README.md](modules/dashboard/README.md) | HTTP movido a infrastructure, dominio mantenido |
