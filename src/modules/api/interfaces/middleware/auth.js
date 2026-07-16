const jwt = require("jsonwebtoken");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Usar require.resolve para obtener el path correcto
const TenantContext = require(path.resolve(__dirname, "../../../../shared/tenant/TenantContext"));

/**
 * Middleware: Extrae y valida el JWT, guarda empresaId como tenantContext.
 */
function autenticar(req, res, next) {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "");

    if (!token) {
        return res.status(401).json({ success: false, error: "No se proporcionó token de autenticación." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.tenantContext = TenantContext.from({ tenantId: decoded.empresaId, source: "jwt" });
        req.usuario = decoded;
        next();
    } catch {
        res.status(401).json({ success: false, error: "Token inválido o expirado." });
    }
}

/**
 * Middleware: Mapea errores del dominio a respuestas HTTP estandarizadas.
 */
function manejarErrores(err, req, res, next) {
    const ValidationError = require(path.resolve(__dirname, "../../../../shared/errors/ValidationError"));
    const DomainError = require(path.resolve(__dirname, "../../../../shared/errors/DomainError"));
    const NotFoundError = require(path.resolve(__dirname, "../../../../shared/errors/NotFoundError"));
    const TenantError = require(path.resolve(__dirname, "../../../../shared/tenant/TenantError"));

    if (err instanceof ValidationError) {
        return res.status(400).json({ success: false, error: err.message, fields: err.fields });
    }
    if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: err.message });
    }
    if (err instanceof DomainError) {
        return res.status(422).json({ success: false, error: err.message });
    }
    if (err instanceof TenantError) {
        return res.status(403).json({ success: false, error: err.message });
    }

    res.status(500).json({ success: false, error: err.message || "Error interno del servidor." });
}

module.exports = { autenticar, manejarErrores, JWT_SECRET };
