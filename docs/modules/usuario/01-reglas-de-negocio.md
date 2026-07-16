Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/01-reglas-de-negocio.md
```

```md id="r8m41"
# Reglas de negocio del módulo Usuario

## 1. Objetivo

Este documento define las reglas de negocio que gobiernan el comportamiento de un Usuario dentro de Abiel Core.

Estas reglas pertenecen al dominio y deben cumplirse independientemente de:

- Base de datos.
- Framework.
- API.
- Interfaz gráfica.
- Sistema de autenticación.


---

# 2. Concepto de Usuario

Un Usuario representa una persona que tiene acceso a una Empresa dentro del sistema SaaS.

Un Usuario siempre debe estar asociado a una Empresa.


Regla principal:

> No existe un Usuario sin Empresa.


Ejemplo válido:

```

Empresa:
Abiel Barber Shop

Usuario:
Juan Pérez

Rol:
ADMIN

```


Ejemplo inválido:

```

Usuario:
Juan Pérez

Empresa:
null

```


---

# 3. Identidad del Usuario

Cada Usuario debe tener una identidad única dentro del sistema.


## Reglas:

- Debe tener un identificador único.
- Debe tener nombre válido.
- Debe tener una empresa asociada.
- Debe tener un rol asignado.
- Debe tener un estado válido.


---

# 4. Nombre del Usuario

El nombre representa la identidad visible del usuario.


Reglas:

- Es obligatorio.
- No puede estar vacío.
- Debe tener una longitud mínima.
- No debe contener únicamente espacios.


Ejemplo válido:

```

Julio Santos

```


Ejemplo inválido:

```

""

```
```

"   "

```


---

# 5. Email del Usuario

El email será utilizado como identificador de contacto.


Reglas:

- Debe tener formato válido.
- Debe ser único dentro de la empresa.
- No puede cambiarse sin una operación explícita.


Ejemplo válido:

```

[julio@empresa.com](mailto:julio@empresa.com)

```


Ejemplo inválido:

```

julio@

```


---

# 6. Relación con Empresa

Cada Usuario pertenece a exactamente una Empresa.


Reglas:

- Un usuario no puede cambiar de empresa directamente.
- El cambio de empresa debe ser una operación administrativa.
- Los datos deben permanecer aislados por tenant.


Ejemplo:

```

Empresa A

Usuario:
Carlos

```


No puede acceder a:

```

Empresa B

Usuario:
Ana

```


---

# 7. Roles del Usuario

Los roles iniciales del sistema son:


## OWNER

Propietario principal de la empresa.


Características:

- Creado junto con la empresa.
- Máximo nivel administrativo.
- No puede ser eliminado si es el único propietario.


---

## ADMIN

Administrador operativo.


Puede:

- Gestionar usuarios.
- Configurar servicios.
- Administrar módulos permitidos.


---

## OPERADOR

Usuario estándar.


Puede:

- Utilizar funcionalidades asignadas.
- No administrar configuración crítica.


---

# 8. Reglas de roles

## Un usuario siempre debe tener un rol.

Estado inválido:

```

Usuario:
Pedro

Rol:
null

```


---

## OWNER

Reglas:

- Una empresa debe tener al menos un OWNER.
- No se elimina el último OWNER.


Ejemplo:

Empresa:

```

Abiel AI

```

Usuarios:

```

Julio OWNER
Ana ADMIN

```

Eliminar Julio:

```

ERROR
No existe otro OWNER

```


---

# 9. Estados del Usuario

El ciclo de vida inicial será:


```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```


---

# 10. Máquina de estados


## PENDIENTE

Usuario creado pero todavía no habilitado.


Permitido:

```

PENDIENTE → ACTIVO

PENDIENTE → CANCELADO

```


No permitido:

```

PENDIENTE → SUSPENDIDO

```


---

## ACTIVO

Usuario operativo.


Permitido:

```

ACTIVO → SUSPENDIDO

ACTIVO → CANCELADO

```


---

## SUSPENDIDO

Usuario temporalmente bloqueado.


Permitido:

```

SUSPENDIDO → ACTIVO

SUSPENDIDO → CANCELADO

```


---

## CANCELADO

Estado final.


Permitido:

```

CANCELADO → CANCELADO

```


No permitido:

```

CANCELADO → ACTIVO

```

---

# 11. Eliminación del usuario

El usuario no será eliminado físicamente.


Se utiliza:

```

Soft Delete

```


Motivo:

- Auditoría.
- Historial.
- Cumplimiento.
- Recuperación.


El estado pasa a:

```

CANCELADO

```


---

# 12. Reglas de seguridad futuras

El módulo Usuario debe estar preparado para:


- autenticación multifactor.
- recuperación de acceso.
- sesiones.
- dispositivos autorizados.


Pero esas funciones pertenecen a módulos futuros.


---

# 13. Eventos de dominio derivados

Cuando ocurren acciones importantes se generan eventos:


```

UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

RolUsuarioCambiado

```


Estos eventos permiten desacoplar:

- auditoría.
- notificaciones.
- seguridad.
- analítica.


---

# 14. Invariantes del dominio


Siempre debe cumplirse:


✅ Usuario tiene Empresa.

✅ Usuario tiene Rol.

✅ Usuario tiene Estado válido.

✅ Email válido.

✅ Estados respetan transiciones permitidas.

✅ Empresas no comparten usuarios.


---

# 15. Estado del documento

Versión:

```

Usuario v0.1

```


Estado:

```

Reglas de negocio definidas

```


Próximo documento:

```

02-arquitectura-interna.md

```
```

Siguiente paso sería definir **la arquitectura interna del módulo Usuario** antes de crear entidades y código.
