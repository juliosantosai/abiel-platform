class CoreInfoDto {
  constructor({ tenant, capabilityRegistry, eventBus, pluginRegistry, metadata } = {}) {
    this.tenant = tenant || null;
    this.capabilityRegistry = capabilityRegistry || null;
    this.eventBus = eventBus || null;
    this.pluginRegistry = pluginRegistry || null;
    this.metadata = metadata || {};
  }
}

class EngineInfoDto {
  constructor({ runtimeEngine, eventDispatcher, details } = {}) {
    this.runtimeEngine = runtimeEngine || null;
    this.eventDispatcher = eventDispatcher || null;
    this.details = details || {};
  }
}

class ModuleInfoDto {
  constructor({ name, path, available, loaded, source } = {}) {
    this.name = name || null;
    this.path = path || null;
    this.available = available === true;
    this.loaded = loaded === true;
    this.source = source || null;
  }
}

class SharedServiceInfoDto {
  constructor({ name, available, type, metadata } = {}) {
    this.name = name || null;
    this.available = available === true;
    this.type = type || null;
    this.metadata = metadata || {};
  }
}

class RuntimeStateDto {
  constructor({ processInfo, runtimeEngine, eventBus, memory, activeExecutions, handlerCount } = {}) {
    this.process = processInfo || {};
    this.runtimeEngine = runtimeEngine || null;
    this.eventBus = eventBus || null;
    this.memory = memory || {};
    this.activeExecutions = activeExecutions ?? null;
    this.handlerCount = handlerCount ?? null;
  }
}

class ArchitectureOverviewDto {
  constructor({ core, engines, modules, shared, runtime } = {}) {
    this.core = core || null;
    this.engines = engines || null;
    this.modules = modules || [];
    this.shared = shared || [];
    this.runtime = runtime || null;
  }
}

module.exports = {
  CoreInfoDto,
  EngineInfoDto,
  ModuleInfoDto,
  SharedServiceInfoDto,
  RuntimeStateDto,
  ArchitectureOverviewDto,
};
