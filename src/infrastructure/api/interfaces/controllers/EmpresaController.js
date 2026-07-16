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
            
            // Validate input
            if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
                return res.status(400).json({ success: false, error: "nombre es requerido y debe ser un string no vacío." });
            }
            if (email && typeof email !== "string") {
                return res.status(400).json({ success: false, error: "email debe ser un string válido." });
            }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ success: false, error: "email debe ser una dirección de email válida." });
            }
            if (telefono && typeof telefono !== "string") {
                return res.status(400).json({ success: false, error: "telefono debe ser un string." });
            }
            
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
            
            // Validate id
            if (!id || typeof id !== "string" || id.trim().length === 0) {
                return res.status(400).json({ success: false, error: "id en params es requerido." });
            }
            
            // Validate input (at least one field must be provided)
            if (nombre === undefined && email === undefined && telefono === undefined) {
                return res.status(400).json({ success: false, error: "Al menos uno de nombre, email o telefono debe ser proporcionado." });
            }
            if (nombre !== undefined && (typeof nombre !== "string" || nombre.trim().length === 0)) {
                return res.status(400).json({ success: false, error: "nombre debe ser un string no vacío." });
            }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ success: false, error: "email debe ser una dirección de email válida." });
            }
            if (telefono && typeof telefono !== "string") {
                return res.status(400).json({ success: false, error: "telefono debe ser un string." });
            }
            
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
