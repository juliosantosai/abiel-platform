Siguiente documento del módulo **Usuario**:

```text id="usr10err"
docs/modules/usuario/10-manejo-de-errores.md
```

```md id="err10usr"
# Manejo de errores del módulo Usuario

## 1. Objetivo

Este documento define cómo el módulo Usuario maneja errores dentro de la arquitectura DDD / Hexagonal de Abiel Core.

El objetivo es evitar errores genéricos y permitir que cada capa pueda reaccionar correctamente según el tipo de fallo.


---

# 2. Principio general

Los errores se dividen según la responsabilidad de cada capa:


```

Domain

↓

Application

↓

Infrastructure

```


Cada capa tiene errores diferentes.


---

# 3. Errores compartidos

Ubicación:


```

src/shared/errors

```


Errores utilizados:


```

DomainError

ValidationError

NotFoundError

```


---

# 4. ValidationError


## Responsabilidad

Representa datos inválidos antes de crear o modificar un usuario.


Pertenece principalmente a:


```

Domain

```


---

## Ejemplos


Nombre vacío:


```

ValidationError

campo: nombre
razón: required

```


Email incorrecto:


```

ValidationError

campo: email
razón: invalid

```


Rol inexistente:


```

ValidationError

campo: rol
razón: invalid

```


---

# 5. DomainError


## Responsabilidad

Representa una regla de negocio violada.


Ejemplos:


Intentar activar usuario cancelado:


```

CANCELADO

↓

ACTIVO

```


Resultado:


```

DomainError

```


---

Intentar suspender usuario pendiente:


```

PENDIENTE

↓

SUSPENDIDO

```


Resultado:


```

DomainError

```


---

# 6. NotFoundError


## Responsabilidad

Representa una entidad que no existe.


Se utiliza principalmente en Application.


Ejemplo:


Caso de uso:


```

ActivarUsuarioUseCase

```


Busca:


```

usuarioId = 100

```


Repositorio devuelve:


```

null

```


Resultado:


```

NotFoundError

Usuario no encontrado

```


---

# 7. Responsabilidad por capa


## Domain


Puede lanzar:


```

ValidationError

DomainError

```


Ejemplo:


```

usuario.cambiarRol()

↓

rol inválido

↓

ValidationError

```


---

## Application


Puede lanzar:


```

NotFoundError

```


Ejemplo:


```

buscar usuario

↓

null

↓

NotFoundError

```


---

## Infrastructure


No debe lanzar:


```

DomainError

```


Debe manejar:


- errores de conexión.
- errores Prisma.
- errores de base de datos.


Ejemplo:


```

DatabaseConnectionError

```


---

# 8. Flujo de error


Ejemplo:


Activar usuario inexistente:


```

Request

↓

ActivarUsuarioUseCase

↓

UsuarioRepository.buscarPorId()

↓

null

↓

NotFoundError

↓

Respuesta del sistema

````


---

# 9. Reglas de implementación


## Regla 1

No usar:


```js
throw new Error()
````

Para reglas de negocio.

Incorrecto:

```js
throw new Error(
 "Usuario inválido"
)
```

Correcto:

```js
throw new ValidationError(
 "email inválido"
)
```

---

# Regla 2

Los errores deben conservar contexto.

Ejemplo:

Malo:

```
Usuario inválido
```

Bueno:

```
{
 campo:"email",
 motivo:"formato incorrecto"
}
```

---

# Regla 3

El dominio no conoce HTTP.

Incorrecto:

```
throw 404
```

Correcto:

```
throw NotFoundError
```

---

# 10. Errores por operación

| Operación                        | Error esperado       |
| -------------------------------- | -------------------- |
| Crear usuario con email inválido | ValidationError      |
| Crear usuario con rol incorrecto | ValidationError      |
| Buscar usuario inexistente       | NotFoundError        |
| Activar usuario cancelado        | DomainError          |
| Suspender usuario pendiente      | DomainError          |
| Cambiar rol inválido             | ValidationError      |
| Error de base de datos           | Infrastructure Error |

---

# 11. Integración con API

La capa superior puede transformar:

```
ValidationError

↓

HTTP 400
```

```
NotFoundError

↓

HTTP 404
```

```
DomainError

↓

HTTP 422
```

El dominio nunca conoce estos códigos.

---

# 12. Auditoría de errores

Los errores importantes deben registrar:

```
usuarioEjecutor

empresaId

acción

fecha

motivo
```

Ejemplo:

```
Admin suspendió usuario

Empresa ABC

Motivo:
incumplimiento
```

---

# 13. Pruebas esperadas

Debe existir:

```
Usuario.errors.test.js
```

Validando:

* ValidationError.
* DomainError.
* NotFoundError.
* mensajes.
* contexto.

---

# 14. Estado del documento

Versión:

```
Usuario v0.1
```

Estado:

```
Sistema de errores definido
```

---

# Próximo documento

```
11-reglas-de-estado.md
```

```

Siguiente: **11-reglas-de-estado.md** → definimos la máquina de estados oficial de Usuario (PENDIENTE, ACTIVO, SUSPENDIDO, CANCELADO), igual que hicimos con Empresa.
```
