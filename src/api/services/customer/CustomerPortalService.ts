class CustomerPortalService {
    constructor({ runtimeEngine = null, moduleRegistry = null, pluginRegistry = null } = {}) {
        this.runtimeEngine = runtimeEngine;
        this.moduleRegistry = moduleRegistry;
        this.pluginRegistry = pluginRegistry;
    }

    async getProfile({ user = null, tenant = null } = {}) {
        return {
            tenantId: tenant?.tenantId || user?.empresaId || null,
            userId: user?.usuarioId || user?.sub || 'customer-user',
            role: user?.role || user?.rol || 'CUSTOMER_MEMBER',
            status: 'ACTIVE',
        };
    }

    async getUsage({ tenant = null } = {}) {
        return {
            tenantId: tenant?.tenantId || null,
            period: 'current',
            agents: 0,
            conversations: 0,
            knowledgeBases: 0,
            activeExecutions: this.runtimeEngine?.activeExecutions?.size ?? 0,
        };
    }

    async getAgents({ tenant = null } = {}) {
        return {
            tenantId: tenant?.tenantId || null,
            items: [],
        };
    }

    async getConversations({ tenant = null } = {}) {
        return {
            tenantId: tenant?.tenantId || null,
            items: [],
        };
    }

    async getKnowledge({ tenant = null } = {}) {
        return {
            tenantId: tenant?.tenantId || null,
            items: [],
            pluginCount: typeof this.pluginRegistry?.list === 'function' ? this.pluginRegistry.list().length : 0,
        };
    }
}

module.exports = CustomerPortalService;