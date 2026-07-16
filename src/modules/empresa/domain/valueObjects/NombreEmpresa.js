const ValidationError = require("../../../../shared/errors/ValidationError");

class NombreEmpresa {
    constructor(nombre) {
        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            throw new ValidationError("El nombre de la empresa es obligatorio.", { nombre: "required" });
        }

        const texto = nombre.trim();

        if (texto.length < 2) {
            throw new ValidationError("El nombre de la empresa debe tener al menos 2 caracteres.", { nombre: "tooShort" });
        }

        this.value = texto;
    }
}

module.exports = NombreEmpresa;
