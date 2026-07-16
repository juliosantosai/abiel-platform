Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/02-arquitectura-interna.md
```

```md
# Arquitectura interna del módulo Usuario

## 1. Objetivo

Este documento define cómo estará organizado internamente el módulo Usuario dentro de Abiel Core.

La arquitectura sigue los mismos principios utilizados en el módulo Empresa:

- Domain Driven Design (DDD)
- Clean Architecture
- Arquitectura Hexagonal
- Separación de responsabilidades
- Bajo acoplamiento


---

# 2. Estructura del módulo

La estructura propuesta:

```

usuario/

├── domain/
│   ├── entities/
│   │   └── Usuario.js
│   │
│   ├── valueObjects/
│   │   ├── EmailUsuario.js
│   │   └── NombreUsuario.js
│   │
│   ├── events/
│   │   ├── UsuarioCreado.js
│   │   ├── UsuarioActualizado.js
│   │   ├── UsuarioActivado.js
│   │   ├── UsuarioSuspendido.js
│   │   ├── UsuarioCancelado.js
│   │   └── RolUsuarioCambiado.js
│   │
│   ├── repositories/
│   │   └── UsuarioRepository.js
│   │
│   └── errors/
│
│
├── application/
│   └── use-cases/
│       ├── CrearUsuarioUseCase.js
│       ├── ActualizarUsuarioUseCase.js
│       ├── ActivarUsuarioUseCase.js
│       ├── SuspenderUsuarioUseCase.js
│       ├── CancelarUsuarioUseCase.js
│       └── CambiarRolUsuarioUseCase.js
│
│
├── infrastructure/
│   └── persistence/
│       ├── PrismaUsuarioRepository.js
│       └── FakeUsuarioRepository.js
│
│
└── interfaces/
└── UsuarioController.js

```

---

# 3. Capa Domain

La capa Domain contiene las reglas centrales del usuario.

No conoce:

- Prisma.
- HTTP.
- APIs externas.
- Frameworks.
- Bases de datos.


Su responsabilidad es proteger las reglas del negocio.


---

# 4. Entidad Usuario

Archivo:

```

domain/entities/Usuario.js

```


La entidad representa un usuario dentro de una empresa.


Responsabilidades:

- Mantener identidad.
- Validar estado.
- Gestionar rol.
- Cambiar información personal.
- Controlar transiciones.


Ejemplo conceptual:

```

Usuario

id

empresaId

nombre

email

rol

estado

createdAt

updatedAt

```


---

# 5. Value Objects


## NombreUsuario

Responsabilidad:

- Validar nombre.
- Evitar valores inválidos.
- Mantener reglas de formato.


Ejemplo:

```

NombreUsuario("Julio Santos")

```


---

## EmailUsuario

Responsabilidad:

- Validar formato.
- Normalizar email.
- Proteger identidad.


Ejemplo:

```

EmailUsuario("[julio@empresa.com](mailto:julio@empresa.com)")

```


---

# 6. Eventos de dominio


Los eventos representan hechos ocurridos.


Ejemplo:


```

UsuarioCreado

```


Significa:

"La empresa creó un nuevo usuario."


No significa:

"Crear usuario."


Los eventos serán consumidos por otros módulos.


Ejemplo:

```

UsuarioCreado

```
    |
    |
    +---- Auditoría
    |
    +---- Notificación
    |
    +---- Seguridad
```

```


---

# 7. Capa Application


La capa Application coordina acciones.


Responsabilidades:

- Recibir comandos.
- Ejecutar casos de uso.
- Utilizar repositorios.
- Publicar eventos.


No contiene reglas profundas del negocio.


Ejemplo:

Crear usuario:


```

Request

↓

CrearUsuarioUseCase

↓

Usuario.crear()

↓

Repositorio.guardar()

↓

UsuarioCreado

```


---

# 8. Casos de uso


## CrearUsuarioUseCase


Responsabilidad:

Crear un nuevo usuario.


Valida:

- Empresa existente.
- Datos requeridos.
- Rol permitido.


---

## ActualizarUsuarioUseCase


Responsabilidad:

Modificar datos permitidos.


Ejemplo:

- Nombre.
- Email.


---

## ActivarUsuarioUseCase


Responsabilidad:

Cambiar:

```

PENDIENTE → ACTIVO

```


---

## SuspenderUsuarioUseCase


Responsabilidad:

Cambiar:

```

ACTIVO → SUSPENDIDO

```


---

## CancelarUsuarioUseCase


Responsabilidad:

Cerrar acceso.


Cambia:

```

ACTIVO

o

SUSPENDIDO

↓

CANCELADO

```


---

## CambiarRolUsuarioUseCase


Responsabilidad:

Modificar rol:


Ejemplo:

```

OPERADOR

↓

ADMIN

```


Debe respetar reglas:

- No eliminar último OWNER.
- Roles válidos.


---

# 9. Capa Infrastructure


Contiene implementaciones técnicas.


## PrismaUsuarioRepository


Responsabilidad:

Comunicación con PostgreSQL mediante Prisma.


Realiza:

- guardar.
- buscar.
- actualizar.
- listar.


No contiene reglas de negocio.


---

## FakeUsuarioRepository


Uso:

- pruebas unitarias.
- desarrollo.


Permite probar casos de uso sin base de datos.


---

# 10. Capa Interfaces


Archivo:

```

interfaces/UsuarioController.js

```


Responsabilidad:

Adaptar entradas externas.


Ejemplos:

- HTTP.
- CLI.
- Mensajes internos.


No contiene lógica de negocio.


---

# 11. Dependencias permitidas


Flujo correcto:


```

Interfaces

```
 ↓
```

Application

```
 ↓
```

Domain

Infrastructure

```
 ↓
```

Domain

```


El dominio es el centro.


---

# 12. Dependencias prohibidas


No permitido:


```

Domain

↓

Prisma

```


No permitido:


```

Entidad Usuario

↓

HTTP

```


No permitido:


```

UseCase

↓

SQL directo

```


---

# 13. Multi-tenancy


Usuario siempre trabaja dentro de una Empresa.


Toda consulta debe considerar:


```

empresaId

```


Ejemplo:


Correcto:

```

buscarUsuarios(
empresaId
)

```


Incorrecto:

```

buscarTodosLosUsuarios()

```


---

# 14. Preparación para escala


Diseño preparado para:


```

1 Empresa

10 Usuarios

```


hasta:


```

100.000 Empresas

Millones de Usuarios

```


Por eso:

- repositorios abstraídos.
- eventos.
- separación por tenant.
- dominio independiente.


---

# 15. Estado del documento


Versión:

```

Usuario v0.1

```


Estado:

```

Arquitectura definida

```


Próximo documento:

```

03-entidades-y-value-objects.md

```
```

Siguiente documento: **03-entidades-y-value-objects.md**, donde definimos exactamente `Usuario`, `NombreUsuario`, `EmailUsuario`, roles y estados antes de programar.
