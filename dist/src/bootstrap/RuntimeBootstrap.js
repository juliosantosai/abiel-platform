"use strict";
const fs = require('fs');
const path = require('path');
const eventBusModule = require('../core/kernel/events/EventBus');
const globalEventBus = eventBusModule.globalEventBus || eventBusModule;
const { AbielCore } = require('../core/AbielCore');
const ModuleRegistry = require('../core/registry/ModuleRegistry');
const PluginRegistry = require('../core/registry/PluginRegistry');
const ArchitectureRegistry = require('../core/architecture/ArchitectureRegistry');
const RuntimeEngine = require('../engines/agent-runtime/application/RuntimeEngine');
const EventDispatcher = require('../engines/agent-runtime/infrastructure/EventDispatcher');
const ExpressApp = require('../infrastructure/api/infrastructure/ExpressApp');
const RuntimeContext = require('./RuntimeContext');
const MODULES_SOURCE_PATH = path.resolve(process.cwd(), 'src/modules');
const PLUGINS_SOURCE_PATH = path.resolve(process.cwd(), 'src/plugins');
const BOOT_STATES = {
    BOOTING: 'BOOTING',
    DISCOVERING: 'DISCOVERING',
    LOADING_MODULES: 'LOADING_MODULES',
    LOADING_PLUGINS: 'LOADING_PLUGINS',
    STARTING: 'STARTING',
    RUNNING: 'RUNNING',
    STOPPING: 'STOPPING',
    STOPPED: 'STOPPED',
    FAILED: 'FAILED',
};
class RuntimeBootstrap {
    runtimeEnv;
    tenantId;
    apiPort;
    loadPluginsFlag;
    logger;
    metrics;
    state;
    eventBus;
    moduleRegistry;
    pluginRegistry;
    architectureRegistry;
    abielCore;
    runtimeEngine;
    expressApp;
    runtimeContext;
    stageTimers;
    health;
    constructor({ tenantId, runtimeEnv, apiPort, loadPlugins = false, logger = null, metrics = null } = {}) {
        this.runtimeEnv = runtimeEnv || process.env.NODE_ENV || 'development';
        this.tenantId = tenantId || process.env.TENANT_ID || 'default';
        this.apiPort = Number(apiPort || process.env.PORT || 5000);
        this.loadPluginsFlag = Boolean(loadPlugins);
        this.logger = logger || new (require('../core/observability/Logger').ConsoleLogger)();
        this.metrics = metrics || { data: {} };
        this.state = BOOT_STATES.BOOTING;
        this.eventBus = null;
        this.moduleRegistry = null;
        this.pluginRegistry = null;
        this.architectureRegistry = null;
        this.abielCore = null;
        this.runtimeEngine = null;
        this.expressApp = null;
        this.runtimeContext = null;
        this.stageTimers = {};
        this.health = { status: 'UNKNOWN', startedAt: null, errors: [] };
    }
    _publishEvent(name, payload = {}) {
        if (!this.eventBus || typeof this.eventBus.publish !== 'function') {
            return;
        }
        try {
            this.eventBus.publish({
                name,
                payload,
                occurredAt: new Date(),
            });
        }
        catch (error) {
            this.logger.error('RuntimeEventPublishFailed', error, { name, payload });
        }
    }
    _transition(state) {
        this.state = state;
        this.logger.info('RuntimeStateChanged', { state });
        this._publishEvent(`Runtime${state.charAt(0) + state.slice(1).toLowerCase()}`, { state });
        return this.state;
    }
    _startStage(stage) {
        this.stageTimers[stage] = process.hrtime.bigint();
        this.logger.info('RuntimeStageStarted', { stage });
    }
    _endStage(stage) {
        const started = this.stageTimers[stage];
        if (!started) {
            return;
        }
        const ended = process.hrtime.bigint();
        const durationMs = Number(ended - started) / 1_000_000;
        this.metrics.data.bootstrap = this.metrics.data.bootstrap || { stages: {}, modulesLoaded: 0, pluginsLoaded: 0, enginesLoaded: 0, startupWarnings: [], startupErrors: [] };
        this.metrics.data.bootstrap.stages[stage] = Number(durationMs.toFixed(2));
        this.logger.info('RuntimeStageCompleted', { stage, durationMs });
    }
    createEventBus() {
        this._transition(BOOT_STATES.BOOTING);
        this._startStage('createEventBus');
        this.eventBus = globalEventBus;
        this.logger.info('EventBusCreated', { type: this.eventBus.constructor?.name || 'EventBus' });
        this.metrics.data.bootstrap = this.metrics.data.bootstrap || { stages: {}, modulesLoaded: 0, pluginsLoaded: 0, enginesLoaded: 0, startupWarnings: [], startupErrors: [] };
        this._endStage('createEventBus');
        return this.eventBus;
    }
    createRegistries() {
        this._transition(BOOT_STATES.DISCOVERING);
        this._startStage('createRegistries');
        this.moduleRegistry = new ModuleRegistry();
        this.pluginRegistry = new PluginRegistry({ plugins: [] });
        this.architectureRegistry = new ArchitectureRegistry({
            eventBus: this.eventBus,
            moduleRegistry: this.moduleRegistry,
            pluginRegistry: this.pluginRegistry,
        });
        this.logger.info('RegistriesCreated', {
            moduleRegistry: true,
            pluginRegistry: true,
        });
        this._endStage('createRegistries');
        return {
            moduleRegistry: this.moduleRegistry,
            pluginRegistry: this.pluginRegistry,
            architectureRegistry: this.architectureRegistry,
        };
    }
    createCore() {
        this._startStage('createCore');
        this.abielCore = new AbielCore({
            tenantId: this.tenantId,
            eventBus: this.eventBus,
            logger: this.logger,
            metrics: this.metrics,
        });
        this.logger.info('CoreCreated', { tenantId: this.tenantId });
        this._endStage('createCore');
        return this.abielCore;
    }
    registerCoreComponents() {
        if (!this.architectureRegistry || !this.abielCore) {
            throw new Error('Registries and core must be initialized before registering components');
        }
        this._startStage('registerCoreComponents');
        this.architectureRegistry.registerComponent({
            id: 'abiel-core',
            name: 'Abiel Core',
            type: 'CORE',
            version: process.env.npm_package_version || 'unknown',
            description: 'Core runtime manager',
            capabilities: [],
            dependencies: ['eventbus'],
            status: 'STARTED',
            metadata: { tenantId: this.tenantId },
            healthFn: () => ({ status: 'OK', checks: { core: true } }),
        });
        this._publishEvent('ComponentRegistered', { componentId: 'abiel-core' });
        this.architectureRegistry.registerComponent({
            id: 'eventbus',
            name: 'EventBus',
            type: 'CORE',
            version: '1.0.0',
            description: 'Event dispatcher bus',
            capabilities: ['publish', 'subscribe'],
            dependencies: [],
            status: 'STARTED',
            metadata: {
                type: this.eventBus.constructor?.name || 'EventBus',
            },
            healthFn: () => ({ status: 'OK', checks: { eventBus: true } }),
            metricsFn: () => ({ handlerCount: this._countEventHandlers() }),
            raw: this.eventBus,
        });
        this._publishEvent('ComponentRegistered', { componentId: 'eventbus' });
        this.architectureRegistry.registerComponent({
            id: 'module-registry',
            name: 'ModuleRegistry',
            type: 'CORE',
            version: '1.0.0',
            description: 'Registry of loaded runtime modules',
            capabilities: ['register', 'discover'],
            dependencies: ['abiel-core'],
            status: 'STARTED',
            metadata: { count: this.moduleRegistry.list().length },
            raw: this.moduleRegistry,
        });
        this._publishEvent('ComponentRegistered', { componentId: 'module-registry' });
        this.architectureRegistry.registerComponent({
            id: 'plugin-registry',
            name: 'PluginRegistry',
            type: 'CORE',
            version: '1.0.0',
            description: 'Registry of installed plugins',
            capabilities: ['install', 'activate', 'deactivate', 'uninstall'],
            dependencies: ['eventbus'],
            status: 'STARTED',
            metadata: { count: this.pluginRegistry.list().length },
            raw: this.pluginRegistry,
        });
        this._publishEvent('ComponentRegistered', { componentId: 'plugin-registry' });
        this._endStage('registerCoreComponents');
        return this.architectureRegistry.getOverview();
    }
    discoverModules() {
        if (!this.moduleRegistry || !this.architectureRegistry) {
            throw new Error('Registries must be initialized before loading modules');
        }
        this._transition(BOOT_STATES.LOADING_MODULES);
        this._startStage('discoverModules');
        const modules = this._scanModuleDirectories();
        modules.forEach((moduleDefinition) => {
            try {
                this.moduleRegistry.register(moduleDefinition);
                this.architectureRegistry.registerComponent({
                    id: moduleDefinition.name,
                    name: moduleDefinition.name,
                    type: 'MODULE',
                    version: moduleDefinition.metadata.version || 'unknown',
                    description: moduleDefinition.metadata.description || `${moduleDefinition.name} module`,
                    capabilities: moduleDefinition.metadata.capabilities || [],
                    dependencies: moduleDefinition.metadata.dependencies || [],
                    status: moduleDefinition.loaded ? 'STARTED' : 'UNKNOWN',
                    metadata: {
                        path: moduleDefinition.path,
                        source: moduleDefinition.source,
                        loaded: moduleDefinition.loaded,
                    },
                    healthFn: () => ({ status: moduleDefinition.loaded ? 'OK' : 'OFFLINE', checks: { loaded: moduleDefinition.loaded } }),
                    metricsFn: () => ({ loaded: moduleDefinition.loaded ? 1 : 0 }),
                    raw: moduleDefinition,
                });
                this._publishEvent('ModuleLoaded', { moduleName: moduleDefinition.name });
            }
            catch (error) {
                this.logger.error('ModuleLoadFailed', error, { module: moduleDefinition.name });
                this.metrics.data.bootstrap.startupErrors.push({ module: moduleDefinition.name, message: String(error) });
            }
        });
        this.metrics.data.bootstrap.modulesLoaded = modules.length;
        this._endStage('discoverModules');
        return modules;
    }
    discoverPlugins() {
        if (!this.pluginRegistry || !this.architectureRegistry) {
            throw new Error('Registries must be initialized before loading plugins');
        }
        this._transition(BOOT_STATES.LOADING_PLUGINS);
        this._startStage('discoverPlugins');
        const plugins = this._scanPluginDirectories();
        plugins.forEach((pluginPort) => {
            try {
                this.pluginRegistry.register(pluginPort);
                const manifest = pluginPort.manifest || {};
                this.architectureRegistry.registerComponent({
                    id: manifest.name,
                    name: manifest.name,
                    type: 'PLUGIN',
                    version: manifest.version || 'unknown',
                    description: manifest.description || `${manifest.name} plugin`,
                    capabilities: manifest.capabilities || [],
                    dependencies: manifest.dependencies || [],
                    status: pluginPort.installed ? 'STARTED' : 'UNKNOWN',
                    metadata: {
                        installed: pluginPort.installed,
                        manifest: manifest,
                    },
                    healthFn: () => ({ status: pluginPort.installed ? 'OK' : 'OFFLINE', checks: { installed: pluginPort.installed } }),
                    metricsFn: () => ({ installed: pluginPort.installed ? 1 : 0 }),
                    raw: pluginPort,
                });
                this._publishEvent('PluginLoaded', { pluginName: manifest.name });
            }
            catch (error) {
                this.logger.error('PluginLoadFailed', error, { plugin: pluginPort.manifest?.name });
                this.metrics.data.bootstrap.startupErrors.push({ plugin: pluginPort.manifest?.name || '<unknown>', message: String(error) });
            }
        });
        this.metrics.data.bootstrap.pluginsLoaded = plugins.length;
        this._endStage('discoverPlugins');
        return plugins;
    }
    buildRuntimeEngine() {
        if (!this.architectureRegistry) {
            throw new Error('Architecture registry must be initialized before building runtime engine');
        }
        this._transition(BOOT_STATES.STARTING);
        this._startStage('buildRuntimeEngine');
        const dispatcher = new EventDispatcher(this.eventBus);
        this.runtimeEngine = new RuntimeEngine({ eventDispatcher: dispatcher });
        this.architectureRegistry.runtimeEngine = this.runtimeEngine;
        this.architectureRegistry.registerComponent({
            id: 'runtime-engine',
            name: 'Runtime Engine',
            type: 'ENGINE',
            version: '1.0.0',
            description: 'Agent execution engine',
            capabilities: ['execute_agent'],
            dependencies: ['eventbus', 'abiel-core'],
            status: 'STARTED',
            metadata: {
                activeExecutions: this.runtimeEngine.activeExecutions.size,
            },
            healthFn: () => ({ status: 'OK', checks: { engine: true } }),
            metricsFn: () => ({ activeExecutions: this.runtimeEngine.activeExecutions.size }),
            raw: this.runtimeEngine,
        });
        this.metrics.data.bootstrap.enginesLoaded = 1;
        this._publishEvent('EngineStarted', { engineId: 'runtime-engine' });
        this._endStage('buildRuntimeEngine');
        return this.runtimeEngine;
    }
    initializeEngine() {
        if (!this.runtimeEngine) {
            throw new Error('Runtime engine must exist before initialization');
        }
        this._startStage('initializeEngine');
        this.logger.info('RuntimeEngineInitialized', { activeExecutions: this.runtimeEngine.activeExecutions.size });
        this._publishEvent('EngineInitialized', { engineId: 'runtime-engine' });
        this._endStage('initializeEngine');
        return this.runtimeEngine;
    }
    buildApi(useCases = {}) {
        if (!this.runtimeEngine || !this.eventBus || !this.moduleRegistry || !this.pluginRegistry || !this.abielCore) {
            throw new Error('Runtime must be initialized before building API');
        }
        this._startStage('buildApi');
        this.expressApp = new ExpressApp(useCases, {
            runtimeEngine: this.runtimeEngine,
            eventBus: this.eventBus,
            abielCore: this.abielCore,
            moduleRegistry: this.moduleRegistry,
            pluginRegistry: this.pluginRegistry,
            metrics: this.metrics,
        });
        this._endStage('buildApi');
        return this.expressApp;
    }
    startServer() {
        if (!this.expressApp) {
            throw new Error('Express app must be built before starting server');
        }
        this._startStage('startServer');
        this.expressApp.listen(this.apiPort);
        this._endStage('startServer');
        this._publishEvent('ServerStarted', { port: this.apiPort });
        return this.expressApp;
    }
    buildRuntimeContext() {
        this.runtimeContext = new RuntimeContext({
            runtimeEngine: this.runtimeEngine,
            eventBus: this.eventBus,
            architectureRegistry: this.architectureRegistry,
            moduleRegistry: this.moduleRegistry,
            pluginRegistry: this.pluginRegistry,
            abielCore: this.abielCore,
            expressApp: this.expressApp,
            logger: this.logger,
            metrics: this.metrics,
            health: this.health,
            state: this.state,
        });
        return this.runtimeContext;
    }
    bootstrap({ useCases = {}, startApi = false } = {}) {
        try {
            this.createEventBus();
            this.createRegistries();
            this.createCore();
            this.registerCoreComponents();
            this.discoverModules();
            if (this.loadPluginsFlag) {
                this.discoverPlugins();
            }
            this.buildRuntimeEngine();
            this.initializeEngine();
            if (startApi) {
                this.buildApi(useCases);
                this.startServer();
            }
            this._transition(BOOT_STATES.RUNNING);
            this._publishEvent('RuntimeReady', { tenantId: this.tenantId });
            this.buildRuntimeContext();
            return this.runtimeContext;
        }
        catch (error) {
            this.state = BOOT_STATES.FAILED;
            this.health.status = 'FAILED';
            this.health.errors.push(String(error));
            this.logger.error('RuntimeBootstrapFailed', error, { state: this.state });
            this._publishEvent('RuntimeFailed', { error: String(error) });
            throw error;
        }
    }
    static create(options = {}) {
        const bootstrap = new RuntimeBootstrap(options);
        return bootstrap.bootstrap(options);
    }
    _scanModuleDirectories() {
        const modules = [];
        if (!fs.existsSync(MODULES_SOURCE_PATH)) {
            return modules;
        }
        fs.readdirSync(MODULES_SOURCE_PATH, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .forEach((entry) => {
            const modulePath = path.join(MODULES_SOURCE_PATH, entry.name);
            modules.push({
                name: entry.name,
                path: modulePath,
                source: modulePath,
                loaded: true,
                metadata: {
                    version: 'unknown',
                    description: `${entry.name} module`,
                },
            });
        });
        return modules;
    }
    _scanPluginDirectories() {
        const plugins = [];
        if (!fs.existsSync(PLUGINS_SOURCE_PATH)) {
            return plugins;
        }
        fs.readdirSync(PLUGINS_SOURCE_PATH, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .forEach((entry) => {
            const pluginPath = path.join(PLUGINS_SOURCE_PATH, entry.name);
            plugins.push({
                installed: true,
                manifest: {
                    name: entry.name,
                    version: 'unknown',
                    description: `${entry.name} plugin`,
                    dependencies: [],
                    capabilities: [],
                },
                plugin: {
                    path: pluginPath,
                },
            });
        });
        return plugins;
    }
    _countEventHandlers() {
        const handlers = this.eventBus.handlers || this.eventBus._handlers || {};
        return Object.keys(handlers).reduce((sum, key) => sum + (Array.isArray(handlers[key]) ? handlers[key].length : 0), 0);
    }
}
module.exports = RuntimeBootstrap;
//# sourceMappingURL=RuntimeBootstrap.js.map