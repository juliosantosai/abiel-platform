Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/14-modelo-de-dominio.md
```

```md
# Modelo de dominio del módulo Usuario

## 1. Introducción

El módulo Usuario representa a las personas o identidades que interactúan dentro de una empresa registrada en Abiel Core.

En un sistema SaaS multi-tenant, el Usuario siempre pertenece a una Empresa.

La relación principal es:

```

Empresa

```
|

|
```

Usuarios

```

Un usuario nunca existe aislado dentro del sistema.

---

# 2. Responsabilidad del módulo

El módulo Usuario controla:

- Identidad del usuario.
- Asociación con una empresa.
- Estado de la cuenta.
- Roles dentro de la empresa.
- Ciclo de vida.
- Permisos básicos de acceso.

No controla:

- Autenticación externa.
- Tokens JWT.
- Sesiones.
- OAuth.
- Integraciones externas.

Eso pertenece a módulos posteriores.

---

# 3. Entidad Usuario

Entidad principal:

```

Usuario

```

Ubicación:

```

domain/entities/Usuario.js

```

---

# 4. Atributos de la entidad


## Identidad

```

id

```

Identificador único del usuario.


Reglas:

- Obligatorio.
- No puede cambiar.


---

## Empresa


```

empresaId

```

Empresa propietaria del usuario.


Reglas:

- Obligatorio.
- Define el tenant.
- Nunca puede quedar vacío.


Ejemplo:

```

Empresa ABC

├── Usuario Juan
├── Usuario María
└── Usuario Pedro

```


---

## Nombre


```

nombre

```

Representa el nombre visible.


Validaciones:

- Obligatorio.
- Longitud mínima.
- Longitud máxima.


---

## Email


```

email

```

Identificador de comunicación.


Reglas:

- Debe tener formato válido.
- Único dentro de la empresa.


Ejemplo:


Permitido:

```

[juan@empresa.com](mailto:juan@empresa.com)

```


No permitido:

```

juan@

```


---

## Rol


```

rol

```

Define responsabilidades dentro de la empresa.


Roles iniciales:


```

OWNER

ADMIN

OPERADOR

LECTOR

```


---

## Estado


```

estado

```


Estados:


```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```


---

# 5. Modelo completo


Conceptualmente:


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

# 6. Reglas de negocio


## Creación


Al crear un usuario:


Debe existir:


- empresaId.
- nombre válido.
- email válido.
- rol válido.


Estado inicial:


```

PENDIENTE

```


---

# 7. Ciclo de vida


## Pendiente


Significa:


Usuario creado pero todavía no habilitado.


Puede:


```

ACTIVARSE

CANCELARSE

```


---

## Activo


Usuario habilitado.


Puede:


```

SUSPENDERSE

CANCELARSE

```


---

## Suspendido


Usuario temporalmente bloqueado.


Puede:


```

ACTIVARSE

CANCELARSE

```


---

## Cancelado


Estado final.


No puede volver a operar.


---

# 8. Reglas de roles


## OWNER


Propietario de la empresa.


Características:


- Puede administrar usuarios.
- Puede cambiar configuración.
- Puede gestionar la empresa.


---

## ADMIN


Administrador interno.


Puede:


- gestionar usuarios.
- operar módulos permitidos.


---

## OPERADOR


Usuario operativo.


Puede:


- ejecutar tareas asignadas.


---

## LECTOR


Solo consulta.


No modifica información.


---

# 9. Relación con Empresa


Regla fundamental:


```

Usuario pertenece a una Empresa

```


No permitido:


```

Usuario sin empresa

```


Motivo:


La empresa representa el límite de seguridad del SaaS.


---

# 10. Multi-tenancy


Todas las operaciones deben filtrar:


```

empresaId

```


Ejemplo:


Solicitud:


```

obtenerUsuarios()

```


Debe convertirse en:


```

obtenerUsuariosPorEmpresa(empresaId)

```


Nunca:


```

obtenerTodosLosUsuarios()

```


---

# 11. Eventos del dominio


La entidad puede generar:


```

UsuarioCreado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

UsuarioRolActualizado

```


Estos eventos permiten:


- auditoría.
- notificaciones.
- automatizaciones futuras.


---

# 12. Lo que NO pertenece al dominio Usuario


No incluir:


❌ contraseña

❌ JWT

❌ refresh tokens

❌ sesiones

❌ envío de emails

❌ WhatsApp


Serán responsabilidad de otros módulos:


```

Auth

Notification

Messaging

```


---

# 13. Dependencias permitidas


Usuario puede conocer:


```

shared/errors

shared/events

```


No puede conocer:


```

Prisma

PostgreSQL

HTTP

Express

Fastify

```


---

# 14. Decisiones arquitectónicas


## Usuario es una entidad rica


No será un simple modelo CRUD.


Debe proteger reglas:


```

Usuario.activar()

Usuario.suspender()

Usuario.cambiarRol()

```


---

# 15. Resultado esperado


Después de implementar este modelo:


Abiel Core tendrá:


```

Empresa

|

|

Usuario

|

|

Roles y permisos

```


Esta será la base para:

- autenticación.
- autorización.
- agentes IA.
- automatizaciones.
- panel administrativo.


---

# Estado del documento

Versión:

```

Usuario v0.1

```


Estado:

```

Modelo de dominio definido

```
```

Siguiente documento recomendado: **15-reglas-de-negocio.md** (definimos todas las reglas exactas que Copilot deberá implementar, igual que hicimos con Empresa).
