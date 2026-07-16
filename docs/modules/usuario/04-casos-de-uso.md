Siguiente documento del módulo **Usuario**:

```text id="u4c91"
docs/modules/usuario/04-casos-de-uso.md
```

```md id="w7q82"
# Casos de uso del módulo Usuario

## 1. Objetivo

Este documento define las operaciones principales que puede realizar el sistema sobre un Usuario.

Los casos de uso representan acciones del negocio.

No contienen:

- reglas profundas del dominio.
- acceso directo a base de datos.
- lógica de infraestructura.


Su responsabilidad es coordinar:

```

Entrada

↓

Caso de uso

↓

Entidad Usuario

↓

Repositorio

↓

Evento de dominio

```

---

# 2. Principios

Los casos de uso deben:

- recibir dependencias por inyección.
- utilizar repositorios por contrato.
- delegar reglas a la entidad.
- publicar eventos cuando corresponda.
- mantener bajo acoplamiento.


---

# 3. Crear Usuario

Archivo:

```

CrearUsuarioUseCase.js

```

## Objetivo

Crear un nuevo usuario dentro de una empresa.


---

## Entrada


Datos requeridos:

```

empresaId

nombre

email

rol

```


---

## Flujo


```

1. Recibir datos

2. Validar empresa existente

3. Crear entidad Usuario

4. Guardar mediante repositorio

5. Publicar UsuarioCreado

6. Retornar usuario

```


---

## Reglas aplicadas

- Usuario debe tener empresa.
- Email válido.
- Nombre válido.
- Rol permitido.


---

## Evento generado


```

UsuarioCreado

```


Payload esperado:


```

{
usuarioId,
empresaId,
rol
}

```


---

# 4. Actualizar Usuario

Archivo:

```

ActualizarUsuarioUseCase.js

```


## Objetivo

Actualizar información del usuario.


Campos permitidos:

```

nombre

email

```


---

## Flujo


```

1. Buscar usuario

2. Verificar existencia

3. Actualizar entidad

4. Guardar cambios

5. Publicar evento

6. Retornar usuario

```


---

## Errores posibles


Usuario inexistente:


```

NotFoundError

```


Datos inválidos:


```

ValidationError

```


---

## Evento generado


```

UsuarioActualizado

```


---

# 5. Activar Usuario

Archivo:

```

ActivarUsuarioUseCase.js

```


## Objetivo

Permitir acceso al usuario.


---

## Flujo


```

1. Buscar usuario

2. Ejecutar usuario.activar()

3. Guardar cambios

4. Publicar evento

```


---

## Transiciones permitidas


```

PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO

```


---

## Evento


```

UsuarioActivado

```


---

# 6. Suspender Usuario

Archivo:

```

SuspenderUsuarioUseCase.js

```


## Objetivo

Bloquear temporalmente el acceso.


---

## Flujo


```

1. Buscar usuario

2. Ejecutar usuario.suspender()

3. Guardar

4. Publicar evento

```


---

## Transición permitida


```

ACTIVO → SUSPENDIDO

```


---

## Evento


```

UsuarioSuspendido

```


---

# 7. Cancelar Usuario

Archivo:

```

CancelarUsuarioUseCase.js

```


## Objetivo

Cerrar definitivamente el acceso.


---

## Flujo


```

1. Buscar usuario

2. Ejecutar usuario.desactivar()

3. Guardar

4. Publicar evento

```


---

## Transiciones


Permitidas:


```

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO

```


---

## Evento


```

UsuarioCancelado

```


---

# 8. Cambiar Rol Usuario

Archivo:

```

CambiarRolUsuarioUseCase.js

```


## Objetivo

Modificar el rol asignado.


Ejemplo:


```

OPERADOR

↓

ADMIN

```


---

## Flujo


```

1. Buscar usuario

2. Validar nuevo rol

3. Ejecutar cambioRol()

4. Guardar

5. Publicar evento

```


---

## Reglas especiales


No permitido:


Eliminar último OWNER.


Ejemplo:


Empresa:


```

Julio OWNER

Ana ADMIN

```


Cambiar Julio:


```

OWNER → OPERADOR

```


Resultado:


```

Error de dominio

```


---

# 9. Buscar Usuario

Archivo futuro:

```

BuscarUsuarioUseCase.js

```


## Objetivo


Obtener información de un usuario.


Filtros posibles:


```

usuarioId

empresaId

email

```


---

# 10. Listar Usuarios

Archivo futuro:

```

ListarUsuariosUseCase.js

```


## Objetivo


Obtener usuarios pertenecientes a una empresa.


Regla:


Siempre requiere:


```

empresaId

```


Nunca:


```

listar todos los usuarios globalmente

```


---

# 11. Errores esperados


El módulo utiliza errores compartidos:


## ValidationError


Cuando:

- nombre inválido.
- email inválido.
- rol incorrecto.


---

## NotFoundError


Cuando:

- usuario no existe.
- empresa no existe.


---

## DomainError


Cuando:

- transición de estado inválida.
- regla de negocio violada.


---

# 12. Eventos publicados


Resumen:


| Acción | Evento |
|---|---|
| Crear | UsuarioCreado |
| Actualizar | UsuarioActualizado |
| Activar | UsuarioActivado |
| Suspender | UsuarioSuspendido |
| Cancelar | UsuarioCancelado |
| Cambiar rol | RolUsuarioCambiado |


---

# 13. Pruebas esperadas


Cada caso de uso debe tener:


## Caso exitoso

Ejemplo:

```

Usuario creado correctamente

```


## Caso inválido

Ejemplo:

```

Email incorrecto

```


## Caso inexistente

Ejemplo:

```

Usuario no encontrado

```


## Evento generado

Ejemplo:

```

UsuarioCreado publicado

```


---

# 14. Estado del documento


Versión:

```

Usuario v0.1

```


Estado:

```

Casos de uso definidos

```


Próximo documento:

```

05-eventos-de-dominio.md

```
```

Siguiente documento: **05-eventos-de-dominio.md**, donde definimos los eventos reales del módulo Usuario igual que hicimos con Empresa.
