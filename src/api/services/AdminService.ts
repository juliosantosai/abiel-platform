const CoreFacade = require('../../core/facade/CoreFacade');

class AdminService {
    constructor({ abielCore, runtimeEngine, eventBus, metrics, logBuffer } = {}) {
        this.abielCore = abielCore || null;
        this.runtimeEngine = runtimeEngine || null;
        this.eventBus = eventBus || null;
        this.metrics = metrics || null;
        this.logBuffer = logBuffer || null;

        // Create a small facade to unify access to core/runtime/eventbus
        try {
            this.facade = new CoreFacade({ abielCore: this.abielCore, runtimeEngine: this.runtimeEngine, eventBus: this.eventBus, metrics: this.metrics, logBuffer: this.logBuffer });
        } catch (e) {
            this.facade = null;
        }
    }

    async getDashboard() {
        const mem = process.memoryUsage();
        const runtime = this.facade?.getRuntimeSnapshot?.() || {
            nodeVersion: process.version,
            platform: process.platform,
            pid: process.pid,
            uptimeSeconds: Math.floor(process.uptime()),
        };

        const eventStats = this.facade?.getEventBusStats?.() || { available: Boolean(this.eventBus), published: 0, subscribers: 0 };
        const capabilities = await this.getCapabilities();

        return {
            version: process.env.npm_package_version || 'dev',
            uptime: Math.floor(process.uptime()),
            status: 'healthy',
            runtime,
            memory: { heapUsed: mem.heapUsed, rss: mem.rss },
            eventBus: eventStats,
            capabilities: Array.isArray(capabilities) ? capabilities.length : 0,
            tenants: process.env.DEMO_TENANTS ? Number(process.env.DEMO_TENANTS) : 1,
        };
    }

    async getRuntime() {
        return this.facade?.getRuntimeSnapshot?.() || {
            runtime: {
                nodeVersion: process.version,
                platform: process.platform,
                pid: process.pid,
                uptimeSeconds: Math.floor(process.uptime()),
            },
            scheduler: {},
            workers: [],
            queue: {},
            pipelines: [],
        };
    }

    async getEventBus() {
        return this.facade?.getEventBusStats?.() || {
            subscribers: 0,
            handlers: [],
            events: [],
            queues: [],
            metrics: {},
        };
    }

    async getCapabilities() {
        try {
            if (this.facade && typeof this.facade.listCapabilities === 'function') {
                return await this.facade.listCapabilities();
            }

            const reg = this.abielCore?.getCapabilityRegistry?.();
            if (reg && typeof reg.findAll === 'function') {
                return await reg.findAll();
            }

            return [];
        } catch (e) {
            return [];
        }
    }

    async getMemory() {
        return {
            sessions: 0,
            conversations: 0,
            cache: {},
            buffers: {},
        };
    }

    async getTenants() {
        return {
            active: this.abielCore?.getTenantContext?.()?.tenantId || process.env.DEMO_TENANT || 'default',
            registered: [],
            context: {},
        };
    }

    async getHealth() {
        return {
            database: 'UNKNOWN',
            redis: 'UNKNOWN',
            runtime: this.runtimeEngine ? 'UP' : 'DOWN',
            eventBus: this.eventBus ? 'UP' : 'DOWN',
            core: this.abielCore ? 'UP' : 'DOWN',
        };
    }

    async getMetrics() {
        try {
            if (this.metrics && typeof this.metrics.snapshot === 'function') {
                return this.metrics.snapshot();
            }
            return this.facade?.getMetrics?.() || {
                cpu: null,
                ram: process.memoryUsage().rss,
                heap: process.memoryUsage().heapUsed,
                gc: {},
                requests: {},
                latency: {},
            };
        } catch (e) {
            return {};
        }
    }

    async getLogs({ page = 1, perPage = 50, level, from, to } = {}) {
        try {
            // Prefer facade if it implements filtering; if it returns an empty default, continue to fallbacks
            if (this.facade && typeof this.facade.getLogs === 'function') {
                try {
                    const facadeRes = await this.facade.getLogs({ page, perPage, level, from, to });
                    if (facadeRes && (Array.isArray(facadeRes.items) && facadeRes.items.length > 0 || (typeof facadeRes.total === 'number' && facadeRes.total > 0))) {
                        return facadeRes;
                    }
                    // otherwise fall through to try other strategies (in-memory filtering)
                } catch (e) {
                    // ignore and fall through
                }
            }

            // If logBuffer supports paginate with filters, pass through
            if (this.logBuffer && typeof this.logBuffer.paginate === 'function') {
                // Some implementations may accept level/from/to
                try {
                    return this.logBuffer.paginate({ page, perPage, level, from, to });
                } catch (e) {
                    // fallback to basic paginate
                    const basic = await this.logBuffer.paginate({ page, perPage });
                    return basic;
                }
            }

            // If logBuffer exposes items array, filter in-memory
            if (this.logBuffer && Array.isArray(this.logBuffer.items)) {
                const items = this.logBuffer.items.filter((it) => {
                    if (level && String(it.level).toLowerCase() !== String(level).toLowerCase()) return false;
                    if (from) {
                        const d = it.occurredAt ? new Date(it.occurredAt) : null;
                        if (!d || d < new Date(from)) return false;
                    }
                    if (to) {
                        const d = it.occurredAt ? new Date(it.occurredAt) : null;
                        if (!d || d > new Date(to)) return false;
                    }
                    return true;
                });

                const total = items.length;
                const start = (page - 1) * perPage;
                const paged = items.slice(start, start + perPage);
                return { total, page, perPage, items: paged };
            }

            return { total: 0, page, perPage, items: [] };
        } catch (e) {
            return { total: 0, page, perPage, items: [] };
        }
    }

    async getConfig() {
        return {
            version: process.env.npm_package_version || 'dev',
            port: process.env.PORT || null,
            mode: process.env.NODE_ENV || 'development',
            env: { NODE_ENV: process.env.NODE_ENV },
        };
    }
}

module.exports = AdminService;
