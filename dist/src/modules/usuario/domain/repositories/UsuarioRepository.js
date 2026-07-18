"use strict";
const DomainError = require("../../../../shared/errors/DomainError");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
class UsuarioRepository {
    async guardar(usuario) {
        throw new DomainError("Método guardar() no implementado.");
    }
    async buscarPorId(id) {
        throw new NotFoundError("Usuario", id);
    }
    async buscarPorEmail(email) {
        throw new NotFoundError("Usuario", email);
    }
    async buscarPorEmpresaId(empresaId) {
        throw new NotFoundError("Usuario", empresaId);
    }
    async obtenerTodos() {
        throw new DomainError("Método obtenerTodos() no implementado.");
    }
    async actualizar(usuario) {
        throw new DomainError("Método actualizar() no implementado.");
    }
    async eliminar(id) {
        throw new DomainError("Método eliminar() no implementado.");
    }
}
module.exports = UsuarioRepository;
//# sourceMappingURL=UsuarioRepository.js.map