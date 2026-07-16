# 01 - Principios de Diseño

# Objetivo

Este documento define los principios de diseño que regirán el desarrollo de Abiel Core.

Todas las decisiones de arquitectura, implementación y mantenimiento deberán respetar estos principios para garantizar un sistema escalable, mantenible y fácil de evolucionar.

Estos principios aplican a todos los módulos del proyecto sin excepción.

---

# Domain-Driven Design (DDD)

Abiel Core utilizará Domain-Driven Design como modelo principal para representar el negocio.

El objetivo es que el software refleje fielmente el dominio de la empresa y que las reglas de negocio sean el centro de la aplicación.

Se aplicarán los siguientes patrones:

- Entidades (Entities)
- Objetos de Valor (Value Objects)
- Agregados (Aggregates)
- Repositorios (Repositories)
- Servicios de Dominio (Domain Services)
- Eventos de Dominio (Domain Events)
- Fábricas (Factories), cuando sean necesarias
- Especificaciones (Specifications), cuando aporten valor

Cada módulo representará un Bounded Context independiente.

---

# Arquitectura Hexagonal

Abiel Core implementará el patrón Ports and Adapters (Arquitectura Hexagonal).

El dominio nunca dependerá de tecnologías externas.

Las dependencias siempre apuntarán hacia el dominio.

Los adaptadores serán responsables de conectar el sistema con tecnologías como:

- PostgreSQL
- Prisma
- APIs externas
- Redis
- Sistemas de mensajería
- Servicios de terceros

---

# Clean Architecture

La arquitectura seguirá el principio de inversión de dependencias.

Las capas internas nunca conocerán las capas externas.

El dominio será completamente independiente de:

- Frameworks
- Base de datos
- Librerías
- Interfaces gráficas
- Protocolos de comunicación

Esto permitirá reemplazar tecnologías sin modificar las reglas del negocio.

---

# Principios SOLID

Todo el código deberá respetar los cinco principios SOLID.

## Single Responsibility Principle (SRP)

Cada clase tendrá una única responsabilidad.

Cada archivo deberá tener un único propósito claramente definido.

---

## Open/Closed Principle (OCP)

El sistema deberá estar abierto para extenderse, pero cerrado para modificaciones innecesarias.

Las nuevas funcionalidades deberán incorporarse mediante nuevas clases o implementaciones.

---

## Liskov Substitution Principle (LSP)

Las implementaciones deberán poder sustituir a sus abstracciones sin alterar el comportamiento esperado.

---

## Interface Segregation Principle (ISP)

Las interfaces serán pequeñas y específicas.

No existirán interfaces con responsabilidades excesivas.

---

## Dependency Inversion Principle (DIP)

Las capas superiores dependerán de abstracciones y no de implementaciones concretas.

---

# Programación Orientada a Objetos (POO)

El proyecto utilizará los principios fundamentales de la orientación a objetos.

## Encapsulamiento

Cada objeto protegerá su estado interno y expondrá únicamente el comportamiento necesario.

## Abstracción

Cada clase ocultará los detalles internos de implementación.

## Herencia

Solo se utilizará cuando represente correctamente una relación "es un".

No se utilizará para reutilizar código de forma indiscriminada.

## Polimorfismo

Las implementaciones podrán intercambiarse respetando los contratos definidos por las interfaces.

---

# Event-Driven Architecture

Abiel Core utilizará eventos de dominio para comunicar módulos.

Los eventos representan hechos que ya ocurrieron dentro del sistema.

Ejemplos:

- EmpresaCreada
- EmpresaActivada
- UsuarioRegistrado
- ConversacionFinalizada

Los eventos no ejecutan lógica de negocio.

Su responsabilidad es informar que una acción ya ocurrió.

---

# Persistencia Tradicional

Aunque se utilizarán eventos, la fuente oficial de información será PostgreSQL.

El flujo será:

1. Ejecutar la lógica de negocio.
2. Persistir los cambios.
3. Publicar los eventos correspondientes.

La persistencia nunca dependerá de los eventos.

---

# Bajo Acoplamiento

Los módulos no conocerán la implementación interna de otros módulos.

La comunicación se realizará únicamente mediante:

- Casos de uso
- Interfaces
- Eventos de dominio

---

# Alta Cohesión

Cada módulo tendrá una única responsabilidad de negocio.

Todas las clases pertenecientes a un módulo deberán colaborar para resolver un mismo problema del dominio.

---

# Convenciones Generales

Durante todo el desarrollo se respetarán las siguientes reglas:

- No mezclar responsabilidades.
- No acceder directamente a la base de datos desde los controladores.
- No colocar lógica de negocio en la infraestructura.
- No colocar reglas del negocio en Prisma.
- No depender directamente de librerías externas desde el dominio.
- Mantener una estructura uniforme en todos los módulos.

---

# Beneficios

La aplicación consistente de estos principios permitirá:

- Código fácil de mantener.
- Mayor facilidad para realizar pruebas.
- Menor acoplamiento entre componentes.
- Mayor reutilización.
- Escalabilidad técnica y funcional.
- Facilidad para incorporar nuevos desarrolladores al proyecto.

---

# Conclusión

Los principios definidos en este documento constituyen las reglas fundamentales de desarrollo de Abiel Core.

Toda nueva funcionalidad deberá respetar estos lineamientos para garantizar la coherencia arquitectónica y la evolución sostenible del sistema.