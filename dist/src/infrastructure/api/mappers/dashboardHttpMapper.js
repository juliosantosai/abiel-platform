"use strict";
function toDashboardMetricsDto(metricas) {
    if (!metricas) {
        return metricas;
    }
    if (typeof metricas.toJSON === "function") {
        return metricas.toJSON();
    }
    return { ...metricas };
}
function toDashboardActivityDto(actividad) {
    if (Array.isArray(actividad)) {
        return actividad.map((item) => ({ ...item }));
    }
    return actividad;
}
module.exports = {
    toDashboardMetricsDto,
    toDashboardActivityDto,
};
//# sourceMappingURL=dashboardHttpMapper.js.map