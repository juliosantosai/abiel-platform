# PR: Core Boundary Hardening + Architecture Fitness Checks

## Resumen
Este PR agrega guardrails de arquitectura sin modificar comportamiento funcional.

## Auditoria de Dependencias (snapshot)
Fuente: tmp/architecture-report.json

- Files scanned: 191
- Edges internos: 281
- Imports prohibidos (bloqueantes): 0
- Violaciones clean architecture (bloqueantes): 0
- Ciclos (bloqueantes): 0
- Wrappers legacy: 58
- Wrappers contaminados: 17
- Contratos implicitos detectados: 57

## Reglas de Capas
Definidas en tools/architecture/layer-rules.json.

- core -> core
- engines -> core, engines, shared
- modules -> core, engines, modules, shared
- plugins -> core, engines, plugins, shared
- infrastructure -> core, engines, modules, plugins, infrastructure, shared
- shared -> core, shared

## Excepciones Baseline
Se permiten solo excepciones explicitas y trazables en:
- tools/architecture/layer-rules.json (allowedImportExceptions)

Objetivo: evitar falsos positivos por compatibilidad V1 y bloquear toda nueva violacion.

## Validaciones de CI
Workflow agregado:
- .github/workflows/architecture-fitness.yml

Pipeline:
1. npm ci
2. npm run arch:inventory:wrappers
3. npm run arch:check:strict

## Compatibilidad
- No se movieron carpetas.
- No se eliminaron wrappers.
- No se cambiaron flujos funcionales.
- V1 se mantiene.

## Deuda Preexistente Registrada (no corregida en este PR)
1. Wrappers contaminados con codigo residual en la misma linea: 17.
2. Contratos implicitos por imports profundos entre capas: 57.
3. Falla historica de test de entorno PORT (fuera del alcance del PR).

## Proximo PR Recomendado
Wrapper Hygiene Safety Pass:
- limpiar wrappers contaminados a reexport puro,
- sin eliminar rutas legacy,
- sin cambios de comportamiento.
