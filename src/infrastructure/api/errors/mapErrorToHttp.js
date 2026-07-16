const path = require("path");
const ApiHttpException = require("./ApiHttpException");

const ValidationError = require(path.resolve(__dirname, "../../../shared/errors/ValidationError"));
const DomainError = require(path.resolve(__dirname, "../../../shared/errors/DomainError"));
const NotFoundError = require(path.resolve(__dirname, "../../../shared/errors/NotFoundError"));
const TenantError = require(path.resolve(__dirname, "../../../shared/tenant/TenantError"));

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
