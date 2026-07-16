Siguiente documento del módulo **Usuario**:

```text id="u2305"
docs/modules/usuario/23-pruebas-del-modulo.md
```

```md id="q3j8s"
# Pruebas del módulo Usuario

## 1. Objetivo

Este documento define la estrategia de pruebas del módulo Usuario.

El objetivo es garantizar:

- Reglas de negocio correctas.
- Seguridad multi-tenant.
- Integridad del dominio.
- Correcta comunicación mediante eventos.
- Funcionamiento de repositorios.

---

# 2. Estrategia de pruebas

El módulo Usuario debe tener pruebas en cuatro niveles:

```

```
    Tests de Integración

          ↑

    Tests Infrastructure

          ↑

    Tests Application

          ↑

    Tests Domain
```

```

---

# 3. Tests de Dominio

Ubicación:

```

domain/**/*.test.js

```

Responsabilidad:

Validar que la entidad Usuario protege las reglas del negocio.

---

# 4. Usuario Entity Tests

Archivo:

```

domain/entities/Usuario.test.js

```

Debe probar:

---

## Creación correcta

Caso:

```

Crear Usuario válido

```

Verificar:

- Tiene ID.
- Tiene empresaId.
- Tiene nombre válido.
- Tiene email válido.
- Tiene rol válido.
- Estado inicial PENDIENTE.

---

## Validación de ID

Debe fallar:

```

Usuario sin id

```

Error esperado:

```

ValidationError

```

---

## Validación empresaId

Debe fallar:

```

Usuario sin empresa

```

Error:

```

ValidationError

```

---

## Validación nombre

Casos:

Válido:

```

Juan Santos

```

Inválido:

```

J

```

Error:

```

ValidationError

```

---

## Validación email

Correcto:

```

[juan@empresa.com](mailto:juan@empresa.com)

```

Incorrecto:

```

juan@

```

Error:

```

ValidationError

```

---

# 5. Tests de estados

Debe cubrir:

---

## Activar

Permitido:

```

PENDIENTE → ACTIVO

SUSPENDIDO → ACTIVO

```

---

Prohibido:

```

CANCELADO → ACTIVO

```

Error:

```

DomainError

```

---

## Suspender

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

Error:

```

DomainError

```

---

## Cancelar

Permitido:

```

PENDIENTE → CANCELADO

ACTIVO → CANCELADO

SUSPENDIDO → CANCELADO

```

---

Debe ser idempotente:

```

CANCELADO → CANCELADO

```

---

# 6. Tests Value Objects


Archivos:


```

NombreUsuario.test.js

EmailUsuario.test.js

RolUsuario.test.js

```

---

## NombreUsuario

Probar:

✅ Nombre válido.

✅ Longitud mínima.

✅ Espacios.

✅ Valores vacíos.

---

## EmailUsuario

Probar:

✅ Email válido.

✅ Conversión minúsculas.

✅ Eliminación espacios.

✅ Email inválido.

---

## RolUsuario

Probar:

Roles válidos:

```

OWNER

ADMIN

OPERADOR

LECTOR

```

Roles inválidos:

```

ROOT

SUPERADMIN

OTRO

```

---

# 7. Tests Application


Ubicación:

```

application/use-cases/*.test.js

```

---

# CrearUsuarioUseCase.test.js

Debe verificar:

✅ Crear entidad.

✅ Guardar repositorio.

✅ Publicar UsuarioCreado.

✅ Error si empresa no existe.

---

# ActualizarUsuarioUseCase.test.js

Debe verificar:

✅ Actualizar nombre.

✅ Actualizar email.

✅ Guardar cambios.

✅ Publicar UsuarioActualizado.

---

# ActivarUsuarioUseCase.test.js

Debe verificar:

✅ Activación correcta.

✅ Persistencia.

✅ Evento UsuarioActivado.

✅ Error Usuario inexistente.

---

# SuspenderUsuarioUseCase.test.js

Debe verificar:

✅ Suspensión correcta.

✅ Evento UsuarioSuspendido.

✅ Error por estado inválido.

---

# CancelarUsuarioUseCase.test.js

Debe verificar:

✅ Baja lógica.

✅ Evento UsuarioCancelado.

---

# CambiarRolUsuarioUseCase.test.js

Debe verificar:

✅ Cambio de permisos.

✅ Evento UsuarioRolActualizado.

✅ Rechazo de rol inválido.

---

# 8. Tests Infrastructure


Ubicación:

```

infrastructure/persistence/

```

---

# FakeUsuarioRepository.test.js


Validar:

✅ guardar()

✅ buscarPorId()

✅ actualizar()

✅ buscarPorEmpresaId()

---

# PrismaUsuarioRepository.test.js


Debe validar:

✅ Mapeo Usuario → Prisma.

✅ Mapeo Prisma → Usuario.

✅ Consultas correctas.

✅ Filtros por empresa.

---

# 9. Tests Multi-Tenant


Muy importante para SaaS.


Caso:

Empresa A:

```

Usuario 1

```

Empresa B:

```

Usuario 2

```

Prueba:

Solicitar usuarios Empresa A.


Resultado esperado:

```

Usuario 1

```

Nunca:

```

Usuario 2

```

---

# 10. Tests de Eventos


Validar:

Cada acción genera su evento:

| Acción | Evento |
|-|-|
| Crear | UsuarioCreado |
| Actualizar | UsuarioActualizado |
| Activar | UsuarioActivado |
| Suspender | UsuarioSuspendido |
| Cancelar | UsuarioCancelado |
| Cambiar rol | UsuarioRolActualizado |

---

# 11. Criterios de aprobación


El módulo Usuario está aprobado cuando:


## Dominio

✅ Entidad protegida.

✅ Value Objects funcionando.

✅ Estados cubiertos.


## Application

✅ Todos los casos de uso testeados.

✅ Eventos publicados.


## Infrastructure

✅ Repositorios funcionando.

✅ Prisma probado.


## Seguridad

✅ Multi-tenancy validado.


---

# 12. Cobertura esperada


Objetivo recomendado:


```

Domain:
90%+

Application:
80%+

Infrastructure:
70%+

```


---

# 13. Resultado esperado


Después de completar estas pruebas:


El módulo Usuario tendrá:

✅ Confianza para producción.

✅ Menos deuda técnica.

✅ Cambios seguros.

✅ Base para Auth y permisos.

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
```

Siguiente documento:

**24-manejo-de-errores.md** → definiremos cómo Usuario maneja validaciones, permisos, estados inválidos y errores de infraestructura.
