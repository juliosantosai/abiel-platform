Siguiente documento del módulo **Usuario**:

```text id="u15reg"
docs/modules/usuario/15-reglas-de-negocio.md
```

```md id="u15doc"
# Reglas de negocio del módulo Usuario

## 1. Objetivo

Este documento define las reglas de negocio que debe proteger el módulo Usuario dentro de Abiel Core.

Estas reglas pertenecen al dominio y deben permanecer independientes de:

- Base de datos.
- Frameworks.
- APIs.
- Interfaces externas.

La entidad Usuario es responsable de garantizar que el estado del sistema sea válido.

---

# 2. Regla principal

Todo Usuario pertenece obligatoriamente a una Empresa.

Regla:

```

Usuario → Empresa

```

No existe:

```

Usuario sin empresa

```

Motivo:

La Empresa representa el límite de seguridad del modelo SaaS multi-tenant.

---

# 3. Creación de usuario


## CrearUsuario


Al crear un usuario deben cumplirse:


### Identidad

Debe existir:

```

id

```

Si falta:

```

ValidationError

```


---

### Empresa


Debe existir:

```

empresaId

```

Si falta:

```

ValidationError

```


---

### Nombre


Debe cumplir:


- obligatorio.
- longitud mínima.
- longitud máxima.


Error:

```

ValidationError

```


---

### Email


Debe cumplir:


- formato correcto.
- no vacío.


Ejemplo válido:


```

[usuario@empresa.com](mailto:usuario@empresa.com)

```


Ejemplo inválido:


```

usuario@

```


Error:

```

ValidationError

```


---

# 4. Unicidad del usuario


Regla:


Dentro de una misma empresa:


```

empresaId + email

```


debe ser único.


Ejemplo:


Empresa A:

```

[juan@test.com](mailto:juan@test.com)

```


Permitido:


Empresa B:

```

[juan@test.com](mailto:juan@test.com)

```


No permitido:


Empresa A:

```

[juan@test.com](mailto:juan@test.com)

```

duplicado.


---

# 5. Estado inicial


Todo usuario nuevo inicia:


```

PENDIENTE

```


Motivo:


Representa un usuario creado pero todavía no habilitado.


---

# 6. Reglas de estado


## PENDIENTE


Puede:


```

ACTIVAR

CANCELAR

```


No puede:


```

SUSPENDER

```


Motivo:


Un usuario que nunca estuvo activo no puede ser suspendido.

---

## ACTIVO


Puede:


```

SUSPENDER

CANCELAR

```


---

## SUSPENDIDO


Puede:


```

ACTIVAR

CANCELAR

```


---

## CANCELADO


Estado final.


Puede:


```

ninguna transición

```


excepto operaciones idempotentes definidas.


---

# 7. Reglas de activación


Método:


```

activar()

```


Permite:


```

PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO

```


No permite:


```

CANCELADO → ACTIVO

```


Debe lanzar:


```

DomainError

```


---

# 8. Reglas de suspensión


Método:


```

suspender()

```


Permite:


```

ACTIVO → SUSPENDIDO

```


No permite:


```

PENDIENTE → SUSPENDIDO

CANCELADO → SUSPENDIDO

```


Debe lanzar:


```

DomainError

```


---

# 9. Reglas de cancelación


Método:


```

cancelar()

```


Permite:


```

PENDIENTE → CANCELADO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO

```


Regla:


Cancelar es irreversible.


---

# 10. Reglas de rol


Roles válidos:


```

OWNER

ADMIN

OPERADOR

LECTOR

```


No permitido:


```

ROL_INVENTADO

```


Debe lanzar:


```

ValidationError

```


---

# 11. Cambio de rol


Método:


```

cambiarRol()

```


Reglas:


Debe existir un rol válido.


Un usuario cancelado no puede cambiar de rol.


Ejemplo prohibido:


```

Usuario CANCELADO

↓

cambiar ADMIN

```


Error:


```

DomainError

```


---

# 12. Cambio de email


Método:


```

cambiarEmail()

```


Reglas:


- Nuevo email válido.
- No puede quedar vacío.
- Debe respetar unicidad dentro del tenant.


---

# 13. Seguridad multi-tenant


Regla crítica:


Toda operación sobre usuarios requiere:


```

empresaId

```


Ejemplo:


Correcto:


```

buscarUsuario(
usuarioId,
empresaId
)

```


Incorrecto:


```

buscarUsuario(usuarioId)

```


---

# 14. Eliminación


No existe eliminación física como regla de negocio.


Se utiliza:


```

cancelar()

```


Motivos:


- auditoría.
- historial.
- trazabilidad.


---

# 15. Eventos generados


Las operaciones generan:


| Acción | Evento |
|-|-|
| Crear | UsuarioCreado |
| Activar | UsuarioActivado |
| Suspender | UsuarioSuspendido |
| Cancelar | UsuarioCancelado |
| Cambiar rol | UsuarioRolActualizado |


---

# 16. Manejo de errores


El dominio utiliza:


## ValidationError


Para:

- datos incorrectos.
- valores inválidos.


---

## DomainError


Para:

- reglas de negocio violadas.
- estados inválidos.


---

## NotFoundError


Para:

- usuario inexistente en casos de uso.


---

# 17. Reglas que nunca deben romperse


Nunca permitir:


❌ Usuario sin empresa.

❌ Usuario sin email válido.

❌ Rol inexistente.

❌ Estado inválido.

❌ Acceso entre tenants.

❌ Dominio dependiendo de Prisma.


---

# 18. Resultado esperado


Al implementar estas reglas:


El módulo Usuario será capaz de soportar:


```

1 Empresa

↓

muchos Usuarios

↓

diferentes Roles

↓

diferentes permisos

```


Preparando Abiel Core para:


- autenticación.
- autorización.
- equipos.
- agentes IA.
- automatizaciones empresariales.


---

# Estado del documento


Versión:

```

Usuario v0.1

```


Estado:

```

Reglas de negocio definidas

```
```

Siguiente documento recomendado:

**16-arquitectura-interna.md** → donde definimos la estructura exacta de carpetas, dependencias y responsabilidades antes de que Copilot genere código.
