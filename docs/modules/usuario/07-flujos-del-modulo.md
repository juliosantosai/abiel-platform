Siguiente documento del módulo **Usuario**:

```text id="u07flu"
docs/modules/usuario/07-flujos-del-modulo.md
```

```md id="f07doc"
# Flujos del módulo Usuario

## 1. Objetivo

Este documento describe los flujos principales del módulo Usuario.

Un flujo representa la interacción completa entre:

- Entrada del sistema.
- Caso de uso.
- Dominio.
- Repositorio.
- Eventos.
- Resultado.


El objetivo es documentar cómo evoluciona un usuario dentro del sistema SaaS multi-tenant.


---

# 2. Flujo: Crear Usuario


## Descripción

Permite crear un nuevo usuario asociado a una empresa.


Estado inicial:

```

PENDIENTE

```


El usuario existe, pero todavía no está habilitado para operar.


---

## Secuencia


```

Cliente

↓

CrearUsuarioUseCase

↓

Validar datos

↓

Crear entidad Usuario

↓

UsuarioRepository.guardar()

↓

Publicar UsuarioCreado

↓

Respuesta

```


---

## Reglas


Antes de crear:


Debe existir:


```

empresaId

```


Debe cumplir:


- Nombre válido.
- Email válido.
- Rol permitido.
- Empresa existente.


---

## Evento generado


```

UsuarioCreado

```


Payload:


```

{
usuarioId,
empresaId,
email,
rol
}

```


---

# 3. Flujo: Activar Usuario


## Descripción

Habilita un usuario pendiente.


Transición:


```

PENDIENTE

```
  ↓
```

ACTIVO

```


---

## Secuencia


```

ActivarUsuarioUseCase

↓

Buscar usuario

↓

usuario.activar()

↓

Actualizar repositorio

↓

Publicar UsuarioActivado

```


---

## Evento


```

UsuarioActivado

```


---

# 4. Flujo: Suspender Usuario


## Descripción


Bloquea temporalmente el acceso.


Ejemplos:


- usuario suspendido por administrador.
- empleado que dejó la empresa temporalmente.
- seguridad.


Transición:


```

ACTIVO

```
↓
```

SUSPENDIDO

```


---

## Secuencia


```

SuspenderUsuarioUseCase

↓

Buscar usuario

↓

usuario.suspender()

↓

Actualizar

↓

UsuarioSuspendido

```


---

# 5. Flujo: Reactivar Usuario


## Descripción


Permite devolver acceso a un usuario suspendido.


Transición:


```

SUSPENDIDO

```
  ↓
```

ACTIVO

```


---

## Reglas


No permitido:


```

CANCELADO

↓

ACTIVO

```


Un usuario cancelado debe permanecer cerrado.


---

# 6. Flujo: Cancelar Usuario


## Descripción


Proceso definitivo de baja.


Ejemplos:


- eliminación de empleado.
- cierre de cuenta.
- baja administrativa.


Transición:


```

ACTIVO

```
   ↓
```

CANCELADO

```


También:


```

SUSPENDIDO

```
   ↓
```

CANCELADO

```


---

## Características


La cancelación es irreversible.


Debe conservar:


- historial.
- auditoría.
- eventos.


---

# 7. Flujo: Cambiar Rol


## Descripción


Permite modificar permisos dentro de una empresa.


Ejemplo:


```

OPERADOR

↓

ADMIN

```


---

## Secuencia


```

ActualizarUsuarioUseCase

↓

usuario.cambiarRol()

↓

Guardar cambios

↓

UsuarioRolActualizado

```


---

## Reglas


Roles permitidos:


```

OWNER
ADMIN
OPERADOR

```


No permitido:


```

rol desconocido

```


---

# 8. Flujo: Cambio de Empresa


## Descripción


Un usuario puede cambiar de empresa solamente mediante un proceso controlado.


No se permite:


```

Usuario

↓

empresaId nuevo

```


directamente.


Debe existir:


- autorización.
- auditoría.
- evento.


---

# 9. Flujo de Login


## Descripción


Proceso de autenticación.


Secuencia:


```

Usuario ingresa email

↓

Buscar usuario

↓

Validar contraseña

↓

Validar estado

↓

Crear sesión/token

```


---

## Validaciones


No puede iniciar sesión si:


```

estado = SUSPENDIDO

```


o


```

estado = CANCELADO

```


---

# 10. Flujo Multi-Tenant


Todo flujo debe validar:


```

empresaId

```


Ejemplo:


Usuario:


```

id: 10

empresaId: 100

```


No puede acceder desde:


```

empresaId: 200

```


---

# 11. Flujo de eventos


Eventos principales:


| Acción | Evento |
|-|-|
| Crear | UsuarioCreado |
| Activar | UsuarioActivado |
| Suspender | UsuarioSuspendido |
| Cancelar | UsuarioCancelado |
| Cambio rol | UsuarioRolActualizado |


---

# 12. Auditoría


Cada acción importante debe registrar:


- usuario que ejecutó acción.
- fecha.
- empresa.
- operación.


Ejemplo:


```

Administrador Julio

suspendió usuario Pedro

Empresa ABC

16/07/2026

```


---

# 13. Estados del Usuario


Estados oficiales:


```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```


---

# 14. Máquina de estados


Permitido:


```

PENDIENTE
|
↓
ACTIVO
|
↓
SUSPENDIDO
|
↓
ACTIVO

```


Cancelación:


```

ACTIVO

↓

CANCELADO

```


o


```

SUSPENDIDO

↓

CANCELADO

```


---

# 15. Estado del documento


Versión:

```

Usuario v0.1

```


Estado:

```

Flujos principales definidos

```


Próximo documento:


```

08-integraciones.md

```
```

Siguiente: **08-integraciones.md** → documentamos cómo Usuario se conecta con Empresa, Auth, WhatsApp, permisos y futuros módulos de Abiel Core.
