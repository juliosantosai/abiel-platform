Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/03-entidades-y-value-objects.md
```

```md
# Entidades y Value Objects del módulo Usuario

## 1. Objetivo

Este documento define las entidades y objetos de valor que forman parte del dominio Usuario.

El objetivo es establecer el modelo de negocio antes de implementar código.

El dominio debe representar correctamente:

- identidad del usuario
- relación con empresa
- roles
- estados
- reglas de validación


---

# 2. Entidad Usuario

Archivo:

```

domain/entities/Usuario.js

```

## Descripción

Usuario representa una persona con acceso dentro de una Empresa (Tenant).

Es una entidad porque:

- tiene identidad propia.
- cambia de estado durante su ciclo de vida.
- mantiene comportamiento.
- conserva historial.


---

# 3. Propiedades de Usuario


## id

Tipo:

```

UUID

```

Descripción:

Identificador único del usuario.


Reglas:

- obligatorio.
- no puede repetirse.
- generado por el sistema.


Ejemplo:

```

550e8400-e29b-41d4-a716-446655440000

```


---

## empresaId

Tipo:

```

UUID

```

Descripción:

Identifica la empresa propietaria del usuario.


Reglas:

- obligatorio.
- no puede ser null.
- determina el tenant.


Ejemplo:

```

empresaId:
abc123

```


Regla fundamental:

Un usuario nunca existe fuera de una empresa.


---

## nombre

Tipo:

```

NombreUsuario

```

Descripción:

Nombre visible del usuario.


Ejemplo:

```

Julio Santos

```


---

## email

Tipo:

```

EmailUsuario

```

Descripción:

Identificador de contacto del usuario.


Ejemplo:

```

[julio@empresa.com](mailto:julio@empresa.com)

```


---

## rol

Tipo:

```

enum

```

Valores iniciales:


```

OWNER

ADMIN

OPERADOR

```


---

## estado

Tipo:

```

enum

```

Valores:


```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```


---

## fechas


```

createdAt

updatedAt

```


Permiten:

- auditoría.
- historial.
- seguimiento.


---

# 4. Comportamientos de Usuario


La entidad no debe ser un objeto de datos.

Debe contener reglas.


Métodos esperados:


## actualizarNombre()


Permite modificar:

```

nombre

```


Valida:

- nombre válido.
- longitud mínima.


---

## cambiarEmail()


Permite actualizar:

```

email

```


Valida:

- formato correcto.
- normalización.


---

## activar()


Cambio permitido:


```

PENDIENTE

↓

ACTIVO

```


También:


```

SUSPENDIDO

↓

ACTIVO

```


No permitido:


```

CANCELADO

↓

ACTIVO

```


---

## suspender()


Cambio permitido:


```

ACTIVO

↓

SUSPENDIDO

```


No permitido:


```

PENDIENTE

↓

SUSPENDIDO

```


---

## desactivar()


Cierra el acceso del usuario.


Permitido:


```

ACTIVO

↓

CANCELADO

```


```

SUSPENDIDO

↓

CANCELADO

```


---

## cambiarRol()


Permite cambiar:


```

OPERADOR

↓

ADMIN

```


o:


```

ADMIN

↓

OPERADOR

```


Reglas especiales:

- No eliminar último OWNER.
- Roles deben existir.


---

# 5. Value Object NombreUsuario


Archivo:

```

domain/valueObjects/NombreUsuario.js

```


## Responsabilidad

Representar un nombre válido.


No permite:

```

null

undefined

""

"   "

```


---

## Reglas


Mínimo:

```

2 caracteres

```


Ejemplos:


Válido:

```

Ana

```


Inválido:

```

A

```


---

# 6. Value Object EmailUsuario


Archivo:

```

domain/valueObjects/EmailUsuario.js

```


## Responsabilidad

Representar un email válido.


Ejemplo:


```

[usuario@empresa.com](mailto:usuario@empresa.com)

```


---

## Reglas


Debe:

- existir.
- tener formato correcto.
- almacenarse normalizado.


Ejemplo:


Entrada:

```

[JULIO@EMPRESA.COM](mailto:JULIO@EMPRESA.COM)

```


Resultado:


```

[julio@empresa.com](mailto:julio@empresa.com)

```


---

# 7. Roles del usuario


## OWNER


Descripción:

Propietario principal.


Reglas:

- Tiene máximo nivel.
- Una empresa debe tener al menos uno.


Ejemplo:

```

Abiel AI

Julio
OWNER

```


---

## ADMIN


Descripción:

Administrador operativo.


Puede administrar recursos asignados.


---

## OPERADOR


Descripción:

Usuario estándar.


Tiene acceso limitado.


---

# 8. Estados del usuario


## PENDIENTE


Usuario creado pero no habilitado.


Ejemplo:

Invitación enviada.


---

## ACTIVO


Usuario operativo.


Puede:

- ingresar.
- usar módulos permitidos.


---

## SUSPENDIDO


Usuario bloqueado temporalmente.


Motivos:

- seguridad.
- administración.
- incumplimiento.


---

## CANCELADO


Estado final.


Representa:

- baja.
- eliminación lógica.


---

# 9. Invariantes del dominio


Siempre debe cumplirse:


## Identidad

```

Usuario.id != null

```


## Empresa

```

Usuario.empresaId != null

```


## Rol

```

Usuario.rol válido

```


## Estado

```

Usuario.estado válido

```


## Email

```

Email válido

```


## Tenant

```

Usuario pertenece a una sola Empresa

```


---

# 10. Eventos generados por la entidad


Acciones importantes generan eventos:


```

UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

RolUsuarioCambiado

```


Estos eventos serán utilizados por:

- Auditoría.
- Seguridad.
- Notificaciones.
- Analítica.


---

# 11. Diseño preparado para evolución


La entidad Usuario debe permitir futuras extensiones:


Posibles campos futuros:


```

avatar

telefono

idioma

zonaHoraria

ultimoAcceso

preferencias

```


Sin romper el dominio actual.


---

# 12. Estado del documento


Versión:

```

Usuario v0.1

```


Estado:

```

Modelo de dominio definido

```


Próximo documento:

```

04-casos-de-uso.md

```
```

Siguiente: **04-casos-de-uso.md** donde definimos cada operación de aplicación antes de escribir los Use Cases.
