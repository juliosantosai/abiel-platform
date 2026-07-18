const AdminService = require('../AdminService');

describe('AdminService architecture discovery', () => {
  test('getArchitectureOverview returns runtime, core, and event bus info', async () => {
    const fakeEventBus = { handlers: { testEvent: [() => {}] }, publish: jest.fn() };
    const fakeRuntimeEngine = { activeExecutions: new Map([["exec-1", {}]]), eventDispatcher: { dispatch: jest.fn() } };
    const abielCore = {
      getTenantContext: () => ({ tenantId: 'tenant-1' }),
      getCapabilityRegistry: () => ({ findAll: async () => [] }),
      getEventBus: () => fakeEventBus,
      healthCheck: { getStatus: () => ({ status: 'ok' }) },
    };

    const svc = new AdminService({ abielCore, runtimeEngine: fakeRuntimeEngine, eventBus: fakeEventBus });

    const overview = await svc.getArchitectureOverview();
    expect(overview).toHaveProperty('core');
    expect(overview).toHaveProperty('runtime');
    expect(overview).toHaveProperty('shared');
    expect(overview).toHaveProperty('modules');
    expect(overview.core.tenant.activeTenantId).toBe('tenant-1');
    expect(overview.runtime.runtimeEngine.activeExecutions).toBe(1);
    expect(overview.shared.some((svc) => svc.name === 'EventBus')).toBe(true);
  });

  test('getArchitectureModules returns a module list', async () => {
    const svc = new AdminService({});
    const modules = await svc.getArchitectureModules();
    expect(Array.isArray(modules)).toBe(true);
    expect(modules.some((module) => module.name === 'empresa')).toBe(true);
  });
});
