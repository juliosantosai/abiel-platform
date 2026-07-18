"use strict";
const { ApiResponse } = require('../../contracts');
const CustomerPortalService = require('../../services/customer/CustomerPortalService');
class CustomerPortalController {
    constructor({ customerPortalService, ...dependencies } = {}) {
        this.service = customerPortalService || new CustomerPortalService(dependencies);
    }
    async profile(req, res) {
        const data = await this.service.getProfile({ user: req.user, tenant: req.tenant });
        res.json(ApiResponse.ok({ req, data }));
    }
    async usage(req, res) {
        const data = await this.service.getUsage({ user: req.user, tenant: req.tenant });
        res.json(ApiResponse.ok({ req, data }));
    }
    async agents(req, res) {
        const data = await this.service.getAgents({ user: req.user, tenant: req.tenant });
        res.json(ApiResponse.ok({ req, data }));
    }
    async conversations(req, res) {
        const data = await this.service.getConversations({ user: req.user, tenant: req.tenant });
        res.json(ApiResponse.ok({ req, data }));
    }
    async knowledge(req, res) {
        const data = await this.service.getKnowledge({ user: req.user, tenant: req.tenant });
        res.json(ApiResponse.ok({ req, data }));
    }
}
module.exports = CustomerPortalController;
//# sourceMappingURL=CustomerPortalController.js.map