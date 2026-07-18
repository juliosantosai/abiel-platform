"use strict";
const jwt = require("jsonwebtoken");
const path = require("path");
const { ApiError, createMetadata, createProblemDetails } = require("../../contracts");
const ApiHttpException = require("../../errors/ApiHttpException");
const { mapErrorToHttp } = require("../../errors/mapErrorToHttp");
// Usar require.resolve para obtener el path correcto
const TenantContext = require(path.resolve(__dirname, "../../../../core/security/TenantContext"));
/**
 * Obtiene JWT_SECRET - valida en tiempo de ejecución en lugar de en tiempo de carga
 */
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is required but not set.");
    }
    return secret;
}
/**
 * Middleware: Extrae y valida el JWT, guarda empresaId como tenantContext.
 */
function autenticar(req, res, next) {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) {
        return next(new ApiHttpException({
            status: 401,
            code: "AUTH_REQUIRED",
            message: "No se proporcionó token de autenticación.",
        }));
    }
    try {
        const JWT_SECRET = getJwtSecret();
        const decoded = jwt.verify(token, JWT_SECRET);
        req.tenantContext = TenantContext.from({ tenantId: decoded.empresaId, source: "jwt" });
        req.usuario = decoded;
        next();
    }
    catch (err) {
        if (err.message && err.message.includes("JWT_SECRET")) {
            return next(new ApiHttpException({
                status: 500,
                code: "AUTH_CONFIG_ERROR",
                message: "Configuration error: JWT_SECRET not set.",
            }));
        }
        return next(new ApiHttpException({
            status: 401,
            code: "AUTH_INVALID_TOKEN",
            message: "Token inválido o expirado.",
        }));
    }
}
/**
 * Middleware: Mapea errores del dominio a respuestas HTTP estandarizadas.
 */
function manejarErrores(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    const mapped = mapErrorToHttp(err);
    const problem = createProblemDetails({
        title: mapped.message,
        detail: mapped.message,
        status: mapped.status,
        code: mapped.code,
        fields: mapped.fields,
        details: mapped.details,
        instance: req.originalUrl,
    });
    return res.status(mapped.status).json(ApiError.createApiError({
        problem,
        metadata: createMetadata(req),
    }));
}
module.exports = { autenticar, manejarErrores };
//# sourceMappingURL=auth.js.map