# Auditoría de alineación Usuario v1.0

## Alcance

Este documento complementa la documentación del módulo Usuario y deja explícito el estado real del diseño actual.

## Roles oficiales

Los roles implementados en el dominio son:

- OWNER
- ADMIN
- OPERADOR
- LECTOR

## Estados oficiales

Los estados implementados en el dominio son:

- PENDIENTE
- ACTIVO
- SUSPENDIDO
- CANCELADO

## Reglas de tenant

- Todo usuario debe pertenecer a una empresa.
- Un usuario no debe poder cambiar de empresa de forma implícita.
- La separación por empresa debe respetarse en todos los repositorios y en la capa de aplicación.

## Notas de implementación

- El dominio no depende de Prisma ni de infraestructura.
- La application coordina dominio, repositorio y eventos.
- La infraestructura implementa repositorios concretos para pruebas y persistencia.
- El modelo Prisma Usuario se añadió al esquema para soportar persistencia real.

## Estado recomendado

El módulo está listo para una fase de integración y validación adicional, pero aún requiere validación con base de datos real antes de una liberación completa.
