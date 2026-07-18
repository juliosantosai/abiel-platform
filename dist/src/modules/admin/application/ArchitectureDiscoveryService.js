"use strict";
const fs = require('fs');
const path = require('path');
const ArchitectureRegistry = require('../../../core/architecture/ArchitectureRegistry');
const ArchitectureComponentDto = require('../domain/ArchitectureComponentDto');
const ArchitectureComponentDetailDto = require('../domain/ArchitectureComponentDetailDto');
const ArchitectureOverviewDto = require('../domain/ArchitectureOverviewDto');
class ArchitectureDiscoveryService {
    constructor({ abielCore, runtimeEngine, eventBus, moduleRegistry, pluginRegistry, dbClient, cacheClient, storageClient, logger, metrics } = {}) {
        this.abielCore = abielCore || null;
        this.runtimeEngine = runtimeEngine || null;
        this.eventBus = eventBus || null;
        this.moduleRegistry = moduleRegistry || null;
        this.pluginRegistry = pluginRegistry || null;
        this.dbClient = dbClient || null;
        this.cacheClient = cacheClient || null;
        this.storageClient = storageClient || null;
        this.logger = logger || this.abielCore?.logger || null;
        this.metrics = metrics || this.abielCore?.getMetrics?.() || null;
        this.registry = new ArchitectureRegistry({
            eventBus: this.eventBus,
            logger: this.logger,
            metrics: this.metrics,
            dbClient: this.dbClient,
            cacheClient: this.cacheClient,
            storageClient: this.storageClient,
            moduleRegistry: this.moduleRegistry,
            pluginRegistry: this.pluginRegistry,
            abielCore: this.abielCore,
            runtimeEngine: this.runtimeEngine,
        });
        this.buildRegistry();
    }
    buildRegistry() {
        this.registry.registerComponent({
            id: 'abiel-core',
            name: 'AbielCore',
            type: 'CORE',
            version: process.env.npm_package_version || 'unknown',
            status: this.abielCore ? 'started' : 'unavailable',
            description: 'Core tenant and capability manager',
            dependencies: ['eventbus', 'capability-registry'],
            capabilities: [],
            metadata: {
                tenantId: this.abielCore?.getTenantContext?.()?.tenantId || null,
            },
            healthFn: () => ({ status: this.abielCore ? 'ok' : 'failed', checks: { core: Boolean(this.abielCore) } }),
            metricsFn: () => ({ hasCapabilityRegistry: Boolean(this.abielCore?.getCapabilityRegistry?.()) }),
            raw: this.abielCore,
        });
        this.registry.registerComponent({
            id: 'eventbus',
            name: 'EventBus',
            type: 'CORE',
            version: '1.0.0',
            status: this.eventBus ? 'started' : 'stopped',
            description: 'Event bus for runtime event delivery',
            dependencies: [],
            capabilities: [],
            metadata: {
                handlerCount: this.eventBus?.handlers ? Object.keys(this.eventBus.handlers).reduce((sum, eventName) => sum + (Array.isArray(this.eventBus.handlers[eventName]) ? this.eventBus.handlers[eventName].length : 0), 0) : 0,
                registeredEvents: this.eventBus?.handlers ? Object.keys(this.eventBus.handlers) : [],
            },
            healthFn: () => ({ status: this.eventBus ? 'ok' : 'failed', checks: { bus: Boolean(this.eventBus) } }),
            metricsFn: () => ({ handlerCount: this.eventBus?.handlers ? Object.keys(this.eventBus.handlers).reduce((sum, eventName) => sum + (Array.isArray(this.eventBus.handlers[eventName]) ? this.eventBus.handlers[eventName].length : 0), 0) : 0 }),
            raw: this.eventBus,
        });
        this.registry.registerComponent({
            id: 'capability-registry',
            name: 'CapabilityRegistry',
            type: 'CORE',
            version: '1.0.0',
            status: Boolean(this.abielCore?.getCapabilityRegistry?.()) ? 'started' : 'stopped',
            description: 'Registry of available capabilities',
            dependencies: ['eventbus'],
            capabilities: [],
            metadata: {
                supportsFindAll: typeof this.abielCore?.getCapabilityRegistry?.()?.findAll === 'function',
            },
            healthFn: () => ({ status: this.abielCore?.getCapabilityRegistry?.() ? 'ok' : 'failed', checks: { registry: Boolean(this.abielCore?.getCapabilityRegistry?.()) } }),
            metricsFn: async () => {
                if (this.abielCore?.getCapabilityRegistry?.()) {
                    try {
                        const caps = await this.abielCore.getCapabilityRegistry().findAll();
                        return { count: Array.isArray(caps) ? caps.length : null };
                    }
                    catch (e) {
                        return { error: String(e) };
                    }
                }
                return {};
            },
            raw: this.abielCore?.getCapabilityRegistry?.(),
        });
        if (this.moduleRegistry) {
            this.registry.registerComponent({
                id: 'module-registry',
                name: 'ModuleRegistry',
                type: 'CORE',
                version: '1.0.0',
                status: 'started',
                description: 'Registry of loaded runtime modules',
                dependencies: ['capability-registry'],
                metadata: { count: this.moduleRegistry.list().length },
                healthFn: () => ({ status: 'ok', checks: { registry: true } }),
                metricsFn: () => ({ moduleCount: this.moduleRegistry.list().length }),
                raw: this.moduleRegistry,
            });
        }
        if (this.pluginRegistry) {
            this.registry.registerComponent({
                id: 'plugin-registry',
                name: 'PluginRegistry',
                type: 'CORE',
                version: '1.0.0',
                status: 'started',
                description: 'Registry of installed plugins',
                dependencies: ['eventbus'],
                metadata: { count: this.pluginRegistry.list().length },
                healthFn: () => ({ status: 'ok', checks: { registry: true } }),
                metricsFn: () => ({ pluginCount: this.pluginRegistry.list().length }),
                raw: this.pluginRegistry,
            });
        }
        if (this.runtimeEngine) {
            this.registry.registerComponent({
                id: 'runtime-engine',
                name: 'Agent Runtime Engine',
                type: 'ENGINE',
                version: '1.0.0',
                status: 'started',
                description: 'Execution engine for agent workflows',
                dependencies: ['eventbus', 'capability-registry'],
                capabilities: [],
                metadata: {
                    activeExecutions: this.runtimeEngine.activeExecutions instanceof Map ? this.runtimeEngine.activeExecutions.size : 0,
                    permissionChecker: Boolean(this.runtimeEngine.permissionChecker),
                    errorClassifier: Boolean(this.runtimeEngine.errorClassifier),
                },
                healthFn: () => ({ status: 'ok', checks: { engine: true } }),
                metricsFn: () => ({ activeExecutions: this.runtimeEngine.activeExecutions instanceof Map ? this.runtimeEngine.activeExecutions.size : 0 }),
                raw: this.runtimeEngine,
            });
        }
        if (this.dbClient) {
            this.registry.registerComponent({
                id: 'database',
                name: 'Database',
                type: 'SHARED',
                version: '1.0.0',
                status: 'started',
                description: 'Primary database connection',
                dependencies: [],
                metadata: { clientType: 'prisma' },
                healthFn: async () => {
                    if (!this.dbClient || typeof this.dbClient.$queryRaw !== 'function') {
                        return { status: 'failed', checks: { database: false } };
                    }
                    try {
                        await this.dbClient.$queryRaw `SELECT 1`;
                        return { status: 'ok', checks: { database: true } };
                    }
                    catch (e) {
                        return { status: 'failed', checks: { database: false, error: String(e) } };
                    }
                },
                metricsFn: () => ({ connected: true }),
                raw: this.dbClient,
            });
        }
        if (this.logger) {
            this.registry.registerComponent({
                id: 'logger',
                name: 'Logger',
                type: 'SHARED',
                version: '1.0.0',
                status: 'started',
                description: 'Logging service for runtime events',
                dependencies: [],
                metadata: { loggerType: this.logger.constructor?.name || null },
                healthFn: () => ({ status: 'ok', checks: { logger: true } }),
                metricsFn: () => ({}),
                raw: this.logger,
            });
        }
        if (this.cacheClient) {
            this.registry.registerComponent({
                id: 'cache',
                name: 'Cache',
                type: 'SHARED',
                version: '1.0.0',
                status: 'started',
                description: 'Cache service',
                dependencies: [],
                healthFn: async () => {
                    if (typeof this.cacheClient.ping === 'function') {
                        try {
                            await this.cacheClient.ping();
                            return { status: 'ok', checks: { cache: true } };
                        }
                        catch (e) {
                            return { status: 'failed', checks: { cache: false, error: String(e) } };
                        }
                    }
                    return { status: 'unknown', checks: {} };
                },
                metricsFn: () => ({}),
                raw: this.cacheClient,
            });
        }
        if (this.storageClient) {
            this.registry.registerComponent({
                id: 'storage',
                name: 'Storage',
                type: 'SHARED',
                version: '1.0.0',
                status: 'started',
                description: 'Storage backend service',
                dependencies: [],
                healthFn: async () => ({ status: 'unknown', checks: { storage: Boolean(this.storageClient) } }),
                metricsFn: () => ({}),
                raw: this.storageClient,
            });
        }
        this._listModules().forEach((module) => {
            const component = {
                id: module.name,
                name: module.name,
                type: 'MODULE',
                version: module.metadata?.version || module.version || 'unknown',
                status: module.loaded ? 'started' : 'registered',
                description: module.metadata?.description || `${module.name} module`,
                dependencies: module.metadata?.dependencies || [],
                capabilities: module.metadata?.capabilities || [],
                metadata: {
                    path: module.path,
                    source: module.source,
                    loaded: module.loaded,
                },
                healthFn: () => ({ status: module.loaded ? 'ok' : 'degraded', checks: { moduleLoaded: module.loaded } }),
                metricsFn: () => ({ loaded: module.loaded }),
                raw: module,
            };
            this.registry.registerComponent(component);
        });
        if (this.pluginRegistry && typeof this.pluginRegistry.list === 'function') {
            this.pluginRegistry.list().forEach((plugin) => {
                const manifest = plugin.manifest || {};
                this.registry.registerComponent({
                    id: manifest.name || plugin.plugin?.name || 'plugin-' + Math.random().toString(36).slice(2, 8),
                    name: manifest.name || plugin.plugin?.name || 'Plugin',
                    type: 'PLUGIN',
                    version: manifest.version || 'unknown',
                    status: plugin.installed ? 'installed' : 'available',
                    description: manifest.description || 'Runtime plugin',
                    dependencies: manifest.dependencies || [],
                    capabilities: plugin.capabilities || manifest.capabilities || [],
                    metadata: { installed: plugin.installed },
                    healthFn: () => ({ status: plugin.installed ? 'ok' : 'degraded', checks: { installed: plugin.installed } }),
                    metricsFn: () => ({ installed: plugin.installed }),
                    raw: plugin,
                });
            });
        }
    }
    discoverCore() {
        const tenantContext = this.abielCore?.getTenantContext?.();
        const capabilityRegistryComponent = this.registry.getComponent('CORE', 'capability-registry');
        const eventBusComponent = this.registry.getComponent('CORE', 'eventbus');
        const pluginRegistryComponent = this.registry.getComponent('CORE', 'plugin-registry');
        return {
            tenant: {
                activeTenantId: tenantContext?.tenantId || null,
                hasTenantContext: Boolean(tenantContext),
            },
            capabilityRegistry: {
                available: Boolean(capabilityRegistryComponent),
                type: capabilityRegistryComponent?.metadata?.type || capabilityRegistryComponent?.raw?.constructor?.name || null,
                supportsFindAll: capabilityRegistryComponent?.metadata?.supportsFindAll || false,
            },
            eventBus: {
                available: Boolean(eventBusComponent),
                type: eventBusComponent?.metadata?.type || eventBusComponent?.raw?.constructor?.name || null,
            },
            pluginRegistry: {
                available: Boolean(pluginRegistryComponent),
                type: pluginRegistryComponent?.metadata?.type || pluginRegistryComponent?.raw?.constructor?.name || null,
                count: pluginRegistryComponent?.metadata?.count ?? null,
            },
            metadata: {
                coreType: this.abielCore?.constructor?.name || null,
            },
        };
    }
    discoverEngines() {
        const engineComponent = this.registry.getComponent('ENGINE', 'runtime-engine');
        const runtimeEngine = engineComponent?.raw || this.runtimeEngine;
        const eventDispatcher = runtimeEngine?.eventDispatcher;
        return {
            runtimeEngine: {
                available: Boolean(runtimeEngine),
                type: runtimeEngine?.constructor?.name || engineComponent?.metadata?.type || null,
                activeExecutions: runtimeEngine?.activeExecutions instanceof Map ? runtimeEngine.activeExecutions.size : null,
                hasPermissionChecker: Boolean(runtimeEngine?.permissionChecker),
                hasErrorClassifier: Boolean(runtimeEngine?.errorClassifier),
            },
            eventDispatcher: {
                available: Boolean(eventDispatcher),
                type: eventDispatcher?.constructor?.name || null,
            },
            details: {
                activeExecutionIds: runtimeEngine?.activeExecutions instanceof Map ? Array.from(runtimeEngine.activeExecutions.keys()) : [],
            },
        };
    }
    _listModules() {
        if (this.moduleRegistry && typeof this.moduleRegistry.list === 'function') {
            return this.moduleRegistry.list();
        }
        return this._scanModuleDirectories();
    }
    discoverModules() {
        return this._listModules().map((moduleDefinition) => new ArchitectureComponentDto({
            id: moduleDefinition.name,
            name: moduleDefinition.name,
            type: 'MODULE',
            version: moduleDefinition.metadata?.version || 'unknown',
            status: moduleDefinition.loaded ? 'started' : 'registered',
            description: moduleDefinition.metadata?.description || `${moduleDefinition.name} module`,
            dependencies: moduleDefinition.metadata?.dependencies || [],
            capabilities: moduleDefinition.metadata?.capabilities || [],
            config: moduleDefinition.config || {},
            metadata: {
                path: moduleDefinition.path,
                source: moduleDefinition.source,
                loaded: moduleDefinition.loaded ?? true,
            },
        }));
    }
    _scanModuleDirectories() {
        const modules = [];
        const modulesPath = path.resolve(process.cwd(), 'src/modules');
        if (!fs.existsSync(modulesPath)) {
            return modules;
        }
        fs.readdirSync(modulesPath, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .forEach((entry) => {
            const modulePath = path.join(modulesPath, entry.name);
            modules.push({
                name: entry.name,
                path: modulePath,
                loaded: false,
                source: modulePath,
                metadata: {},
            });
        });
        return modules;
    }
    discoverSharedServices() {
        const shared = this.registry.listComponents('SHARED').map((component) => new ArchitectureComponentDto(component));
        const coreSupportServices = ['eventbus', 'capability-registry', 'plugin-registry', 'module-registry'];
        coreSupportServices.forEach((id) => {
            const component = this.registry.getComponent('CORE', id);
            if (component) {
                shared.push(new ArchitectureComponentDto(component));
            }
        });
        return shared;
    }
    discoverPlugins() {
        return this.registry.listComponents('PLUGIN').map((component) => new ArchitectureComponentDto(component));
    }
    discoverRuntimeState() {
        return this.registry.getRuntimeSnapshot();
    }
    discoverGraph() {
        return this.registry.getDependencyGraph();
    }
    getArchitectureOverview() {
        return new ArchitectureOverviewDto({
            core: this.discoverCore(),
            engines: this.discoverEngines(),
            modules: this.registry.listComponents('MODULE').map((component) => new ArchitectureComponentDto(component)),
            shared: this.discoverSharedServices(),
            plugins: this.registry.listComponents('PLUGIN').map((component) => new ArchitectureComponentDto(component)),
            services: this.registry.listComponents('SERVICE').map((component) => new ArchitectureComponentDto(component)),
            graph: this.discoverGraph(),
            tree: this.registry.getArchitectureTree(),
            runtime: this.discoverRuntimeState(),
            metrics: this.registry.getMetricsSnapshot(),
        });
    }
    async getComponentDetail(type, id) {
        const detail = await this.registry.getComponentDetail(type, id);
        if (!detail) {
            return null;
        }
        return new ArchitectureComponentDetailDto(detail);
    }
}
module.exports = ArchitectureDiscoveryService;
//# sourceMappingURL=ArchitectureDiscoveryService.js.map