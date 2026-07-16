Siguiente documento del módulo **Usuario**:

```text id="f4k28"
docs/modules/usuario/20-repositorios.md
```

```md id="q8x1m"
# Repositorios del módulo Usuario

## 1. Objetivo

Este documento define la capa de persistencia del módulo Usuario.

El repositorio es el punto de comunicación entre:

```

Application

↓

Domain Repository

↓

Infrastructure

↓

Base de datos

```

---

# 2. Principio arquitectónico

El dominio NO conoce:

❌ Prisma

❌ PostgreSQL

❌ SQL

❌ MongoDB

❌ Redis


El dominio solo conoce un contrato:

```

UsuarioRepository

```

---

# 3. Contrato del repositorio


Ubicación:

```

domain/repositories/UsuarioRepository.js

````


Responsabilidad:

Definir las operaciones que el módulo necesita.


Ejemplo:

```js
class UsuarioRepository {

 guardar(usuario)

 buscarPorId(id)

 buscarPorEmail(email)

 buscarPorEmpresaId(empresaId)

 actualizar(usuario)

 obtenerTodos()

}
````

---

# 4. Operaciones del repositorio

## guardar(usuario)

Responsabilidad:

Persistir un nuevo usuario.

Entrada:

```
Usuario Entity
```

Salida:

```
Usuario guardado
```

Usado por:

```
CrearUsuarioUseCase
```

---

# 5. buscarPorId(id)

Responsabilidad:

Encontrar un usuario específico.

Entrada:

```
UUID
```

Salida:

```
Usuario

o

null
```

Usado por:

* ActualizarUsuario
* ActivarUsuario
* SuspenderUsuario
* CancelarUsuario
* CambiarRolUsuario

---

# 6. buscarPorEmail(email)

Responsabilidad:

Buscar usuario por correo.

Uso principal:

Validar duplicados.

Ejemplo:

```
Crear usuario

↓

Buscar email existente

↓

Permitir o rechazar creación
```

Regla:

El email debe ser único dentro de la empresa.

---

# 7. buscarPorEmpresaId(empresaId)

Responsabilidad:

Obtener usuarios pertenecientes a un tenant.

Ejemplo:

```
Empresa A

 ├ Usuario 1
 ├ Usuario 2
```

Nunca debe devolver:

```
Usuarios de Empresa B
```

Regla crítica SaaS:

Aislamiento multi-tenant.

---

# 8. actualizar(usuario)

Responsabilidad:

Guardar cambios de una entidad existente.

Puede modificar:

✅ nombre

✅ email

✅ rol

✅ estado

No debe modificar:

❌ id

❌ empresaId

---

# 9. obtenerTodos()

Responsabilidad:

Consulta administrativa.

Uso futuro:

* Panel administración.
* Reportes.
* Auditoría.

Debe soportar:

Filtros futuros:

```
empresaId

estado

rol
```

---

# 10. Implementación Prisma

Ubicación:

```
infrastructure/persistence/
PrismaUsuarioRepository.js
```

Responsabilidad:

Traducir:

```
Usuario Entity

↓

Modelo Prisma

↓

Base de datos
```

---

# 11. Reglas PrismaRepository

Debe:

✅ Implementar UsuarioRepository.

✅ Mapear entidades.

✅ Manejar persistencia.

No debe:

❌ Validar reglas de negocio.

❌ Cambiar estados.

❌ Crear eventos.

---

# 12. Ejemplo de flujo

Crear usuario:

```
CrearUsuarioUseCase

↓

UsuarioRepository.guardar()

↓

PrismaUsuarioRepository

↓

Prisma.usuario.create()

↓

PostgreSQL
```

---

# 13. FakeRepository

Ubicación:

```
infrastructure/persistence/
FakeUsuarioRepository.js
```

Uso:

Tests unitarios.

Funciona en memoria:

```
Array []

↓

Usuarios
```

---

# 14. Responsabilidad del Fake

Debe permitir probar:

* Crear usuario.
* Buscar usuario.
* Actualizar usuario.
* Listar usuarios.
* Validaciones.

No necesita:

* Prisma.
* Base de datos real.

---

# 15. Errores

El repositorio puede producir:

## NotFoundError

Cuando:

```
buscarPorId()

↓

Usuario inexistente
```

---

## PersistenceError

Futuro error para:

* Fallo DB.
* Timeout.
* Conexión perdida.

---

# 16. Tests esperados

Debe existir:

```
UsuarioRepository.test.js

FakeUsuarioRepository.test.js

PrismaUsuarioRepository.test.js
```

Validar:

✅ Guardar.

✅ Buscar.

✅ Actualizar.

✅ Filtrar por empresa.

✅ Mapeo entidad ↔ persistencia.

---

# 17. Seguridad Multi-Tenant

Regla obligatoria:

Toda consulta debe considerar:

```
empresaId
```

Ejemplo incorrecto:

```
buscarUsuario(id)
```

Ejemplo seguro:

```
buscarUsuario(id, empresaId)
```

---

# 18. Resultado esperado

El módulo Usuario tendrá:

✅ Dominio independiente.

✅ Persistencia intercambiable.

✅ Tests fáciles.

✅ Preparado para escalar SaaS.

✅ Compatible con múltiples motores de base de datos.

---

# Estado del documento

Versión:

```
Usuario v0.1
```

Estado:

```
Contrato de repositorio definido
```

```

Siguiente documento:

**21-arquitectura-interna.md** → definiremos la estructura final de carpetas del módulo Usuario para que Copilot genere el código sin romper la arquitectura.
```
