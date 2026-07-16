# Estructura y convenciones

## Estructura de carpetas

```
abiel-core/
├── src/
│   ├── modules/
│   │   ├── empresa/
│   │   ├── usuario/
│   │   └── human-intervention/
│   └── shared/
│       ├── config/
│       ├── database/
│       ├── errors/
│       ├── events/
│       ├── logger/
│       ├── tenant/
│       └── uuid/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/
├── package.json
└── ROADMAP.md
```

## Estructura interna de un módulo

```
modulo/
├── domain/
│   ├── entities/          EntidadPrincipal.js + .test.js
│   ├── valueObjects/      ValueObject.js + .test.js
│   ├── events/            EventoNombre.js
│   └── repositories/      RepositorioContrato.js
├── application/
│   ├── use-cases/         CasoDeUso.js + .test.js
│   └── workers/           Worker.js + .test.js
├── infrastructure/
│   ├── persistence/       PrismaRepo.js + FakeRepo.js + tests
│   └── adapters/          Adapter.js + .test.js
└── interfaces/
```

## Convenciones de nombres

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Archivos JS | PascalCase | `ConversationSession.js` |
| Clases | PascalCase | `class ConversationSession` |
| Métodos | camelCase | `detectarIntervencionHumana()` |
| Variables | camelCase | `ultimaIntervencion` |
| Constantes | UPPER_SNAKE | `BOT_ACTIVE` |
| Tests | mismo nombre + `.test.js` | `ConversationSession.test.js` |
| Eventos | PascalCase en pasado | `HumanInterventionDetected` |
| Use cases | PascalCase + `UseCase` | `CrearConversationSessionUseCase` |

## Rutas de import desde un use case

Desde `src/modules/modulo/application/use-cases/`:

```js
require("../../../../shared/errors/NotFoundError")   // shared
require("../../domain/entities/MiEntidad")           // dominio propio
require("../../domain/events/MiEvento")              // eventos propios
require("../../infrastructure/persistence/FakeRepo") // infra propia (solo tests)
```

## Modelos Prisma actuales

```prisma
model Empresa             { id, nombre, email, estado, plan, ... }
model Usuario             { id, empresaId, nombre, email, rol, estado, ... }
model ConversationSession { id, empresaId, clienteId, estado, ... }
```
