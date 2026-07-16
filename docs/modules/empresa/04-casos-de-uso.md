# 04 - Casos de Uso del Módulo Empresa

# Objetivo

Este documento define las operaciones que el sistema puede realizar sobre una Empresa.

Los casos de uso representan acciones del negocio.

No representan:

- Endpoints HTTP.
- Consultas SQL.
- Métodos de base de datos.

Un caso de uso responde:

> ¿Qué puede hacer el sistema con una Empresa?

---

# Concepto de Caso de Uso

Un caso de uso es una acción completa del sistema.

Ejemplo:

Crear una Empresa.

El flujo interno será:

```
Solicitud

↓

Caso de Uso

↓

Dominio

↓

Repositorio

↓

Evento
```

---

# Responsabilidad de Application Layer

Los casos de uso pertenecen a:

```
application/
```

Su responsabilidad es:

- Coordinar acciones.
- Usar entidades.
- Usar repositorios.
- Ejecutar procesos.
- Publicar eventos.

---

# Lo que NO hace un Caso de Uso

Un caso de uso no debe:

- Contener reglas profundas del negocio.
- Manipular SQL.
- Conocer Prisma.
- Manejar HTTP.
- Crear respuestas de API.

---

# Estructura

```
application/

└── useCases/

    ├── CrearEmpresa.js

    ├── ActualizarEmpresa.js

    ├── ActivarEmpresa.js

    ├── SuspenderEmpresa.js

    └── CancelarEmpresa.js
```

---

# Caso de Uso 1: Crear Empresa

## Objetivo

Crear una nueva empresa dentro de Abiel Core.

---

# Entrada

Recibe:

```
nombre
```

Ejemplo:

```
Barbería Santos
```

---

# Flujo

```
Usuario

↓

CrearEmpresa

↓

Crear entidad Empresa

↓

Guardar Empresa

↓

Publicar EmpresaCreada

```

---

# Responsabilidades

CrearEmpresa debe:

- Recibir datos.
- Crear la entidad.
- Solicitar persistencia.
- Publicar evento.

---

# No debe:

Validar reglas internas.

Ejemplo:

No debe decidir:

```
¿El nombre es válido?
```

Eso pertenece al dominio.

---

# Caso de Uso 2: Actualizar Empresa

## Objetivo

Modificar información permitida de una empresa existente.

---

# Entrada

Ejemplo:

```
empresaId

nuevoNombre
```

---

# Flujo

```
Solicitud

↓

ActualizarEmpresa

↓

Buscar Empresa

↓

Cambiar información

↓

Guardar cambios

↓

Publicar evento
```

---

# Responsabilidades

Debe:

- Obtener entidad.
- Ejecutar método del dominio.
- Persistir cambios.

---

# Caso de Uso 3: Activar Empresa

## Objetivo

Cambiar una empresa al estado ACTIVA.

---

# Flujo

```
ActivarEmpresa

↓

Buscar Empresa

↓

empresa.activar()

↓

Guardar

↓

EmpresaActivada
```

---

# Regla importante

El caso de uso no cambia el estado directamente.

Incorrecto:

```
empresa.estado = ACTIVA
```

Correcto:

```
empresa.activar()
```

---

# Caso de Uso 4: Suspender Empresa

## Objetivo

Suspender temporalmente una empresa.

Ejemplos:

- Problemas de pago.
- Suspensión administrativa.

---

# Flujo

```
SuspenderEmpresa

↓

Empresa

↓

empresa.suspender()

↓

Guardar

↓

EmpresaSuspendida
```

---

# Caso de Uso 5: Cancelar Empresa

## Objetivo

Finalizar la relación con una empresa.

---

# Regla

No se elimina físicamente.

Se cambia estado:

```
ACTIVA

↓

CANCELADA
```

---

# Flujo

```
CancelarEmpresa

↓

Empresa

↓

empresa.cancelar()

↓

Guardar

↓

EmpresaCancelada
```

---

# Dependencias de los Casos de Uso

Los casos de uso dependerán de contratos.

Ejemplo:

```
CrearEmpresa

       |
       |
       ▼

EmpresaRepository
```

No dependerá de:

```
PrismaEmpresaRepository
```

---

# Inyección de Dependencias

Ejemplo conceptual:

```
CrearEmpresa

recibe:

EmpresaRepository
```

Puede recibir:

```
PrismaEmpresaRepository
```

o:

```
FakeEmpresaRepository
```

---

# Principios SOLID Aplicados

## Single Responsibility

Cada caso de uso realiza una acción.

Ejemplo:

```
CrearEmpresa

solo crea empresas
```

---

## Dependency Inversion

La aplicación depende de contratos.

Ejemplo:

```
EmpresaRepository

        ↑

PrismaEmpresaRepository
```

---

## Open Closed

Podemos agregar:

```
DuplicarEmpresa
```

sin modificar otros casos.

---

# Eventos producidos

Los casos de uso pueden generar:

```
EmpresaCreada

EmpresaActualizada

EmpresaActivada

EmpresaSuspendida

EmpresaCancelada
```

---

# Comunicación con otros módulos

Los casos de uso no llaman otros módulos directamente.

Incorrecto:

```
CrearEmpresa

↓

EnviarEmail
```

Correcto:

```
CrearEmpresa

↓

EmpresaCreada Event

↓

Notificaciones escucha
```

---

# Manejo de errores

Los casos de uso pueden recibir errores del dominio:

Ejemplo:

```
EmpresaNoPuedeActivarseError
```

y transmitirlos hacia la capa superior.

---

# Pruebas esperadas

Cada caso de uso tendrá pruebas unitarias.

Ejemplo:

CrearEmpresa:

Debe comprobar:

- Crea entidad.
- Llama repositorio.
- Publica evento.

---

# Resumen

Los casos de uso del módulo Empresa serán:

```
CrearEmpresa

ActualizarEmpresa

ActivarEmpresa

SuspenderEmpresa

CancelarEmpresa
```

Ellos coordinan operaciones, pero las reglas pertenecen al dominio.

---

# Conclusión

La capa Application será el puente entre las solicitudes externas y el dominio.

Su función es coordinar, nunca reemplazar las reglas del negocio.