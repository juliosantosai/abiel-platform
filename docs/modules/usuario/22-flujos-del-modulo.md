Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/22-flujos-del-modulo.md
```

````md id="82kq4"
# Flujos del módulo Usuario

## 1. Objetivo

Este documento describe los flujos principales del módulo Usuario.

Los flujos muestran cómo interactúan:

- Interfaces.
- Casos de uso.
- Entidad Usuario.
- Repositorios.
- Eventos de dominio.

El objetivo es tener una guía antes de implementar código.

---

# 2. Flujo: Crear Usuario

## Descripción

Permite crear un nuevo usuario dentro de una empresa existente.

---

## Entrada

```json
{
  "empresaId": "uuid",
  "nombre": "Juan Santos",
  "email": "juan@empresa.com",
  "rol": "OPERADOR"
}
````

---

## Flujo interno

```
Cliente

↓

UsuarioController

↓

CrearUsuarioUseCase

↓

Verificar Empresa

↓

Validar datos

↓

Crear Entidad Usuario

↓

Guardar UsuarioRepository

↓

Publicar UsuarioCreado

↓

Respuesta
```

---

## Reglas

* La empresa debe existir.
* El email debe ser válido.
* El rol debe existir.
* El usuario inicia como PENDIENTE.

Estado inicial:

```
PENDIENTE
```

---

## Evento generado

```
UsuarioCreado
```

---

# 3. Flujo: Activar Usuario

## Descripción

Permite habilitar un usuario para operar.

---

## Flujo

```
Solicitud activar

↓

ActivarUsuarioUseCase

↓

Buscar Usuario

↓

usuario.activar()

↓

Guardar cambios

↓

UsuarioActivado
```

---

## Transiciones permitidas

```
PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO
```

---

## Prohibido

```
CANCELADO → ACTIVO
```

---

# 4. Flujo: Suspender Usuario

## Descripción

Bloquea temporalmente el acceso de un usuario.

---

## Flujo

```
Solicitud suspensión

↓

SuspenderUsuarioUseCase

↓

Buscar Usuario

↓

usuario.suspender()

↓

Guardar

↓

UsuarioSuspendido
```

---

## Estados

Permitido:

```
ACTIVO → SUSPENDIDO
```

---

No permitido:

```
PENDIENTE → SUSPENDIDO

CANCELADO → SUSPENDIDO
```

---

# 5. Flujo: Cancelar Usuario

## Descripción

Realiza una baja lógica del usuario.

No elimina físicamente los datos.

---

## Flujo

```
Solicitud cancelar

↓

CancelarUsuarioUseCase

↓

Buscar Usuario

↓

usuario.cancelar()

↓

Actualizar estado

↓

UsuarioCancelado
```

---

## Transiciones

Permitidas:

```
PENDIENTE → CANCELADO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO
```

---

## Regla

CANCELADO es estado final.

---

# 6. Flujo: Actualizar Usuario

## Descripción

Actualiza información del usuario.

---

## Datos modificables

Permitidos:

```
nombre

email
```

---

No permitido:

```
id

empresaId

estado
```

---

## Flujo

```
ActualizarUsuarioUseCase

↓

Buscar Usuario

↓

usuario.actualizarNombre()

usuario.cambiarEmail()

↓

Guardar

↓

UsuarioActualizado
```

---

# 7. Flujo: Cambiar Rol

## Descripción

Modificar permisos dentro de la empresa.

---

## Entrada

```json
{
 "usuarioId": "uuid",
 "nuevoRol": "ADMIN"
}
```

---

## Flujo

```
CambiarRolUsuarioUseCase

↓

Buscar Usuario

↓

usuario.cambiarRol()

↓

Guardar

↓

UsuarioRolActualizado
```

---

## Roles permitidos

```
OWNER

ADMIN

OPERADOR

LECTOR
```

---

# 8. Flujo: Listar usuarios por empresa

## Descripción

Obtiene todos los usuarios de un tenant.

---

## Flujo

```
Empresa

↓

ListarUsuariosEmpresaUseCase

↓

UsuarioRepository.buscarPorEmpresaId()

↓

Lista usuarios
```

---

## Regla crítica SaaS

Nunca mezclar datos entre empresas.

Ejemplo:

Correcto:

```
Empresa A

Usuario 1
Usuario 2
```

Incorrecto:

```
Empresa A

Usuario 1
Usuario Empresa B
```

---

# 9. Flujo de seguridad multi-tenant

Todas las operaciones deben validar:

```
empresaId
```

Ejemplo:

```
Usuario ID: 123

Empresa solicitante: A

Usuario pertenece: B

↓

Acceso rechazado
```

---

# 10. Flujo con módulo Auth futuro

Preparado para:

```
UsuarioCreado

↓

Auth recibe evento

↓

Crear credenciales

↓

Enviar invitación
```

---

# 11. Flujo con WhatsApp IA

Futuro:

```
UsuarioActivo

↓

Permisos válidos

↓

Puede administrar agentes IA
```

---

# 12. Flujo de auditoría

Ejemplo:

Cambio de rol:

```
UsuarioRolActualizado

↓

Auditoría

↓

Registro:

"Juan pasó de OPERADOR a ADMIN"
```

---

# 13. Estados del usuario

```
          +-----------+
          | PENDIENTE |
          +-----------+
              |
              v
          +---------+
          | ACTIVO  |
          +---------+
          /        \
         v          v
+-------------+  +------------+
| SUSPENDIDO  |  | CANCELADO  |
+-------------+  +------------+
       |
       |
       v
   +---------+
   | ACTIVO  |
   +---------+
```

---

# 14. Resultado esperado

Después de implementar estos flujos:

✅ Usuario tendrá ciclo de vida controlado.

✅ Los permisos estarán preparados.

✅ Los datos estarán aislados por empresa.

✅ Los eventos permitirán integración futura.

✅ El módulo será escalable para SaaS.

---

# Estado del documento

Versión:

```
Usuario v0.1
```

Estado:

```
Flujos del módulo definidos
```

```

Siguiente documento:

**23-pruebas-del-modulo.md** → definiremos qué debe probar Copilot antes de considerar Usuario listo para producción.
```
