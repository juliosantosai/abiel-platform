Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/08-integraciones.md
```

```md id="u08int"
# Integraciones del módulo Usuario

## 1. Objetivo

Este documento describe las integraciones del módulo Usuario con otros componentes del sistema Abiel Core.

El módulo Usuario no funciona de forma aislada. Forma parte del núcleo de identidad y control de acceso del SaaS multi-tenant.


Sus principales integraciones son:

- Empresa.
- Autenticación.
- Roles y permisos.
- Auditoría.
- Eventos de dominio.
- Futuros módulos del sistema.


---

# 2. Integración con módulo Empresa


## Relación


Una empresa puede tener muchos usuarios.


Modelo:


```

Empresa

```
1

|

N
```

Usuario

```


---

## Responsabilidad


Empresa administra:

- Tenancy.
- Datos comerciales.
- Suscripción.


Usuario administra:

- Personas.
- Acceso.
- Roles.
- Permisos.


---

## Regla principal


Todo usuario debe pertenecer a una empresa.


Ejemplo:


Correcto:


```

Usuario

empresaId = 123

```


Incorrecto:


```

Usuario

empresaId = null

```


---

# 3. Integración con autenticación


## Objetivo


Permitir validar identidad del usuario.


El módulo Usuario entrega:


- Email.
- Estado.
- Rol.
- Empresa.


El módulo Auth gestiona:


- Password.
- Tokens.
- Sesiones.


---

## Flujo


```

Usuario intenta ingresar

```
    ↓
```

Auth busca Usuario

```
    ↓
```

UsuarioRepository.buscarPorEmail()

```
    ↓
```

Validar estado

```
    ↓
```

Crear sesión

```


---

# 4. Reglas de autenticación


Un usuario puede autenticarse si:


```

estado = ACTIVO

```


No puede autenticarse si:


```

estado = SUSPENDIDO

```


o


```

estado = CANCELADO

```


---

# 5. Integración con Roles y Permisos


## Objetivo


Controlar qué acciones puede realizar cada usuario.


Ejemplo:


```

OWNER

puede administrar empresa

```


```

ADMIN

puede administrar usuarios

```


```

OPERADOR

puede utilizar servicios

```


---

# 6. Modelo de autorización


El usuario posee:


```

rol

```


El sistema consulta:


```

rol + permiso requerido

```


Ejemplo:


Acción:


```

crear usuario

```


Consulta:


```

¿ADMIN tiene permiso?

```


Resultado:


```

permitido / rechazado

```


---

# 7. Integración con eventos


El módulo Usuario publica eventos para que otros módulos reaccionen.


Eventos:


```

UsuarioCreado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

UsuarioRolActualizado

```


---

## Ejemplo


Cuando se crea un usuario:


```

UsuarioCreado

```
    ↓
```

Módulo Notificaciones

```
    ↓
```

Enviar bienvenida

```


---

# 8. Integración con auditoría


Toda operación administrativa importante debe generar registro.


Ejemplos:


```

Administrador creó usuario

```


```

Administrador cambió rol

```


```

Administrador suspendió usuario

```


---

Datos mínimos:


```

usuarioEjecutor

usuarioAfectado

empresaId

acción

fecha

```


---

# 9. Integración futura con WhatsApp


Posible uso:


Usuarios administradores pueden configurar:


- asistentes IA.
- conversaciones.
- clientes.
- equipos.


Ejemplo:


```

Usuario ADMIN

```
  ↓
```

Configura agente IA

```
  ↓
```

WhatsApp Engine

```


---

# 10. Integración con módulos SaaS


Usuarios podrán interactuar con:


## Ventas


```

Usuario

↓

Clientes

↓

Pedidos

```


## Automatización


```

Usuario

↓

Agentes IA

↓

Workflows

```


## Reportes


```

Usuario

↓

Dashboard

↓

Métricas

```


---

# 11. Seguridad Multi-Tenant


Regla crítica:


Todas las consultas deben estar filtradas por:


```

empresaId

```


Ejemplo:


Consulta segura:


```

buscarUsuarios(
empresaId
)

```


Consulta insegura:


```

buscarTodosUsuarios()

```


---

# 12. Dependencias permitidas


Usuario puede depender de:


```

Shared

* errores
* eventos
* utilidades

```


```

Empresa

* validar existencia

```


No debe depender de:


```

Prisma

Infraestructura externa

WhatsApp

IA Engine

```


---

# 13. Eventos consumidos


Posibles eventos futuros:


```

EmpresaCancelada

```


Acción:


```

Suspender todos los usuarios

```


---

```

EmpresaSuspendida

```


Acción:


```

Bloquear acceso temporal

```


---

# 14. Estado de integración


Versión:


```

Usuario v0.1

```


Estado:


```

Arquitectura definida

```


Pendientes:


- Auth real.
- Sistema de permisos.
- Auditoría.
- Integraciones externas.


---

# Próximo documento

```

09-pruebas.md

```

Donde se define la estrategia de pruebas del módulo Usuario.
```

Siguiente: **09-pruebas.md** → definimos qué tests necesita Usuario antes de considerarlo listo para producción.
