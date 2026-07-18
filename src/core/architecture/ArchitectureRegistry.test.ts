const ArchitectureRegistry = require('./ArchitectureRegistry');

describe('ArchitectureRegistry', () => {
  test('registers and resolves components with dependencies', async () => {
    const registry = new ArchitectureRegistry();
    const core = registry.registerComponent({
      id: 'core',
      name: 'Core',
      type: 'CORE',
      version: '1.0.0',
      dependencies: ['event-bus'],
      capabilities: ['boot'],
      healthFn: () => ({ status: 'ACTIVE', latency: 12, memory: '64MB', errors: 0 }),
      metricsFn: () => ({ cpu: 10, memory: 64, requests: 3, errors: 0, uptimeSeconds: 120 }),
    });

    const engine = registry.registerComponent({
      id: 'runtime-engine',
      name: 'Runtime Engine',
      type: 'ENGINE',
      version: '1.0.0',
      dependencies: ['core'],
      capabilities: ['execute_agent'],
      metricsFn: () => ({ cpu: 10, memory: 128, requests: 0, errors: 0, uptimeSeconds: 45 }),
    });

    const detail = await registry.getComponentDetail('ENGINE', 'runtime-engine');
    expect(core.id).toBe('core');
    expect(engine.dependencies).toContain('core');
    expect(detail.health.status).toBe('UNKNOWN');
    expect(detail.metrics).toEqual(expect.objectContaining({ cpu: 10 }));
    expect(registry.getDependencies('ENGINE', 'runtime-engine')).toEqual(['core']);
  });
});
