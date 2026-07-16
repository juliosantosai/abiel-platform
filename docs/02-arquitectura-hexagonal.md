# 02 - Arquitectura Hexagonal

# Objetivo

Este documento define cómo se implementará la Arquitectura Hexagonal (Ports & Adapters) en Abiel Core.

El objetivo principal es aislar la lógica de negocio de cualquier tecnología externa, permitiendo que el dominio permanezca independiente de frameworks, bases de datos, APIs o librerías.

La Arquitectura Hexagonal será aplicada de forma uniforme en todos los módulos del sistema.

---

# ¿Qué es la Arquitectura Hexagonal?

La Arquitectura Hexagonal, también conocida como Ports & Adapters, propone que el dominio sea el centro de la aplicación.

Todo acceso al dominio se realiza mediante puertos (Ports).

Toda integración con tecnologías externas se realiza mediante adaptadores (Adapters).

De esta forma, el dominio nunca depende de la infraestructura.

---

# Principio Fundamental

Las dependencias siempre apuntan hacia el dominio.

Nunca en sentido contrario.

Esto significa que:

- El dominio no conoce Prisma.
- El dominio no conoce PostgreSQL.
- El dominio no conoce Express.
- El dominio no conoce Redis.
- El dominio no conoce APIs externas.

La infraestructura conoce al dominio.

Nunca al revés.

---

# Capas de la Arquitectura

Cada módulo estará compuesto por cuatro capas principales.

## Dominio (Domain)

Es el núcleo del negocio.

Contiene únicamente reglas de negocio.

Incluye:

- Entidades
- Value Objects
- Agregados
- Eventos de Dominio
- Servicios de Dominio
- Interfaces de Repositorios
- Excepciones del Dominio

El dominio nunca depende de otra capa.

---

## Aplicación (Application)

La capa de aplicación coordina el dominio.

Su responsabilidad es ejecutar casos de uso.

Ejemplos:

- Crear Empresa
- Actualizar Empresa
- Activar Empresa
- Cambiar Plan

No implementa reglas de negocio complejas.

Orquesta el trabajo entre entidades, repositorios y eventos.

---

## Infraestructura (Infrastructure)

Implementa los contratos definidos por el dominio.

Ejemplos:

- Prisma
- PostgreSQL
- Logger
- EventBus
- Redis
- Servicios externos

Toda tecnología vive aquí.

---

## Interfaces (Interfaces)

Representan los puntos de entrada al sistema.

Ejemplos:

- REST API
- Webhooks
- CLI
- Cron Jobs
- Mensajería

Su única responsabilidad es recibir solicitudes y delegarlas a la aplicación.

---

# Puertos (Ports)

Los puertos representan contratos definidos por el dominio o la aplicación.

Ejemplos:

- EmpresaRepository
- EventPublisher
- Logger

Los puertos no contienen implementación.

Solo definen el comportamiento esperado.

---

# Adaptadores (Adapters)

Los adaptadores implementan los puertos.

Ejemplos:

- PrismaEmpresaRepository
- ConsoleLogger
- PostgresEventStore

Si en el futuro se cambia Prisma por otro ORM, únicamente se reemplaza el adaptador.

El dominio permanece intacto.

---

# Flujo de una Solicitud

El recorrido de una solicitud será el siguiente:

Cliente

↓

Controller

↓

Caso de Uso

↓

Entidad

↓

Repositorio (Puerto)

↓

Repositorio Prisma (Adaptador)

↓

PostgreSQL

↓

Evento de Dominio

↓

EventBus

↓

Otros módulos

---

# Reglas de Dependencia

Las dependencias permitidas son:

Interfaces → Application

Application → Domain

Infrastructure → Domain

Infrastructure → Application

Las siguientes dependencias están prohibidas:

Domain → Infrastructure

Domain → Interfaces

Application → Interfaces

Infrastructure → Interfaces

Esto garantiza un bajo acoplamiento y una alta independencia del dominio.

---

# Beneficios

Aplicar Arquitectura Hexagonal aporta:

- Independencia tecnológica.
- Mayor facilidad para realizar pruebas.
- Reemplazo sencillo de tecnologías.
- Bajo acoplamiento.
- Alta mantenibilidad.
- Mayor escalabilidad.

---

# Ejemplo de Evolución

Supongamos que actualmente utilizamos Prisma.

En el futuro decidimos utilizar otro ORM.

Solo será necesario reemplazar el adaptador correspondiente.

El dominio, los casos de uso y los controladores permanecerán sin cambios.

Esto demuestra el beneficio de depender de abstracciones y no de implementaciones concretas.

---

# Reglas del Proyecto

En Abiel Core siempre se cumplirán las siguientes reglas:

- Toda lógica de negocio pertenece al dominio.
- Ningún controlador accederá directamente a la base de datos.
- Ninguna entidad conocerá Prisma.
- Ningún caso de uso conocerá PostgreSQL.
- Toda dependencia externa será implementada mediante adaptadores.
- Todo acceso al dominio será realizado mediante casos de uso.

---

# Conclusión

La Arquitectura Hexagonal constituye la base estructural de Abiel Core.

Gracias a esta arquitectura, el dominio permanecerá aislado de la infraestructura, facilitando el mantenimiento, las pruebas y la evolución tecnológica del sistema durante toda su vida útil.