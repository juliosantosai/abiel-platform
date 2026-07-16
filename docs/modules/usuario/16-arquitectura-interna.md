Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/16-arquitectura-interna.md
```

```md id="u16arqu"
# Arquitectura interna del módulo Usuario

## 1. Objetivo

Este documento define la arquitectura interna del módulo Usuario dentro de Abiel Core.

El objetivo es establecer:

- Separación de responsabilidades.
- Dependencias permitidas.
- Organización de carpetas.
- Comunicación entre capas.
- Reglas para mantener bajo acoplamiento.

La arquitectura seguirá:

```

DDD

*

Clean Architecture

*

Hexagonal Architecture

*

Event Driven Architecture

```

---

# 2. Principio fundamental

El módulo Usuario se divide en cuatro capas:

```

Domain

↓

Application

↓

Infrastructure

↓

Interfaces

```

Cada capa tiene responsabilidades diferentes.

---

# 3. Estructura de carpetas


La estructura esperada:


```

src/modules/usuario/

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

│   │   └── UsuarioRolActualizado.js

│   │

│   └── repositories/

│       └── UsuarioRepository.js

├── application/

│   └── use-cases/

│       ├── CrearUsuarioUseCase.js

│       ├── ActualizarUsuarioUseCase.js

│       ├── ActivarUsuarioUseCase.js

│       ├── SuspenderUsuarioUseCase.js

│       ├── CancelarUsuarioUseCase.js

│       └── CambiarRolUsuarioUseCase.js

├── infrastructure/

│   └── persistence/

│       ├── PrismaUsuarioRepository.js

│       └── FakeUsuarioRepository.js

└── interfaces/

```
└── UsuarioController.js
```

```

---

# 4. Capa Domain


Ubicación:


```

domain/

```


Responsabilidad:

Contiene las reglas puras del negocio.


Puede contener:


- Entidades.
- Value Objects.
- Eventos.
- Contratos de repositorios.
- Errores de dominio.


No puede contener:


❌ Prisma

❌ SQL

❌ HTTP

❌ Frameworks


---

# 5. Entidad Usuario


Archivo:


```

domain/entities/Usuario.js

```


Responsabilidad:


Representar un usuario válido.


Debe controlar:


- estados.
- roles.
- cambios permitidos.
- invariantes.


Ejemplo:


```

usuario.activar()

usuario.suspender()

usuario.cambiarRol()

```


La entidad protege el negocio.

---

# 6. Value Objects


Ubicación:


```

domain/valueObjects/

```


Responsabilidad:


Validar valores importantes.


Ejemplo:


```

EmailUsuario

```


Controla:


- formato.
- normalización.
- reglas del email.


Ejemplo:


```

NombreUsuario

```


Controla:


- longitud.
- formato.
- valores inválidos.


---

# 7. Eventos de dominio


Ubicación:


```

domain/events/

```


Los eventos representan hechos ocurridos.


Ejemplo:


Después de crear:


```

UsuarioCreado

```


Después de activar:


```

UsuarioActivado

```


Características:


- Inmutables.
- Sin lógica.
- Independientes de infraestructura.


Todos extienden:


```

shared/events/DomainEvent

```

---

# 8. Contrato de repositorio


Archivo:


```

domain/repositories/UsuarioRepository.js
