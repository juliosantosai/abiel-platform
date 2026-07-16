# Shared — Events

## DomainEvent

Clase base para todos los eventos de dominio del sistema.

```js
class UsuarioCreado extends DomainEvent {
    static eventName = "UsuarioCreado";

    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}
```

Propiedades automáticas al construir: `id` (UUID), `name` (desde `eventName` estático), `occurredAt` (Date)

---

## EventBus

Bus de eventos en memoria. Soporta múltiples handlers por evento.

### API

```js
bus.subscribe(eventName, handler)   // registrar handler
bus.unsubscribe(eventName, handler) // eliminar handler
await bus.publish(event)            // disparar handlers (async)
bus.clear()                         // eliminar todos los handlers
```

### Uso

```js
const globalBus = require("./EventBus");           // singleton global
const { EventBus } = require("./EventBus");        // clase para inyección
```

El singleton global se usa en producción. Para tests, crear instancias independientes con `new EventBus()`.

---

## EventPublisher

Publica eventos en un EventBus. Registra cada publicación en el Logger.

```js
const { EventPublisher } = require("./EventPublisher");
const { EventBus } = require("./EventBus");

const bus = new EventBus();
const publisher = new EventPublisher({ bus });

await publisher.publish(new UsuarioCreado({ ... }));
```

Si se instancia sin `bus`, usa el singleton global.

El singleton global `require("./EventPublisher")` está disponible para compatibilidad con módulos que no necesitan inyección.

---

## EventSubscriber

Wrapper de conveniencia sobre EventBus. Mantenido por compatibilidad.

Para nuevos módulos usar EventBus directamente.

```js
const globalBus = require("./EventBus");
globalBus.subscribe("UsuarioCreado", handler);
```

---

## Patrón de uso en use cases

Los use cases reciben `eventPublisher` como dependencia inyectada. En producción se pasa el singleton global; en tests se pasa un mock o una instancia con bus aislado.

```js
class CrearUsuarioUseCase {
    constructor({ repository, eventPublisher }) { ... }
}
```
