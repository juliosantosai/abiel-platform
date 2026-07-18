# Public API Map

## Objetivo

Definir la superficie pública real de Abiel Core para que el producto pueda ser consumido sin depender de la estructura interna de engines, modules o infraestructura.

## API pública propuesta

```text
AbielCore
├── Agent
├── Runtime
├── Capability
├── Memory
├── Tenant
└── Events
```

## Componentes públicos

### Core

- Ubicación: src/core
- Responsabilidad: definir contratos, políticas de ejecución y modelos centrales de dominio.
- Dependencias: shared, contracts, security, capability, execution-policy.
- Consumidor: runtime, engines, infraestructura.
- Estabilidad: alta.

### Runtime

- Ubicación: src/engines/agent-runtime
- Responsabilidad: ejecutar capacidades, manejar contexto, ciclos de vida y eventos.
- Dependencias: core contracts, execution-policy, event bus.
- Consumidor: entrypoints de aplicación y tests de integración.
- Estabilidad: alta.

### Agent

- Ubicación: src/engines/ai-engine y src/engines/conversation-engine
- Responsabilidad: encapsular lógica de agentes, IA y flujos conversacionales.
- Dependencias: runtime, events, capability.
- Consumidor: aplicación y runtime.
- Estabilidad: media.

### Capability

- Ubicación: src/core/capability
- Responsabilidad: registrar y ejecutar capacidades con validación de permisos y errores.
- Dependencias: execution-policy, contracts.
- Consumidor: runtime y agentes.
- Estabilidad: alta.

### Tenant

- Ubicación: src/core/security y src/shared/tenant
- Responsabilidad: proveer contexto de tenant, validación y aislamiento.
- Dependencias: shared errors, runtime context.
- Consumidor: runtime, eventos, infraestructura.
- Estabilidad: alta.

### Events

- Ubicación: src/core/kernel/events y src/shared/events
- Responsabilidad: publicar y consumir eventos de dominio y runtime.
- Dependencias: shared errors, contracts.
- Consumidor: runtime, agents, infrastructure.
- Estabilidad: alta.

### Memory

- Ubicación: contratos en src/core/contracts y repositorios de infraestructura.
- Responsabilidad: almacenar y recuperar contexto de ejecución y memoria de agentes.
- Dependencias: contracts, runtime.
- Consumidor: runtime, engines.
- Estabilidad: media.

## Componentes internos

Estos deben permanecer internos mientras no se redefina su uso público:

- infraestructura persistencia
- adaptadores HTTP
- módulos de modules/ legacy
- repositorios fake
- workers específicos de engine

## Reglas de diseño para la API pública

1. No exponer internals de engines directamente.
2. No depender de modules legacy.
3. Mantener los contratos bajo src/core.
4. Preferir composiciones simples sobre detalles de implementación.

## Conclusión

La superficie pública real del sistema ya está formada principalmente por:

- Core contracts
- Runtime
- Capability
- Tenant
- Events
- y los contratos de ejecución y memoria

La siguiente fase debe consolidar estos bloques en una sola entrada pública.
