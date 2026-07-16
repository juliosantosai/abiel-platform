# Architecture Fitness Checks

## Objetivo
Proteger fronteras arquitectonicas de Abiel Core sin cambiar comportamiento funcional.

## Comando
- npm run arch:check
- npm run arch:check:strict
- npm run arch:inventory:wrappers

## Que valida
1. Imports prohibidos entre capas (core, engines, modules, plugins, infrastructure, shared).
2. Dependencias circulares en src.
3. Violaciones de Clean Architecture (domain/application -> infrastructure).
4. Inventario de wrappers legacy.
5. Deteccion de wrappers contaminados (reexport + codigo residual).
6. Contratos implicitos por imports profundos entre capas.

## Salidas
- tmp/architecture-report.json
- docs/arquitectura/wrappers-legacy-inventory.md (cuando se usa arch:inventory:wrappers)

## Criterio CI
- Falla solo en modo strict cuando exista:
  - imports prohibidos
  - violaciones clean architecture
  - ciclos

Excepciones baseline:
- El archivo tools/architecture/layer-rules.json contiene `allowedImportExceptions` para deuda preexistente y wrappers de compatibilidad V1.
- Toda nueva excepcion requiere justificacion arquitectonica y fecha objetivo de retiro.

Advertencias (no bloqueantes por ahora):
- contratos implicitos
- wrappers contaminados

## Deuda Preexistente Conocida
- Existe warning/falla historica fuera de este PR en pruebas de entorno (PORT esperado).
- Existen wrappers contaminados detectados en inventario que deben tratarse en PR dedicado de higiene.
