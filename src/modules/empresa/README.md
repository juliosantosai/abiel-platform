# Módulo Empresa

Este módulo implementa las operaciones relacionadas con las empresas dentro de Abiel Core.

## Estructura

- `application/use-cases/` - Casos de uso de la capa de aplicación.
- `domain/entities/` - Entidades del dominio.
- `domain/repositories/` - Contratos de repositorios.
- `domain/events/` - Eventos del dominio.
- `domain/valueObjects/` - Value objects del dominio.
- `infrastructure/persistence/` - Implementaciones de persistencia.
- `interfaces/` - Adaptadores de entrada del módulo.

## Casos de uso

- `CrearEmpresaUseCase`
- `ActualizarEmpresaUseCase`
- `ActivarEmpresaUseCase`
- `SuspenderEmpresaUseCase`
- `CancelarEmpresaUseCase`

## Repositorios

- `EmpresaRepository` (contrato)
- `PrismaEmpresaRepository` (implementación con Prisma)
- `FakeEmpresaRepository` (implementación en memoria para pruebas)
