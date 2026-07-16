Siguiente documento del módulo **Usuario**:

```text id="u05ev1"
docs/modules/usuario/05-eventos-de-dominio.md
```

```md id="e7d92"
# Eventos de dominio del módulo Usuario

## 1. Objetivo

Este documento define los eventos de dominio generados por el módulo Usuario.

Los eventos representan hechos que ya ocurrieron dentro del negocio.

Un evento:

- no ejecuta acciones.
- no contiene lógica de negocio.
- no conoce infraestructura.
- permite comunicación entre módulos.


Ejemplo:

Correcto:

```

UsuarioCreado

```

Significa:

"Un usuario fue creado dentro del sistema."


Incorrecto:

```

CrearUsuario

```

Eso representa una orden o comando.


---

# 2. Arquitectura de eventos

Los eventos siguen el modelo:


```

Usuario

|
|
↓

Dominio genera evento

|
|
↓

EventPublisher

|
|
↓

EventBus

|
|
+------------+
|            |
↓            ↓

Auditoría    Notificaciones

```


---

# 3. Clase base de eventos

Los eventos del módulo utilizan:


```

DomainEvent

```

Ubicación:

```

src/shared/events/DomainEvent.js

```


Responsabilidad:

Proporcionar estructura común:


```

name

data

occurredAt

```


---

# 4. UsuarioCreado


Archivo:


```

domain/events/UsuarioCreado.js

```


## Descripción

Se genera cuando un usuario es creado correctamente.


---

## Cuándo ocurre


Después de:


```

CrearUsuarioUseCase

↓

Repositorio.guardar()

↓

UsuarioCreado

````


---

## Datos del evento


```json
{
  "usuarioId": "uuid",
  "empresaId": "uuid",
  "rol": "OWNER"
}
````

---

## Consumidores posibles

### Auditoría

Registrar:

"Usuario creado"

### Notificaciones

Enviar:

"Tu cuenta fue creada"

### Seguridad

Crear registros iniciales.

---

# 5. UsuarioActualizado

Archivo:

```
UsuarioActualizado.js
```

## Descripción

Representa cambios realizados sobre un usuario.

---

## Cuándo ocurre

Después de:

```
ActualizarUsuarioUseCase
```

---

## Datos

```json
{
 "usuarioId": "uuid",
 "camposModificados": [
    "nombre",
    "email"
 ]
}
```

---

# 6. UsuarioActivado

Archivo:

```
UsuarioActivado.js
```

## Descripción

Indica que un usuario comenzó a estar operativo.

---

## Transiciones

```
PENDIENTE

↓

ACTIVO
```

o:

```
SUSPENDIDO

↓

ACTIVO
```

---

## Datos

```json
{
 "usuarioId": "uuid",
 "estadoAnterior": "PENDIENTE",
 "nuevoEstado": "ACTIVO"
}
```

---

# 7. UsuarioSuspendido

Archivo:

```
UsuarioSuspendido.js
```

## Descripción

Indica que un usuario fue bloqueado temporalmente.

---

## Transición

```
ACTIVO

↓

SUSPENDIDO
```

---

## Datos

```json
{
 "usuarioId": "uuid",
 "motivo": "administrativo"
}
```

---

# 8. UsuarioCancelado

Archivo:

```
UsuarioCancelado.js
```

## Descripción

Indica que el acceso del usuario fue cerrado definitivamente.

---

## Transiciones

```
ACTIVO

↓

CANCELADO
```

o:

```
SUSPENDIDO

↓

CANCELADO
```

---

## Datos

```json
{
 "usuarioId": "uuid",
 "empresaId": "uuid"
}
```

---

# 9. RolUsuarioCambiado

Archivo:

```
RolUsuarioCambiado.js
```

## Descripción

Representa un cambio de permisos administrativos.

---

## Ejemplo

Antes:

```
OPERADOR
```

Después:

```
ADMIN
```

---

## Datos

```json
{
 "usuarioId": "uuid",
 "rolAnterior": "OPERADOR",
 "nuevoRol": "ADMIN"
}
```

---

# 10. Reglas de eventos

## Regla 1

Los eventos ocurren después de persistir.

Correcto:

```
Cambiar entidad

↓

Guardar

↓

Publicar evento
```

Incorrecto:

```
Publicar evento

↓

Guardar
```

---

## Regla 2

Los eventos son inmutables.

Un evento creado no cambia.

---

## Regla 3

Los eventos no contienen entidades completas.

Incorrecto:

```json
{
 "usuario": {
    objeto completo
 }
}
```

Correcto:

```json
{
 "usuarioId": "uuid"
}
```

---

# 11. Versionado futuro

Los eventos pueden evolucionar.

Ejemplo:

Versión inicial:

```
UsuarioCreado.v1
```

Futuro:

```
UsuarioCreado.v2
```

Manteniendo compatibilidad.

---

# 12. Integraciones futuras

Los eventos permitirán:

## Auditoría

```
UsuarioCreado

UsuarioSuspendido
```

---

## Seguridad

```
UsuarioActivado
```

---

## Notificaciones

```
UsuarioCreado
```

---

## Analítica

```
RolUsuarioCambiado
```

---

# 13. Pruebas esperadas

Cada evento debe validar:

## Nombre correcto

Ejemplo:

```
UsuarioCreado.name

=

"UsuarioCreado"
```

---

## Payload correcto

Debe contener:

* identificadores.
* datos mínimos.
* sin información sensible.

---

## Fecha de creación

Todo evento debe tener:

```
occurredAt
```

---

# 14. Estado del documento

Versión:

```
Usuario v0.1
```

Estado:

```
Eventos de dominio definidos
```

Próximo documento:

```
06-repositorios.md
```

```

Siguiente documento: **06-repositorios.md**, donde definimos el contrato `UsuarioRepository`, Prisma y Fake Repository antes de implementar infraestructura.
```
