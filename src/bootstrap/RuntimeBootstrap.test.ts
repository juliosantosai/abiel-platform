const RuntimeBootstrap = require('./RuntimeBootstrap');

describe('RuntimeBootstrap', () => {
  test('builds runtime components and returns valid runtime state', () => {
    const bootstrap = new RuntimeBootstrap({ tenantId: 'tenant-test', runtimeEnv: 'test', apiPort: 5001 });
    const runtime = bootstrap.bootstrap({ useCases: {}, startApi: false });

    expect(runtime.moduleRegistry).toBeDefined();
    expect(runtime.pluginRegistry).toBeDefined();
    expect(runtime.architectureRegistry).toBeDefined();
    expect(runtime.abielCore).toBeDefined();
    expect(runtime.runtimeEngine).toBeDefined();
    expect(runtime.runtimeEngine.activeExecutions).toBeInstanceOf(Map);

    const overview = runtime.architectureRegistry.getOverview();
    expect(overview.core.count).toBeGreaterThanOrEqual(3);
    expect(overview.engines.length).toBe(1);
    expect(overview.modules.length).toBeGreaterThanOrEqual(0);
    expect(overview.plugins.length).toBe(0);
  });
});
