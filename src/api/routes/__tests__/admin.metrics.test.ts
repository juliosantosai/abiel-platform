const express = require('express');
const request = require('supertest');
const { crearRutasAdmin } = require('../../routes/admin.routes');
const { adminAuth } = require('../../middleware/adminAuth');

describe('Admin routes - metrics', () => {
  const ADMIN_TOKEN = 'test-admin-token';
  beforeAll(() => {
    process.env.ADMIN_SECRET_TOKEN = ADMIN_TOKEN;
  });

  test('GET /api/admin/metrics returns metrics snapshot', async () => {
    const metrics = { snapshot: () => ({ startedAt: new Date().toISOString(), eventsPublished: 5, capabilitiesRegistered: 2 }) };

    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({ metrics }));

    const res = await request(app)
      .get('/api/admin/metrics')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('eventsPublished');
    expect(res.body.data.eventsPublished).toBe(5);
  });

  test('GET /api/admin/metrics returns 401 without token', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app).get('/api/admin/metrics').expect(401);
    expect(res.body).toHaveProperty('success', false);
  });
});
