# 07 - Estructura de Carpetas

# Objetivo

Este documento define la estructura de carpetas oficial de Abiel Core.

La organización del proyecto seguirá los principios de:

- Domain-Driven Design (DDD)
- Arquitectura Hexagonal
- Clean Architecture
- Separación de responsabilidades

La estructura deberá mantenerse consistente durante todo el ciclo de vida del proyecto.

---

# Estructura Principal del Proyecto

La estructura raíz será:

```
abiel-core/

├── src/
├── prisma/
├── docs/
├── tests/
├── scripts/
├── docker/
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

# Carpeta docs/

Contiene toda la documentación arquitectónica y técnica del proyecto.

Ejemplo:

```
docs/

├── 00-arquitectura-general.md
├── 01-principios-de-diseno.md
├── 02-arquitectura-hexagonal.md
├── 03-bounded-contexts.md
├── 04-modulos-del-sistema.md
├── 05-flujo-entre-modulos.md
├── 06-flujo-de-eventos.md
└── 07-estructura-de-carpetas.md
```

Responsabilidad:

- Documentación del diseño.
- Decisiones arquitectónicas.
- Guías de desarrollo.

---

# Carpeta src/

Contiene todo el código fuente de la aplicación.

Estructura:

```
src/

├── modules/
├── shared/
├── infrastructure/
├── interfaces/
├── config/
└── app.js
```

---

# Carpeta modules/

Contiene todos los Bounded Contexts del sistema.

Ejemplo:

```
modules/

├── empresa/
├── usuario/
├── ia/
├── conversacion/
├── mensaje/
├── canal/
├── conocimiento/
├── suscripcion/
├── facturacion/
├── notificaciones/
├── automatizacion/
└── auditoria/
```

Cada carpeta representa un módulo independiente.

---

# Estructura interna de un módulo

Todos los módulos tendrán la misma estructura.

Ejemplo:

```
empresa/

├── domain/
├── application/
├── infrastructure/
├── interfaces/
└── tests/
```

---

# Carpeta domain/

Contiene la lógica principal del negocio.

Estructura:

```
domain/

├── entities/
├── valueObjects/
├── events/
├── repositories/
├── services/
└── errors/
```

Responsabilidades:

## entities/

Contiene las entidades del dominio.

Ejemplo:

```
Empresa.js
```

---

## valueObjects/

Contiene objetos que representan conceptos sin identidad propia.

Ejemplo:

```
Email.js
Plan.js
```

---

## events/

Contiene eventos de dominio.

Ejemplo:

```
EmpresaCreada.js
```

---

## repositories/

Contiene contratos de persistencia.

Ejemplo:

```
EmpresaRepository.js
```

Son interfaces, no implementaciones.

---

## services/

Contiene servicios de dominio cuando una regla no pertenece a una entidad específica.

---

## errors/

Contiene errores propios del dominio.

Ejemplo:

```
EmpresaInvalidaError.js
```

---

# Carpeta application/

Contiene los casos de uso.

Estructura:

```
application/

├── useCases/
├── dto/
└── services/
```

---

## useCases/

Ejemplos:

```
CrearEmpresa.js
ActualizarEmpresa.js
ActivarEmpresa.js
```

Responsabilidad:

Coordinar acciones del negocio.

---

## dto/

Contiene objetos utilizados para transportar información.

Ejemplo:

```
CrearEmpresaDTO.js
```

---

# Carpeta infrastructure/

Contiene implementaciones técnicas.

Estructura:

```
infrastructure/

├── persistence/
├── database/
├── events/
└── external/
```

---

## persistence/

Implementaciones de repositorios.

Ejemplo:

```
PrismaEmpresaRepository.js
```

---

## database/

Configuración de acceso a PostgreSQL.

Ejemplo:

```
PrismaClient.js
```

---

## events/

Implementaciones del sistema de eventos.

Ejemplo:

```
EventBus.js
```

---

## external/

Integraciones externas.

Ejemplo:

```
WhatsAppClient.js
OpenAIClient.js
```

---

# Carpeta interfaces/

Contiene entradas y salidas externas.

Estructura:

```
interfaces/

├── http/
├── webhooks/
├── consumers/
└── cli/
```

---

## http/

Controladores HTTP.

Ejemplo:

```
EmpresaController.js
```

---

## webhooks/

Entradas desde servicios externos.

Ejemplo:

```
WhatsAppWebhook.js
```

---

## consumers/

Consumidores de eventos.

Ejemplo:

```
EmpresaCreadaHandler.js
```

---

# Carpeta shared/

Contiene componentes utilizados por varios módulos.

Ejemplos:

```
shared/

├── errors/
├── events/
├── logger/
├── uuid/
├── utils/
└── constants/
```

---

# Reglas de ubicación

Cada archivo debe estar ubicado según su responsabilidad.

Ejemplos:

Incorrecto:

```
domain/PrismaEmpresaRepository.js
```

Correcto:

```
infrastructure/persistence/PrismaEmpresaRepository.js
```

---

Incorrecto:

```
controller/CrearEmpresa.js
```

Correcto:

```
application/useCases/CrearEmpresa.js
```

---

# Reglas importantes

## No crear carpetas sin responsabilidad clara.

Cada carpeta debe tener una razón arquitectónica.

---

## No mezclar capas.

Ejemplo prohibido:

Un Entity usando Prisma directamente.

---

## No crear archivos genéricos.

Evitar nombres como:

```
helper.js
manager.js
common.js
```

Los nombres deben representar una responsabilidad concreta.

---

# Beneficios

Esta estructura proporciona:

- Fácil navegación.
- Separación clara de responsabilidades.
- Facilidad para incorporar desarrolladores.
- Escalabilidad del código.
- Menor riesgo de errores arquitectónicos.

---

# Conclusión

La estructura de carpetas de Abiel Core será una representación física de la arquitectura del sistema.

Cada ubicación tendrá un propósito definido, permitiendo que el proyecto crezca manteniendo orden, claridad y estándares profesionales.