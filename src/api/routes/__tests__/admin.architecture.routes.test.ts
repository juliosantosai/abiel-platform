const express = require('express');
const request = require('supertest');
const { crearRutasAdmin } = require('../../routes/admin.routes');
const { adminAuth } = require('../../middleware/adminAuth');

describe('Admin architecture routes', () => {
  const ADMIN_TOKEN = 'test-admin-token';
  beforeAll(() => {
    process.env.ADMIN_SECRET_TOKEN = ADMIN_TOKEN;
  });

  test('GET /api/admin/architecture returns architecture overview', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app)
      .get('/api/admin/architecture')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('core');
    expect(res.body.data).toHaveProperty('runtime');
    expect(res.body.data).toHaveProperty('shared');
    expect(res.body.data).toHaveProperty('modules');
  });

  test('GET /api/admin/architecture/modules returns module list', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app)
      .get('/api/admin/architecture/modules')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((module) => module.name === 'empresa')).toBe(true);
  });

  test('GET /api/admin/core returns core info', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app)
      .get('/api/admin/core')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('tenant');
    expect(res.body.data).toHaveProperty('eventBus');
    expect(res.body.data).toHaveProperty('capabilityRegistry');
  });

  test('GET /api/admin/engines returns engines info', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app)
      .get('/api/admin/engines')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('runtimeEngine');
    expect(res.body.data).toHaveProperty('eventDispatcher');
  });

  test('GET /api/admin/modules returns module list', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app)
      .get('/api/admin/modules')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((module) => module.name === 'empresa')).toBe(true);
  });

  test('GET /api/admin/shared returns shared service metadata', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app)
      .get('/api/admin/shared')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((service) => service.name === 'EventBus')).toBe(true);
  });

  test('GET /api/admin/runtime returns runtime state', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app)
      .get('/api/admin/runtime')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('process');
    expect(res.body.data).toHaveProperty('runtimeEngine');
    expect(res.body.data).toHaveProperty('eventBus');
  });

  test('GET /api/admin/architecture/CORE/eventbus returns component detail', async () => {
    const fakeEventBus = { handlers: { testEvent: [() => {}] }, publish: jest.fn() };
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({ eventBus: fakeEventBus }));

    const res = await request(app)
      .get('/api/admin/architecture/CORE/eventbus')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id', 'eventbus');
    expect(res.body.data).toHaveProperty('type', 'CORE');
    expect(res.body.data).toHaveProperty('health');
    expect(res.body.data).toHaveProperty('metrics');
    expect(res.body.data.graph).toEqual({ dependencies: [] });
  });

  test('GET /api/admin/architecture/MODULE/empresa returns module detail', async () => {
    const fakeModuleRegistry = { list: () => [{ name: 'empresa', loaded: true, metadata: { version: '1.0.0', dependencies: ['core'], description: 'Empresa module' }, path: '/src/modules/empresa', source: '/src/modules/empresa' }] };
    const fakeEventBus = { handlers: { testEvent: [() => {}] }, publish: jest.fn() };
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({ moduleRegistry: fakeModuleRegistry, eventBus: fakeEventBus }));

    const res = await request(app)
      .get('/api/admin/architecture/MODULE/empresa')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id', 'empresa');
    expect(res.body.data).toHaveProperty('type', 'MODULE');
    expect(res.body.data).toHaveProperty('dependencies');
    expect(res.body.data.dependencies).toContain('core');
    expect(res.body.data).toHaveProperty('health');
    expect(res.body.data.graph).toEqual({ dependencies: ['core'] });
  });
});
