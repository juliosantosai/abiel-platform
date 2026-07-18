const ValidationError = require("../../../../shared/errors/ValidationError");

class EmailUsuario {
    constructor(email) {
        if (!email || typeof email !== "string") {
            throw new ValidationError("El email del usuario es obligatorio.", { email: "required" });
        }

        const valorNormalizado = email.trim().toLowerCase();

        if (valorNormalizado === "") {
            throw new ValidationError("El email del usuario es obligatorio.", { email: "required" });
        }

        const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!patronEmail.test(valorNormalizado)) {
            throw new ValidationError("El email del usuario no tiene un formato válido.", { email: "invalid" });
        }

        this.value = valorNormalizado;
    }
}

module.exports = EmailUsuario;
