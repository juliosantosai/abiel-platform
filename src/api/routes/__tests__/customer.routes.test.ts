const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { crearRutasCustomer } = require('../../routes/customer.routes');
const { manejarErrores } = require('../../../infrastructure/api/interfaces/middleware/auth');

describe('Customer routes', () => {
  const JWT_SECRET = 'customer-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  test('GET /api/customer/profile returns tenant-aware customer profile', async () => {
    const app = express();
    const token = jwt.sign({ empresaId: 'tenant-1', usuarioId: 'u-1', role: 'CUSTOMER_OWNER' }, JWT_SECRET);

    app.use('/api/customer', crearRutasCustomer({ runtimeEngine: { activeExecutions: new Map() } }));
    app.use(manejarErrores);

    const res = await request(app)
      .get('/api/customer/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toMatchObject({ tenantId: 'tenant-1', userId: 'u-1', role: 'CUSTOMER_OWNER' });
  });

  test('GET /api/customer/usage rejects unauthenticated requests', async () => {
    const app = express();

    app.use('/api/customer', crearRutasCustomer({}));
    app.use(manejarErrores);

    const res = await request(app)
      .get('/api/customer/usage')
      .expect(401);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('code', 'AUTH_REQUIRED');
  });
});