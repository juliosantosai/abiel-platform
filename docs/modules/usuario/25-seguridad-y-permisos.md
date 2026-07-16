Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/25-seguridad-y-permisos.md
```

```md
# Seguridad y permisos del módulo Usuario

## 1. Objetivo

Definir las reglas de seguridad, autorización y control de acceso del módulo Usuario dentro de una arquitectura SaaS multi-tenant.

El objetivo es garantizar:

- Separación de datos entre empresas.
- Control de acciones según rol.
- Protección de información sensible.
- Auditoría de acciones importantes.

---

# 2. Principio Multi-Tenant

El módulo Usuario pertenece siempre a una Empresa.

Relación:

```

Empresa
|
└── Usuarios

```

Un usuario nunca existe aislado.

Toda operación debe validar:

```

usuarioId
+
empresaId

```

---

# 3. Regla principal de aislamiento

Un usuario de una empresa NO puede:

- Ver usuarios de otra empresa.
- Modificar usuarios externos.
- Eliminar usuarios externos.
- Cambiar roles externos.

Ejemplo:

Empresa A:

```

Usuario Juan
Usuario Pedro

```

Empresa B:

```

Usuario María

```

Solicitud:

```

Empresa A solicita Usuario María

```

Resultado:

```

NotFoundError

```

No debe revelar:

```

"Usuario pertenece a otra empresa"

```

---

# 4. Roles del sistema

Roles iniciales:

```

OWNER
ADMIN
OPERADOR
LECTOR

```

---

# 5. OWNER

## Descripción

Dueño principal de la empresa.

Permisos:

✅ Crear usuarios.

✅ Eliminar usuarios.

✅ Cambiar roles.

✅ Modificar configuración empresarial.

✅ Gestionar facturación.

Restricciones:

No puede eliminarse a sí mismo sin transferir propiedad.

---

# 6. ADMIN

## Descripción

Administrador operativo.

Permisos:

✅ Crear usuarios.

✅ Actualizar usuarios.

✅ Activar usuarios.

✅ Suspender usuarios.

✅ Gestionar operaciones.

No puede:

❌ Cambiar OWNER.

❌ Eliminar empresa.

❌ Gestionar facturación.

---

# 7. OPERADOR

## Descripción

Usuario que trabaja dentro del negocio.

Permisos:

✅ Usar funcionalidades asignadas.

✅ Gestionar tareas operativas.

No puede:

❌ Crear usuarios.

❌ Cambiar permisos.

❌ Modificar configuración.

---

# 8. LECTOR

## Descripción

Usuario únicamente de consulta.

Permisos:

✅ Leer información permitida.

No puede:

❌ Crear.

❌ Editar.

❌ Eliminar.

---

# 9. Matriz de permisos

| Acción | OWNER | ADMIN | OPERADOR | LECTOR |
|-|-|-|-|-|
| Crear usuario | ✅ | ✅ | ❌ | ❌ |
| Editar usuario | ✅ | ✅ | ❌ | ❌ |
| Cambiar rol | ✅ | ❌ | ❌ | ❌ |
| Suspender usuario | ✅ | ✅ | ❌ | ❌ |
| Cancelar usuario | ✅ | ✅ | ❌ | ❌ |
| Ver usuarios | ✅ | ✅ | limitado | lectura |

---

# 10. Cambio de roles

Cambiar rol es una operación sensible.

Reglas:

OWNER puede:

```

ADMIN
OPERADOR
LECTOR

```

ADMIN puede:

```

OPERADOR
LECTOR

```

No permitido:

```

ADMIN → OWNER

```

por parte de ADMIN.

---

# 11. Protección del OWNER

Reglas:

Debe existir siempre un OWNER activo.

No permitido:

```

Eliminar último OWNER

```

Error:

```

DomainError

```

---

# 12. Estados y seguridad

Estados:

```

PENDIENTE
ACTIVO
SUSPENDIDO
CANCELADO

```

---

## Usuario suspendido

No puede:

- Iniciar sesión.
- Ejecutar operaciones.
- Acceder a recursos.

---

## Usuario cancelado

Estado final.

No puede:

- Reactivarse.
- Recuperar permisos.

---

# 13. Auditoría

Acciones sensibles deben generar eventos:

```

UsuarioCreado

UsuarioRolCambiado

UsuarioSuspendido

UsuarioCancelado

````

Información mínima:

```json
{
 usuarioId:"",
 empresaId:"",
 accion:"",
 realizadoPor:"",
 fecha:""
}
````

---

# 14. Seguridad de credenciales

El módulo Usuario NO debe guardar:

* Contraseñas en texto plano.
* Tokens visibles.
* Secretos.

Debe almacenar:

```
passwordHash
```

Nunca:

```
password
```

---

# 15. Futuras integraciones

Preparado para:

* JWT.
* OAuth.
* Login WhatsApp.
* MFA.
* Sesiones.
* Auditoría avanzada.

---

# 16. Tests de seguridad requeridos

Debe probar:

## Multi-tenant

✅ Usuario empresa A no accede a empresa B.

## Roles

✅ OWNER puede administrar.

✅ LECTOR no puede modificar.

## Estados

✅ Suspendido no opera.

✅ Cancelado no vuelve.

## Protección OWNER

✅ No eliminar último propietario.

---

# 17. Reglas para futuros módulos

Todo módulo SaaS debe:

* Recibir empresaId.
* Validar pertenencia.
* Respetar permisos.
* Emitir eventos sensibles.
* No exponer datos cruzados.

---

# Estado del documento

Versión:

Usuario v0.1

Estado:

Seguridad y permisos definidos.

```

Siguiente documento:

**26-integraciones-del-modulo.md**

Ahí documentamos cómo Usuario se conecta con Auth, Empresa, WhatsApp, IA, notificaciones y otros módulos de Abiel Core.
```
