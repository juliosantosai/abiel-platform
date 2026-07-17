# PR 16 - Eliminación de JS Residual y Consolidación de Imports

## Objetivo

Eliminar los artefactos JS restantes en `src` después de completar la limpieza de wrappers en PR15, consolidando el árbol en una arquitectura TS-first sin dependencias activas a `.js`.

## Contexto

PR15 debe limpiar wrappers legacy y estabilizar los imports. PR16 cierra el ciclo eliminando los archivos JS duplicados que ya no son necesarios y actualizando cualquier importación que todavía resuelva a `.js`.

## Alcance

1. Eliminar archivos `.js` residuales en `src` que son duplicados de artefactos TS migrados.
2. Cambiar importaciones explícitas a `.js` por referencias a `.ts` cuando el artefacto TS correspondiente existe.
3. Actualizar pruebas y rutas internas para que no dependan de archivos JS legacy.
4. Confirmar que `tsc`, `jest` y `npm run arch:check` pasen después de la limpieza.

## Pasos

1. Partir del estado final de PR15 y validar que el árbol TS está estable.
2. Buscar en `src` todas las importaciones con sufijo `.js` y clasificarlas en:
   - imports de tests que pueden migrarse a `.ts` de inmediato.
   - imports de runtime que requieren una revisión de dependencia.
3. Reemplazar imports `.js` por `.ts` en el código que ya tiene soporte TS.
4. Eliminar archivos `.js` duplicados y wrappers sobrantes, uno por uno o por módulo, con validación continua.
5. Ejecutar:
   - `npm run typecheck`
   - `npx jest --runInBand` para los módulos afectados
   - `npm run arch:check`
6. Documentar cualquier JS que deba persistir temporalmente junto con la razón técnica.

## Criterios de eliminación

- Solo borrar un archivo `.js` si su equivalente TS está definido y validado.
- No permitir imports con sufijo `.js` dentro de `src` tras PR16.
- Mantener archivos JS fuera de `src` solo si se requiere un adapter compatible con herramientas externas o integraciones legacy.

## Resultados esperados

- Eliminación de la mayoría o la totalidad de archivos JS dentro de `src` que existían solo por wrappers legacy.
- Importaciones limpias hacia `.ts` en el árbol de código fuente.
- Reducción de la deuda técnica de migración y preparación para una futura refactorización TS-only.

## Riesgos y mitigaciones

- Riesgo: eliminar un `.js` aún requerido indirectamente por un import dinámico.
  - Mitigación: verificar con `git grep '\.js' src` y pruebas de integración.
- Riesgo: fallas de `jest` por paths de test aún en `.js`.
  - Mitigación: migrar imports de tests primero y validar por suite.

## Notas

- PR16 solo debe tocar archivos y imports, no cambiar lógica de negocio.
- Si queda JS necesario por reasons de bundling / runtime, documentar su uso en un PR posterior.
- PR16 es el paso natural después de PR15 para cerrar la transición a TS en `src`.
