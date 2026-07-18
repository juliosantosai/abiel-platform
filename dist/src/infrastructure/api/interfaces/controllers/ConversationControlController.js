"use strict";
const { ApiResponse } = require("../../contracts");
const { validateConversationId } = require("../../validators/conversationValidators");
const { toConversationControlDto } = require("../../mappers/conversationHttpMapper");
class ConversationControlController {
    constructor({ bloquearConversacionUseCase, cerrarConversacionUseCase }) {
        this.bloquearConversacionUseCase = bloquearConversacionUseCase;
        this.cerrarConversacionUseCase = cerrarConversacionUseCase;
    }
    async bloquear(req, res, next) {
        try {
            const { id } = validateConversationId(req.params);
            const resultado = await this.bloquearConversacionUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toConversationControlDto(resultado) }));
        }
        catch (err) {
            next(err);
        }
    }
    async cerrar(req, res, next) {
        try {
            const { id } = validateConversationId(req.params);
            const resultado = await this.cerrarConversacionUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toConversationControlDto(resultado) }));
        }
        catch (err) {
            next(err);
        }
    }
}
module.exports = ConversationControlController;
//# sourceMappingURL=ConversationControlController.js.map