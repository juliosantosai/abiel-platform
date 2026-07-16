Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/21-arquitectura-interna.md
```

```md
# Arquitectura interna del módulo Usuario

## 1. Objetivo

Este documento define la estructura interna del módulo Usuario dentro de Abiel Core.

El objetivo es mantener una arquitectura:

- Modular.
- Escalable.
- Multi-tenant.
- Orientada a dominio.
- Compatible con DDD + Arquitectura Hexagonal + Clean Architecture.

---

# 2. Principio general

El módulo Usuario se divide en capas:

```

Usuario Module

├── domain
│
├── application
│
├── infrastructure
│
└── interfaces

```

Cada capa tiene una responsabilidad específica.

---

# 3. Estructura completa esperada


```

src/modules/usuario/

├── domain/
│
│   ├── entities/
│   │   └── Usuario.js
│   │
│   ├── valueObjects/
│   │   ├── NombreUsuario.js
│   │   ├── EmailUsuario.js
│   │   └── RolUsuario.js
│   │
│   ├── events/
│   │   ├── UsuarioCreado.js
│   │   ├── UsuarioActualizado.js
│   │   ├── UsuarioActivado.js
│   │   ├── UsuarioSuspendido.js
│   │   ├── UsuarioCancelado.js
│   │   └── UsuarioRolActualizado.js
│   │
│   └── repositories/
│       └── UsuarioRepository.js
│
│
├── application/
│
│   └── use-cases/
│       ├── CrearUsuarioUseCase.js
│       ├── ActualizarUsuarioUseCase.js
│       ├── ActivarUsuarioUseCase.js
│       ├── SuspenderUsuarioUseCase.js
│       ├── CancelarUsuarioUseCase.js
│       ├── CambiarRolUsuarioUseCase.js
│       ├── ObtenerUsuarioUseCase.js
│       └── ListarUsuariosEmpresaUseCase.js
│
│
├── infrastructure/
│
│   └── persistence/
│       ├── PrismaUsuarioRepository.js
│       └── FakeUsuarioRepository.js
│
│
└── interfaces/
└── UsuarioController.js

```

---

# 4. Capa Domain

## Responsabilidad

Contiene el corazón del negocio.

Aquí viven:

- Entidades.
- Reglas.
- Value Objects.
- Eventos.
- Contratos.

---

## Dependencias permitidas

Puede usar:

```

shared/errors

shared/events

```

---

## Dependencias prohibidas

No puede usar:

```

Prisma

HTTP

Express

Fastify

JWT

Base de datos

```

---

# 5. Entidad Usuario

Archivo:

```

domain/entities/Usuario.js

```

Responsabilidad:

Representar un usuario válido dentro del sistema.

Contiene:

- Estado.
- Rol.
- Empresa.
- Reglas de transición.

Ejemplo:

```

usuario.activar()

usuario.suspender()

usuario.cancelar()

usuario.cambiarRol()

```

---

# 6. Value Objects

## NombreUsuario

Responsable:

Validar identidad visible.


---

## EmailUsuario

Responsable:

Normalizar y validar correo.


---

## RolUsuario

Responsable:

Controlar permisos válidos.

---

# 7. Eventos

Ubicación:

```

domain/events

```

Responsabilidad:

Comunicar hechos ocurridos.

Ejemplo:

```

UsuarioCreado

```

No ejecutan acciones.

---

# 8. Application Layer


Responsabilidad:

Coordinar acciones.


Ejemplo:

```

CrearUsuarioUseCase

```

Realiza:

```

Recibir comando

↓

Crear entidad

↓

Guardar

↓

Publicar evento

```

---

No contiene:

- Reglas de estados.
- Validaciones profundas.
- SQL.

---

# 9. Infrastructure Layer


Responsabilidad:

Implementar detalles técnicos.


Ejemplo:

```

PrismaUsuarioRepository

```

Convierte:


```

Usuario Entity

↓

Prisma Model

```

---

# 10. Interfaces


Ubicación:

```

interfaces/

```

Responsabilidad:

Adaptar entradas externas.


Ejemplos futuros:

```

HTTP Controller

CLI

WhatsApp Command

```

---

# 11. Flujo completo


Ejemplo:

Crear usuario:


```

Cliente

↓

UsuarioController

↓

CrearUsuarioUseCase

↓

Usuario Entity

↓

UsuarioRepository

↓

PrismaUsuarioRepository

↓

Database

↓

UsuarioCreado Event

```

---

# 12. Reglas de dependencia


La dirección siempre debe ser:


```

Infrastructure

```
    ↓
```

Application

```
    ↓
```

Domain

```


Nunca:


```

Domain

↓

Infrastructure

```

---

# 13. Multi-tenancy


Toda operación debe estar relacionada con:

```

empresaId

```

Ejemplo:


Correcto:

```

CrearUsuario

{

empresaId,
nombre,
email

}

```


Incorrecto:

```

CrearUsuario

{

nombre,
email

}

```

---

# 14. Preparación para crecimiento


Esta arquitectura permite agregar:

- Autenticación.
- Permisos avanzados.
- Roles personalizados.
- Invitaciones.
- Auditoría.
- Equipos.
- Departamentos.

Sin modificar el dominio existente.

---

# 15. Criterio de liberación


El módulo Usuario podrá considerarse listo cuando tenga:

✅ Entidad implementada.

✅ Value Objects.

✅ Casos de uso.

✅ Eventos.

✅ Repositorios.

✅ Tests.

✅ Documentación.

---

# Estado del documento

Versión:

Usuario v0.1

Estado:

Arquitectura definida
```

Siguiente documento:

**22-flujos-del-modulo.md** → documentaremos los flujos completos (crear usuario, activar, permisos, cancelación) antes de implementar.
