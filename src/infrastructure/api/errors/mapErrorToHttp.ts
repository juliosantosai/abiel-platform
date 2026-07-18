const path = require("path");
const ApiHttpException = require("./ApiHttpException");

const ValidationErrorModule = require(path.resolve(__dirname, "../../../shared/errors/ValidationError"));
const DomainErrorModule = require(path.resolve(__dirname, "../../../shared/errors/DomainError"));
const NotFoundErrorModule = require(path.resolve(__dirname, "../../../shared/errors/NotFoundError"));
const TenantErrorModule = require(path.resolve(__dirname, "../../../core/security/TenantError"));

const ValidationError = ValidationErrorModule.ValidationError || ValidationErrorModule.default || ValidationErrorModule;
const DomainError = DomainErrorModule.DomainError || DomainErrorModule.default || DomainErrorModule;
const NotFoundError = NotFoundErrorModule.NotFoundError || NotFoundErrorModule.default || NotFoundErrorModule;
const TenantError = TenantErrorModule.TenantError || TenantErrorModule.default || TenantErrorModule;

function mapErrorToHttp(err) {
  if (err instanceof ApiHttpException) {
    return {
      status: err.status,
      code: err.code,
      message: err.message,
      fields: err.fields,
      details: err.details,
    };
  }

  if (err instanceof ValidationError) {
    return { status: 400, code: "VALIDATION_ERROR", message: err.message, fields: err.fields };
  }

  if (err instanceof NotFoundError) {
    return { status: 404, code: "NOT_FOUND", message: err.message };
  }

  if (err instanceof TenantError) {
    return { status: 403, code: "TENANT_FORBIDDEN", message: err.message };
  }

  if (err instanceof DomainError) {
    return { status: 422, code: "DOMAIN_ERROR", message: err.message };
  }

  return {
    status: 500,
    code: "INTERNAL_ERROR",
    message: err?.message || "Error interno del servidor.",
    details: process.env.NODE_ENV === "production" ? undefined : { stack: err?.stack },
  };
}

module.exports = { mapErrorToHttp };
