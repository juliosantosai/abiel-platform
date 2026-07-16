# Pruebas del dominio Usuario

## Objetivo

Este documento describe las pruebas unitarias del dominio Usuario y las reglas que deben mantenerse en el modelo de negocio.

## Qué valida el dominio

El dominio Usuario valida:

- que el usuario tenga un identificador válido
- que pertenezca a una empresa
- que tenga nombre, email y rol válidos
- que el estado sea uno de los estados oficiales del módulo
- que las transiciones de estado respeten la regla de negocio

## Reglas probadas

### Creación

Se valida que un usuario pueda crearse correctamente cuando recibe:

- id
- empresaId
- nombre
- email
- rol

Además, se comprueba que el estado inicial sea PENDIENTE.

### Value objects

Se prueban los objetos de valor:

- NombreUsuario
- EmailUsuario
- RolUsuario

Cada uno valida sus reglas propias con ValidationError cuando la entrada es inválida.

### Estados

Las pruebas cubren los siguientes flujos:

- PENDIENTE -> ACTIVO
- PENDIENTE -> CANCELADO
- ACTIVO -> SUSPENDIDO
- ACTIVO -> CANCELADO
- SUSPENDIDO -> ACTIVO
- SUSPENDIDO -> CANCELADO
- CANCELADO -> CANCELADO

También se validan las transiciones prohibidas:

- PENDIENTE -> SUSPENDIDO
- CANCELADO -> ACTIVO
- CANCELADO -> SUSPENDIDO

## Errores esperados

- ValidationError para entradas inválidas o datos obligatorios faltantes
- DomainError para transiciones de estado no permitidas

## Alcance

Estas pruebas están orientadas únicamente al dominio, sin incluir:

- persistencia
- infraestructura
- casos de uso
- controladores
