const { ApiResponse } = require("../../contracts");
const AdminService = require("../../application/AdminService");

class AdminController {
    constructor({ adminService } = {}) {
        this.adminService = adminService || new AdminService();
    }

    async getStatus(req, res, next) {
        try {
            const status = this.adminService.getStatus();
            return res.status(200).json(ApiResponse.ok({ req, data: status }));
        } catch (err) {
            if (typeof next === "function") {
                return next(err);
            }
            throw err;
        }
    }

    async getHealth(req, res, next) {
        try {
            const health = this.adminService.getHealth();
            return res.status(200).json(ApiResponse.ok({ req, data: health }));
        } catch (err) {
            if (typeof next === "function") {
                return next(err);
            }
            throw err;
        }
    }

    async getRuntime(req, res, next) {
        try {
            const runtime = this.adminService.getRuntimeState();
            return res.status(200).json(ApiResponse.ok({ req, data: runtime }));
        } catch (err) {
            if (typeof next === "function") {
                return next(err);
            }
            throw err;
        }
    }

    async getOverview(req, res, next) {
        try {
            const overview = this.adminService.getOverview();
            return res.status(200).json(ApiResponse.ok({ req, data: overview }));
        } catch (err) {
            if (typeof next === "function") {
                return next(err);
            }
            throw err;
        }
    }
}

module.exports = AdminController;
