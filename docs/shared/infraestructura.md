# Shared — Infraestructura

## Database (prisma.js)

Singleton de PrismaClient con adaptador pg para conexión a PostgreSQL.

```js
const prisma = require("./database/prisma");
await prisma.empresa.findUnique({ where: { id } });
```

La conexión usa `DATABASE_URL` del entorno. El cliente expone también `prisma.disconnect()` para cerrar pool y cliente.

## Config (env.js)

Variables de entorno con valores por defecto:

| Variable       | Default        |
|----------------|----------------|
| NODE_ENV       | development    |
| APP_NAME       | abiel-core     |
| PORT           | 3000           |
| DATABASE_URL   | (requerida)    |

## Logger

Singleton silencioso en NODE_ENV=test. Usa console.log/error/warn en producción.

```js
const Logger = require("./logger/Logger");
Logger.info("mensaje", { contexto });
Logger.error("fallo", error);
Logger.warn("advertencia");
```

Para crear un logger con silencio explícito:

```js
const { Logger } = require("./logger/Logger");
const logger = new Logger({ silent: true });
```

## UuidGenerator

Genera UUIDs v4 usando la función nativa `crypto.randomUUID()`.

```js
const gen = new UuidGenerator();
const id = gen.generate(); // "550e8400-e29b-41d4-a716-446655440000"
```
