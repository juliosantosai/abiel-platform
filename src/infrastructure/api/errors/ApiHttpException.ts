class ApiHttpException extends Error {
  constructor({ status = 500, code = "INTERNAL_ERROR", message = "Internal error", details, fields, cause }) {
    super(message);
    this.name = "ApiHttpException";
    this.status = status;
    this.code = code;
    this.details = details;
    this.fields = fields;
    this.cause = cause;
  }
}

module.exports = ApiHttpException;
