"use strict";
const { assertNonEmptyString, assertOptionalString, assertEmail, ValidationError } = require("./commonValidators");
function validateCrearEmpresa(body = {}) {
    const { nombre, email, telefono } = body;
    assertNonEmptyString(nombre, "nombre");
    if (email !== undefined) {
        assertOptionalString(email, "email");
        if (email) {
            assertEmail(email, "email");
        }
    }
    if (telefono !== undefined) {
        assertOptionalString(telefono, "telefono");
    }
    return { nombre, email, telefono };
}
function validateActualizarEmpresa(params = {}, body = {}) {
    const { id } = params;
    assertNonEmptyString(id, "id en params");
    const { nombre, email, telefono } = body;
    if (nombre === undefined && email === undefined && telefono === undefined) {
        throw new ValidationError("Al menos uno de nombre, email o telefono debe ser proporcionado.");
    }
    if (nombre !== undefined) {
        assertNonEmptyString(nombre, "nombre");
    }
    if (email !== undefined) {
        assertOptionalString(email, "email");
        if (email) {
            assertEmail(email, "email");
        }
    }
    if (telefono !== undefined) {
        assertOptionalString(telefono, "telefono");
    }
    return { id, nombre, email, telefono };
}
function validateEmpresaId(params = {}) {
    const { id } = params;
    assertNonEmptyString(id, "id en params");
    return { id };
}
module.exports = {
    validateCrearEmpresa,
    validateActualizarEmpresa,
    validateEmpresaId,
};
//# sourceMappingURL=empresaValidators.js.map