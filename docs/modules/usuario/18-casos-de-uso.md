Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/18-casos-de-uso.md
```

```md
# Casos de Uso del módulo Usuario

## 1. Objetivo

Este documento define las operaciones permitidas sobre la entidad Usuario.

Los casos de uso representan acciones del sistema y coordinan:

- Dominio.
- Repositorios.
- Eventos.
- Servicios externos.

La lógica de negocio permanece dentro de la entidad Usuario.

---

# 2. Principios

Los casos de uso deben:

✅ Recibir dependencias por inyección.

✅ Usar repositorios por contrato.

✅ Ejecutar reglas mediante la entidad.

✅ Publicar eventos de dominio.

✅ No contener reglas de negocio profundas.


Los casos de uso NO deben:

❌ Validar estados manualmente.

❌ Acceder directamente a Prisma.

❌ Conocer HTTP.

❌ Crear SQL.

---

# 3. Crear Usuario

Archivo:

```

application/use-cases/CrearUsuarioUseCase.js

```

## Objetivo

Crear un nuevo usuario dentro de una empresa.


Entrada:

```

{
empresaId,
nombre,
email,
rol
}

```

---

Flujo:

```

Request

↓

CrearUsuarioUseCase

↓

Validar datos

↓

Crear entidad Usuario

↓

Guardar repositorio

↓

Publicar UsuarioCreado

↓

Respuesta

```

---

Reglas:

- Empresa debe existir.
- Email debe ser válido.
- Rol debe existir.
- Usuario inicia como PENDIENTE.


Estado inicial:

```

PENDIENTE

```

---

Errores:

```

ValidationError

NotFoundError

```

---

Evento:

```

UsuarioCreado

```

---

# 4. Actualizar Usuario

Archivo:

```

application/use-cases/ActualizarUsuarioUseCase.js

```

## Objetivo

Modificar información básica.


Entrada:

```

{
usuarioId,
nombre?,
email?
}

```

---

Flujo:

```

Buscar Usuario

↓

Actualizar entidad

↓

Guardar cambios

↓

Publicar UsuarioActualizado

```

---

Puede modificar:

✅ Nombre

✅ Email


No puede modificar:

❌ empresaId

❌ id

❌ estado directamente


Errores:

```

NotFoundError

ValidationError

```

Evento:

```

UsuarioActualizado

```

---

# 5. Activar Usuario

Archivo:

```

application/use-cases/ActivarUsuarioUseCase.js

```

## Objetivo

Permitir que un usuario pueda operar.


Flujo:

```

Buscar Usuario

↓

usuario.activar()

↓

Guardar

↓

Publicar evento

```

---

Estados permitidos:

```

PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO

```

---

Prohibido:

```

CANCELADO → ACTIVO

```

---

Errores:

```

NotFoundError

DomainError

```

---

Evento:

```

UsuarioActivado

```

---

# 6. Suspender Usuario

Archivo:

```

application/use-cases/SuspenderUsuarioUseCase.js

```

## Objetivo

Bloquear temporalmente un usuario.


Flujo:

```

Buscar Usuario

↓

usuario.suspender()

↓

Guardar

↓

Evento

```

---

Estados:

Permitido:

```

ACTIVO → SUSPENDIDO

```

---

Prohibido:

```

PENDIENTE → SUSPENDIDO

CANCELADO → SUSPENDIDO

```

---

Errores:

```

DomainError

```

Evento:

```

UsuarioSuspendido

```

---

# 7. Cancelar Usuario

Archivo:

```

application/use-cases/CancelarUsuarioUseCase.js

```

## Objetivo

Eliminar lógicamente el usuario.


No elimina físicamente.

---

Flujo:

```

Buscar Usuario

↓

usuario.cancelar()

↓

Guardar

↓

Evento

```

---

Estados:

Permitidos:

```

PENDIENTE → CANCELADO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO

```

---

Regla:

Estado final.

---

Evento:

```

UsuarioCancelado

```

---

# 8. Cambiar Rol

Archivo:

```

application/use-cases/CambiarRolUsuarioUseCase.js

```

## Objetivo

Modificar permisos.


Entrada:

```

{
usuarioId,
nuevoRol
}

```

---

Flujo:

```

Buscar Usuario

↓

usuario.cambiarRol()

↓

Guardar

↓

Evento

```

---

Roles:

```

OWNER

ADMIN

OPERADOR

LECTOR

```

---

Errores:

```

ValidationError

DomainError

```

---

Evento:

```

UsuarioRolActualizado

```

---

# 9. Buscar Usuario

Archivo:

```

application/use-cases/ObtenerUsuarioUseCase.js

```

## Objetivo

Consultar información.


Entrada:

```

usuarioId

```

---

Respuesta:

Entidad Usuario.


Error:

```

NotFoundError

```

---

# 10. Listar usuarios de empresa

Archivo:

```

application/use-cases/ListarUsuariosEmpresaUseCase.js

```

## Objetivo

Obtener usuarios pertenecientes a un tenant.


Regla crítica:

Nunca devolver usuarios de otra empresa.


Entrada:

```

empresaId

```

---

Repositorio:

```

buscarPorEmpresaId()

```

---

# 11. Resumen de casos de uso


| Caso de uso | Evento |
|-|-|
| CrearUsuario | UsuarioCreado |
| ActualizarUsuario | UsuarioActualizado |
| ActivarUsuario | UsuarioActivado |
| SuspenderUsuario | UsuarioSuspendido |
| CancelarUsuario | UsuarioCancelado |
| CambiarRolUsuario | UsuarioRolActualizado |
| ObtenerUsuario | - |
| ListarUsuariosEmpresa | - |


---

# 12. Resultado esperado


Al finalizar:

El módulo Usuario tendrá:

✅ Ciclo de vida definido.

✅ Gestión de permisos.

✅ Multi-tenancy protegido.

✅ Eventos para integración.

✅ Preparado para autenticación.


---

# Estado del documento

Versión:

```

Usuario v0.1

```

Estado:

```

Casos de uso definidos

```
```

Siguiente documento:

**19-eventos-de-dominio.md** → definiremos los eventos que permitirán conectar Usuario con Auth, IA, WhatsApp y otros módulos de Abiel Core.
