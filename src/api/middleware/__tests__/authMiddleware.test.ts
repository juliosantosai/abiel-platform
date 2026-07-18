const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { authenticateRequest } = require('../auth/authMiddleware');
const { manejarErrores } = require('../../../infrastructure/api/interfaces/middleware/auth');

describe('authMiddleware', () => {
  const JWT_SECRET = 'auth-middleware-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  test('authenticateRequest normalizes req.user and tenantContext', async () => {
    const app = express();
    const token = jwt.sign({ empresaId: 'tenant-auth', usuarioId: 'user-auth', role: 'CUSTOMER_MEMBER' }, JWT_SECRET);

    app.get('/secure', authenticateRequest, (req, res) => {
      res.json({ tenantId: req.tenantContext?.tenantId, userId: req.user?.usuarioId });
    });
    app.use(manejarErrores);

    const res = await request(app)
      .get('/secure')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({ tenantId: 'tenant-auth', userId: 'user-auth' });
  });
});