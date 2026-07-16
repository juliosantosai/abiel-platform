# Reglas de desarrollo

## Guardrails de arquitectura (obligatorio)

Antes de mergear un PR:

```bash
npm run arch:inventory:wrappers
npm run arch:check
npm run arch:check:strict
```

El modo estricto bloquea:

- imports prohibidos por capa
- ciclos de dependencia
- violaciones domain/application -> infrastructure

Tambien reporta (no bloqueante por ahora):

- contratos implicitos por imports profundos
- wrappers contaminados

## Orden obligatorio al crear un módulo

1. **Dominio** → entidad, value objects, invariantes, eventos, repositorio abstracto
2. **Tests de dominio** → cubrir invariantes y transiciones de estado
3. **Application** → use cases, inyección de repositorio y eventPublisher
4. **Tests de application** → comportamiento, eventos publicados, tenant isolation
5. **Infrastructure** → FakeRepository, PrismaRepository
6. **Tests de infrastructure** → ciclo completo con mocks de Prisma
7. **Interfaces** → controllers, webhooks (cuando aplique)

## Reglas del dominio

- La entidad es la única fuente de verdad de sus invariantes.
- Los value objects validan sus propios datos en el constructor.
- Una entidad nunca importa de application ni de infrastructure.
- Las transiciones de estado se hacen mediante métodos explícitos (`activar()`, `suspender()`).

## Reglas de la application

- Los use cases **no** contienen reglas de negocio — solo orquestan.
- Un use case siempre recibe sus dependencias por constructor (inyección).
- `tenantGuard` es opcional; si se provee contexto, se valida; si no, el flujo continúa.
- Si el recurso no existe, lanzar `NotFoundError`.

## Reglas de tests

- Probar **comportamiento**, no implementación.
- No mockear métodos internos de la entidad — probar la entidad directamente.
- En tests de use cases, usar `FakeRepository` o mocks de Jest.
- Cada test de cross-tenant debe verificar que el repositorio no fue llamado con cambios.
- Los tests de dominio no deben depender de Prisma ni de I/O.

## Reglas de infraestructura

- `PrismaRepository` mapea registros del schema a entidades del dominio.
- `FakeRepository` implementa el mismo contrato con un `Map` en memoria.
- Ningún repositorio contiene lógica de negocio.
- **Patrón upsert** (idempotente): `guardar()` usa `prisma.model.upsert({ where: { id }, update: data, create: data })` para ser idempotente (crea si no existe, actualiza si existe).

## Politica de wrappers legacy

- No eliminar wrappers en PRs de hardening.
- Si un wrapper esta contaminado, limpiarlo a reexport puro en PR dedicado de higiene.
- Mantener compatibilidad V1 hasta retiro planificado.
- Toda excepcion de capa debe declararse en `tools/architecture/layer-rules.json` con motivo.

## Estrategia de pruebas

```
        E2E (muy pocos, flujos críticos completos)
    ─────────────────────────────────────────────
      Integración (repositorio Prisma + BD real)
    ─────────────────────────────────────────────
    Unitarios (dominio + use cases + adapters) ← mayoría
```

Ejecutar la suite completa:
```
npx jest --runInBand
```

Ejecutar un módulo:
```
npx jest src/modules/usuario --runInBand
```

## Escalabilidad

El monolito modular está diseñado para escalar verticalmente primero. Cuando un módulo crece en tráfico, puede extraerse como microservicio sin cambiar su contrato interno, ya que:

- No tiene dependencias directas de otros módulos.
- Se comunica mediante eventos.
- Su repositorio ya tiene un contrato abstracto.
