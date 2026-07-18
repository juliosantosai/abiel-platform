const { ApiResponse } = require("../../contracts");
const { toUsuarioDto } = require("../../mappers/usuarioHttpMapper");
const {
    validateCrearUsuario,
    validateActualizarUsuario,
    validateUsuarioId,
} = require("../../validators/usuarioValidators");

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
            const command = validateCrearUsuario(req.body);
            const usuario = await this.crearUsuarioUseCase.execute(command);
            return res.status(201).json(ApiResponse.created({ req, data: toUsuarioDto(usuario) }));
        } catch (err) {
            next(err);
        }
    }

    async actualizar(req, res, next) {
        try {
            const command = validateActualizarUsuario(req.params, req.body);
            const usuario = await this.actualizarUsuarioUseCase.execute({ ...command, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toUsuarioDto(usuario) }));
        } catch (err) {
            next(err);
        }
    }

    async activar(req, res, next) {
        try {
            const { id } = validateUsuarioId(req.params);
            const usuario = await this.activarUsuarioUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toUsuarioDto(usuario) }));
        } catch (err) {
            next(err);
        }
    }

    async suspender(req, res, next) {
        try {
            const { id } = validateUsuarioId(req.params);
            const usuario = await this.suspenderUsuarioUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toUsuarioDto(usuario) }));
        } catch (err) {
            next(err);
        }
    }

    async cancelar(req, res, next) {
        try {
            const { id } = validateUsuarioId(req.params);
            const usuario = await this.cancelarUsuarioUseCase.execute({ id, tenantContext: req.tenantContext });
            return res.json(ApiResponse.ok({ req, data: toUsuarioDto(usuario) }));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UsuarioController;
