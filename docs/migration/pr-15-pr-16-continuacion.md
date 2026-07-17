# PR15 → PR16 Continuación

## Estado actual

- Wrappers auditados: `160`
- Archivos JS en `src`: `289`
- Archivos TS en `src`: `299`
- Importaciones que resuelven a `.js`: `73` de `737` importaciones analizadas (`9.9%`)
- Wrappers usados detectados: `24`
- Wrappers no referenciados detectados: `27`

## Objetivo de la continuación

Alinear PR15 y PR16 como fases secuenciales de la migración:

- PR15: eliminar la capa legacy JS y estabilizar imports.
- PR16: consolidar la arquitectura TS nativa y eliminar JS residuales.

## PR15

### Propósito

- Reducir la dependencia de wrappers JS.
- Migrar contracts core y fronteras de API en bloques controlados.
- Validar cada avance con tests.
- Documentar wrappers que se conservan por riesgo.

### Resultado esperado

- Descenso significativo de `jsWrappers`.
- Menos imports explícitos a `.js`.
- Importaciones TS más coherentes en los módulos migrados.

### Flujo operativo de PR15

1. Revisar `docs/migration/pr-15-wrapper-migration.md`.
2. Crear rama:

```bash
git checkout -b refactor/pr15-wrapper-migration
```

3. Migrar wrappers usados en bloques pequeños:
   - `DomainEvent.js`
   - `TenantError.js`
   - `AIRequest.js`
   - `LLMProvider.js`
   - API controllers y rutas
4. Revisar wrappers con lógica extra antes de migrarlos.
5. No eliminar wrappers muertos sin confirmar con `git grep` y pruebas.
6. Ejecutar:
   - `npm test`
   - `npm run typecheck`
   - `node tools/architecture/audit-wrapper-ts.js`

## PR16

### Propósito

- Consolidar la arquitectura nativa TS.
- Eliminar JS de compatibilidad que ya no sea necesario.
- Lograr un árbol de imports limpio.

### Resultado esperado

- `jsWrappers=0` o solo wrappers explícitamente documentados.
- Imports de `.js` eliminados cuando exista el TS correspondiente.
- El proyecto listo para un runtime TS-first.

### Enfoque de PR16

1. Revisar bloques migrados en PR15.
2. Eliminar archivos `.js` residuales en módulos estabilizados.
3. Cambiar imports explícitos `.js` por `.ts` donde sea seguro.
4. Validar con tests completos y auditoría.
5. Documentar la eliminación de la capa legacy.

## Comparación PR15 vs PR16

PR15:

```text
Eliminar capa legacy JS
↓
Reducir acoplamiento
↓
Estabilizar contratos
```

PR16:

```text
Consolidar arquitectura nativa
↓
Event-driven runtime
↓
Plugin system
↓
Multi-tenant production readiness
```

## Criterios para avanzar de PR15 a PR16

- PR15 estabiliza imports y wrappers usados.
- Los wrappers muertos están confirmados o quedan documentados para PR16.
- Los wrappers de alto riesgo no se eliminan sin diseño.
- La auditoría muestra reducción de wrappers y `jsImports`.

## Nota final

Este es el documento de transición entre la fase operativa PR15 y la fase consolidación PR16. Usar como guía de avance.
