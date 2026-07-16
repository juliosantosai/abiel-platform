class UsuarioController {
    constructor({ crearUsuarioUseCase, actualizarUsuarioUseCase, activarUsuarioUseCase, suspenderUsuarioUseCase, cancelarUsuarioUseCase }) {
        this.crearUsuarioUseCase = crearUsuarioUseCase;
        this.actualizarUsuarioUseCase = actualizarUsuarioUseCase;
        this.activarUsuarioUseCase = activarUsuarioUseCase;
        this.suspenderUsuarioUseCase = suspenderUsuarioUseCase;
        this.cancelarUsuarioUseCase = cancelarUsuarioUseCase;
    }

    async crear(req, res, next) {
        try {
            const { empresaId, nombre, email, rol } = req.body;
            const usuario = await this.crearUsuarioUseCase.execute({ empresaId, nombre, email, rol });
            res.status(201).json({ success: true, data: usuario });
        } catch (err) {
            next(err);
        }
    }

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const { nombre, email, rol } = req.body;
            const usuario = await this.actualizarUsuarioUseCase.execute({ id, nombre, email, rol, tenantContext: req.tenantContext });
            res.json({ success: true, data: usuario });
        } catch (err) {
            next(err);
        }
    }

    async activar(req, res, next) {
        try {
            const { id } = req.params;
            const usuario = await this.activarUsuarioUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: usuario });
        } catch (err) {
            next(err);
        }
    }

    async suspender(req, res, next) {
        try {
            const { id } = req.params;
            const usuario = await this.suspenderUsuarioUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: usuario });
        } catch (err) {
            next(err);
        }
    }

    async cancelar(req, res, next) {
        try {
            const { id } = req.params;
            const usuario = await this.cancelarUsuarioUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: usuario });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UsuarioController;
