# Vision y arquitectura

## Que es Abiel Core

Abiel Core es un framework backend event-driven y multi-tenant para orquestar conversaciones inteligentes con controles de ejecucion, politicas y extensibilidad.

No se orienta a una unica aplicacion final; se orienta a evolucion sostenible de 10+ anos.

## Estilo arquitectonico

Monolito modular con fronteras explicitas y gobernanza automatizada.

## Capas del framework

```
src/core            kernel reusable (events, policy, capability, security)
src/engines         motores de orquestacion (runtime, conversation, ai)
src/modules         bounded contexts de negocio
src/plugins         contratos/extensiones (reservado, crecimiento futuro)
src/infrastructure  http, wiring, adapters de borde
src/shared          utilidades y compatibilidad transicional
```

## Principios

- DDD y lenguaje ubicuo por contexto.
- Clean Architecture y dependencias hacia adentro.
- Event-driven para desacoplamiento entre contextos.
- Compatibility-first para rutas V1 durante migracion.
- Governance-first con architecture fitness checks en CI.

## Guardrails activos

- reglas de dependencias por capa en `tools/architecture/layer-rules.json`
- verificaciones automaticas en `tools/architecture/check-architecture.js`
- control estricto en CI mediante `.github/workflows/architecture-fitness.yml`
- inventario y politica de wrappers legacy en `docs/arquitectura/`

## Tenant isolation

Todo recurso de negocio pertenece a un tenant. Se mantiene validacion transversal por guardas de tenancy y contratos de dominio.
