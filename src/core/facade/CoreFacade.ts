const os = require('os');

class CoreFacade {
    constructor({ abielCore, runtimeEngine, eventBus, metrics, logBuffer } = {}) {
        this.abielCore = abielCore || null;
        this.runtimeEngine = runtimeEngine || null;
        this.eventBus = eventBus || null;
        this.metrics = metrics || null;
        this.logBuffer = logBuffer || null;
    }

    async listCapabilities() {
        try {
            const reg = this.abielCore?.getCapabilityRegistry?.();
            if (reg && typeof reg.findAll === 'function') {
                return await reg.findAll();
            }
            // fallback: try repository inspection if available
            return [];
        } catch (e) {
            return [];
        }
    }

    getEventBusStats() {
        try {
            const bus = this.eventBus;
            if (!bus) return { available: false };

            // EventBus in this repo stores handlers per eventName
            const handlersMap = bus.handlers || bus._handlers || {};
            const subscribers = Object.keys(handlersMap).reduce((acc, k) => acc + (handlersMap[k]?.length || 0), 0);
            return {
                available: true,
                published: 0,
                subscribers,
                handlersMapKeys: Object.keys(handlersMap),
            };
        } catch (e) {
            return { available: false };
        }
    }

    getRuntimeSnapshot() {
        const mem = process.memoryUsage();
        return {
            nodeVersion: process.version,
            platform: process.platform,
            pid: process.pid,
            uptimeSeconds: Math.floor(process.uptime()),
            cpuCount: os.cpus().length,
            memory: { rss: mem.rss, heapUsed: mem.heapUsed, heapTotal: mem.heapTotal },
            runtimeEngine: {
                available: Boolean(this.runtimeEngine),
                activeExecutions: this.runtimeEngine?.activeExecutions?.size ?? 0,
            },
        };
    }

    getMetrics() {
        const mem = process.memoryUsage();
        return {
            cpu: null,
            ram: mem.rss,
            heap: mem.heapUsed,
            gc: {},
            requests: {},
            latency: {},
        };
    }

    appendLog(entry) {
        if (this.logBuffer && typeof this.logBuffer.push === 'function') {
            this.logBuffer.push(entry);
        }
    }

    getLogs({ page = 1, perPage = 50 } = {}) {
        if (this.logBuffer && typeof this.logBuffer.paginate === 'function') {
            return this.logBuffer.paginate({ page, perPage });
        }
        return { total: 0, page, perPage, items: [] };
    }
}

module.exports = CoreFacade;
