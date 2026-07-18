"use strict";
const { assertNonEmptyString, assertOptionalString, assertEmail, ValidationError } = require("./commonValidators");
const VALID_ROLES = ["OWNER", "ADMIN", "OPERADOR", "LECTOR"];
function validateCrearUsuario(body = {}) {
    const { empresaId, nombre, email, rol } = body;
    assertNonEmptyString(empresaId, "empresaId");
    assertNonEmptyString(nombre, "nombre");
    assertNonEmptyString(email, "email");
    assertEmail(email, "email");
    if (!rol || !VALID_ROLES.includes(rol)) {
        throw new ValidationError(`rol es requerido y debe ser uno de: ${VALID_ROLES.join(", ")}.`);
    }
    return { empresaId, nombre, email, rol };
}
function validateActualizarUsuario(params = {}, body = {}) {
    const { id } = params;
    assertNonEmptyString(id, "id en params");
    const { nombre, email, rol } = body;
    if (nombre === undefined && email === undefined && rol === undefined) {
        throw new ValidationError("Al menos uno de nombre, email o rol debe ser proporcionado.");
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
    if (rol !== undefined && !VALID_ROLES.includes(rol)) {
        throw new ValidationError(`rol debe ser uno de: ${VALID_ROLES.join(", ")}.`);
    }
    return { id, nombre, email, rol };
}
function validateUsuarioId(params = {}) {
    const { id } = params;
    assertNonEmptyString(id, "id en params");
    return { id };
}
module.exports = {
    validateCrearUsuario,
    validateActualizarUsuario,
    validateUsuarioId,
};
//# sourceMappingURL=usuarioValidators.js.map