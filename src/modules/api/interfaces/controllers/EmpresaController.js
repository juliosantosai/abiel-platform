class EmpresaController {
    constructor({ crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase }) {
        this.crearEmpresaUseCase = crearEmpresaUseCase;
        this.actualizarEmpresaUseCase = actualizarEmpresaUseCase;
        this.activarEmpresaUseCase = activarEmpresaUseCase;
        this.suspenderEmpresaUseCase = suspenderEmpresaUseCase;
        this.cancelarEmpresaUseCase = cancelarEmpresaUseCase;
    }

    async crear(req, res, next) {
        try {
            const { nombre, email, telefono } = req.body;
            const empresa = await this.crearEmpresaUseCase.execute({ nombre, email, telefono });
            res.status(201).json({ success: true, data: empresa });
        } catch (err) {
            next(err);
        }
    }

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const { nombre, email, telefono } = req.body;
            const empresa = await this.actualizarEmpresaUseCase.execute({ id, nombre, email, telefono, tenantContext: req.tenantContext });
            res.json({ success: true, data: empresa });
        } catch (err) {
            next(err);
        }
    }

    async activar(req, res, next) {
        try {
            const { id } = req.params;
            const empresa = await this.activarEmpresaUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: empresa });
        } catch (err) {
            next(err);
        }
    }

    async suspender(req, res, next) {
        try {
            const { id } = req.params;
            const empresa = await this.suspenderEmpresaUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: empresa });
        } catch (err) {
            next(err);
        }
    }

    async cancelar(req, res, next) {
        try {
            const { id } = req.params;
            const empresa = await this.cancelarEmpresaUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: empresa });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = EmpresaController;
