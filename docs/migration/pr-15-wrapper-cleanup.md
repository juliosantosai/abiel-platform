# PR 15 - Wrapper Cleanup y Estabilización de Imports

## Objetivo

Eliminar wrappers legacy y consolidar importaciones en `src` para que el código use directamente los artefactos TS migrados cuando la validación de módulo a módulo lo permita.

## Contexto

Con PR14 se documentó la auditoría de wrappers y la dependencia actual de `.js` en el repositorio. En este momento el proyecto tiene:

- `160` wrappers TS detectados con patrón legacy.
- `289` archivos JS y `299` archivos TS en `src`.
- `73` importaciones que resuelven directamente a `.js` de `737` importaciones analizadas (`9.9%`).
- `106` wrappers candidatos a revisión sin referencia directa desde el análisis de importación.

## Alcance de este PR

1. Validar y limpiar wrappers en `src/modules` y `src/infrastructure`.
2. Eliminar archivos de wrapper TS que ya no tienen uso o cuyo contenido ya fue absorbido por el artefacto TS real.
3. Actualizar imports que actualmente resuelven a `.js` cuando sean parte de caminos productivos o de tests que ya pueden migrarse a TS.
4. Preservar wrappers solo cuando la ruta de migración no pueda cerrarse de inmediato.

## Priorización de módulos

1. `src/modules/human-intervention` — mayor número de wrappers junto con alta probabilidad de dependencia runtime.
2. `src/modules/usuario`
3. `src/modules/empresa`
4. `src/modules/buffer`
5. `src/modules/api`
6. `src/modules/dashboard`
7. `src/modules/state-machine`
8. `src/modules/ai`
9. `src/modules/whatsapp-sender`

## Criterios de limpieza

- No eliminar un wrapper hasta confirmar que no existe ningún import activo que transporte la dependencia a través de él.
- Si el wrapper es usado solo desde tests, distinguir entre:
  - tests que deberían migrarse a TS y actualizar su importación, y
  - wrappers productivos que todavía sirven a la app en tiempo de ejecución.
- No borrar archivos `.js` hasta que el árbol TS equivalente esté plenamente validado en ese módulo.

## Pasos propuestos

1. Revisar el informe `docs/migration/pr-14-wrapper-audit.md` y tomar la lista de wrappers candidatos.
2. En cada módulo priorizado, ejecutar:
   - `npx jest <módulo> --runInBand` o la suite de tests específica del módulo.
   - `npm run typecheck` sobre el módulo o con paths restringidos.
3. Cambiar imports locales que apunten a `.js` hacia `.ts` cuando la referencia exista y sea válida.
4. Remover wrappers sin uso directo y verificar que no se rompa la importación legacy.
5. Mantener un listado de wrappers aún preservados con motivo explicado en el PR.

## Riesgos y mitigaciones

- Riesgo: eliminar wrappers activos sin detectar imports dinámicos o paths no evidentes.
  - Mitigación: conservar wrappers para el siguiente PR si existen dudas de uso indirecto.
- Riesgo: invalidar rutas de importación en tests que aún se generan en `.js`.
  - Mitigación: migrar primero los tests y luego limpiar los wrappers asociados.
- Riesgo: el código de `src/infrastructure` puede depender de wrappers de `src/modules` en forma transitoria.
  - Mitigación: aplicar la limpieza en orden de dependencia y mantener wrappers en un PR posterior si la ruta no está cerrada.

## Resultados esperados de PR15

- Reducción significativa de wrappers legacy en `src/modules` e `src/infrastructure`.
- Menos importaciones que resuelvan a `.js` y mayor consistencia de árboles TS.
- Base lista para PR16 enfocado en eliminación de JS sobrante y refactorización de imports.

## Notas

- Este PR no debe convertirse en un refactor masivo de lógica, sino en una limpieza controlada de fronteras de importación.
- Si en algún módulo un wrapper no puede eliminarse aún, documentar la razón concreta en el PR para evitar regresiones futuras.
- Mantener la dependencia sobre `docs/migration/pr-14-wrapper-audit.md` como referencia de la decisión.
