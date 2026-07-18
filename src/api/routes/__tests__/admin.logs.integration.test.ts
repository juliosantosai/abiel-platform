const express = require('express');
const request = require('supertest');
const { crearRutasAdmin } = require('../../routes/admin.routes');
const { adminAuth } = require('../../middleware/adminAuth');

describe('Admin routes integration - logs filters', () => {
  const ADMIN_TOKEN = 'test-admin-token';
  beforeAll(() => {
    process.env.ADMIN_SECRET_TOKEN = ADMIN_TOKEN;
  });

  test('GET /api/admin/logs filters by level and date range', async () => {
    const now = new Date();
    const items = [
      { message: 'info-old', level: 'info', occurredAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString() },
      { message: 'error-mid', level: 'error', occurredAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString() },
      { message: 'error-new', level: 'error', occurredAt: now.toISOString() },
    ];

    // simple in-memory logBuffer used by AdminService
    const logBuffer = { items };

    const app = express();
    app.use('/api/admin', adminAuth, crearRutasAdmin({ logBuffer }));

    const from = new Date(now.getTime() - 1000 * 60 * 90).toISOString(); // 90 minutes ago
    const res = await request(app)
      .get(`/api/admin/logs?page=1&limit=10&level=error&from=${encodeURIComponent(from)}`)
      .set('x-admin-token', ADMIN_TOKEN)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('items');
    const returned = res.body.data.items;
    expect(Array.isArray(returned)).toBe(true);
    // both items should be error level and within range (exclude old)
    expect(returned.every(i => i.level === 'error')).toBe(true);
    expect(returned.some(i => i.message === 'error-mid')).toBe(true);
    expect(returned.some(i => i.message === 'error-new')).toBe(true);
    expect(returned.some(i => i.message === 'info-old')).toBe(false);
  });
});
