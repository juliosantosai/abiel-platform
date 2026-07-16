Siguiente documento del módulo **Usuario**:

```text id="usr12audit"
docs/modules/usuario/12-auditoria-final.md
```

```md id="audit12usr"
# Auditoría final del módulo Usuario

## 1. Objetivo

Este documento define los criterios de revisión antes de liberar el módulo Usuario como parte del núcleo estable de Abiel Core.

La auditoría valida:

- Arquitectura.
- Dominio.
- Casos de uso.
- Persistencia.
- Eventos.
- Seguridad multi-tenant.
- Pruebas.
- Documentación.


---

# 2. Estado general esperado

El módulo Usuario debe cumplir:


```

DDD

*

Clean Architecture

*

Arquitectura Hexagonal

*

Multi-Tenant SaaS

```id="f6d2pq"


---

# 3. Auditoría de arquitectura


## Estructura esperada


```

usuario/

├── domain/

│   ├── entities/

│   ├── valueObjects/

│   ├── events/

│   └── repositories/

├── application/

│   └── use-cases/

├── infrastructure/

│   └── persistence/

└── interfaces/

```id="7y8kq2"


---

## Validación


Debe cumplirse:


✅ Domain independiente.

✅ Application no conoce infraestructura.

✅ Infrastructure implementa contratos.

✅ Interfaces adaptan entradas externas.


---

# 4. Auditoría del dominio


## Entidad Usuario


Debe contener:


- Identidad.
- Estado.
- Rol.
- Empresa asociada.
- Reglas de negocio.


Debe evitar:


- SQL.
- Prisma.
- HTTP.
- Frameworks.


---

## Value Objects


Esperados:


```

EmailUsuario

NombreUsuario

```id="7v1n3x"


Validaciones:


- formato.
- longitud.
- valores permitidos.


---

# 5. Auditoría de reglas de negocio


Validar:


## Creación


Debe impedir:


- usuario sin empresa.
- email inválido.
- rol inexistente.


---

## Estados


Debe implementar:


```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```id="4g8q1w"


---

## Transiciones


Permitidas:


```

PENDIENTE → ACTIVO

ACTIVO → SUSPENDIDO

SUSPENDIDO → ACTIVO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO

```id="8h5j2n"


Prohibidas:


```

PENDIENTE → SUSPENDIDO

CANCELADO → ACTIVO

CANCELADO → SUSPENDIDO

```id="7c9m5v"


---

# 6. Auditoría de casos de uso


Casos esperados:


```

CrearUsuarioUseCase

ActualizarUsuarioUseCase

ActivarUsuarioUseCase

SuspenderUsuarioUseCase

CancelarUsuarioUseCase

CambiarRolUsuarioUseCase

```id="0g5t8x"


Cada caso debe:


✅ recibir dependencias por inyección.

✅ usar repositorio por contrato.

✅ ejecutar reglas del dominio.

✅ publicar eventos.


---

# 7. Auditoría de eventos


Eventos esperados:


```

UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

UsuarioRolActualizado

```id="5n8k2m"


Validar:


- Extienden DomainEvent.
- Tienen nombre único.
- Contienen payload mínimo.
- No dependen de infraestructura.


---

# 8. Auditoría de repositorios


## Contrato


Debe vivir en:


```

domain/repositories

```id="9k3w7q"


---

## Implementaciones


Fake:


```

para pruebas

```id="6x2p8a"


Prisma:


```

para producción

```id="4j7v9m"


---

Validar:


✅ Mapeo correcto.

✅ Filtrado por empresaId.

✅ No contiene reglas de negocio.


---

# 9. Auditoría Multi-Tenant


Regla crítica:


Todo acceso debe estar aislado por:


```

empresaId

```id="5s7m2q"


Debe impedir:


```

Empresa A

↓

ver usuarios

↓

Empresa B

```id="1x9f4a"


---

# 10. Auditoría de errores


Debe usar:


```

ValidationError

DomainError

NotFoundError

````id="8r3k6p"


No permitido:


```js
throw new Error()
````

Para reglas de negocio.

---

# 11. Auditoría de pruebas

Debe existir:

## Domain

````
Usuario.test.js
``` id="j5m8w2"


Debe cubrir:


- creación.
- validaciones.
- estados.


---

## Application


Tests:


````

CrearUsuarioUseCase.test.js

ActualizarUsuarioUseCase.test.js

ActivarUsuarioUseCase.test.js

SuspenderUsuarioUseCase.test.js

CancelarUsuarioUseCase.test.js

```id="2p8x6v"


---

## Infrastructure


Tests:


```

FakeUsuarioRepository.test.js

PrismaUsuarioRepository.test.js

```id="8d4q1z"


---

# 12. Auditoría de documentación


Debe existir:


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

```id="6y3n8c"


---

# 13. Deuda técnica aceptable antes de v1.0


## Baja prioridad


- Mejorar mensajes de error.
- Optimizar consultas.
- Agregar métricas.
- Añadir auditoría avanzada.


---

# 14. Bloqueadores para liberar


No liberar si existe:


❌ Usuario sin empresa.

❌ Falta aislamiento tenant.

❌ Estados inconsistentes.

❌ Eventos incorrectos.

❌ Tests fallando.

❌ Dominio dependiendo de infraestructura.


---

# 15. Criterio de aprobación


El módulo Usuario queda aprobado cuando:


✅ Arquitectura correcta.

✅ Dominio protegido.

✅ Casos de uso funcionando.

✅ Eventos completos.

✅ Persistencia validada.

✅ Seguridad multi-tenant aplicada.

✅ Pruebas completas.

✅ Documentación terminada.


---

# 16. Resultado esperado


Después de completar este módulo:


Abiel Core tendrá:


```

Empresa

```
    +
```

Usuario

```id="9z7m4k"


como base del sistema SaaS.


Estos módulos permiten construir posteriormente:


- autenticación.
- permisos.
- agentes IA.
- ventas.
- automatizaciones.


---

# Estado del documento


Versión:

```

Usuario v0.1

```id="7w2q8m"


Estado:


```

Auditoría definida

```id="4m9x1p"
```

Con esto queda terminada la **documentación completa del módulo Usuario** (misma profundidad que Empresa).

Siguiente paso recomendado como arquitecto SaaS: **no programar todavía**. Primero crear el documento **13-plan-de-implementacion.md**, donde se define el orden exacto de construcción del módulo Usuario: dominio → errores → eventos → casos de uso → repositorios → tests → liberación v1.0.
