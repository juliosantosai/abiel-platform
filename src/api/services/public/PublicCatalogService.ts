class PublicCatalogService {
    async getPlans() {
        return {
            items: [
                { code: 'starter', name: 'Starter', monthlyPrice: 0, currency: 'USD' },
                { code: 'growth', name: 'Growth', monthlyPrice: 199, currency: 'USD' },
                { code: 'enterprise', name: 'Enterprise', monthlyPrice: null, currency: 'USD' },
            ],
        };
    }

    async signup(payload = {}) {
        return {
            status: 'PENDING',
            companyName: payload.companyName || null,
            email: payload.email || null,
        };
    }

    async requestDemo(payload = {}) {
        return {
            status: 'QUEUED',
            email: payload.email || null,
            requestedAt: new Date().toISOString(),
        };
    }
}

module.exports = PublicCatalogService;