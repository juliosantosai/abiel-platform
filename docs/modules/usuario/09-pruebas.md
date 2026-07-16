Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/09-pruebas.md
```

```md
# Pruebas del módulo Usuario

## 1. Objetivo

Este documento define la estrategia de pruebas del módulo Usuario.

El objetivo es garantizar que el módulo sea confiable antes de integrarse al núcleo estable de Abiel Core.

Las pruebas deben validar:

- Reglas de negocio.
- Estados del usuario.
- Casos de uso.
- Persistencia.
- Eventos.
- Seguridad multi-tenant.


---

# 2. Estrategia de pruebas

El módulo utiliza diferentes niveles:

```

```
    Tests de dominio

          ↓

    Tests de aplicación

          ↓

    Tests infraestructura

          ↓

    Tests integración
```

```


Cada nivel valida una responsabilidad diferente.


---

# 3. Tests de dominio

Ubicación:


```

domain/**/*.test.js

```


Objetivo:

Validar que la entidad Usuario mantiene sus reglas de negocio.


---

## 3.1 Entidad Usuario


Archivo:


```

domain/entities/Usuario.test.js

```


Debe validar:


### Creación


Caso correcto:


```

Usuario válido

↓

Entidad creada

```


Casos inválidos:


- Nombre vacío.
- Email inválido.
- Empresa inexistente.
- Rol inválido.


---

## 3.2 Estados del usuario


Estados:


```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```


Pruebas:


Permitido:


```

PENDIENTE → ACTIVO

```


```

ACTIVO → SUSPENDIDO

```


```

SUSPENDIDO → ACTIVO

```


```

ACTIVO → CANCELADO

```


Prohibido:


```

CANCELADO → ACTIVO

```


```

CANCELADO → SUSPENDIDO

```


---

# 4. Tests de Value Objects


Archivo:


```

domain/valueObjects/EmailUsuario.test.js

```


Validar:


Email correcto:


```

[usuario@empresa.com](mailto:usuario@empresa.com)

```


Email incorrecto:


```

usuario@

```


```

@empresa

```


---

# 5. Tests de Application


Ubicación:


```

application/use-cases/*.test.js

```


Objetivo:

Verificar coordinación entre:


```

UseCase

↓

Repository

↓

Domain

↓

EventPublisher

```


---

# 6. CrearUsuarioUseCase.test.js


Debe validar:


## Caso exitoso


Flujo:


```

Crear usuario

↓

Guardar

↓

Publicar UsuarioCreado

```


Verificar:


- Repositorio llamado.
- Usuario creado.
- Evento publicado.


---

## Error


Empresa no existe:


Resultado:


```

NotFoundError

```


---

# 7. ActivarUsuarioUseCase.test.js


Validar:


Correcto:


```

PENDIENTE

↓

ACTIVO

```


Debe:


- actualizar usuario.
- publicar UsuarioActivado.


---

# 8. SuspenderUsuarioUseCase.test.js


Validar:


Correcto:


```

ACTIVO

↓

SUSPENDIDO

```


Error:


```

PENDIENTE

↓

SUSPENDIDO

```


Debe lanzar:


```

DomainError

```


---

# 9. CancelarUsuarioUseCase.test.js


Validar:


```

ACTIVO

↓

CANCELADO

```


y:


```

SUSPENDIDO

↓

CANCELADO

```


Debe publicar:


```

UsuarioCancelado

```


---

# 10. Tests de repositorio


Ubicación:


```

infrastructure/persistence

```


---

# FakeUsuarioRepository.test.js


Validar:


## Guardar


```

guardar(usuario)

↓

usuario almacenado

```


---

## Buscar


```

buscarPorId()

↓

Usuario

```


---

## Actualizar


```

actualizar(usuario)

↓

datos modificados

```


---

# PrismaUsuarioRepository.test.js


Validar:


## Persistencia


Debe llamar:


```

prisma.usuario.create()

```


---

## Consulta


Debe llamar:


```

prisma.usuario.findUnique()

```


---

## Mapeo


Prisma:


```

registro DB

```


↓

Dominio:


```

Usuario

```


---

# 11. Tests de eventos


Archivo:


```

domain/events/*.test.js

```


Validar:


Cada evento debe:


- Extender DomainEvent.
- Tener nombre correcto.
- Contener payload necesario.


Ejemplo:


```

UsuarioCreado

{
usuarioId,
empresaId
}

```


---

# 12. Tests Multi-Tenant


Objetivo:

Garantizar aislamiento.


Caso:


Empresa A:


```

usuario1

```


Empresa B:


```

usuario2

```


No permitido:


```

Empresa A

buscar usuario de Empresa B

```


Resultado:


```

rechazado

```


---

# 13. Tests de seguridad


Validar:


## Roles


ADMIN puede:


```

gestionar usuarios

```


OPERADOR no puede:


```

crear usuarios

```


---

## Estados


Usuario suspendido:


```

sin acceso

```


Usuario cancelado:


```

sin acceso permanente

```


---

# 14. Cobertura mínima esperada


Antes de liberar:


Dominio:


```

90%+

```


Application:


```

85%+

```


Infrastructure:


```

80%+

```


---

# 15. Criterio de aprobación


El módulo Usuario puede considerarse listo cuando:


✅ Entidad cubierta.

✅ Estados probados.

✅ Casos de uso probados.

✅ Eventos verificados.

✅ Repositorios validados.

✅ Multi-tenant protegido.

✅ npm test pasa correctamente.


---

# Estado del documento


Versión:

```

Usuario v0.1

```


Estado:

```

Estrategia de pruebas definida

```


---

Próximo documento:

```

10-manejo-de-errores.md

```
```

Siguiente: **10-manejo-de-errores.md** → documentamos `DomainError`, `ValidationError`, `NotFoundError`, reglas de errores y cómo debe comportarse Usuario igual que Empresa.
