class ModuleRegistry {
  constructor({ modules = [] } = {}) {
    this.modules = Array.isArray(modules) ? modules : [];
  }

  register(moduleDefinition) {
    if (!moduleDefinition || !moduleDefinition.name) {
      throw new Error('ModuleRegistry.register requires a module definition with a name');
    }

    this.modules.push({
      name: moduleDefinition.name,
      path: moduleDefinition.path || null,
      loaded: Boolean(moduleDefinition.loaded ?? true),
      source: moduleDefinition.source || null,
      metadata: moduleDefinition.metadata || {},
    });

    return moduleDefinition;
  }

  list() {
    return [...this.modules];
  }
}

module.exports = ModuleRegistry;
