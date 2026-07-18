

// src/shared/errors/NotFoundError.js

class NotFoundError extends Error {

    constructor(resource, id) {

        super(`${resource} no encontrado`);

        this.name = "NotFoundError";

        this.resource = resource;

        this.id = id;

    }

}

module.exports = NotFoundError;