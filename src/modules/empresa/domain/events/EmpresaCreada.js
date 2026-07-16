class EmpresaCreada {
    constructor({ empresaId, nombre, estado }) {
        this.name = "EmpresaCreada";
        this.data = { empresaId, nombre, estado };
        this.occurredAt = new Date();
    }
}

module.exports = EmpresaCreada;
