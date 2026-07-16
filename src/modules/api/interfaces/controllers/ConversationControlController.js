class ConversationControlController {
    constructor({ bloquearConversacionUseCase, cerrarConversacionUseCase }) {
        this.bloquearConversacionUseCase = bloquearConversacionUseCase;
        this.cerrarConversacionUseCase = cerrarConversacionUseCase;
    }

    async bloquear(req, res, next) {
        try {
            const { id } = req.params;
            
            // Validate id
            if (!id || typeof id !== "string" || id.trim().length === 0) {
                return res.status(400).json({ success: false, error: "id en params es requerido." });
            }
            
            const resultado = await this.bloquearConversacionUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: resultado });
        } catch (err) {
            next(err);
        }
    }

    async cerrar(req, res, next) {
        try {
            const { id } = req.params;
            
            // Validate id
            if (!id || typeof id !== "string" || id.trim().length === 0) {
                return res.status(400).json({ success: false, error: "id en params es requerido." });
            }
            
            const resultado = await this.cerrarConversacionUseCase.execute({ id, tenantContext: req.tenantContext });
            res.json({ success: true, data: resultado });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ConversationControlController;
