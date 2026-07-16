const DashboardMetrics = require("../../domain/entities/DashboardMetrics");
const MetricasEmpresa = require("../../domain/valueObjects/MetricasEmpresa");
const MetricasUsuario = require("../../domain/valueObjects/MetricasUsuario");
const MetricasConversacion = require("../../domain/valueObjects/MetricasConversacion");
const DashboardRepository = require("../../domain/repositories/DashboardRepository");
const NotFoundError = require("../../../../shared/errors/NotFoundError");

const prisma = require("../../../../shared/database/prisma");

/**
 * Adaptador Prisma: PrismaDashboardRepository
 * Ejecuta queries agregadas para obtener métricas del dashboard
 */
class PrismaDashboardRepository extends DashboardRepository {
    /**
     * Obtiene métricas globales de una empresa
     */
    async obtenerMetricasGlobales(empresaId) {
        // 1. Contar empresas por estado (solo si el usuario es admin global, sino solo su empresa)
        const empresasCount = await prisma.empresa.groupBy({
            by: ["estado"],
            where: { id: empresaId }, // Limitar a la empresa del usuario
        });

        const empresasMetricas = MetricasEmpresa.desde(this._agruparPorEstado(empresasCount, "estado"));

        // 2. Contar usuarios por rol (de la empresa del usuario)
        const usuariosCount = await prisma.usuario.groupBy({
            by: ["rol"],
            where: { empresaId },
            _count: true,
        });

        const usuariosMetricas = MetricasUsuario.desde(this._agruparPorRol(usuariosCount, "rol"));

        // 3. Contar conversaciones por estado (de la empresa del usuario)
        const conversacionesCount = await prisma.conversationSession.groupBy({
            by: ["estado"],
            where: { empresaId },
            _count: true,
        });

        const conversacionesMetricas = MetricasConversacion.desde(
            this._agruparPorEstadoConversacion(conversacionesCount, "estado")
        );

        // 4. Obtener últimas 10 actividades (simuladas con eventos)
        const actividadReciente = await this._obtenerActividadRecienteInterna(empresaId, 10);

        const metricas = DashboardMetrics.crear({
            empresaId,
            empresasMetricas: empresasMetricas.toJSON(),
            usuariosMetricas: usuariosMetricas.toJSON(),
            conversacionesMetricas: conversacionesMetricas.toJSON(),
            actividadReciente,
        });

        return metricas;
    }

    /**
     * Obtiene historial de actividades recientes
     */
    async obtenerActividadReciente(empresaId, limit = 10) {
        return this._obtenerActividadRecienteInterna(empresaId, limit);
    }

    /**
     * Helper: Agrupa resultados por estado para empresas
     */
    _agruparPorEstado(datos, campo) {
        const resultado = { total: 0 };
        const estadosValidos = ["ACTIVA", "SUSPENDIDA", "CANCELADA", "PENDIENTE"];

        // Inicializar todos los estados en 0
        estadosValidos.forEach((estado) => {
            resultado[estado] = 0;
        });

        // Contar
        datos.forEach((item) => {
            const estado = item[campo];
            if (estadosValidos.includes(estado)) {
                resultado[estado] += item._count;
                resultado.total += item._count;
            }
        });

        return resultado;
    }

    /**
     * Helper: Agrupa resultados por rol para usuarios
     */
    _agruparPorRol(datos, campo) {
        const resultado = { total: 0 };
        const rolesValidos = ["ADMIN", "SUPERVISOR", "AGENTE", "CLIENTE"];

        rolesValidos.forEach((rol) => {
            resultado[rol] = 0;
        });

        datos.forEach((item) => {
            const rol = item[campo];
            if (rolesValidos.includes(rol)) {
                resultado[rol] += item._count || 1;
                resultado.total += item._count || 1;
            }
        });

        return resultado;
    }

    /**
     * Helper: Agrupa resultados por estado para conversaciones
     */
    _agruparPorEstadoConversacion(datos, campo) {
        const resultado = { total: 0 };
        const estadosValidos = ["INICIADA", "EN_PROGRESO", "FINALIZADA", "BLOQUEADA"];

        estadosValidos.forEach((estado) => {
            resultado[estado] = 0;
        });

        datos.forEach((item) => {
            const estado = item[campo];
            if (estadosValidos.includes(estado)) {
                resultado[estado] += item._count || 1;
                resultado.total += item._count || 1;
            }
        });

        return resultado;
    }

    /**
     * Helper: Obtiene actividad reciente simulada
     * TODO: Implementar con tabla de eventos una vez que se agregue a Prisma schema
     */
    async _obtenerActividadRecienteInterna(empresaId, limit) {
        const actividades = [];

        // Últimas empresas creadas
        const empresas = await prisma.empresa.findMany({
            where: { id: empresaId },
            orderBy: { createdAt: "desc" },
            take: 3,
        });

        empresas.forEach((empresa) => {
            actividades.push({
                id: `evt-${empresa.id}`,
                tipo: "EmpresaModificada",
                empresaId: empresa.id,
                usuario: "sistema",
                datos: { nombre: empresa.nombre },
                timestamp: empresa.updatedAt,
            });
        });

        // Últimos usuarios creados
        const usuarios = await prisma.usuario.findMany({
            where: { empresaId },
            orderBy: { createdAt: "desc" },
            take: 3,
        });

        usuarios.forEach((usuario) => {
            actividades.push({
                id: `evt-${usuario.id}`,
                tipo: "UsuarioCreado",
                empresaId: usuario.empresaId,
                usuario: usuario.email,
                datos: { nombre: usuario.nombre, rol: usuario.rol },
                timestamp: usuario.createdAt,
            });
        });

        // Últimas conversaciones
        const conversaciones = await prisma.conversationSession.findMany({
            where: { empresaId },
            orderBy: { createdAt: "desc" },
            take: 3,
        });

        conversaciones.forEach((conversacion) => {
            actividades.push({
                id: `evt-${conversacion.id}`,
                tipo: "ConversacionIniciada",
                empresaId: conversacion.empresaId,
                usuario: "cliente",
                datos: { estado: conversacion.estado },
                timestamp: conversacion.createdAt,
            });
        });

        // Ordenar por timestamp descendente y limitar
        actividades.sort((a, b) => b.timestamp - a.timestamp);
        return actividades.slice(0, limit);
    }
}

module.exports = PrismaDashboardRepository;
