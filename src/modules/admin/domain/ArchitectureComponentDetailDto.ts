class ComponentDetailDto {
  constructor({ id, name, type, version, status, description, dependencies, capabilities, config, metadata, health, metrics, graph, eventHistory, createdAt, updatedAt } = {}) {
    this.id = id || null;
    this.name = name || null;
    this.type = type || null;
    this.version = version || null;
    this.status = status || null;
    this.description = description || null;
    this.dependencies = dependencies || [];
    this.capabilities = capabilities || [];
    this.config = config || {};
    this.metadata = metadata || {};
    this.health = health || {};
    this.metrics = metrics || {};
    this.graph = graph || {};
    this.eventHistory = Array.isArray(eventHistory) ? eventHistory : [];
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }
}

module.exports = ComponentDetailDto;
