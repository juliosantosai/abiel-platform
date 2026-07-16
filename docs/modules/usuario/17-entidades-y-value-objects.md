Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/17-entidades-y-value-objects.md
```

```md id="u17entidades"
# Entidades y Value Objects del módulo Usuario

## 1. Objetivo

Este documento define las entidades y objetos de valor que forman parte del dominio Usuario en Abiel Core.

El objetivo es establecer:

- Responsabilidades.
- Atributos.
- Reglas de validación.
- Comportamientos permitidos.
- Límites del dominio.

---

# 2. Entidad principal

## Usuario

Ubicación:

```

domain/entities/Usuario.js

```

La entidad Usuario representa una identidad perteneciente a una Empresa dentro del sistema SaaS.

Un Usuario:

- Tiene una identidad propia.
- Pertenece a un tenant.
- Posee un rol.
- Tiene un ciclo de vida.
- Protege reglas de negocio.

---

# 3. Modelo de Usuario


```

Usuario
{

id

empresaId

nombre

email

rol

estado

createdAt

updatedAt

}

```

---

# 4. Atributos de Usuario


## id

Tipo:

```

UUID

```

Responsabilidad:

Identificar únicamente al usuario.

Reglas:

- Obligatorio.
- Inmutable.
- No puede repetirse.

Error:

```

ValidationError

```

---

# 5. empresaId

Tipo:

```

UUID

```

Responsabilidad:

Indicar a qué empresa pertenece el usuario.

Regla crítica:

Todo usuario debe tener empresa.


Correcto:

```

Empresa A

├── Usuario 1
├── Usuario 2

```

Incorrecto:

```

Usuario sin empresa

```

Error:

```

ValidationError

```

---

# 6. NombreUsuario (Value Object)


Archivo:

```

domain/valueObjects/NombreUsuario.js

```

Responsabilidad:

Representar un nombre válido.

---

## Reglas


Debe cumplir:

- No vacío.
- Longitud mínima.
- Longitud máxima.
- Formato permitido.

Ejemplo válido:

```

Juan Santos

```

Ejemplo inválido:

```

J

```

Error:

```

ValidationError

```

---

# 7. EmailUsuario (Value Object)


Archivo:

```

domain/valueObjects/EmailUsuario.js

```

Responsabilidad:

Representar un email válido.

---

## Reglas


Debe:

- Tener formato correcto.
- Normalizar minúsculas.
- Eliminar espacios.

Ejemplo:

Entrada:

```

[JUAN@EMPRESA.COM](mailto:JUAN@EMPRESA.COM)

```

Resultado:

```

[juan@empresa.com](mailto:juan@empresa.com)

```

---

Error:

```

ValidationError

```

---

# 8. RolUsuario (Value Object)


Archivo recomendado:

```

domain/valueObjects/RolUsuario.js

```

Responsabilidad:

Controlar roles válidos.

---

Roles iniciales:

```

OWNER

ADMIN

OPERADOR

LECTOR

```

---

No permitido:

```

SUPERADMIN

ROOT

OTRO

```

Error:

```

ValidationError

```

---

# 9. EstadoUsuario


El estado pertenece a la entidad.

Estados:

```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```

---

# 10. Métodos de la entidad Usuario


## actualizarNombre()


Responsabilidad:

Cambiar el nombre del usuario.


Reglas:

- Nuevo nombre válido.
- Usuario no cancelado.


---

## cambiarEmail()


Responsabilidad:

Actualizar email.


Reglas:

- Email válido.
- No duplicado dentro del tenant.


---

## cambiarRol()


Responsabilidad:

Modificar permisos del usuario.


Reglas:

- Rol permitido.
- Usuario activo.


No permitido:

```

Usuario CANCELADO

↓

Cambiar ADMIN

```

Error:

```

DomainError

```

---

## activar()


Transiciones permitidas:


```

PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO

```


No permitido:

```

CANCELADO → ACTIVO

```

Error:

```

DomainError

```

---

## suspender()


Transición:


```

ACTIVO → SUSPENDIDO

```

No permitido:


```

PENDIENTE → SUSPENDIDO

CANCELADO → SUSPENDIDO

```

Error:

```

DomainError

```

---

## cancelar()


Transiciones:


```

PENDIENTE → CANCELADO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO

```

Regla:

Es irreversible.

---

# 11. Invariantes del dominio


La entidad siempre debe garantizar:


## Usuario válido


Debe existir:

```

id

empresaId

nombre válido

email válido

rol válido

estado válido

```


---

## Seguridad tenant


Nunca permitir:


```

Usuario empresa A

↓

modificado desde empresa B

```

---

# 12. Dependencias permitidas


La entidad puede usar:


```

shared/errors

```

Puede generar:


```

DomainError

ValidationError

```


Puede generar eventos de dominio.


---

# 13. Dependencias prohibidas


No puede usar:


```

Prisma

PostgreSQL

Express

Fastify

JWT

HTTP

```

---

# 14. Eventos relacionados


La entidad puede producir:


```

UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

UsuarioRolActualizado

```

---

# 15. Diseño final esperado


El dominio queda:


```

Empresa

```
|

|
```

Usuario

```
|

|
```

Rol + Estado

```

---

# 16. Resultado esperado


Al implementar este diseño:


El módulo Usuario tendrá:

✅ Entidad rica.

✅ Reglas protegidas.

✅ Bajo acoplamiento.

✅ Preparado para permisos.

✅ Compatible con SaaS multi-tenant.


---

# Estado del documento

Versión:

```

Usuario v0.1

```

Estado:

```

Entidades y Value Objects definidos

```
```

Siguiente documento:

**18-casos-de-uso.md** → definiremos exactamente qué debe hacer cada UseCase antes de que Copilot escriba código.
