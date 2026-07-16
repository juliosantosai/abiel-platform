# 09 - Reglas de Desarrollo

# Objetivo

Este documento define las reglas obligatorias de desarrollo para Abiel Core.

Su objetivo es garantizar que todo el código mantenga los principios definidos en la arquitectura:

- Domain-Driven Design (DDD)
- Arquitectura Hexagonal
- Clean Architecture
- SOLID
- Programación Orientada a Objetos
- Event-Driven Architecture

Estas reglas aplican a todos los módulos y funcionalidades del sistema.

---

# Principio Fundamental

Antes de escribir código se debe comprender:

- El problema del negocio.
- El contexto donde pertenece.
- La responsabilidad del módulo.
- La capa correcta donde debe vivir.

No se debe comenzar programando sin haber definido previamente el diseño.

---

# Orden Obligatorio de Desarrollo

Todo nuevo módulo deberá construirse siguiendo este orden:

## 1. Dominio

Primero se define:

- Entidades.
- Value Objects.
- Reglas de negocio.
- Eventos de dominio.
- Interfaces de repositorio.

El dominio representa el conocimiento del negocio.

---

## 2. Aplicación

Después se crean:

- Casos de uso.
- DTOs.
- Orquestadores.

La aplicación coordina el flujo, pero no contiene reglas del negocio.

---

## 3. Infraestructura

Luego se implementa:

- Persistencia.
- Prisma.
- PostgreSQL.
- Servicios externos.
- Adaptadores.

La infraestructura implementa contratos existentes.

---

## 4. Interfaces

Finalmente:

- Controllers.
- Webhooks.
- Entradas externas.

Las interfaces conectan el mundo exterior con los casos de uso.

---

## 5. Pruebas

Todo componente nuevo debe tener pruebas.

---

# Reglas del Dominio

La capa de dominio tiene las siguientes restricciones:

Está permitido:

- Crear entidades.
- Crear Value Objects.
- Crear reglas de negocio.
- Crear eventos.

Está prohibido:

- Importar Prisma.
- Importar bases de datos.
- Importar frameworks.
- Acceder a APIs externas.

Ejemplo incorrecto:

```javascript
class Empresa {

  constructor(prisma){
     this.database = prisma;
  }

}
```

El dominio nunca debe conocer infraestructura.

---

# Reglas de Aplicación

La capa Application debe:

- Coordinar procesos.
- Ejecutar casos de uso.
- Llamar repositorios.
- Publicar eventos.

No debe:

- Contener lógica compleja del negocio.
- Manipular directamente la base de datos.
- Crear dependencias con frameworks.

---

# Reglas de Infraestructura

La infraestructura debe:

- Implementar interfaces.
- Manejar tecnologías externas.
- Resolver detalles técnicos.

Ejemplos:

Permitido:

```
PrismaEmpresaRepository
```

No permitido:

```
Empresa.js usando Prisma
```

---

# Reglas de Interfaces

Las interfaces deben ser simples.

Su responsabilidad:

- Recibir datos externos.
- Validar formato básico.
- Ejecutar casos de uso.
- Devolver respuestas.

No deben contener lógica del negocio.

---

# Reglas de Dependencias

Las dependencias siempre apuntan hacia el centro.

Permitido:

```
Infrastructure

↓

Domain
```

```
Application

↓

Domain
```

No permitido:

```
Domain

↓

Infrastructure
```

---

# Reglas para Nuevas Funcionalidades

Antes de crear una funcionalidad se debe responder:

1. ¿A qué módulo pertenece?
2. ¿Qué problema del negocio resuelve?
3. ¿Qué entidad está involucrada?
4. ¿Qué reglas existen?
5. ¿Genera algún evento?
6. ¿Necesita comunicación con otro módulo?

Si no existe una respuesta clara, no se debe programar todavía.

---

# Reglas para Eventos

Los eventos deben:

- Representar hechos ocurridos.
- Ser inmutables.
- Tener nombres claros.
- Ser independientes.

Ejemplo correcto:

```
EmpresaCreada
```

Ejemplo incorrecto:

```
CrearEmpresaEvent
```

---

# Reglas para Errores

Los errores deben pertenecer a la capa correcta.

Errores del negocio:

```
domain/errors
```

Ejemplo:

```
EmpresaNoPuedeActivarseError
```

Errores técnicos:

```
infrastructure/errors
```

Ejemplo:

```
DatabaseConnectionError
```

No mezclar errores de negocio con errores técnicos.

---

# Reglas para Código

Todo código debe priorizar:

- Claridad.
- Simplicidad.
- Legibilidad.
- Mantenimiento futuro.

Evitar:

- Funciones gigantes.
- Clases con demasiadas responsabilidades.
- Código duplicado.
- Lógica oculta.

---

# Reglas de Git

Los commits deberán ser pequeños y descriptivos.

Formato recomendado:

```
tipo: descripción
```

Ejemplos:

```
feat: crear entidad empresa

fix: corregir validacion de email

test: agregar pruebas empresa
```

Tipos permitidos:

```
feat
fix
refactor
test
docs
chore
```

---

# Revisión de Código

Antes de integrar código se debe verificar:

- ¿Respeta la arquitectura?
- ¿Está en la capa correcta?
- ¿Tiene pruebas?
- ¿Tiene nombres claros?
- ¿Respeta SOLID?
- ¿Introduce dependencias innecesarias?

---

# Decisiones Arquitectónicas

Toda decisión importante deberá documentarse.

Ejemplos:

- Cambio de tecnología.
- Nuevo patrón.
- Nueva dependencia.
- Cambio estructural.

La arquitectura debe evolucionar de forma consciente.

---

# Beneficios

Estas reglas permiten:

- Mantener calidad del código.
- Evitar desorden con el crecimiento.
- Facilitar trabajo en equipo.
- Reducir errores arquitectónicos.
- Mantener la visión original del proyecto.

---

# Conclusión

Las reglas de desarrollo representan el contrato técnico de Abiel Core.

Seguir estas reglas garantiza que cada nueva funcionalidad mantenga la arquitectura limpia, escalable y preparada para el crecimiento futuro.