class ArchitectureOverviewDto {
  constructor({ core, engines, modules, shared, plugins, services, graph, tree, runtime, metrics } = {}) {
    this.core = core || { components: [], count: 0 };
    this.engines = engines || [];
    this.modules = modules || [];
    this.shared = shared || [];
    this.plugins = plugins || [];
    this.services = services || [];
    this.graph = graph || { nodes: [], edges: [] };
    this.tree = tree || [];
    this.runtime = runtime || {};
    this.metrics = metrics || {};
  }
}

module.exports = ArchitectureOverviewDto;
