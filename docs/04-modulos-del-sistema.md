# 04 - Módulos del Sistema

# Objetivo

Este documento define la estructura y organización de los módulos de Abiel Core.

Cada módulo representa un Bounded Context y encapsula una parte específica del dominio del negocio.

Todos los módulos deberán seguir exactamente la misma estructura para mantener la consistencia del proyecto.

---

# ¿Qué es un módulo?

Un módulo es una unidad funcional independiente que contiene todo lo necesario para resolver un problema del negocio.

Cada módulo posee:

- Su propio dominio.
- Sus propios casos de uso.
- Su propia infraestructura.
- Sus propios puntos de entrada.
- Sus propias pruebas.

Un módulo nunca dependerá de la implementación interna de otro módulo.

---

# Principios

Todos los módulos deberán cumplir las siguientes reglas:

- Una única responsabilidad de negocio.
- Bajo acoplamiento.
- Alta cohesión.
- Independencia tecnológica.
- Comunicación mediante contratos o eventos.
- Sin dependencias circulares.

---

# Estructura General

Cada módulo tendrá la siguiente estructura:

empresa/

├── domain/
├── application/
├── infrastructure/
├── interfaces/
└── tests/

La estructura será idéntica para todos los módulos del sistema.

---

# Capa Domain

La carpeta **domain** contiene las reglas del negocio.

Aquí viven los elementos más importantes del sistema.

Contendrá:

- Entidades
- Value Objects
- Agregados
- Eventos de Dominio
- Interfaces de Repositorios
- Servicios de Dominio
- Excepciones del Dominio

Esta capa nunca dependerá de ninguna otra.

---

# Capa Application

La carpeta **application** coordina la ejecución de los casos de uso.

Contendrá:

- Casos de Uso
- DTOs
- Interfaces de Entrada (si fueran necesarias)
- Validaciones de aplicación

No contendrá reglas de negocio complejas.

---

# Capa Infrastructure

La carpeta **infrastructure** implementa los contratos definidos por el dominio.

Aquí vivirán:

- Repositorios Prisma
- Adaptadores
- Mapeadores
- Persistencia
- Integraciones externas

Toda dependencia técnica pertenece a esta capa.

---

# Capa Interfaces

La carpeta **interfaces** representa los puntos de entrada del módulo.

Ejemplos:

- Controllers
- Routes
- Webhooks
- CLI
- Consumers de eventos

Su responsabilidad es transformar las solicitudes externas en llamadas a los casos de uso.

---

# Carpeta Tests

Cada módulo tendrá sus propias pruebas.

Se organizarán por tipo.

Ejemplo:

tests/

├── unit/
├── integration/
└── e2e/

Las pruebas siempre estarán cercanas al módulo que verifican.

---

# Comunicación entre módulos

Los módulos no accederán directamente a:

- Entidades
- Repositorios
- Base de datos
- Infraestructura

La comunicación permitida será:

- Casos de uso públicos.
- Eventos de dominio.

Esto garantiza independencia entre contextos.

---

# Dependencias Permitidas

Las dependencias dentro de un módulo seguirán la siguiente dirección:

Interfaces

↓

Application

↓

Domain

Infrastructure

↓

Domain

Nunca se permitirá que el dominio dependa de infraestructura.

---

# Responsabilidad de cada módulo

Cada módulo deberá ser responsable únicamente de su parte del negocio.

Ejemplo:

Empresa

Responsable de:

- Registro
- Estado
- Configuración
- Plan

No será responsable de:

- Usuarios
- Mensajes
- Facturación

Cada problema pertenece a un único contexto.

---

# Incorporación de un nuevo módulo

Cuando se agregue un nuevo módulo se deberán seguir estos pasos:

1. Crear el Bounded Context.
2. Definir el dominio.
3. Crear entidades.
4. Crear Value Objects.
5. Definir eventos.
6. Crear interfaces de repositorio.
7. Implementar casos de uso.
8. Implementar infraestructura.
9. Crear interfaces.
10. Escribir pruebas.

No se permitirá alterar este orden.

---

# Beneficios

Mantener una estructura uniforme proporciona:

- Mayor facilidad de mantenimiento.
- Curva de aprendizaje reducida.
- Desarrollo paralelo por equipos.
- Mejor organización del código.
- Menor riesgo de errores arquitectónicos.
- Escalabilidad del proyecto.

---

# Conclusión

Cada módulo de Abiel Core será una unidad de negocio completamente independiente, organizada bajo los principios de DDD, Arquitectura Hexagonal y Clean Architecture.

La uniformidad en la estructura permitirá que el sistema crezca de forma ordenada y sostenible, facilitando la incorporación de nuevas funcionalidades y nuevos desarrolladores.