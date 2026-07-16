# Shared — Visión general

## Propósito

La capa `src/shared/` contiene infraestructura transversal reutilizable por todos los módulos del sistema. No es un bounded context ni contiene lógica de negocio. Es la base técnica sobre la que se construyen los módulos.

## Principios

- Ningún componente shared importa de un módulo específico.
- Cada subcarpeta tiene una responsabilidad única.
- Los componentes son testables de forma aislada.
- Los singletons globales existen por conveniencia pero las clases se exportan para inyección de dependencias.

## Estructura

```
src/shared/
├── config/        env.js             variables de entorno con defaults
├── database/      prisma.js          cliente Prisma singleton con adaptador pg
├── errors/        DomainError        ValidationError    NotFoundError
├── events/        DomainEvent        EventBus           EventPublisher      EventSubscriber
├── logger/        Logger
├── tenant/        TenantContext      TenantGuard        TenantError
└── uuid/          UuidGenerator
```

## Tests

Todos los componentes tienen tests unitarios. Ejecutar:

```
npx jest src/shared --runInBand
```
