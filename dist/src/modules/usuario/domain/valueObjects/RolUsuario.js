"use strict";
const ValidationError = require("../../../../shared/errors/ValidationError");
class RolUsuario {
    constructor(rol) {
        if (!rol || typeof rol !== "string") {
            throw new ValidationError("El rol del usuario es obligatorio.", { rol: "required" });
        }
        const rolNormalizado = rol.trim().toUpperCase();
        const rolesValidos = ["OWNER", "ADMIN", "OPERADOR", "LECTOR"];
        if (!rolesValidos.includes(rolNormalizado)) {
            throw new ValidationError("El rol del usuario no es válido.", { rol: "invalid" });
        }
        this.value = rolNormalizado;
    }
}
module.exports = RolUsuario;
//# sourceMappingURL=RolUsuario.js.map