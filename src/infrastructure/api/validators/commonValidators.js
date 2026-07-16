const path = require("path");
const ValidationError = require(path.resolve(__dirname, "../../../shared/errors/ValidationError"));

function assertNonEmptyString(value, fieldName) {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} es requerido y debe ser un string no vacío.`);
  }
}

function assertOptionalString(value, fieldName) {
  if (value !== undefined && value !== null && typeof value !== "string") {
    throw new ValidationError(`${fieldName} debe ser un string.`);
  }
}

function assertEmail(value, fieldName = "email") {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new ValidationError(`${fieldName} debe ser una dirección de email válida.`);
  }
}

module.exports = {
  assertNonEmptyString,
  assertOptionalString,
  assertEmail,
  ValidationError,
};
