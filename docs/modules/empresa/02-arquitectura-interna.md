# 02 - Arquitectura Interna del Módulo Empresa

# Objetivo

Este documento define la arquitectura interna del módulo Empresa dentro de Abiel Core.

El objetivo es establecer cómo estará organizado el código, cuáles son las responsabilidades de cada capa y cómo se comunican entre ellas.

El módulo seguirá los principios:

- Domain Driven Design (DDD)
- Arquitectura Hexagonal
- Clean Architecture
- SOLID

---

# Principio Fundamental

El módulo Empresa estará organizado alrededor del dominio.

El negocio es el centro.

La infraestructura es un detalle externo.

La dirección de dependencia será:

```
Interfaces

      ↓

Application

      ↓

Domain

      ↑

Infrastructure
```

---

# Capas del Módulo

El módulo Empresa estará dividido en cuatro capas:

```
empresa/

├── domain/

├── application/

├── infrastructure/

└── interfaces/
```

Cada capa tiene una responsabilidad diferente.

---

# 1. Capa Domain

## Responsabilidad

Contiene las reglas reales del negocio.

Es la parte más importante del módulo.

Aquí viven:

- Entidades.
- Value Objects.
- Eventos de dominio.
- Reglas.
- Contratos.

---

## Estructura

```
domain/

├── entities/

├── valueObjects/

├── events/

├── repositories/

└── errors/
```

---

# Entities

Ubicación:

```
domain/entities/
```

Responsabilidad:

Representar objetos del negocio con identidad propia.

Ejemplo:

```
Empresa.js
```

Una entidad:

- Tiene ID.
- Tiene estado.
- Tiene comportamiento.

---

# Value Objects

Ubicación:

```
domain/valueObjects/
```

Responsabilidad:

Representar conceptos del negocio sin identidad.

Ejemplos futuros:

```
NombreEmpresa.js

Ruc.js

EmailEmpresa.js
```

Características:

- Inmutables.
- Validados.
- Reutilizables.

---

# Events

Ubicación:

```
domain/events/
```

Responsabilidad:

Representar hechos importantes.

Ejemplo:

```
EmpresaCreada.js
```

Los eventos permiten comunicación desacoplada.

---

# Repositories

Ubicación:

```
domain/repositories/
```

Responsabilidad:

Definir contratos de persistencia.

Ejemplo:

```
EmpresaRepository.js
```

El dominio dice:

"Necesito guardar una Empresa"

pero no sabe:

"Cómo se guarda"

---

# Errors

Ubicación:

```
domain/errors/
```

Responsabilidad:

Errores propios del negocio.

Ejemplos:

```
NombreEmpresaInvalidoError

EmpresaNoPuedeActivarseError
```

---

# 2. Capa Application

## Responsabilidad

Coordina acciones del sistema.

No contiene reglas profundas del negocio.

Su función es ejecutar casos de uso.

---

## Estructura

```
application/

├── useCases/

└── dto/
```

---

# Use Cases

Ubicación:

```
application/useCases/
```

Ejemplos:

```
CrearEmpresa.js

ActualizarEmpresa.js

ActivarEmpresa.js
```

---

# Responsabilidad

Un caso de uso:

- Recibe una solicitud.
- Ejecuta una operación.
- Usa el dominio.
- Guarda cambios.
- Publica eventos.

---

# DTO

Ubicación:

```
application/dto/
```

Responsabilidad:

Transportar datos.

Ejemplo:

```
CrearEmpresaDTO.js
```

Los DTO no contienen reglas del negocio.

---

# 3. Capa Infrastructure

## Responsabilidad

Contiene detalles técnicos.

Ejemplos:

- Prisma.
- PostgreSQL.
- APIs externas.

---

## Estructura

```
infrastructure/

├── persistence/

└── external/
```

---

# Persistence

Ubicación:

```
infrastructure/persistence/
```

Contiene implementaciones reales.

Ejemplo:

```
PrismaEmpresaRepository.js
```

Implementa:

```
EmpresaRepository
```

---

# External

Ubicación:

```
infrastructure/external/
```

Contiene integraciones externas.

Ejemplo futuro:

```
EmpresaNotificationAdapter.js
```

---

# 4. Capa Interfaces

## Responsabilidad

Comunicar el módulo con el exterior.

---

## Estructura

```
interfaces/

├── http/

├── events/

└── cli/
```

---

# HTTP

Contiene controladores.

Ejemplo:

```
EmpresaController.js
```

Responsabilidad:

- Recibir solicitudes.
- Ejecutar casos de uso.
- Responder.

---

# Events

Contiene consumidores externos.

Ejemplo:

```
EmpresaCreadaHandler.js
```

---

# Flujo Interno Completo

Ejemplo:

Crear una empresa.

```
Usuario

↓

Controller

↓

CrearEmpresa

↓

Empresa Entity

↓

EmpresaRepository

↓

PostgreSQL

↓

EmpresaCreada Event

↓

EventBus

↓

Otros módulos
```

---

# Reglas de Dependencias

Permitido:

```
Application → Domain

Infrastructure → Domain

Interfaces → Application
```

---

No permitido:

```
Domain → Infrastructure
```

Ejemplo incorrecto:

```
Empresa.js

import Prisma
```

La entidad nunca debe conocer la base de datos.

---

# Principios SOLID Aplicados

## Single Responsibility Principle

Cada clase tiene una responsabilidad.

Ejemplo:

Empresa:

Reglas de empresa.

Repository:

Persistencia.

Controller:

Entrada HTTP.

---

## Open Closed Principle

El módulo puede extenderse sin modificar el núcleo.

Ejemplo:

Agregar MongoDB:

Nuevo repositorio.

Sin cambiar Empresa.

---

## Liskov Substitution Principle

Las implementaciones deben respetar contratos.

Ejemplo:

```
EmpresaRepository

        ↑

PrismaEmpresaRepository
```

---

## Interface Segregation Principle

Los contratos deben ser pequeños.

No crear interfaces gigantes.

---

## Dependency Inversion Principle

El dominio define contratos.

La infraestructura depende de ellos.

---

# Comunicación con otros módulos

El módulo Empresa no llama directamente a otros módulos.

Ejemplo incorrecto:

```
Empresa

↓

Notificaciones
```

Correcto:

```
Empresa

↓

EmpresaCreada Event

↓

Notificaciones
```

---

# Escalabilidad Futura

Esta estructura permite evolucionar:

Actualmente:

```
Módulo Empresa dentro del monolito
```

Futuro:

```
Servicio Empresa independiente
```

Sin cambiar el dominio.

---

# Resumen

El módulo Empresa estará organizado con:

- Domain como núcleo.
- Application como coordinador.
- Infrastructure como implementación técnica.
- Interfaces como entrada/salida.

Esta separación permite mantener un sistema SaaS escalable y profesional.