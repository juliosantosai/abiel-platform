"use strict";
const ApiHttpException = require("../errors/ApiHttpException");
const DEFAULT_ADMIN_API_KEY = "dev-admin-secret";
function getAdminApiKey() {
    const adminApiKey = process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN;
    if (adminApiKey) {
        return adminApiKey;
    }
    if (process.env.NODE_ENV !== "production") {
        process.env.ADMIN_API_KEY = DEFAULT_ADMIN_API_KEY;
        return DEFAULT_ADMIN_API_KEY;
    }
    return null;
}
function autenticarAdmin(req, res, next) {
    const headerKey = req.headers["x-admin-api-key"] || "";
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.replace(/^Bearer\s+/i, "");
    const token = String(headerKey || bearerToken || "").trim();
    const adminApiKey = getAdminApiKey();
    if (!adminApiKey) {
        return next(new ApiHttpException({
            status: 500,
            code: "ADMIN_AUTH_CONFIG_ERROR",
            message: "Admin API key is not configured.",
        }));
    }
    if (!token) {
        return next(new ApiHttpException({
            status: 401,
            code: "ADMIN_AUTH_REQUIRED",
            message: "No admin API key provided.",
        }));
    }
    if (token !== adminApiKey) {
        return next(new ApiHttpException({
            status: 401,
            code: "ADMIN_AUTH_INVALID_TOKEN",
            message: "Admin API key is invalid.",
        }));
    }
    next();
}
module.exports = { autenticarAdmin };
//# sourceMappingURL=adminAuth.js.map