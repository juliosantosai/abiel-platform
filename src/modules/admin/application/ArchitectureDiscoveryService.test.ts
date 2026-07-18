const ArchitectureDiscoveryService = require('./ArchitectureDiscoveryService');

describe('ArchitectureDiscoveryService', () => {
  test('builds architecture overview from runtime components', async () => {
    const fakeEventBus = { handlers: { event: [() => {}] }, publish: jest.fn() };
    const fakeRuntimeEngine = { activeExecutions: new Map([['exec-1', {}]]), eventDispatcher: { dispatch: jest.fn() } };
    const fakeModuleRegistry = { list: () => [{ name: 'empresa', loaded: true, metadata: { version: '1.0.0', dependencies: ['core'] } }] };
    const fakePluginRegistry = { list: () => [{ installed: true, manifest: { name: 'whatsapp', version: '1.0.0' }, plugin: {} }] };

    const service = new ArchitectureDiscoveryService({
      abielCore: { getTenantContext: () => ({ tenantId: 'tenant-1' }), getCapabilityRegistry: () => ({ findAll: async () => [] }) },
      runtimeEngine: fakeRuntimeEngine,
      eventBus: fakeEventBus,
      moduleRegistry: fakeModuleRegistry,
      pluginRegistry: fakePluginRegistry,
    });

    const overview = await service.getArchitectureOverview();
    expect(overview.modules.some((module) => module.name === 'empresa')).toBe(true);
    expect(overview.plugins.some((plugin) => plugin.name === 'whatsapp')).toBe(true);
    expect(overview.runtime.runtimeEngine.activeExecutions).toBe(1);
  });
});
