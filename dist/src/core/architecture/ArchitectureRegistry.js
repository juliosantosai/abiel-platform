"use strict";
const { EventEmitter } = require('events');
const ComponentManifest = require('./ComponentManifest');
const COMPONENT_REGISTERED = 'COMPONENT_REGISTERED';
const COMPONENT_STARTED = 'COMPONENT_STARTED';
const COMPONENT_STOPPED = 'COMPONENT_STOPPED';
const COMPONENT_FAILED = 'COMPONENT_FAILED';
const VALID_TYPES = ['CORE', 'ENGINE', 'MODULE', 'SHARED', 'PLUGIN', 'SERVICE'];
function normalizeType(type) {
    return String(type || '').toUpperCase();
}
class ArchitectureRegistry {
    constructor({ eventBus, logger, metrics, dbClient, cacheClient, storageClient, moduleRegistry, pluginRegistry, abielCore, runtimeEngine } = {}) {
        this.eventBus = eventBus || null;
        this.logger = logger || null;
        this.metrics = metrics || null;
        this.dbClient = dbClient || null;
        this.cacheClient = cacheClient || null;
        this.storageClient = storageClient || null;
        this.moduleRegistry = moduleRegistry || null;
        this.pluginRegistry = pluginRegistry || null;
        this.abielCore = abielCore || null;
        this.runtimeEngine = runtimeEngine || null;
        this.components = new Map();
        this.history = [];
        this.eventEmitter = new EventEmitter();
    }
    _key(type, id) {
        return `${normalizeType(type)}:${String(id).toLowerCase()}`;
    }
    _ensureType(type) {
        const normalized = normalizeType(type);
        if (!VALID_TYPES.includes(normalized)) {
            throw new Error(`Invalid architecture component type: ${type}`);
        }
        return normalized;
    }
    registerComponent(component = {}) {
        const manifest = component instanceof ComponentManifest ? component : new ComponentManifest(component);
        const type = this._ensureType(manifest.type || 'SERVICE');
        const id = String(manifest.id || manifest.name || `${type}-${Math.random().toString(36).slice(2, 8)}`).toLowerCase();
        const key = this._key(type, id);
        const existing = this.components.get(key) || {};
        const merged = {
            id,
            name: manifest.name || existing.name || id,
            type,
            version: manifest.version || existing.version || process.env.npm_package_version || 'unknown',
            status: manifest.status || existing.status || 'REGISTERED',
            description: manifest.description || existing.description || null,
            dependencies: Array.isArray(manifest.dependencies) ? manifest.dependencies : existing.dependencies || [],
            capabilities: Array.isArray(manifest.capabilities) ? manifest.capabilities : existing.capabilities || [],
            config: manifest.config || existing.config || {},
            metadata: manifest.metadata || existing.metadata || {},
            compatibleCore: manifest.compatibleCore || existing.compatibleCore || '1.x',
            createdAt: existing.createdAt || manifest.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            healthFn: typeof manifest.healthFn === 'function' ? manifest.healthFn : existing.healthFn,
            metricsFn: typeof manifest.metricsFn === 'function' ? manifest.metricsFn : existing.metricsFn,
            raw: manifest.raw || existing.raw || null,
        };
        this.components.set(key, merged);
        this.recordEvent(COMPONENT_REGISTERED, merged);
        return merged;
    }
    removeComponent(type, id) {
        const key = this._key(type, id);
        return this.components.delete(key);
    }
    getComponent(type, id) {
        const key = this._key(type, id);
        const component = this.components.get(key);
        return component ? { ...component } : null;
    }
    listComponents(type) {
        const normalized = type ? this._ensureType(type) : null;
        return Array.from(this.components.values()).filter((item) => !normalized || item.type === normalized);
    }
    getDependencies(type, id) {
        const component = this.getComponent(type, id);
        return Array.isArray(component?.dependencies) ? component.dependencies : [];
    }
    getDependencyGraph() {
        const nodes = Array.from(this.components.values()).map((component) => ({
            id: component.id,
            name: component.name,
            type: component.type,
            version: component.version,
        }));
        const edges = [];
        this.components.forEach((component) => {
            (component.dependencies || []).forEach((dependency) => {
                edges.push({ from: component.id, to: dependency });
            });
        });
        return { nodes, edges };
    }
    getArchitectureTree() {
        const nodeMap = new Map();
        this.components.forEach((component) => {
            nodeMap.set(component.id, { id: component.id, name: component.name, type: component.type, children: [] });
        });
        const roots = [];
        this.components.forEach((component) => {
            const node = nodeMap.get(component.id);
            const dependencies = Array.isArray(component.dependencies) ? component.dependencies : [];
            if (dependencies.length === 0) {
                roots.push(node);
                return;
            }
            let attached = false;
            dependencies.forEach((dependencyId) => {
                const parent = nodeMap.get(dependencyId);
                if (parent) {
                    parent.children.push(node);
                    attached = true;
                }
            });
            if (!attached) {
                roots.push(node);
            }
        });
        return roots;
    }
    getOverview() {
        return {
            core: {
                components: this.listComponents('CORE'),
                count: this.listComponents('CORE').length,
            },
            engines: this.listComponents('ENGINE'),
            modules: this.listComponents('MODULE'),
            shared: this.listComponents('SHARED'),
            plugins: this.listComponents('PLUGIN'),
            services: this.listComponents('SERVICE'),
            graph: this.getDependencyGraph(),
            tree: this.getArchitectureTree(),
            totals: {
                core: this.listComponents('CORE').length,
                engines: this.listComponents('ENGINE').length,
                modules: this.listComponents('MODULE').length,
                shared: this.listComponents('SHARED').length,
                plugins: this.listComponents('PLUGIN').length,
                services: this.listComponents('SERVICE').length,
            },
        };
    }
    async getComponentDetail(type, id) {
        const component = this.getComponent(type, id);
        if (!component) {
            return null;
        }
        const health = await this._resolveHealth(component);
        const metrics = await this._resolveMetrics(component);
        const eventHistory = this.getHistory({ type, id });
        return {
            ...component,
            health,
            metrics,
            eventHistory,
            graph: {
                dependencies: this.getDependencies(type, id),
            },
        };
    }
    async _resolveHealth(component) {
        if (!component) {
            return { status: 'UNKNOWN', latency: null, memory: null, errors: 0, checks: {} };
        }
        if (typeof component.healthFn === 'function') {
            try {
                return await component.healthFn();
            }
            catch (e) {
                return { status: 'FAILED', latency: null, memory: null, errors: 1, checks: { error: String(e) } };
            }
        }
        return { status: component.status === 'STARTED' || component.status === 'ACTIVE' ? 'ACTIVE' : 'UNKNOWN', latency: null, memory: null, errors: 0, checks: {} };
    }
    async _resolveMetrics(component) {
        if (!component) {
            return {};
        }
        if (typeof component.metricsFn === 'function') {
            try {
                return await component.metricsFn();
            }
            catch (e) {
                return { error: String(e) };
            }
        }
        return {};
    }
    updateStatus(type, id, status, metadata = {}) {
        const component = this.getComponent(type, id);
        if (!component) {
            return null;
        }
        const normalizedStatus = String(status).toUpperCase();
        component.status = normalizedStatus;
        component.updatedAt = new Date().toISOString();
        if (metadata.description) {
            component.description = metadata.description;
        }
        const key = this._key(type, id);
        this.components.set(key, component);
        let eventType = null;
        if (normalizedStatus === 'STARTED')
            eventType = COMPONENT_STARTED;
        if (normalizedStatus === 'STOPPED')
            eventType = COMPONENT_STOPPED;
        if (normalizedStatus === 'FAILED')
            eventType = COMPONENT_FAILED;
        if (eventType) {
            this.recordEvent(eventType, component, metadata);
        }
        return component;
    }
    recordEvent(eventType, component, payload = {}) {
        if (!component || !eventType) {
            return null;
        }
        const event = {
            id: `${this.history.length + 1}`,
            eventType,
            timestamp: new Date().toISOString(),
            component: {
                id: component.id,
                name: component.name,
                type: component.type,
            },
            payload,
        };
        this.history.push(event);
        this.eventEmitter.emit(eventType, event);
        if (this.eventBus && typeof this.eventBus.publish === 'function') {
            try {
                this.eventBus.publish({
                    name: eventType,
                    component: event.component,
                    payload,
                    occurredAt: event.timestamp,
                });
            }
            catch (e) {
                // Keep registry operation resilient.
            }
        }
        return event;
    }
    getHistory(filters = {}) {
        return this.history.filter((item) => {
            if (filters.type && normalizeType(filters.type) !== item.component.type) {
                return false;
            }
            if (filters.id && String(filters.id).toLowerCase() !== String(item.component.id).toLowerCase()) {
                return false;
            }
            if (filters.eventType && filters.eventType !== item.eventType) {
                return false;
            }
            return true;
        });
    }
    on(eventType, listener) {
        this.eventEmitter.on(eventType, listener);
    }
    off(eventType, listener) {
        this.eventEmitter.off(eventType, listener);
    }
    getRuntimeSnapshot() {
        const runtimeEngine = this.runtimeEngine;
        const eventBus = this.eventBus;
        return {
            process: {
                pid: process.pid,
                platform: process.platform,
                nodeVersion: process.version,
                uptimeSeconds: Math.floor(process.uptime()),
            },
            runtimeEngine: {
                available: Boolean(runtimeEngine),
                type: runtimeEngine?.constructor?.name || null,
                activeExecutions: runtimeEngine?.activeExecutions instanceof Map ? runtimeEngine.activeExecutions.size : null,
                hasPermissionChecker: Boolean(runtimeEngine?.permissionChecker),
                hasErrorClassifier: Boolean(runtimeEngine?.errorClassifier),
            },
            eventBus: {
                available: Boolean(eventBus),
                type: eventBus?.constructor?.name || null,
                handlers: eventBus?.handlers ? Object.keys(eventBus.handlers).reduce((sum, eventName) => sum + (Array.isArray(eventBus.handlers[eventName]) ? eventBus.handlers[eventName].length : 0), 0) : 0,
            },
            memory: {
                rss: process.memoryUsage().rss,
                heapUsed: process.memoryUsage().heapUsed,
                heapTotal: process.memoryUsage().heapTotal,
            },
        };
    }
    getMetricsSnapshot() {
        const memory = process.memoryUsage();
        return {
            heapUsed: memory.heapUsed,
            heapTotal: memory.heapTotal,
            rss: memory.rss,
            cpuCount: require('os').cpus().length,
            uptimeSeconds: Math.floor(process.uptime()),
            components: {
                total: this.components.size,
            },
        };
    }
}
ArchitectureRegistry.COMPONENT_REGISTERED = COMPONENT_REGISTERED;
ArchitectureRegistry.COMPONENT_STARTED = COMPONENT_STARTED;
ArchitectureRegistry.COMPONENT_STOPPED = COMPONENT_STOPPED;
ArchitectureRegistry.COMPONENT_FAILED = COMPONENT_FAILED;
module.exports = ArchitectureRegistry;
//# sourceMappingURL=ArchitectureRegistry.js.map