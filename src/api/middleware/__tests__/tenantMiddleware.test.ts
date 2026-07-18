const express = require('express');
const request = require('supertest');
const { resolveTenant } = require('../tenant/tenantMiddleware');
const { manejarErrores } = require('../../../infrastructure/api/interfaces/middleware/auth');

describe('tenantMiddleware', () => {
  test('resolveTenant accepts x-tenant-id as fallback source', async () => {
    const app = express();

    app.get('/tenant', resolveTenant, (req, res) => {
      res.json(req.tenant);
    });
    app.use(manejarErrores);

    const res = await request(app)
      .get('/tenant')
      .set('x-tenant-id', 'tenant-header')
      .expect(200);

    expect(res.body).toEqual({ tenantId: 'tenant-header', source: 'header' });
  });

  test('resolveTenant fails when no tenant context is present', async () => {
    const app = express();

    app.get('/tenant', resolveTenant, (req, res) => {
      res.json(req.tenant);
    });
    app.use(manejarErrores);

    const res = await request(app)
      .get('/tenant')
      .expect(400);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body.problem).toHaveProperty('code', 'TENANT_REQUIRED');
  });
});