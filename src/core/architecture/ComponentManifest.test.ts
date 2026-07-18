const ComponentManifest = require('./ComponentManifest');

describe('ComponentManifest', () => {
  test('creates a manifest from runtime component data', () => {
    const manifest = new ComponentManifest({
      id: 'eventbus',
      name: 'EventBus',
      type: 'CORE',
      version: '1.0.0',
      description: 'Event bus for runtime delivery',
      capabilities: ['publish', 'subscribe'],
      dependencies: [],
      status: 'started',
      metadata: { region: 'us-east-1' },
    });

    expect(manifest.toJSON()).toEqual({
      id: 'eventbus',
      name: 'EventBus',
      type: 'CORE',
      version: '1.0.0',
      description: 'Event bus for runtime delivery',
      capabilities: ['publish', 'subscribe'],
      dependencies: [],
      status: 'STARTED',
      metadata: { region: 'us-east-1' },
    });
  });

  test('normalizes component type alias SERVICE to SHARED and supports default runtime fields', async () => {
    const manifest = new ComponentManifest({
      id: 'logger',
      name: 'Logger',
      type: 'service',
      status: 'active',
    });

    expect(manifest.type).toBe('SHARED');
    expect(manifest.status).toBe('ACTIVE');
    expect(manifest.metadata).toEqual({});

    const health = await manifest.health();
    const metrics = await manifest.metrics();

    expect(health).toEqual(expect.objectContaining({ status: 'ACTIVE' }));
    expect(metrics).toHaveProperty('uptimeSeconds');
    expect(metrics).toHaveProperty('memoryUsageMB');
    expect(metrics).toHaveProperty('cpuCount');
  });

  test('throws when the component type is invalid', () => {
    expect(() => new ComponentManifest({ type: 'unknown' })).toThrow('Invalid component type: unknown');
  });
});
