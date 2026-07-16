# PR 04 - Modules SaaS Cleanup

## Objetivo

Dejar `src/modules` como bounded contexts puros de negocio, moviendo fuera de módulos únicamente la interfaz HTTP de `dashboard`.

## Módulos limpiados

- `dashboard`

## Archivos movidos

- `src/modules/dashboard/interfaces/controllers/DashboardController.js` -> `src/infrastructure/api/interfaces/controllers/DashboardController.js`
- `src/modules/dashboard/interfaces/controllers/DashboardController.test.js` -> `src/infrastructure/api/interfaces/controllers/DashboardController.test.js`
- `src/modules/dashboard/interfaces/routes/dashboardRoutes.js` -> `src/infrastructure/api/interfaces/routes/dashboardRoutes.js`
- `src/modules/dashboard/interfaces/web/dashboard.html` -> `src/infrastructure/api/interfaces/web/dashboard.html`

## Imports modificados

- `src/infrastructure/api/infrastructure/ExpressApp.js` ahora importa `DashboardController` y `dashboardRoutes` desde `src/infrastructure/api/interfaces/**`.
- `src/infrastructure/api/infrastructure/ExpressApp.js` ahora sirve `dashboard.html` desde `src/infrastructure/api/interfaces/web/dashboard.html`.

## Wrappers temporales

Se dejaron wrappers legacy en:

- `src/modules/dashboard/interfaces/controllers/DashboardController.js`
- `src/modules/dashboard/interfaces/routes/dashboardRoutes.js`

No se creó wrapper para `web/dashboard.html` porque el asset no es importado vía `require`; la ruta productiva fue actualizada directamente en `ExpressApp.js`.

## Revisión de duplicidades

### `src/modules/empresa/interfaces/EmpresaController.js`

Se revisó y **no se eliminó**.

Evidencia:

- El controller HTTP activo es `src/infrastructure/api/interfaces/controllers/EmpresaController.js`.
- `src/modules/empresa/interfaces/EmpresaController.js` no es controller HTTP Express: expone métodos `crearEmpresa`, `actualizarEmpresa`, `activarEmpresa`, `suspenderEmpresa`, `cancelarEmpresa` sobre un request plano.
- No se encontró referencia activa a ese archivo en el código de arranque ni en infraestructura HTTP actual.

Decisión:

- Se conserva como fachada interna o artefacto legacy hasta que un PR específico determine si debe renombrarse o eliminarse con evidencia de no uso.

## Duplicidades eliminadas

- Ninguna eliminada físicamente en este PR.
- Se removió la mezcla HTTP dentro de `dashboard`, que era la duplicidad arquitectónica principal frente a `infrastructure/api`.

## Riesgos encontrados

- `dashboard` tenía su interfaz HTTP alojada dentro del módulo, mientras el resto de HTTP ya vivía en `src/infrastructure/api`; esta inconsistencia quedó corregida.
- Los wrappers legacy deben retirarse en un PR futuro para evitar doble ownership temporal.
- La suite mantiene una falla preexistente en `src/shared/config/env.test.js` no relacionada con este PR.

## Decisiones tomadas

- No se movieron Evolution, WhatsApp ni providers LLM en este PR.
- No se tocó `src/modules/empresa/interfaces/EmpresaController.js` por falta de evidencia suficiente para eliminarlo.
- No se modificó lógica de `dashboard`; solo se reubicó su frontera HTTP.