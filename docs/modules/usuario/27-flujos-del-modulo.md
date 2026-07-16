Siguiente documento del módulo **Usuario**:

```text id="gk529"
docs/modules/usuario/27-flujos-del-modulo.md
```

```md id="8h3xk"
# Flujos del módulo Usuario

## 1. Objetivo

Documentar los principales flujos de negocio del módulo Usuario.

Estos flujos representan cómo interactúan:

- Usuario.
- Empresa.
- Casos de uso.
- Repositorios.
- Eventos.
- Otros módulos.

---

# 2. Flujo: Crear Usuario

## Objetivo

Registrar un nuevo usuario dentro de una empresa.

---

## Actores

- Administrador.
- OWNER.
- Sistema.

---

## Flujo principal

```

Solicitud crear usuario

```
    ↓
```

Validar empresa

```
    ↓
```

Validar datos usuario

```
    ↓
```

Crear entidad Usuario

```
    ↓
```

Guardar repositorio

```
    ↓
```

Publicar UsuarioCreado

```
    ↓
```

Enviar invitación

```

---

## Validaciones

Debe comprobar:

- Empresa existente.
- Nombre válido.
- Email válido.
- Rol permitido.

---

## Resultado

Usuario creado:

Estado:

```

PENDIENTE

```

Evento:

```

UsuarioCreado

```

---

# 3. Flujo: Invitación de usuario

## Objetivo

Permitir que un usuario nuevo acceda al sistema.

---

## Flujo

```

Usuario creado

```
   ↓
```

Evento UsuarioCreado

```
   ↓
```

Auth recibe evento

```
   ↓
```

Genera invitación

```
   ↓
```

Notificación enviada

```
   ↓
```

Usuario acepta

```

---

## Resultado

Usuario queda:

```

ACTIVO

```

después de completar onboarding.

---

# 4. Flujo: Activar Usuario

## Objetivo

Habilitar un usuario registrado.

---

## Flujo

```

Solicitud activar

```
   ↓
```

Buscar usuario

```
   ↓
```

Validar estado actual

```
   ↓
```

Ejecutar activar()

```
   ↓
```

Actualizar repositorio

```
   ↓
```

Publicar UsuarioActivado

```

---

## Reglas

Permitido:

```

PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO

```

Prohibido:

```

CANCELADO → ACTIVO

```

---

# 5. Flujo: Suspender Usuario

## Objetivo

Bloquear temporalmente el acceso.

---

## Flujo

```

Solicitud suspensión

```
   ↓
```

Buscar usuario

```
   ↓
```

Validar permisos

```
   ↓
```

Ejecutar suspender()

```
   ↓
```

Guardar cambios

```
   ↓
```

Publicar UsuarioSuspendido

```
   ↓
```

Auth revoca sesiones

```

---

## Reglas

Permitido:

```

ACTIVO → SUSPENDIDO

```

No permitido:

```

PENDIENTE → SUSPENDIDO

CANCELADO → SUSPENDIDO

```

---

# 6. Flujo: Cancelar Usuario

## Objetivo

Realizar baja lógica.

---

## Flujo

```

Solicitud cancelar

```
   ↓
```

Validar permisos

```
   ↓
```

Ejecutar cancelar()

```
   ↓
```

Guardar estado

```
   ↓
```

Publicar UsuarioCancelado

```
   ↓
```

Revocar acceso

```

---

## Estados permitidos

```

PENDIENTE → CANCELADO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO

```

---

# 7. Flujo: Actualizar Usuario

## Objetivo

Modificar información del perfil.

---

## Datos actualizables

Permitidos:

- Nombre.
- Email.
- Datos de contacto.

---

## Flujo

```

Solicitud actualización

```
   ↓
```

Buscar usuario

```
   ↓
```

Validar cambios

```
   ↓
```

Actualizar entidad

```
   ↓
```

Guardar

```
   ↓
```

Publicar UsuarioActualizado

```

---

# 8. Flujo: Cambio de rol

## Objetivo

Modificar permisos del usuario.

---

## Flujo

```

Solicitud cambio rol

```
    ↓
```

Validar quien ejecuta

```
    ↓
```

Validar nuevo rol

```
    ↓
```

Cambiar rol

```
    ↓
```

Guardar

```
    ↓
```

Publicar UsuarioRolCambiado

```

---

## Ejemplo

Antes:

```

OPERADOR

```

Después:

```

ADMIN

```

---

# 9. Flujo: Login

## Responsabilidad

Pertenece principalmente a Auth.

Usuario participa entregando:

- Perfil.
- Empresa.
- Rol.
- Permisos.

---

Flujo:

```

Login

↓

Auth valida

↓

Busca Usuario

↓

Carga permisos

↓

Genera sesión

```

---

# 10. Flujo Multi-Tenant

## Objetivo

Garantizar aislamiento.

---

Ejemplo:

Empresa A:

```

Usuario Juan

```

Empresa B:

```

Usuario Pedro

```

Solicitud:

```

Empresa A busca Pedro

```

Resultado:

```

NotFoundError

```

---

# 11. Flujo de eliminación lógica

El sistema NO elimina físicamente usuarios.

Proceso:

```

Usuario

↓

CANCELADO

↓

Sin acceso

```

---

Ventajas:

- Auditoría.
- Historial.
- Recuperación de información.

---

# 12. Flujo de eventos

Ejemplo:

Crear usuario:

```

CrearUsuario

```
  ↓
```

UsuarioCreado

```
  ↓
```

Auth

```
  ↓
```

Notificaciones

```
  ↓
```

Auditoría

```

---

# 13. Flujos críticos SaaS

Los flujos más importantes:

1. Crear OWNER inicial.
2. Invitar colaboradores.
3. Asignar permisos.
4. Suspender acceso.
5. Revocar acceso.
6. Auditar acciones.

---

# 14. Criterios de aceptación

Un flujo está aprobado cuando:

✅ Valida reglas de negocio.

✅ Respeta empresa.

✅ Genera evento correcto.

✅ Tiene pruebas.

✅ Mantiene auditoría.

---

# Estado del documento

Versión:

Usuario v0.1

Estado:

Flujos del módulo definidos.
```

Siguiente documento:

**28-checklist-liberacion.md**

Será la revisión final antes de marcar el módulo Usuario como **v1.0 listo para producción**.
