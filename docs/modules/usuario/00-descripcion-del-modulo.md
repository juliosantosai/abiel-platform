Creamos el primer documento del módulo **Usuario** siguiendo el mismo estándar profesional de Abiel Core.

Archivo:

```text
docs/modules/usuario/00-descripcion-del-modulo.md
```

Contenido:

```md
# Módulo Usuario

## 1. Descripción general

El módulo Usuario es responsable de gestionar las identidades de las personas que utilizan Abiel Core dentro de una Empresa (Tenant).

Un usuario representa a una persona autorizada para acceder y operar dentro de una cuenta empresarial.

Este módulo forma parte del núcleo de identidad del sistema SaaS y será utilizado por otros módulos como:

- Agentes IA
- Conversaciones
- Facturación
- Configuración
- Auditoría
- Administración


---

# 2. Objetivo del módulo

El objetivo principal del módulo Usuario es:

- Crear usuarios asociados a una empresa.
- Gestionar el ciclo de vida del usuario.
- Controlar información básica de identidad.
- Administrar roles iniciales.
- Permitir la autenticación futura.
- Mantener separación entre usuarios de diferentes empresas.


El módulo NO debe contener lógica relacionada con:

- autenticación externa
- envío de mensajes
- WhatsApp
- pagos
- facturación
- permisos complejos


Estas responsabilidades pertenecen a otros módulos.


---

# 3. Contexto dentro de Abiel Core

Abiel Core es un SaaS multi-tenant.

La relación principal es:

```

Empresa (Tenant)
|
|
+---- Usuario

```


Una Empresa puede tener múltiples usuarios.

Un Usuario pertenece únicamente a una Empresa.


Ejemplo:

```

Empresa:
Barbería Santos

Usuarios:

Julio Santos
Rol:
OWNER

Ana Gómez
Rol:
ADMIN

Carlos Pérez
Rol:
OPERADOR

```


---

# 4. Responsabilidad del módulo

El módulo Usuario administra:

## Identidad

Información básica:

- nombre
- email
- identificación interna
- estado


## Asociación empresarial

Cada usuario debe pertenecer a una Empresa.


Regla:

Un usuario sin empresa no existe dentro del sistema.


## Ciclo de vida

Controla estados:

- PENDIENTE
- ACTIVO
- SUSPENDIDO
- CANCELADO


## Roles iniciales

Primera versión:

- OWNER
- ADMIN
- OPERADOR


Los permisos avanzados serán responsabilidad de un futuro módulo de autorización.


---

# 5. Límites del módulo

## Responsabilidades propias

Usuario es responsable de:

- Crear usuarios.
- Actualizar información personal.
- Cambiar estado.
- Asignar rol.
- Emitir eventos de dominio.


---

## Responsabilidades externas

Usuario NO es responsable de:

### Autenticación

Ejemplo:

- login
- contraseña
- OAuth
- JWT


Futuro módulo:

```

Authentication

```


---

### Autorización avanzada

Ejemplo:

- permisos personalizados
- políticas
- reglas dinámicas


Futuro módulo:

```

Authorization

```


---

### Comunicación

Ejemplo:

- WhatsApp
- email
- notificaciones


Pertenece a:

```

Communication Module

```


---

# 6. Relación con otros módulos

## Empresa

Relación:

```

Empresa 1 ---- N Usuario

```


Empresa es el propietario del usuario.


---

## Autenticación

Futuro:

```

Usuario
|
|
+---- Credential

```


---

## Roles y permisos

Futuro:

```

Usuario
|
|
+---- Role
|
|
+---- Permission

```


---

# 7. Principios arquitectónicos

El módulo seguirá:

## Domain Driven Design

El dominio contiene:

- Entidades
- Value Objects
- Eventos
- Reglas de negocio


---

## Arquitectura Hexagonal

Separación:

```

Domain

Application

Infrastructure

Interfaces

```


El dominio no conoce:

- Base de datos
- Frameworks
- APIs externas


---

## Clean Architecture

Las dependencias apuntan hacia el dominio.


Regla:

```

Infrastructure
↓
Application
↓
Domain

```


Nunca al contrario.


---

# 8. Eventos principales esperados

Eventos iniciales:

```

UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

```


Estos eventos permitirán integración futura con:

- auditoría
- notificaciones
- analítica
- seguridad


---

# 9. Escalabilidad SaaS

El diseño debe permitir crecer desde:

```

1 Empresa
10 Usuarios

```

hasta:

```

Miles de Empresas
Millones de Usuarios

```


Por eso:

- Cada usuario pertenece a un tenant.
- No mezclar datos entre empresas.
- Mantener bajo acoplamiento.
- Usar eventos para integración.


---

# 10. Estado del documento

Versión:

```

Usuario v0.1

```


Estado:

```

Diseño arquitectónico inicial

```


No contiene implementación.

La implementación comenzará únicamente después de completar:

- reglas de negocio
- arquitectura interna
- entidades
- casos de uso
- eventos
- pruebas
```

---

Este sería el equivalente al **00-descripcion-del-modulo.md de Empresa**, pero adaptado a un SaaS multi-tenant. El siguiente documento sería:

```text
01-reglas-de-negocio.md
```

donde definimos las reglas reales del usuario antes de escribir código.
