# Flujos del sistema

## Flujo de una solicitud

```
Cliente
  ↓
interfaces/        (HTTP / webhook / consumer)
  ↓
application/       (use case: valida, orquesta)
  ↓
domain/            (entidad: aplica reglas de negocio)
  ↓
infrastructure/    (repositorio: persiste)
  ↓
EventPublisher     (publica evento de dominio)
  ↓
EventBus           (distribuye a suscriptores)
  ↓
Otros módulos      (reaccionan de forma independiente)
```

## Flujo Core Runtime V1

```
Event
  ↓
RuntimeEngine
  ↓
ExecutionContext
  ↓
PermissionChecker + ExecutionPolicy
  ↓
Execution Pipeline (v1: direct/planned/workflow)
  ↓
Capability
  ↓
ResultEvent
```

Notas:

- `RuntimeEngine` construye un `ExecutionContext` inmutable por ejecución.
- `ExecutionLifecycle` controla transiciones de estado hasta terminal.
- `EventDispatcher` publica `ExecutionStarted` y `ResultEvent`.
- `RetryPolicy`, `TimeoutPolicy` y `ErrorClassifier` se aplican dentro del runtime.

## Gobernanza de flujos

Los flujos documentados deben respetar reglas de dependencia entre capas y se validan automaticamente con:

- `npm run arch:check`
- `npm run arch:check:strict`

## Flujo de eventos de dominio

Un evento de dominio representa algo que **ocurrió**, no una orden.

```js
// Correcto — hecho ocurrido
class UsuarioActivado extends DomainEvent { }

// Incorrecto — orden
class ActivarUsuario { }
```

### Ciclo de vida de un evento

1. El use case ejecuta la operación en el dominio.
2. La entidad muta su estado.
3. El repositorio persiste.
4. El use case publica el evento con `eventPublisher.publish(event)`.
5. `EventBus` ejecuta todos los handlers suscritos a ese nombre de evento.

### Inyección en use cases

```js
class CrearUsuarioUseCase {
    constructor({ usuarioRepository, eventPublisher }) { ... }
}
```

En producción se pasa el singleton global `require("./EventPublisher")`.
En tests se pasa un mock o una instancia con `new EventPublisher({ bus: new EventBus() })`.

## Comunicación entre módulos

| Tipo | Cuándo usar | Ejemplo |
|------|-------------|---------|
| Síncrona (use case público) | Cuando se necesita respuesta inmediata | Conversation Control necesita saber si la empresa existe |
| Asíncrona (evento) | Cuando solo se informa que algo ocurrió | EmpresaCreada → otros módulos reaccionan |

**Regla:** ningún módulo importa entidades internas de otro módulo.

## Flujo de tenant isolation

```
Request llega con tenantContext (empresaId del operador)
  ↓
Use case busca el recurso por id
  ↓
TenantGuard.ensureTenantMatches(recurso, tenantContext)
  ↓
Si empresaId del recurso ≠ tenantContext → TenantError (operación abortada)
Si coincide → continúa
```
