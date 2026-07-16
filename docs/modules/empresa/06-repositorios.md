# 06 - Repositorios del Módulo Empresa

# Objetivo

Este documento define la responsabilidad de los repositorios dentro del módulo Empresa.

Los repositorios representan la forma en que el dominio solicita almacenar y recuperar entidades.

El objetivo principal es separar:

- Lógica del negocio.
- Persistencia de datos.
- Tecnología utilizada.

---

# Concepto de Repositorio en DDD

En Domain Driven Design, un repositorio es una abstracción que representa una colección de entidades del dominio.

El dominio piensa en objetos:

```
Empresa
```

No piensa en:

```
Tabla SQL

SELECT

INSERT

UPDATE
```

---

# Problema que resuelve

Sin repositorios:

```
Empresa

↓

Prisma

↓

PostgreSQL
```

La entidad queda acoplada a infraestructura.

Problemas:

- Difícil cambiar base de datos.
- Difícil probar.
- Dominio contaminado.
- Menor flexibilidad.

---

# Solución

Con repositorio:

```
Empresa

↓

EmpresaRepository

↓

PrismaEmpresaRepository

↓

PostgreSQL
```

El dominio conoce un contrato.

La infraestructura decide la implementación.

---

# Ubicación

El contrato del repositorio pertenece al dominio:

```
empresa/

└── domain/

    └── repositories/

        └── EmpresaRepository.js
```

---

# Implementación real

La implementación pertenece a infraestructura:

```
empresa/

└── infrastructure/

    └── persistence/

        └── PrismaEmpresaRepository.js
```

---

# Separación de responsabilidades

## Domain Repository

Define:

"Qué necesito hacer"

Ejemplo:

```
guardar empresa

buscar empresa

verificar existencia
```

---

## Infrastructure Repository

Define:

"Cómo lo hago"

Ejemplo:

```
Usando Prisma

Usando PostgreSQL
```

---

# Contrato EmpresaRepository

El módulo Empresa necesitará operaciones básicas.

Inicialmente:

```
guardar()

buscarPorId()

buscarPorNombre()

existe()
```

---

# Método guardar()

## Objetivo

Persistir una Empresa.

Flujo:

```
CrearEmpresa

↓

EmpresaRepository.guardar()

↓

Base de datos
```

---

# Método buscarPorId()

## Objetivo

Recuperar una empresa mediante su identificador.

Ejemplo:

Entrada:

```
empresaId
```

Salida:

```
Empresa
```

---

# Método buscarPorNombre()

## Objetivo

Buscar una empresa por nombre cuando sea necesario.

Ejemplo futuro:

Evitar duplicados.

---

# Método existe()

## Objetivo

Verificar si una empresa ya existe.

Ejemplo:

```
¿Existe esta empresa?
```

---

# Repositorios y Agregados

Empresa es un Aggregate Root.

Por lo tanto:

```
EmpresaRepository
```

solamente administra:

```
Empresa
```

No administra:

```
Usuarios

Mensajes

Conversaciones
```

Cada agregado tendrá su propio repositorio.

---

# Regla importante

No crear repositorios gigantes.

Incorrecto:

```
SistemaRepository

guardarEmpresa()

guardarUsuario()

guardarMensaje()
```

Correcto:

```
EmpresaRepository

UsuarioRepository

MensajeRepository
```

---

# Arquitectura Hexagonal

Los repositorios representan un puerto.

Modelo:

```
              Domain


        EmpresaRepository

              ↑

              |

       Infrastructure


 PrismaEmpresaRepository
```

---

# Puertos y Adaptadores

## Puerto

Contrato definido por el dominio:

```
EmpresaRepository
```

---

## Adaptador

Implementación técnica:

```
PrismaEmpresaRepository
```

---

# SOLID Aplicado

## Dependency Inversion Principle

La regla principal:

El dominio no depende de detalles técnicos.

Ejemplo:

Correcto:

```
EmpresaRepository

        ↑

PrismaEmpresaRepository
```

---

Incorrecto:

```
Empresa

↓

Prisma
```

---

## Interface Segregation Principle

El repositorio debe tener métodos necesarios.

No agregar métodos innecesarios.

---

# Pruebas

Los repositorios tendrán diferentes tipos de pruebas.

---

# Prueba del Dominio

Se prueba usando un repositorio falso:

```
FakeEmpresaRepository
```

No necesita PostgreSQL.

---

# Prueba de Infraestructura

Se prueba:

```
PrismaEmpresaRepository

↓

PostgreSQL
```

---

# Repositorio Fake

Para pruebas:

```
FakeEmpresaRepository

    |
    |
    memoria RAM
```

Ejemplo:

Guardar empresa en un array.

---

# Evolución futura

Inicialmente:

```
Prisma

↓

PostgreSQL
```

Futuro:

```
EmpresaRepository

        ↑

MongoEmpresaRepository

        ↑

ApiEmpresaRepository
```

Sin cambiar el dominio.

---

# Errores comunes evitados

## Error 1

Poner SQL dentro del dominio.

Evita:

```
Empresa.js

SELECT *
```

---

## Error 2

Usar Prisma directamente en casos de uso.

Evita:

```
CrearEmpresa

↓

Prisma
```

---

## Error 3

Crear repositorios como simples CRUD.

Un repositorio trabaja con objetos del dominio.

---

# Flujo completo

```
Controller

↓

CrearEmpresa Use Case

↓

Empresa Entity

↓

EmpresaRepository

↓

PrismaEmpresaRepository

↓

PostgreSQL
```

---

# Resumen

El módulo Empresa tendrá:

Contrato:

```
domain/repositories/EmpresaRepository.js
```

Implementación:

```
infrastructure/persistence/PrismaEmpresaRepository.js
```

El dominio define qué necesita.

La infraestructura decide cómo hacerlo.

---

# Conclusión

Los repositorios permiten mantener Abiel Core desacoplado, testeable y preparado para evolucionar hacia diferentes tecnologías de persistencia sin modificar las reglas del negocio.