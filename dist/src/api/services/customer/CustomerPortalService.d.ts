declare class CustomerPortalService {
    constructor({ runtimeEngine, moduleRegistry, pluginRegistry }?: {
        runtimeEngine?: any;
        moduleRegistry?: any;
        pluginRegistry?: any;
    });
    getProfile({ user, tenant }?: {
        user?: any;
        tenant?: any;
    }): Promise<{
        tenantId: any;
        userId: any;
        role: any;
        status: string;
    }>;
    getUsage({ tenant }?: {
        tenant?: any;
    }): Promise<{
        tenantId: any;
        period: string;
        agents: number;
        conversations: number;
        knowledgeBases: number;
        activeExecutions: any;
    }>;
    getAgents({ tenant }?: {
        tenant?: any;
    }): Promise<{
        tenantId: any;
        items: any[];
    }>;
    getConversations({ tenant }?: {
        tenant?: any;
    }): Promise<{
        tenantId: any;
        items: any[];
    }>;
    getKnowledge({ tenant }?: {
        tenant?: any;
    }): Promise<{
        tenantId: any;
        items: any[];
        pluginCount: any;
    }>;
}
//# sourceMappingURL=CustomerPortalService.d.ts.map