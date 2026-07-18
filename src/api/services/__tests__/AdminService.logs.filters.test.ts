const AdminService = require('../AdminService');

describe('AdminService getLogs filters', () => {
  test('filters by level using in-memory items', async () => {
    const now = new Date();
    const items = [
      { message: 'info1', level: 'info', occurredAt: new Date(now.getTime() - 10000).toISOString() },
      { message: 'error1', level: 'error', occurredAt: new Date(now.getTime() - 5000).toISOString() },
      { message: 'info2', level: 'info', occurredAt: now.toISOString() },
    ];

    const logBuffer = { items };
    const svc = new AdminService({ logBuffer });

    const res = await svc.getLogs({ page: 1, perPage: 10, level: 'info' });
    expect(res.total).toBe(2);
    expect(res.items.every(i => i.level === 'info')).toBe(true);
  });

  test('filters by date range', async () => {
    const now = new Date();
    const items = [
      { message: 'old', level: 'info', occurredAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString() },
      { message: 'mid', level: 'info', occurredAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString() },
      { message: 'new', level: 'info', occurredAt: now.toISOString() },
    ];

    const logBuffer = { items };
    const svc = new AdminService({ logBuffer });

    const from = new Date(now.getTime() - 1000 * 60 * 90).toISOString(); // 90 minutes ago
    const res = await svc.getLogs({ page: 1, perPage: 10, from });
    expect(res.items.some(i => i.message === 'mid')).toBe(true);
    expect(res.items.every(i => i.message !== 'old')).toBe(true);
  });
});
