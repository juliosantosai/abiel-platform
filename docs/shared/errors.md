# Shared — Errors

## DomainError

Error base para violaciones de reglas de negocio en el dominio.

```js
throw new DomainError("Solo un usuario activo puede ser suspendido.");
```

Propiedades: `name = "DomainError"`, `message`

## ValidationError

Error para datos de entrada inválidos. Incluye un mapa de campos afectados.

```js
throw new ValidationError("El email no es válido.", { email: "invalid" });
```

Propiedades: `name = "ValidationError"`, `message`, `fields`

## NotFoundError

Error para recursos no encontrados en repositorios.

```js
throw new NotFoundError("Usuario", id);
// → "Usuario no encontrado"
```

Propiedades: `name = "NotFoundError"`, `message`, `resource`, `id`

## Jerarquía

Todos extienden `Error` directamente. No hay herencia entre ellos.
