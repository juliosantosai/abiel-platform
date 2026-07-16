class EmpresaController {
    constructor({ crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase }) {
        this.crearEmpresaUseCase = crearEmpresaUseCase;
        this.actualizarEmpresaUseCase = actualizarEmpresaUseCase;
        this.activarEmpresaUseCase = activarEmpresaUseCase;
        this.suspenderEmpresaUseCase = suspenderEmpresaUseCase;
        this.cancelarEmpresaUseCase = cancelarEmpresaUseCase;
    }

    async crearEmpresa(request) {
        const { id, nombre, email, telefono, plan } = request;
        return this.crearEmpresaUseCase.execute({ id, nombre, email, telefono, plan });
    }

    async actualizarEmpresa(request) {
        const { id, nombre } = request;
        return this.actualizarEmpresaUseCase.execute({ id, nombre });
    }

    async activarEmpresa(request) {
        const { id } = request;
        return this.activarEmpresaUseCase.execute({ id });
    }

    async suspenderEmpresa(request) {
        const { id } = request;
        return this.suspenderEmpresaUseCase.execute({ id });
    }

    async cancelarEmpresa(request) {
        const { id } = request;
        return this.cancelarEmpresaUseCase.execute({ id });
    }
}

module.exports = EmpresaController;
