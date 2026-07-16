# PR 01 - Infrastructure HTTP Migration

## Objetivo

Preparar la arquitectura destino moviendo solo la infraestructura HTTP desde `src/modules/api` a `src/infrastructure/api` sin cambiar comportamiento de V1.

## Archivos movidos

- `src/modules/api/infrastructure/ExpressApp.js` -> `src/infrastructure/api/infrastructure/ExpressApp.js`
- `src/modules/api/infrastructure/ExpressApp.test.js` -> `src/infrastructure/api/infrastructure/ExpressApp.test.js`
- `src/modules/api/infrastructure/runApiMock.js` -> `src/infrastructure/api/infrastructure/runApiMock.js`
- `src/modules/api/interfaces/controllers/ConversationControlController.js` -> `src/infrastructure/api/interfaces/controllers/ConversationControlController.js`
- `src/modules/api/interfaces/controllers/ConversationControlController.test.js` -> `src/infrastructure/api/interfaces/controllers/ConversationControlController.test.js`
- `src/modules/api/interfaces/controllers/EmpresaController.js` -> `src/infrastructure/api/interfaces/controllers/EmpresaController.js`
- `src/modules/api/interfaces/controllers/EmpresaController.test.js` -> `src/infrastructure/api/interfaces/controllers/EmpresaController.test.js`
- `src/modules/api/interfaces/controllers/UsuarioController.js` -> `src/infrastructure/api/interfaces/controllers/UsuarioController.js`
- `src/modules/api/interfaces/controllers/UsuarioController.test.js` -> `src/infrastructure/api/interfaces/controllers/UsuarioController.test.js`
- `src/modules/api/interfaces/middleware/auth.js` -> `src/infrastructure/api/interfaces/middleware/auth.js`
- `src/modules/api/interfaces/middleware/auth.test.js` -> `src/infrastructure/api/interfaces/middleware/auth.test.js`
- `src/modules/api/interfaces/middleware/rateLimit.js` -> `src/infrastructure/api/interfaces/middleware/rateLimit.js`
- `src/modules/api/interfaces/middleware/rateLimit.test.js` -> `src/infrastructure/api/interfaces/middleware/rateLimit.test.js`
- `src/modules/api/interfaces/routes/conversacionesRoutes.js` -> `src/infrastructure/api/interfaces/routes/conversacionesRoutes.js`
- `src/modules/api/interfaces/routes/empresasRoutes.js` -> `src/infrastructure/api/interfaces/routes/empresasRoutes.js`
- `src/modules/api/interfaces/routes/usuariosRoutes.js` -> `src/infrastructure/api/interfaces/routes/usuariosRoutes.js`

## Imports modificados

- `app.js` ahora importa `runApiMock` desde `src/infrastructure/api/infrastructure/runApiMock`.
- `src/infrastructure/api/infrastructure/ExpressApp.js` actualiza referencias relativas hacia el módulo `dashboard`.
- `src/infrastructure/api/infrastructure/runApiMock.js` actualiza referencias relativas hacia el módulo `dashboard`.

## Compatibilidad temporal

Se recrearon wrappers en `src/modules/api/**` para reexportar los archivos de `src/infrastructure/api/**` y evitar roturas por imports legacy durante PRs posteriores.

## Tests afectados

- Los tests de API se movieron junto con los archivos fuente al nuevo árbol `src/infrastructure/api/**`.
- `app.js` mantiene el mismo comportamiento y solo cambia la ruta de import.
- No se modificaron tests fuera del árbol HTTP.

## Riesgos encontrados

- Imports relativos profundos hacia `dashboard` y `shared` son frágiles y deben revisarse cuando se ejecute la migración de módulos.
- Los wrappers legacy deben eliminarse en un PR posterior para evitar doble ownership del árbol API.
- La suite actual ya tenía deuda previa no relacionada con este PR, por lo que la validación debe diferenciar roturas de migración vs. fallos preexistentes.