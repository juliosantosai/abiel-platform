class AdminService {
    constructor({ abielCore, runtimeEngine, eventBus } = {}) {
        this.abielCore = abielCore;
        this.runtimeEngine = runtimeEngine;
        this.eventBus = eventBus;
    }

    getStatus() {
        return {
            service: "Abiel Core Admin API",
            environment: process.env.NODE_ENV || "development",
            adminApiEnabled: true,
            adminTokenConfigured: Boolean(process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET),
            serverTime: new Date().toISOString(),
            version: process.env.npm_package_version || "unknown",
        };
    }

    getHealth() {
        return {
            status: "ok",
            uptimeSeconds: Math.round(process.uptime()),
            serverTime: new Date().toISOString(),
            coreAvailable: Boolean(this.abielCore),
            runtimeAvailable: Boolean(this.runtimeEngine),
        };
    }

    getRuntimeState() {
        return {
            runtimeEngine: {
                available: Boolean(this.runtimeEngine),
                activeExecutions: this.runtimeEngine?.activeExecutions?.size ?? 0,
                hasPermissionChecker: Boolean(this.runtimeEngine?.permissionChecker),
                hasErrorClassifier: Boolean(this.runtimeEngine?.errorClassifier),
            },
            core: {
                available: Boolean(this.abielCore),
                tenantId: this.abielCore?.getTenantContext()?.tenantId || null,
                hasCapabilityRegistry: Boolean(this.abielCore?.getCapabilityRegistry()),
            },
            eventBus: {
                available: Boolean(this.eventBus),
                publishFunction: typeof this.eventBus?.publish === "function",
                subscribeFunction: typeof this.eventBus?.subscribe === "function",
            },
        };
    }

    getOverview() {
        return {
            service: "Abiel Core Admin API",
            description: "Admin API para supervisar estado de runtime y núcleo",
            status: this.getStatus(),
            health: this.getHealth(),
            runtime: this.getRuntimeState(),
        };
    }
}

module.exports = AdminService;
