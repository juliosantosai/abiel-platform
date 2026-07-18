const ValidationError = require("../../../../shared/errors/ValidationError");

class NombreUsuario {
    constructor(nombre) {
        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            throw new ValidationError("El nombre del usuario es obligatorio.", { nombre: "required" });
        }

        const texto = nombre.trim();

        if (texto.length < 2) {
            throw new ValidationError("El nombre del usuario debe tener al menos 2 caracteres.", { nombre: "tooShort" });
        }

        if (texto.length > 100) {
            throw new ValidationError("El nombre del usuario no puede superar los 100 caracteres.", { nombre: "tooLong" });
        }

        this.value = texto;
    }
}

module.exports = NombreUsuario;
