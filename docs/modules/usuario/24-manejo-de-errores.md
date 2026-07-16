Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/24-manejo-de-errores.md
```

````md
# Manejo de errores del módulo Usuario

## 1. Objetivo

Definir cómo el módulo Usuario representa y comunica errores.

El objetivo es evitar errores genéricos y mantener separación entre:

- Errores de dominio.
- Errores de aplicación.
- Errores de infraestructura.
- Errores de seguridad.

---

# 2. Principios

El módulo Usuario debe cumplir:

- El dominio no conoce HTTP, Prisma ni detalles externos.
- Los casos de uso no crean reglas de negocio.
- Infraestructura no lanza errores de dominio.
- Cada error debe tener significado para la capa superior.

No usar:

```js
throw new Error("algo salió mal")
````

para reglas del negocio.

---

# 3. Errores compartidos utilizados

Ubicación:

```
src/shared/errors
```

Errores base:

```
DomainError
ValidationError
NotFoundError
```

---

# 4. ValidationError

## Responsabilidad

Representa datos inválidos.

Pertenece principalmente al dominio.

Ejemplos:

* Nombre vacío.
* Email incorrecto.
* Rol inexistente.
* EmpresaId faltante.

---

Ejemplo:

```js
throw new ValidationError(
  "Email inválido",
  {
    email:"invalid"
  }
)
```

---

Casos:

## Usuario sin nombre

Entrada:

```
nombre=""
```

Resultado:

```
ValidationError
```

---

## Email incorrecto

Entrada:

```
email="abc"
```

Resultado:

```
ValidationError
```

---

## Rol inválido

Entrada:

```
rol="SUPERUSER"
```

Resultado:

```
ValidationError
```

---

# 5. DomainError

## Responsabilidad

Representa violaciones de reglas del negocio.

Ejemplos:

* Cambio de estado inválido.
* Operación prohibida.
* Regla de permisos.

---

Ejemplo:

```js
throw new DomainError(
 "No se puede activar usuario cancelado"
)
```

---

# 6. Máquina de estados y errores

Estados:

```
PENDIENTE
ACTIVO
SUSPENDIDO
CANCELADO
```

---

## Activar usuario

Permitido:

```
PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO
```

---

Error:

```
CANCELADO → ACTIVO
```

Lanza:

```
DomainError
```

---

## Suspender usuario

Permitido:

```
ACTIVO → SUSPENDIDO
```

---

Errores:

```
PENDIENTE → SUSPENDIDO

CANCELADO → SUSPENDIDO
```

Lanza:

```
DomainError
```

---

## Cancelar usuario

Permitido:

```
PENDIENTE → CANCELADO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO
```

---

Idempotente:

```
CANCELADO → CANCELADO
```

No genera error.

---

# 7. NotFoundError

## Responsabilidad

Representa recursos inexistentes.

Se utiliza principalmente en Application.

---

Ejemplos:

Buscar usuario:

```
id=123
```

Resultado:

No existe.

Lanza:

```
NotFoundError
```

---

Casos:

* Usuario no encontrado.
* Empresa del usuario inexistente.
* Rol solicitado inexistente.

---

# 8. Errores de permisos

Los permisos pertenecen a Application.

Ejemplo:

Un usuario ADMIN intenta cambiar un OWNER.

Resultado:

```
DomainError
```

Mensaje:

```
No tiene permisos para modificar este usuario
```

---

# 9. Errores multi-tenant

Regla crítica:

Un usuario nunca puede acceder a datos de otra empresa.

Ejemplo:

Solicitud:

```
empresaId=A
usuarioId=B
```

Si pertenece a empresa C:

Resultado:

```
NotFoundError
```

No devolver:

```
Access denied
```

para evitar revelar información.

---

# 10. Errores de infraestructura

La infraestructura puede lanzar errores técnicos:

Ejemplos:

* Base de datos caída.
* Timeout.
* Error Prisma.
* Error conexión.

Estos errores NO deben transformarse en:

```
DomainError
```

---

Ejemplo:

```
PrismaError
      |
      ↓
Infrastructure Handler
      |
      ↓
Application Response
```

---

# 11. Mapeo recomendado

| Situación         | Error                |
| ----------------- | -------------------- |
| Email inválido    | ValidationError      |
| Nombre inválido   | ValidationError      |
| Rol inexistente   | ValidationError      |
| Estado inválido   | DomainError          |
| Usuario no existe | NotFoundError        |
| Empresa no existe | NotFoundError        |
| Sin permisos      | DomainError          |
| Error DB          | Infrastructure Error |

---

# 12. Tests requeridos

Debe existir:

```
Usuario.errors.test.js
```

Validando:

* ValidationError.
* DomainError.
* NotFoundError.

---

# 13. Reglas para futuros módulos

Todos los módulos deben:

✅ Reutilizar errors compartidos.

✅ No usar Error genérico para negocio.

✅ Mantener errores técnicos separados.

✅ Documentar reglas que producen errores.

---

# Estado del documento

Versión:

Usuario v0.1

Estado:

Manejo de errores definido.

```

Siguiente documento:

**25-seguridad-y-permisos.md**

Ahí definimos la parte más importante del SaaS: roles, autorización, multi-tenant y protección de datos.
```
