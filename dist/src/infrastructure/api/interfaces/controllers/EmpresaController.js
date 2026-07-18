"use strict";
const { ApiResponse } = require("../../contracts");
const { toEmpresaDto } = require("../../mappers/empresaHttpMapper");
const { validateCrearEmpresa, validateActualizarEmpresa, validateEmpresaId, } = require("../../validators/empresaValidators");
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
            const command = validateCrearEmpresa(req.body);
            const empresa = await this.crearEmpresaUseCase.execute(command);
            return res.status(201).json(ApiResponse.created({ req, data: toEmpresaDto(empresa) }));
        }
        catch (err) {
            next(err);
        }
    }
    async actualizar(req, res, next) {
        try {
            const command = validateActualizarEmpresa(req.params, req.body);
            const empresa = await this.actualizarEmpresaUseCase.execute({ ...command, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toEmpresaDto(empresa) }));
        }
        catch (err) {
            next(err);
        }
    }
    async activar(req, res, next) {
        try {
            const { id } = validateEmpresaId(req.params);
            const empresa = await this.activarEmpresaUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toEmpresaDto(empresa) }));
        }
        catch (err) {
            next(err);
        }
    }
    async suspender(req, res, next) {
        try {
            const { id } = validateEmpresaId(req.params);
            const empresa = await this.suspenderEmpresaUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toEmpresaDto(empresa) }));
        }
        catch (err) {
            next(err);
        }
    }
    async cancelar(req, res, next) {
        try {
            const { id } = validateEmpresaId(req.params);
            const empresa = await this.cancelarEmpresaUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toEmpresaDto(empresa) }));
        }
        catch (err) {
            next(err);
        }
    }
}
module.exports = EmpresaController;
//# sourceMappingURL=EmpresaController.js.map