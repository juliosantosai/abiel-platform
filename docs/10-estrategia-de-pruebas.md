# 10 - Estrategia de Pruebas

# Objetivo

Este documento define la estrategia oficial de pruebas para Abiel Core.

El objetivo es garantizar que el sistema sea:

- Correcto funcionalmente.
- Seguro ante cambios.
- Fácil de mantener.
- Escalable.
- Confiable durante su evolución.

Las pruebas estarán alineadas con:

- Domain-Driven Design.
- Arquitectura Hexagonal.
- Clean Architecture.
- Separación de responsabilidades.

---

# Principios de Testing

Las pruebas deberán cumplir los siguientes principios:

- Probar comportamiento, no implementación.
- Mantener pruebas simples y claras.
- Cada prueba debe tener una responsabilidad.
- Los errores deben ser detectados lo más cerca posible del origen.
- El dominio debe tener la mayor cobertura.

---

# Pirámide de Pruebas

Abiel Core utilizará la siguiente distribución:

```
              E2E
        ----------------

          Integración
    ------------------------

          Unitarias
------------------------------
```

La mayor cantidad de pruebas estarán en la capa de dominio.

---

# 1. Pruebas Unitarias (Unit Tests)

## Objetivo

Validar pequeñas unidades de código de manera aislada.

Ejemplos:

- Entidades.
- Value Objects.
- Servicios de dominio.
- Casos de uso.

Estas pruebas deben ejecutarse rápidamente.

---

# Pruebas del Dominio

El dominio es la parte más importante del sistema.

Se probarán:

- Creación de entidades.
- Validaciones.
- Cambios de estado.
- Reglas de negocio.
- Eventos generados.

Ejemplo:

Una empresa no puede activarse si no tiene un plan válido.

La prueba debe verificar esa regla.

---

# Pruebas de Value Objects

Se verificará:

- Creación correcta.
- Validaciones.
- Comparaciones.
- Casos inválidos.

Ejemplo:

Email inválido debe generar error.

---

# Pruebas de Casos de Uso

Los casos de uso serán probados utilizando dependencias simuladas.

Ejemplo:

CrearEmpresa:

Debe verificar:

- Que llama al repositorio.
- Que crea la entidad.
- Que publica el evento correcto.

---

# 2. Pruebas de Integración

## Objetivo

Validar que varias partes del sistema funcionan juntas.

Se probarán:

- Repositorios.
- Prisma.
- PostgreSQL.
- EventBus.
- Adaptadores.

---

# Integración con Base de Datos

Estas pruebas verifican:

- Guardado correcto.
- Recuperación de información.
- Actualizaciones.
- Eliminaciones.

Ejemplo:

Crear Empresa:

Caso de uso

↓

Repositorio Prisma

↓

PostgreSQL

---

# Integración de Eventos

Se verificará:

- Publicación correcta.
- Suscriptores registrados.
- Procesamiento del evento.
- Manejo de errores.

Ejemplo:

EmpresaCreada

↓

EmpresaCreadaHandler

---

# 3. Pruebas End-to-End (E2E)

## Objetivo

Validar el funcionamiento completo desde una entrada externa hasta el resultado final.

Ejemplo:

Usuario crea una empresa.

Flujo:

```
HTTP Request

↓

Controller

↓

Caso de Uso

↓

Dominio

↓

Base de Datos

↓

Evento

↓

Respuesta
```

---

# Organización de Pruebas

Cada módulo tendrá:

```
empresa/

├── domain/
├── application/
├── infrastructure/
├── interfaces/
└── tests/

        ├── unit/
        ├── integration/
        └── e2e/
```

---

# Pruebas por Capa

## Domain

Tipo:

Unitarias

Prueba:

- Entidades.
- Reglas.
- Eventos.

---

## Application

Tipo:

Unitarias

Prueba:

- Casos de uso.
- Orquestación.

---

## Infrastructure

Tipo:

Integración

Prueba:

- Persistencia.
- Servicios externos.

---

## Interfaces

Tipo:

Integración / E2E

Prueba:

- Entradas externas.
- Respuestas.

---

# Mocking

Los mocks se utilizarán solamente cuando sea necesario.

Ejemplo:

Caso de uso:

```
CrearEmpresa
```

Puede usar:

```
FakeEmpresaRepository
```

para evitar depender de PostgreSQL.

---

# Pruebas del Dominio sin Infraestructura

Una característica importante de la arquitectura es que el dominio podrá probarse sin:

- Base de datos.
- Prisma.
- Internet.
- APIs externas.

Esto permite pruebas rápidas y confiables.

---

# Cobertura

La cobertura no será el único objetivo.

Una cobertura alta con pruebas malas no garantiza calidad.

La prioridad será:

1. Reglas críticas del negocio.
2. Casos de error.
3. Flujos importantes.
4. Integraciones principales.

---

# Pruebas y Eventos

Cuando una acción genere un evento se deberá probar:

- Que el evento fue creado.
- Que contiene la información correcta.
- Que los consumidores reaccionan correctamente.

---

# Pruebas de Regresión

Cada nuevo cambio deberá verificar que funcionalidades existentes continúan funcionando.

Especialmente:

- Facturación.
- Conversaciones.
- IA.
- Mensajería.
- Suscripciones.

---

# Automatización

Las pruebas deberán ejecutarse automáticamente mediante:

- Scripts npm.
- Integración continua (CI/CD).
- Pipelines de Git.

---

# Beneficios

Una estrategia correcta de pruebas permite:

- Detectar errores temprano.
- Refactorizar con seguridad.
- Mantener velocidad de desarrollo.
- Evitar regresiones.
- Aumentar la confianza del sistema.

---

# Conclusión

La estrategia de pruebas de Abiel Core estará enfocada en proteger el dominio, validar integraciones y garantizar que el sistema pueda crecer manteniendo calidad profesional.

Las pruebas serán parte del desarrollo desde el inicio, no una actividad posterior.