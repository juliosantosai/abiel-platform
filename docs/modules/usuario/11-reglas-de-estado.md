Siguiente documento del módulo **Usuario**:

```text id="usr11state"
docs/modules/usuario/11-reglas-de-estado.md
```

```md id="estado11usr"
# Reglas de estado del módulo Usuario

## 1. Objetivo

Este documento define la máquina de estados del usuario dentro de Abiel Core.

El estado del usuario controla su ciclo de vida dentro de una empresa SaaS multi-tenant.

Los estados determinan:

- Si puede ingresar al sistema.
- Si puede ejecutar acciones.
- Si puede recibir permisos.
- Si puede ser administrado.


---

# 2. Estados oficiales

El usuario posee cuatro estados principales:


```

PENDIENTE

ACTIVO

SUSPENDIDO

CANCELADO

```id="8u2dkw"


---

# 3. Estado PENDIENTE


## Descripción


Usuario creado pero todavía no habilitado.


Ejemplos:


- Invitación enviada.
- Registro incompleto.
- Esperando aprobación.


---

## Características


Puede:


- Completar información.
- Confirmar acceso.


No puede:


- Iniciar operaciones.
- Ejecutar acciones administrativas.


---

# 4. Estado ACTIVO


## Descripción


Usuario habilitado para operar dentro del sistema.


Es el estado operativo principal.


---

## Características


Puede:


- Iniciar sesión.
- Usar módulos autorizados.
- Ejecutar acciones según rol.


Ejemplo:


```

ADMIN

*

ACTIVO

=

Administrador operativo

```id="z0dyjo"


---

# 5. Estado SUSPENDIDO


## Descripción


Usuario bloqueado temporalmente.


La cuenta sigue existiendo.


---

## Motivos:


- Seguridad.
- Falta temporal.
- Decisión administrativa.


---

## Características


Conserva:


- Datos.
- Historial.
- Permisos configurados.


Pero:


```

No puede acceder

```id="9x6q21"


---

# 6. Estado CANCELADO


## Descripción


Estado definitivo.


Representa baja permanente del usuario.


---

## Características


- No puede iniciar sesión.
- No puede ser activado nuevamente.
- Conserva información histórica.


---

# 7. Máquina de estados oficial


## Flujo normal


```

PENDIENTE

```
 |

 ↓
```

ACTIVO

```
 |

 ↓
```

SUSPENDIDO

```
 |

 ↓
```

ACTIVO

```id="7t4j21"


---

# 8. Cancelación


Desde activo:


```

ACTIVO

```
 |

 ↓
```

CANCELADO

```id="m2s8a9"


Desde suspendido:


```

SUSPENDIDO

```
 |

 ↓
```

CANCELADO

```id="n8j3sa"


---

# 9. Transiciones permitidas


| Estado origen | Estado destino | Permitido |
|-|-|-|
| PENDIENTE | ACTIVO | ✅ |
| PENDIENTE | CANCELADO | ✅ |
| PENDIENTE | SUSPENDIDO | ❌ |
| ACTIVO | SUSPENDIDO | ✅ |
| ACTIVO | CANCELADO | ✅ |
| SUSPENDIDO | ACTIVO | ✅ |
| SUSPENDIDO | CANCELADO | ✅ |
| CANCELADO | ACTIVO | ❌ |
| CANCELADO | SUSPENDIDO | ❌ |


---

# 10. Reglas de negocio


## Activar usuario


Método:


```

activar()

```id="k7a9pu"


Permitido:


```

PENDIENTE

↓

ACTIVO

```id="2dd6fw"


No permitido:


```

CANCELADO

↓

ACTIVO

```id="7t4lpx"


---

# Suspender usuario


Método:


```

suspender()

```id="6bf8ha"


Permitido:


```

ACTIVO

↓

SUSPENDIDO

```id="84mtgk"


No permitido:


```

PENDIENTE

↓

SUSPENDIDO

```id="4t8x1a"


---

# Reactivar usuario


Método:


```

activar()

```id="h4s9ds"


Permitido:


```

SUSPENDIDO

↓

ACTIVO

```id="1ry4n7"


No permitido:


```

CANCELADO

↓

ACTIVO

```id="6h3vbc"


---

# Cancelar usuario


Método:


```

cancelar()

```id="y5f9sw"


Permitido:


```

PENDIENTE

↓

CANCELADO

```id="3d9k2m"


```

ACTIVO

↓

CANCELADO

```id="5z1c7q"


```

SUSPENDIDO

↓

CANCELADO

```id="0w6n8p"


---

# 11. Idempotencia


Cancelar usuario es una operación idempotente.


Ejemplo:


Primera ejecución:


```

ACTIVO

↓

CANCELADO

```id="k2a8ps"


Segunda ejecución:


```

CANCELADO

↓

CANCELADO

```id="w7m3az"


Resultado:


```

Sin error

```id="5v8h2r"


---

# 12. Reglas multi-tenant


El estado pertenece al usuario dentro de una empresa.


Ejemplo:


```

Usuario

empresaId = 100

estado = ACTIVO

```id="y8p4nk"


No puede modificarse desde:


```

empresaId = 200

```id="d2x6jm"


---

# 13. Eventos asociados


| Acción | Evento |
|-|-|
| Crear usuario | UsuarioCreado |
| Activar usuario | UsuarioActivado |
| Suspender usuario | UsuarioSuspendido |
| Cancelar usuario | UsuarioCancelado |


---

# 14. Auditoría requerida


Cambios de estado deben registrar:


```

usuario afectado

usuario ejecutor

estado anterior

estado nuevo

fecha

motivo

```id="4n8xk2"


Ejemplo:


```

Administrador Juan

suspendió usuario Pedro

Estado:

ACTIVO → SUSPENDIDO

```id="1j7m9a"


---

# 15. Pruebas obligatorias


La entidad debe probar:


## Estados válidos


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


---

## Estados inválidos


Debe lanzar:


```

DomainError

```


Ejemplos:


```

PENDIENTE → SUSPENDIDO

```


```

CANCELADO → ACTIVO

```


---

# 16. Estado del documento


Versión:


```

Usuario v0.1

```


Estado:


```

Máquina de estados definida

```


---

# Próximo documento

```

12-auditoria-final.md

```
```

Siguiente: **12-auditoria-final.md** → revisión completa del módulo Usuario antes de implementar código, igual que hicimos con Empresa.
