Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/19-eventos-de-dominio.md
```

```md
# Eventos de Dominio del módulo Usuario

## 1. Objetivo

Este documento define los eventos de dominio generados por el módulo Usuario.

Los eventos representan hechos que ya ocurrieron dentro del sistema.

Ejemplo:

Correcto:

```

UsuarioCreado

```

Significa:

"Un usuario fue creado correctamente".

Incorrecto:

```

CrearUsuario

```

Eso representa una orden, no un evento.

---

# 2. Principios

Los eventos de dominio deben:

✅ Ser inmutables.

✅ Contener información relevante del hecho ocurrido.

✅ No depender de infraestructura.

✅ Poder ser consumidos por otros módulos.

✅ Tener fecha de creación del evento.

---

# 3. Clase base

Ubicación:

```

src/shared/events/DomainEvent.js

```

Todos los eventos deben extender:

```

DomainEvent

```

Estructura:

```

{
name,

data,

occurredAt
}

```

---

# 4. UsuarioCreado


Archivo:

```

domain/events/UsuarioCreado.js

```


## Descripción

Se genera cuando un usuario es creado correctamente.


Momento:

```

CrearUsuarioUseCase

```


Payload:

```

{
usuarioId,

empresaId,

nombre,

email,

rol
}

```


Consumidores posibles:

- Auth.
- Notificaciones.
- Auditoría.
- Analytics.

---

# 5. UsuarioActualizado


Archivo:

```

domain/events/UsuarioActualizado.js

```


## Descripción

Se genera cuando cambia información del usuario.


Payload:

```

{
usuarioId,

cambios
}

```


Ejemplo:

```

{
nombre:
{
anterior:"Juan",
nuevo:"Juan Santos"
}
}

```


Consumidores:

- Auditoría.
- Historial.
- Sincronización.

---

# 6. UsuarioActivado


Archivo:

```

domain/events/UsuarioActivado.js

```


## Descripción

Indica que un usuario puede volver a operar.


Payload:

```

{
usuarioId,

empresaId
}

```


Consumidores:

- Sistema de permisos.
- Notificaciones.
- Seguridad.

---

# 7. UsuarioSuspendido


Archivo:

```

domain/events/UsuarioSuspendido.js

```


## Descripción

Representa el bloqueo temporal de un usuario.


Payload:

```

{
usuarioId,

empresaId,

motivo?
}

```


Consumidores:

- Control de acceso.
- Auditoría.
- Alertas.

---

# 8. UsuarioCancelado


Archivo:

```

domain/events/UsuarioCancelado.js

```


## Descripción

Usuario dado de baja lógica.


Payload:

```

{
usuarioId,

empresaId
}

```


Regla:

Este evento es irreversible.


Consumidores:

- Limpieza de permisos.
- Auditoría.
- Facturación.

---

# 9. UsuarioRolActualizado


Archivo:

```

domain/events/UsuarioRolActualizado.js

```


## Descripción

Cambio de permisos del usuario.


Payload:

```

{
usuarioId,

rolAnterior,

nuevoRol
}

```


Ejemplo:

```

OPERADOR

↓

ADMIN

```


Consumidores:

- Sistema de autorización.
- Seguridad.
- Logs.

---

# 10. Flujo de eventos


Ejemplo:

Crear usuario:


```

Cliente

↓

CrearUsuarioUseCase

↓

Usuario

↓

Repositorio

↓

UsuarioCreado

↓

EventPublisher

↓

Suscriptores

```


---

# 11. Suscriptores futuros


Los eventos pueden activar:


## Módulo Auth

Ejemplo:

```

UsuarioCreado

↓

Crear credenciales

```


---

## Módulo Notificaciones

Ejemplo:

```

UsuarioActivado

↓

Enviar bienvenida

```


---

## Módulo Auditoría

Ejemplo:

```

UsuarioRolActualizado

↓

Registrar cambio

```


---

# 12. Reglas de diseño


Los eventos NO deben:

❌ Actualizar base de datos directamente.

❌ Enviar mensajes directamente.

❌ Conocer APIs externas.

❌ Tener lógica de negocio.


Responsabilidad:

Solo informar que algo ocurrió.

---

# 13. Contrato esperado


Todo evento debe tener:


```

eventName

data

occurredAt

```


Ejemplo:


```

UsuarioCreado

{
usuarioId,
empresaId,
email
}

2026-07-16T00:00:00

```


---

# 14. Relación con Empresa


Usuario pertenece a Empresa:


```

EmpresaCreada

↓

UsuarioCreado

↓

Permisos

↓

Conversaciones IA

```


El evento permite desacoplar módulos.


---

# 15. Estado del documento


Versión:

```

Usuario v0.1

```


Estado:

```

Eventos de dominio definidos

```
```

Siguiente documento:

**20-repositorios.md** → definiremos contratos, PrismaRepository y FakeRepository del módulo Usuario antes de que Copilot implemente código.
