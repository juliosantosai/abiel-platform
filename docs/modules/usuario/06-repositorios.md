Siguiente documento del módulo **Usuario**:

```text id="u06rep"
docs/modules/usuario/06-repositorios.md
```

```md id="r06doc"
# Repositorios del módulo Usuario

## 1. Objetivo

Este documento define la responsabilidad de los repositorios dentro del módulo Usuario.

Los repositorios representan una abstracción entre el dominio y la persistencia de datos.

El dominio conoce el contrato del repositorio, pero no conoce:

- Prisma.
- PostgreSQL.
- MongoDB.
- APIs externas.
- Archivos.


La implementación real pertenece a Infrastructure.


---

# 2. Principio arquitectónico


La dependencia correcta:


```

Application

```
  ↓
```

UsuarioRepository (contrato)

```
  ↓
```

PrismaUsuarioRepository

```
  ↓
```

Base de datos

```id="d9e2b"


El dominio nunca depende de Prisma.


Incorrecto:


```

Usuario

↓

Prisma

```id="7f3x3b"


Correcto:


```

Usuario

↓

UsuarioRepository

```id="7v0m2q"


---

# 3. Contrato UsuarioRepository


Ubicación:


```

domain/repositories/UsuarioRepository.js

```id="a8n2kk"


Responsabilidad:

Definir qué operaciones necesita el negocio.


No define:

- SQL.
- consultas.
- tablas.
- ORM.


---

# 4. Operaciones principales


## guardar()


Responsabilidad:

Persistir un usuario nuevo.


Entrada:


```

Usuario

```id="0d6b2v"


Resultado:


```

Usuario guardado

```id="3my6c5"


Ejemplo:


```

guardar(usuario)

```id="k6r4y8"


---

# 5. buscarPorId()


Responsabilidad:

Obtener un usuario mediante identificador.


Entrada:


```

usuarioId

```id="4q7n3j"


Resultado:


```

Usuario

o

null

```id="c9k7xe"


---

# 6. buscarPorEmail()


Responsabilidad:

Buscar usuario por email.


Entrada:


```

email

empresaId

```id="9t7m4p"


Motivo:

El email debe ser único dentro del tenant.


Ejemplo:


Correcto:


```

buscarPorEmail(
"[julio@empresa.com](mailto:julio@empresa.com)",
empresaId
)

```id="m1b6vq"


Incorrecto:


```

buscarPorEmail(
"[julio@empresa.com](mailto:julio@empresa.com)"
)

```id="5z9h0q"


---

# 7. buscarPorEmpresa()


Responsabilidad:

Obtener usuarios pertenecientes a una empresa.


Entrada:


```

empresaId

```id="w2y3sa"


Resultado:


```

Usuario[]

```id="2s9v8e"


---

# 8. actualizar()


Responsabilidad:

Guardar cambios de un usuario existente.


Entrada:


```

Usuario

```id="o8k5pj"


Ejemplo:


Cambiar:


```

OPERADOR

↓

ADMIN

```id="6x4k9n"


---

# 9. eliminar lógico()


El usuario no se elimina físicamente.


No existe:


```

DELETE usuario

```id="kj8y2p"


Se realiza:


```

estado = CANCELADO

```id="3f2n8d"


Motivos:


- auditoría.
- historial.
- seguridad.


---

# 10. Implementación FakeUsuarioRepository


Ubicación:


```

infrastructure/persistence/FakeUsuarioRepository.js

```id="b7v4nx"


## Objetivo


Repositorio en memoria para:


- pruebas unitarias.
- desarrollo.
- validación de casos de uso.


---

## Ejemplo


```

Usuario

↓

FakeRepository

↓

Array en memoria

```id="7p8n4q"


---

# 11. Implementación PrismaUsuarioRepository


Ubicación:


```

infrastructure/persistence/PrismaUsuarioRepository.js

```id="w9c4zs"


## Objetivo


Adaptar el dominio Usuario a PostgreSQL mediante Prisma.


---

## Responsabilidades


Realiza:


- Crear registros.
- Buscar usuarios.
- Actualizar usuarios.
- Mapear entidades.


---

# 12. Mapeo de datos


Dominio:


```

Usuario

```id="y3q7pa"


↓

Prisma:


```

usuario table

```id="1j8z9b"


Ejemplo:


Dominio:


```

usuario.nombre

```id="0o9q3n"


Base:


```

nombre

```id="4v7a2c"


---

# 13. Reglas Multi-Tenant


Todo acceso debe considerar:


```

empresaId

```id="q2v9ab"


Ejemplo:


Correcto:


```

buscarUsuarios(
empresaId
)

```id="9p3m7k"


Incorrecto:


```

SELECT usuarios

```id="4w7c2x"


---

# 14. Seguridad de datos


El repositorio debe garantizar:


## Aislamiento


Empresa A:


```

usuarios_A

```id="w5n8sd"


No puede acceder:


```

usuarios_B

```id="m9x3qv"


---

## Unicidad


No permitir:


Misma empresa:


```

[julio@email.com](mailto:julio@email.com)

[julio@email.com](mailto:julio@email.com)

```id="z8k5fr"


---

# 15. Errores esperados


El repositorio puede devolver:


## null


Cuando no existe:


```

buscarPorId()

↓

null

```id="x4v8py"


El caso de uso decide si genera:


```

NotFoundError

```id="f3m8qd"


---

## Error de infraestructura


Ejemplo:


- caída de base de datos.
- conexión perdida.


Debe ser manejado por Infrastructure.


---

# 16. Pruebas esperadas


Cada repositorio debe tener:


## FakeUsuarioRepository.test.js


Validar:


- guardar usuario.
- buscar usuario.
- actualizar usuario.
- listar usuarios.


---

## PrismaUsuarioRepository.test.js


Validar:


- mapeo correcto.
- llamadas Prisma.
- filtros por empresaId.


---

# 17. Estado del documento


Versión:


```

Usuario v0.1

```id="c0s7vp"


Estado:


```

Contrato de persistencia definido

```id="r8t2wm"


Próximo documento:


```

07-flujos-del-modulo.md

```
```

Siguiente documento: **07-flujos-del-modulo.md**, donde documentamos los procesos completos (crear usuario, activación, suspensión, cambio de rol, etc.) como hicimos con Empresa.
