# Módulo Dashboard

## Propósito

**Backend**: Proporciona endpoints REST para métricas, estadísticas y datos de monitoreo del sistema.
**Frontend** (futuro): Interfaz web para administradores, operadores y owners de empresas.

**Responsabilidades backend**:
- Agregar datos de otros módulos (Empresa, Usuario, ConversationSession, etc)
- Exponer endpoints de métricas (GET /api/dashboard/metricas)
- Consumir eventos de dominio para actividad reciente
- Validar acceso según rol/tenant

**Usuarios objetivo**:
- Administradores SaaS (visión global)
- Owners de empresas (gestión de su tenant)
- Operadores (monitoreo de conversaciones)

---

## Modelo de dominio

**Entidad: DashboardMetrics**

| Campo | Tipo | Descripción |
|-------|------|----------|
| id | string | UUID único |
| empresaId | string | Empresa propietaria |
| fecha | Date | Timestamp de generación |
| empresasMetricas | object | Totales por estado |
| usuariosMetricas | object | Totales por rol |
| conversacionesMetricas | object | Totales por estado |
| actividadReciente | Activity[] | Últimas 10 actividades |

**Value Objects**:
- `MetricasEmpresa` (valida totales, estados válidos)
- `MetricasUsuario` (valida roles válidos)
- `MetricasConversacion` (valida estados válidos)

---

## Casos de uso

### 1. ObtenerMetricasGlobales
**Entrada**: empresaId (del token JWT)
**Salida**: DashboardMetrics
**Errores**: NotFoundError

**Lógica**:
- Obtiene totales de Empresa por estado
- Obtiene totales de Usuario por rol (filtrado por empresa)
- Obtiene totales de ConversationSession por estado (filtrado por empresa)
- Obtiene últimas 10 actividades de la empresa
- Retorna agregado con timestamp

### 2. ObtenerActividadReciente
**Entrada**: empresaId, limit (1-100)
**Salida**: Activity[]
**Errores**: ValidationError si limit > 100

**Lógica**:
- Consulta historial de eventos de dominio
- Filtra por empresa
- Retorna últimas N actividades

---

## Endpoints HTTP

### GET /api/dashboard/metricas
Retorna métricas globales de la empresa autenticada.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "empresaId": "uuid",
    "empresasMetricas": {
      "total": 10,
      "ACTIVA": 8,
      "SUSPENDIDA": 1,
      "CANCELADA": 1
    },
    "usuariosMetricas": {
      "total": 25,
      "ADMIN": 2,
      "SUPERVISOR": 5,
      "AGENTE": 15,
      "CLIENTE": 3
    },
    "conversacionesMetricas": {
      "total": 150,
      "INICIADA": 50,
      "EN_PROGRESO": 80,
      "FINALIZADA": 15,
      "BLOQUEADA": 5
    },
    "actividadReciente": [...],
    "generadoEn": "2026-07-16T10:30:00Z"
  }
}
```

### GET /api/dashboard/actividad?limit=20
Retorna historial de actividades recientes.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tipo": "EmpresaCreada",
      "empresaId": "uuid",
      "usuario": "usuario@empresa.com",
      "datos": { "nombre": "Nueva Empresa" },
      "timestamp": "2026-07-16T10:30:00Z"
    }
  ]
}
```

---

## Vistas planificadas (Frontend)

### Gestión de empresas (Admin SaaS)

| Vista | Descripción |
|-------|-------------|
| Lista de empresas | Estado, plan, fecha de creación, actividad reciente |
| Detalle de empresa | Información completa, usuarios, métricas |
| Crear / editar empresa | Formulario con validación |
| Cambiar estado | Activar / Suspender / Cancelar |

### Gestión de usuarios

| Vista | Descripción |
|-------|-------------|
| Lista de usuarios | Filtro por rol, estado, empresa |
| Detalle de usuario | Actividad, rol, estado |
| Crear / editar usuario | Formulario |
| Cambiar estado | Activar / Suspender / Cancelar |

### Panel de conversaciones

| Vista | Descripción |
|-------|-------------|
| Bandeja de conversaciones | Por estado: BOT_ACTIVE, HUMAN_ACTIVE, HUMAN_LOCKED |
| Detalle de conversación | Historial, estado actual, botones de acción |
| Tomar control | Disparar `BloquearConversacionUseCase` |
| Devolver al bot | Disparar `ReanudarBotUseCase` |

### Métricas (futuro)

| Métrica | Descripción |
|---------|-------------|
| Mensajes procesados | Por empresa, por día |
| Tiempo de respuesta | Promedio del LLM |
| Intervenciones humanas | Frecuencia por empresa |
| Tasa de cierre | Flujos completados vs iniciados |

---

## Arquitectura del dashboard

```
Dashboard (SPA o SSR)
       │
       ↓
API Module (HTTP)
       │
       ↓
Use Cases
       │
       ↓
Dominio + Infraestructura
```

El dashboard no accede directamente a la base de datos ni a los módulos de negocio. Todo pasa por la API.

---

## Tecnología (a definir)

- **Frontend:** React / Next.js (por confirmar)
- **Estado:** React Query para sincronización con la API
- **Autenticación:** JWT almacenado en httpOnly cookie
- **Tiempo real:** WebSocket o Server-Sent Events para actualizaciones de conversaciones

---

## Consideraciones de seguridad

- El dashboard no almacena datos sensibles en localStorage.
- Todas las acciones validan tenant isolation a nivel de API.
- Los roles del sistema controlan qué vistas y acciones están disponibles para cada usuario.
