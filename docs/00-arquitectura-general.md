# 00 - Arquitectura General

## Objetivo

Abiel Core es un SaaS diseñado bajo una arquitectura profesional que permita evolucionar desde un MVP hasta una plataforma empresarial capaz de soportar miles de empresas sin necesidad de reestructurar el sistema.

La arquitectura está basada en principios de ingeniería de software ampliamente utilizados en la industria, priorizando la mantenibilidad, escalabilidad y desacoplamiento entre componentes.

---

# Objetivos de la Arquitectura

La arquitectura de Abiel Core busca cumplir los siguientes objetivos:

- Escalar desde una empresa hasta miles de empresas.
- Mantener un bajo acoplamiento entre módulos.
- Facilitar el mantenimiento y la evolución del sistema.
- Permitir el trabajo simultáneo de múltiples desarrolladores.
- Aislar la lógica de negocio de los detalles técnicos.
- Facilitar la incorporación de nuevas funcionalidades sin modificar el código existente.
- Preparar la plataforma para una futura migración a microservicios, si el crecimiento del negocio lo requiere.

---

# Estilo Arquitectónico

Abiel Core adopta un **Monolito Modular (Modular Monolith)** como arquitectura principal.

Este enfoque permite mantener una única aplicación y una única base de datos, mientras organiza el sistema en módulos independientes y desacoplados.

Cada módulo representa un contexto de negocio (Bounded Context) y posee su propia estructura interna.

Esta decisión reduce la complejidad inicial del proyecto y permite evolucionar de forma ordenada conforme aumentan los requerimientos.

---

# Tecnologías Base

La plataforma utilizará las siguientes tecnologías:

- Node.js
- JavaScript (CommonJS)
- PostgreSQL
- Prisma ORM
- Jest para pruebas
- Docker para despliegue
- Git para control de versiones

Estas tecnologías forman la base técnica sobre la que se implementará toda la arquitectura.

---

# Principios Arquitectónicos

Toda decisión técnica dentro del proyecto deberá respetar los siguientes principios:

- Domain-Driven Design (DDD)
- Arquitectura Hexagonal (Ports & Adapters)
- Clean Architecture
- Principios SOLID
- Programación Orientada a Objetos (POO)
- Event-Driven Architecture mediante Eventos de Dominio
- Persistencia tradicional utilizando PostgreSQL

Estos principios serán aplicados de forma consistente en todos los módulos del sistema.

---

# Organización General

La arquitectura se organiza en módulos independientes.

Cada módulo contiene su propia lógica de negocio y mantiene una separación clara entre:

- Dominio
- Aplicación
- Infraestructura
- Interfaces

Ningún módulo accederá directamente a la implementación interna de otro módulo.

La comunicación entre módulos se realizará mediante casos de uso o eventos de dominio.

---

# Flujo General

El flujo de una solicitud dentro del sistema será el siguiente:

Cliente

↓

Interfaces

↓

Aplicación

↓

Dominio

↓

Repositorio

↓

Base de Datos

↓

Eventos de Dominio

↓

Otros módulos reaccionan si es necesario

---

# Beneficios de esta Arquitectura

Esta arquitectura proporciona los siguientes beneficios:

- Alta mantenibilidad.
- Alta escalabilidad.
- Bajo acoplamiento.
- Alta cohesión.
- Código fácil de probar.
- Facilidad para incorporar nuevos módulos.
- Independencia entre las reglas del negocio y la infraestructura.
- Preparación para crecimiento futuro.

---

# Evolución de la Plataforma

Aunque Abiel Core comenzará como un monolito modular, su diseño permitirá evolucionar hacia una arquitectura distribuida si el crecimiento del negocio lo requiere.

Gracias al desacoplamiento entre módulos, será posible extraer uno o varios contextos como microservicios sin modificar la lógica del dominio.

Esta estrategia reduce el riesgo técnico y evita realizar una migración completa de la plataforma.

---

# Alcance de la Fase 0

Durante la Fase 0 se definirá completamente la arquitectura del sistema antes de escribir cualquier lógica de negocio.

Esta documentación servirá como referencia para todas las fases posteriores del desarrollo.

No se implementará código funcional hasta finalizar y aprobar toda la documentación arquitectónica.

---

# Conclusión

La arquitectura de Abiel Core ha sido diseñada para construir una plataforma robusta, mantenible y escalable, siguiendo estándares profesionales de ingeniería de software.

Todas las decisiones de diseño tomadas durante el desarrollo deberán respetar los principios establecidos en este documento para garantizar la coherencia y evolución del sistema a largo plazo.