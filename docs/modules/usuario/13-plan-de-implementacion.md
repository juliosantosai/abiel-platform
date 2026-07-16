Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/13-plan-de-implementacion.md
```

```md id="u13plan"
# Plan de implementación del módulo Usuario

## 1. Objetivo

Definir el orden técnico de construcción del módulo Usuario para Abiel Core.

La implementación seguirá la misma estrategia utilizada en el módulo Empresa:

```

Dominio

↓

Errores

↓

Eventos

↓

Casos de uso

↓

Repositorios

↓

Tests

↓

Auditoría

↓

Release v1.0

```

El objetivo es evitar deuda técnica y mantener una arquitectura SaaS multi-tenant escalable.


---

# 2. Principios de implementación

Durante todo el desarrollo se respetará:

## Arquitectura

- Domain Driven Design.
- Clean Architecture.
- Arquitectura Hexagonal.
- Event Driven Architecture.


## Reglas

El dominio no conocerá:

- Prisma.
- PostgreSQL.
- HTTP.
- WhatsApp.
- APIs externas.


La aplicación solo coordina.

La infraestructura adapta.


---

# 3. Fase 1 - Diseño del dominio


## Crear entidad Usuario


Archivo:

```

domain/entities/Usuario.js

```


Responsabilidades:

- identidad.
- estado.
- empresa asociada.
- rol.
- comportamiento.


Métodos esperados:


```

actualizarNombre()

cambiarEmail()

cambiarRol()

activar()

suspender()

cancelar()

```


---

## Crear Value Objects


Archivos:


```

domain/valueObjects/EmailUsuario.js

domain/valueObjects/NombreUsuario.js

```


Responsabilidad:


Encapsular validaciones:


- email correcto.
- nombre válido.
- longitud.
- formato.


---

# 4. Fase 2 - Errores de dominio


Reutilizar:


```

shared/errors

```


Usar:


```

ValidationError

DomainError

NotFoundError

````


Regla:


No usar:


```js
throw new Error()
````

para reglas del negocio.

---

# 5. Fase 3 - Máquina de estados

Implementar:

Estados:

```
PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO
```

Reglas:

Permitido:

```
PENDIENTE → ACTIVO

ACTIVO → SUSPENDIDO

SUSPENDIDO → ACTIVO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO
```

Bloqueado:

```
PENDIENTE → SUSPENDIDO

CANCELADO → ACTIVO

CANCELADO → SUSPENDIDO
```

Documentar en:

```
11-reglas-de-estado.md
```

---

# 6. Fase 4 - Eventos de dominio

Crear:

```
UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

UsuarioRolActualizado
```

Ubicación:

```
domain/events
```

Todos deben extender:

```
shared/events/DomainEvent
```

---

# 7. Fase 5 - Contrato de repositorio

Crear:

```
domain/repositories/UsuarioRepository.js
```

Métodos mínimos:

```
guardar()

buscarPorId()

buscarPorEmail()

buscarPorEmpresa()

actualizar()

eliminar()
```

---

# 8. Fase 6 - Casos de uso

Crear:

## Crear usuario

```
CrearUsuarioUseCase
```

Flujo:

```
validar datos

↓

crear entidad

↓

guardar

↓

publicar UsuarioCreado
```

---

## Actualizar usuario

```
ActualizarUsuarioUseCase
```

---

## Activar usuario

```
ActivarUsuarioUseCase
```

---

## Suspender usuario

```
SuspenderUsuarioUseCase
```

---

## Cancelar usuario

```
CancelarUsuarioUseCase
```

---

## Cambiar rol

```
CambiarRolUsuarioUseCase
```

---

# 9. Fase 7 - Infraestructura

Crear:

```
infrastructure/persistence
```

Implementaciones:

## Fake

Para tests:

```
FakeUsuarioRepository.js
```

## Prisma

Producción:

```
PrismaUsuarioRepository.js
```

Responsabilidad:

Solo persistencia.

No reglas de negocio.

---

# 10. Fase 8 - Tests

## Dominio

Crear:

```
Usuario.test.js
```

Validar:

* creación.
* validaciones.
* estados.
* roles.

---

## Application

Crear:

```
CrearUsuarioUseCase.test.js

ActualizarUsuarioUseCase.test.js

ActivarUsuarioUseCase.test.js

SuspenderUsuarioUseCase.test.js

CancelarUsuarioUseCase.test.js

CambiarRolUsuarioUseCase.test.js
```

Validar:

* repositorio.
* eventos.
* errores.

---

## Infrastructure

Crear:

```
FakeUsuarioRepository.test.js

PrismaUsuarioRepository.test.js
```

Validar:

* contratos.
* mapeo.
* persistencia.

---

# 11. Fase 9 - Documentación

Completar:

```
00-descripcion-del-modulo.md

01-reglas-de-negocio.md

02-arquitectura-interna.md

03-entidades-y-value-objects.md

04-casos-de-uso.md

05-eventos-de-dominio.md

06-repositorios.md

07-flujos-del-modulo.md

08-integraciones.md

09-pruebas.md

10-manejo-de-errores.md

11-reglas-de-estado.md

12-auditoria-final.md
```

---

# 12. Criterio de terminado

El módulo Usuario se considera terminado cuando:

✅ Tests completos.

✅ Sin errores críticos.

✅ Documentación completa.

✅ Eventos funcionando.

✅ Multi-tenant validado.

✅ Auditoría aprobada.

---

# 13. Orden recomendado de trabajo

1. Crear estructura de carpetas.

2. Crear entidad Usuario.

3. Crear Value Objects.

4. Implementar estados.

5. Agregar errores.

6. Crear eventos.

7. Crear repositorio.

8. Crear casos de uso.

9. Crear infraestructura.

10. Crear tests.

11. Ejecutar auditoría.

12. Liberar v1.0.

---

# Estado

Versión:

```
Usuario v0.1
```

Estado:

```
Plan de implementación aprobado
```

```

Siguiente documento recomendado: **14-modelo-de-dominio.md** (antes de programar), donde definimos exactamente qué es un Usuario dentro de Abiel Core: atributos, relaciones con Empresa, roles, permisos y límites del dominio.
```
