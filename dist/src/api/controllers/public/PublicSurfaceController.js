"use strict";
const { ApiResponse } = require('../../contracts');
const PublicCatalogService = require('../../services/public/PublicCatalogService');
class PublicSurfaceController {
    constructor({ publicCatalogService, ...dependencies } = {}) {
        this.service = publicCatalogService || new PublicCatalogService(dependencies);
    }
    async signup(req, res) {
        const data = await this.service.signup(req.body || {});
        res.status(201).json(ApiResponse.created({ req, data }));
    }
    async plans(req, res) {
        const data = await this.service.getPlans();
        res.json(ApiResponse.ok({ req, data }));
    }
    async demo(req, res) {
        const data = await this.service.requestDemo(req.body || {});
        res.status(202).json(ApiResponse.ok({ req, data }));
    }
}
module.exports = PublicSurfaceController;
//# sourceMappingURL=PublicSurfaceController.js.map