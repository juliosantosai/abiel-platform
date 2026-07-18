export {};

const request = require('supertest');
const jwt = require('jsonwebtoken');
const ExpressApp = require('./ExpressApp');

describe('ExpressApp API surfaces', () => {
    const TEST_JWT_SECRET = 'surface-jwt-secret';
    const ADMIN_TOKEN = 'surface-admin-token';

    beforeAll(() => {
        process.env.JWT_SECRET = TEST_JWT_SECRET;
        process.env.ADMIN_SECRET_TOKEN = ADMIN_TOKEN;
    });

    function createApp() {
        const expressApp = new ExpressApp({}, {
            runtimeEngine: { activeExecutions: new Map() },
            eventBus: { handlers: { runtimeReady: [() => {}] } },
            moduleRegistry: { list: () => [{ name: 'empresa' }] },
            pluginRegistry: { list: () => [{ manifest: { name: 'demo-plugin' } }] },
        });

        return expressApp.app;
    }

    test('mounts customer API under /api/customer', async () => {
        const app = createApp();
        const token = jwt.sign({ empresaId: 'tenant-1', usuarioId: 'u-1', role: 'CUSTOMER_OWNER' }, TEST_JWT_SECRET);

        const res = await request(app)
            .get('/api/customer/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('tenantId', 'tenant-1');
    });

    test('mounts core API under /api/core', async () => {
        const app = createApp();

        const res = await request(app)
            .get('/api/core/health')
            .set('x-admin-token', ADMIN_TOKEN)
            .expect(200);

        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('status', 'ok');
    });

    test('mounts public API under /api/public', async () => {
        const app = createApp();

        const res = await request(app)
            .get('/api/public/plans')
            .expect(200);

        expect(res.body).toHaveProperty('success', true);
        expect(Array.isArray(res.body.data.items)).toBe(true);
    });
});