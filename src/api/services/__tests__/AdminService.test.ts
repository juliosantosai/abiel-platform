const AdminService = require('../AdminService');

describe('AdminService', () => {
  test('getCapabilities returns capabilities from abielCore registry', async () => {
    const fakeRegistry = { findAll: async () => [{ name: 'cap1' }, { name: 'cap2' }] };
    const abielCore = { getCapabilityRegistry: () => fakeRegistry };
    const svc = new AdminService({ abielCore });

    const caps = await svc.getCapabilities();
    expect(Array.isArray(caps)).toBe(true);
    expect(caps.length).toBe(2);
    expect(caps[0].name).toBe('cap1');
  });

  test('getEventBus returns event stats from facade/eventBus', async () => {
    const eventBus = { handlers: { evt: [() => {}] }, publish: jest.fn(), subscribe: jest.fn() };
    const svc = new AdminService({ eventBus });

    const stats = await svc.getEventBus();
    expect(stats).toHaveProperty('available');
    expect(stats).toHaveProperty('subscribers');
  });

  test('getMetrics returns metrics snapshot when provided', async () => {
    const metrics = { snapshot: () => ({ startedAt: new Date().toISOString(), eventsPublished: 5, capabilitiesRegistered: 2 }) };
    const svc = new AdminService({ metrics });

    const m = await svc.getMetrics();
    expect(m).toHaveProperty('eventsPublished');
    expect(m.eventsPublished).toBe(5);
  });

  test('getLogs returns empty pagination when none available', async () => {
    const svc = new AdminService({});

    const logs = await svc.getLogs({ page: 1, perPage: 10 });
    expect(logs).toHaveProperty('total');
    expect(logs.page).toBe(1);
  });
});
