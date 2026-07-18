const express = require('express');
const request = require('supertest');
const { crearRutasCore } = require('../../routes/core.routes');
const { adminAuth } = require('../../middleware/adminAuth');
const { manejarErrores } = require('../../../infrastructure/api/interfaces/middleware/auth');

describe('Core routes', () => {
  const ADMIN_TOKEN = 'core-admin-token';

  beforeAll(() => {
    process.env.ADMIN_SECRET_TOKEN = ADMIN_TOKEN;
  });

  test('GET /api/core/health returns runtime health for internal consumers', async () => {
    const app = express();
    app.use('/api/core', adminAuth, crearRutasCore({
      runtimeEngine: { activeExecutions: new Map() },
      eventBus: { handlers: { runtimeReady: [() => {}] } },
      moduleRegistry: { list: () => [{ name: 'empresa' }] },
      pluginRegistry: { list: () => [{ manifest: { name: 'demo-plugin' } }] },
    }));
    app.use(manejarErrores);

    const res = await request(app)
      .get('/api/core/health')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toMatchObject({ status: 'ok', runtimeEngine: true, eventBus: true });
  });

  test('GET /api/core/modules returns mounted runtime modules', async () => {
    const app = express();
    app.use('/api/core', adminAuth, crearRutasCore({
      moduleRegistry: { list: () => [{ name: 'empresa' }, { name: 'usuario' }] },
    }));
    app.use(manejarErrores);

    const res = await request(app)
      .get('/api/core/modules')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((module) => module.name === 'empresa')).toBe(true);
  });
});