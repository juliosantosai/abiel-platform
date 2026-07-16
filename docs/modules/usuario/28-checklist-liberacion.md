Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/28-checklist-liberacion.md
```

```md
# Checklist de liberación módulo Usuario v1.0

## 1. Objetivo

Definir los criterios necesarios para considerar el módulo Usuario estable y listo para integrarse al núcleo de Abiel Core.

La liberación v1.0 debe garantizar:

- Dominio estable.
- Seguridad multi-tenant.
- Casos de uso completos.
- Pruebas suficientes.
- Documentación actualizada.

---

# 2. Arquitectura

## Estructura de carpetas

Debe existir:

```

usuario/

├── domain/
│   ├── entities/
│   ├── valueObjects/
│   ├── events/
│   └── repositories/
│
├── application/
│   └── use-cases/
│
├── infrastructure/
│   └── persistence/
│
└── interfaces/

```

Estado:

☐ Cumple

---

# 3. Dominio

## Entidad Usuario

Verificar:

☐ Tiene identidad propia.

☐ Contiene reglas de negocio.

☐ No depende de Prisma.

☐ No depende de HTTP.

☐ Protege invariantes.

---

## Value Objects

Verificar:

☐ NombreUsuario implementado.

☐ EmailUsuario implementado.

☐ RolUsuario implementado.

☐ Validaciones cubiertas.

---

## Estados

Estados definidos:

```

PENDIENTE
ACTIVO
SUSPENDIDO
CANCELADO

```

Verificar:

☐ Transiciones permitidas.

☐ Transiciones prohibidas.

☐ Cancelación idempotente.

---

# 4. Errores

Verificar uso correcto:

| Caso | Error |
|-|-|
| Datos inválidos | ValidationError |
| Regla negocio | DomainError |
| Usuario inexistente | NotFoundError |

---

No permitido:

```

throw new Error()

```

para reglas del negocio.

Estado:

☐ Cumple

---

# 5. Casos de uso

Debe existir:

```

CrearUsuarioUseCase

ActualizarUsuarioUseCase

ActivarUsuarioUseCase

SuspenderUsuarioUseCase

CancelarUsuarioUseCase

CambiarRolUsuarioUseCase

```

---

Cada caso de uso debe:

☐ Recibir dependencias por inyección.

☐ Usar repositorio por contrato.

☐ Aplicar reglas de dominio.

☐ Persistir cambios.

☐ Publicar eventos.

---

# 6. Eventos de dominio

Eventos esperados:

```

UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

UsuarioRolCambiado

```

Verificar:

☐ Eventos son objetos.

☐ Extienden DomainEvent.

☐ Tienen payload definido.

☐ No dependen de infraestructura.

---

# 7. Persistencia

## PrismaUsuarioRepository

Verificar:

☐ Implementa contrato.

☐ Mapea entidad correctamente.

☐ No contiene reglas de negocio.

☐ Maneja errores correctamente.

---

## FakeUsuarioRepository

Verificar:

☐ Funciona para pruebas.

☐ Respeta interfaz.

☐ No tiene lógica diferente al real.

---

# 8. Seguridad SaaS

## Multi-Tenant

Obligatorio:

☐ Toda consulta filtra por empresaId.

☐ Usuario no accede a otra empresa.

☐ No existe fuga de información.

---

## Roles

Verificar:

Roles:

```

OWNER
ADMIN
OPERADOR
LECTOR

```

---

Permisos:

☐ OWNER administra todo.

☐ ADMIN administra usuarios.

☐ OPERADOR ejecuta tareas.

☐ LECTOR solo consulta.

---

# 9. Tests

## Domain

Objetivo:

90%+

Verificar:

☐ Entidad.

☐ Value Objects.

☐ Estados.

☐ Errores.

---

## Application

Objetivo:

80%+

Verificar:

☐ Todos los casos de uso.

☐ Eventos publicados.

☐ Errores esperados.

---

## Infrastructure

Objetivo:

70%+

Verificar:

☐ Fake Repository.

☐ Prisma Repository.

☐ Mapeos.

---

# 10. Documentación

Debe existir:

```

00-descripcion-del-modulo.md

01-reglas-de-negocio.md

02-arquitectura-interna.md

03-entidades-y-value-objects.md

04-casos-de-uso.md

05-eventos-de-dominio.md

06-repositorios.md

07-flujos-del-modulo.md

08-integraciones.md

09-pruebas.md

10-manejo-de-errores.md

12-reglas-de-estado.md

25-seguridad-y-permisos.md

26-integraciones-del-modulo.md

27-flujos-del-modulo.md

28-checklist-liberacion.md

```

---

# 11. Revisión de código

Antes de liberar:

☐ npm test pasa.

☐ Sin errores de lint.

☐ Sin código muerto.

☐ Sin secretos en repositorio.

☐ Variables y nombres claros.

---

# 12. Migraciones

Verificar:

☐ Modelo Prisma creado.

☐ Migraciones aplicadas.

☐ Índices correctos.

☐ Relaciones correctas.

---

# 13. Observabilidad

Preparado para:

☐ Logs.

☐ Auditoría.

☐ Métricas.

☐ Seguimiento de errores.

---

# 14. Versionado

Antes del release:

Crear:

```

usuario-v1.0.0

```

Actualizar:

```

CHANGELOG.md

```

Registrar:

- Nuevas entidades.
- Casos de uso.
- Eventos.
- Cambios importantes.

---

# 15. Criterio final

El módulo Usuario puede liberarse cuando:

✅ Arquitectura aprobada.

✅ Dominio probado.

✅ Seguridad validada.

✅ Tests completos.

✅ Documentación completa.

✅ Integración preparada.

---

# Estado del módulo

Versión:

Usuario v1.0

Estado:

Checklist de liberación definido.
```

Con este documento termina la **documentación base del módulo Usuario**.

Siguiente paso recomendado: hacer la **auditoría final del módulo Usuario v1.0**, igual que hicimos con `Empresa`, antes de pasar al siguiente módulo de Abiel Core.
