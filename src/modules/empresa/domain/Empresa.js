class Empresa {

    constructor({
        id,
        nombre,
        email = null,
        telefono = null,

        // Identificador de la instancia de WhatsApp
        whatsappInstanceId = null,

        estado = "ACTIVA",
        plan = "BASICO",

        createdAt = new Date(),
        updatedAt = new Date()

    }) {

        if (!id) {
            throw new Error("El ID de la empresa es obligatorio.");
        }

        if (!nombre || nombre.trim() === "") {
            throw new Error("El nombre de la empresa es obligatorio.");
        }

        this.id = id;
        this.nombre = nombre.trim();
        this.email = email;
        this.telefono = telefono;

        this.whatsappInstanceId = whatsappInstanceId;

        this.estado = estado;
        this.plan = plan;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

    }

    actualizarNombre(nombre) {

        if (!nombre || nombre.trim() === "") {
            throw new Error("El nombre no puede estar vacío.");
        }

        this.nombre = nombre.trim();
        this.updatedAt = new Date();

    }

    cambiarPlan(plan) {

        this.plan = plan;
        this.updatedAt = new Date();

    }

    asignarWhatsappInstance(instanceId) {

        if (!instanceId) {
            throw new Error("El ID de la instancia es obligatorio.");
        }

        this.whatsappInstanceId = instanceId;
        this.updatedAt = new Date();

    }

    quitarWhatsappInstance() {

        this.whatsappInstanceId = null;
        this.updatedAt = new Date();

    }

    activar() {

        this.estado = "ACTIVA";
        this.updatedAt = new Date();

    }

    suspender() {

        this.estado = "SUSPENDIDA";
        this.updatedAt = new Date();

    }

    eliminar() {

        this.estado = "ELIMINADA";
        this.updatedAt = new Date();

    }

}

module.exports = Empresa;