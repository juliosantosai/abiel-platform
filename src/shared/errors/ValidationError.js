// src/shared/errors/ValidationError.js

class ValidationError extends Error {

    constructor(message, fields = {}) {

        super(message);

        this.name = "ValidationError";

        this.fields = fields;

    }

}

module.exports = ValidationError;