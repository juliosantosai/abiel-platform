const express = require('express');
const request = require('supertest');
const { crearRutasAdmin } = require('../../routes/admin.routes');
const { adminAuth } = require('../../middleware/adminAuth');

describe('Admin routes - logs and auth', () => {
  const ADMIN_TOKEN = 'test-admin-token';
  beforeAll(() => {
    process.env.ADMIN_SECRET_TOKEN = ADMIN_TOKEN;
  });

  test('GET /api/admin/logs returns paginated logs with timestamp', async () => {
    const logBuffer = {
      paginate: ({ page, perPage }) => ({ total: 1, page, perPage, items: [{ message: 'test', level: 'info' }] }),
    };

    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({ logBuffer }));

    const res = await request(app)
      .get('/api/admin/logs?page=1&limit=10')
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body.data).toHaveProperty('items');
  });

  test('GET /api/admin/logs returns 401 without token', async () => {
    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({}));

    const res = await request(app).get('/api/admin/logs').expect(401);
    expect(res.body).toHaveProperty('success', false);
  });
});
