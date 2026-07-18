const express = require('express');
const request = require('supertest');
const { crearRutasPublic } = require('../../routes/public.routes');
const { manejarErrores } = require('../../../infrastructure/api/interfaces/middleware/auth');

describe('Public routes', () => {
  test('GET /api/public/plans returns public plan catalog', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/public', crearRutasPublic({}));
    app.use(manejarErrores);

    const res = await request(app)
      .get('/api/public/plans')
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items.some((plan) => plan.code === 'starter')).toBe(true);
  });

  test('POST /api/public/signup returns pending signup contract', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/public', crearRutasPublic({}));
    app.use(manejarErrores);

    const res = await request(app)
      .post('/api/public/signup')
      .send({ companyName: 'Acme', email: 'ops@acme.com' })
      .expect(201);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toMatchObject({ status: 'PENDING', companyName: 'Acme', email: 'ops@acme.com' });
  });

  test('POST /api/public/demo validates required email field', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/public', crearRutasPublic({}));
    app.use(manejarErrores);

    const res = await request(app)
      .post('/api/public/demo')
      .send({})
      .expect(400);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body.problem).toHaveProperty('code', 'INVALID_BODY');
  });
});