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
            
            // Validate required fields
            if (!empresaId || typeof empresaId !== "string" || empresaId.trim().length === 0) {
                return res.status(400).json({ success: false, error: "empresaId es requerido y debe ser un string no vacío." });
            }
            if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
                return res.status(400).json({ success: false, error: "nombre es requerido y debe ser un string no vacío." });
            }
            if (!email || typeof email !== "string") {
                return res.status(400).json({ success: false, error: "email es requerido y debe ser un string." });
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ success: false, error: "email debe ser una dirección de email válida." });
            }
            const validRoles = ["OWNER", "ADMIN", "OPERADOR", "LECTOR"];
            if (!rol || !validRoles.includes(rol)) {
                return res.status(400).json({ success: false, error: `rol es requerido y debe ser uno de: ${validRoles.join(", ")}.` });
            }
            
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
            
            // Validate id
            if (!id || typeof id !== "string" || id.trim().length === 0) {
                return res.status(400).json({ success: false, error: "id en params es requerido." });
            }
            
            // Validate input (at least one field must be provided)
            if (nombre === undefined && email === undefined && rol === undefined) {
                return res.status(400).json({ success: false, error: "Al menos uno de nombre, email o rol debe ser proporcionado." });
            }
            if (nombre !== undefined && (typeof nombre !== "string" || nombre.trim().length === 0)) {
                return res.status(400).json({ success: false, error: "nombre debe ser un string no vacío." });
            }
            if (email !== undefined && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
                return res.status(400).json({ success: false, error: "email debe ser una dirección de email válida." });
            }
            const validRoles = ["OWNER", "ADMIN", "OPERADOR", "LECTOR"];
            if (rol !== undefined && !validRoles.includes(rol)) {
                return res.status(400).json({ success: false, error: `rol debe ser uno de: ${validRoles.join(", ")}.` });
            }
            
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
