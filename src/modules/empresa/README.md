# Empresa Module

## Descripción

El módulo Empresa administra el ciclo de vida de las empresas dentro de Abiel Core.

Es responsable de identificar la empresa propietaria de un mensaje, validar su estado y permitir o bloquear el procesamiento de eventos según las reglas del negocio.

---

## Responsabilidades

- Crear empresas.
- Actualizar empresas.
- Buscar empresas por ID o instancia.
- Validar el estado de una empresa.
- Verificar la suscripción.
- Gestionar la configuración de la empresa.
- Publicar eventos del dominio.

---

## Casos de uso

- CrearEmpresa
- ObtenerEmpresa
- ActualizarEmpresa
- EliminarEmpresa
- BuscarPorInstancia
- ValidarEmpresa
- SuspenderEmpresa
- ReactivarEmpresa

---

## Eventos consumidos

| Evento | Descripción |
|---------|-------------|
| message.received | Recibe un mensaje para validar la empresa propietaria. |

---

## Eventos publicados

| Evento | Descripción |
|---------|-------------|
| company.created | Empresa creada. |
| company.updated | Empresa actualizada. |
| company.checked | Empresa validada correctamente. |
| company.suspended | Empresa suspendida. |
| company.subscription.expired | Suscripción vencida. |

---

## Reglas de negocio

- Una instancia pertenece únicamente a una empresa.
- Una empresa suspendida no puede procesar mensajes.
- Una empresa con la suscripción vencida queda bloqueada.
- Toda empresa debe tener una instancia registrada.

---

## Dependencias

- Shared
- Event Bus

---

## Flujo

```text
Webhook
    │
    ▼
message.received
    │
    ▼
Empresa
    │
    ├── company.checked
    └── company.subscription.expired
```

---

## Estructura

```text
empresa/
├── application/
├── domain/
├── infrastructure/
├── events/
├── tests/
└── README.md
```

---

## Estado

**En desarrollo**