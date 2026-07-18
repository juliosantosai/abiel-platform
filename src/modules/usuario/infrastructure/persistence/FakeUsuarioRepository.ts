const UsuarioRepository = require("../../domain/repositories/UsuarioRepository");

class FakeUsuarioRepository extends UsuarioRepository {
    constructor() {
        super();
        this.storage = new Map();
    }

    async guardar(usuario) {
        this.storage.set(usuario.id, usuario);
        return usuario;
    }

    async buscarPorId(id) {
        return this.storage.get(id) || null;
    }

    async buscarPorEmail(email) {
        for (const usuario of this.storage.values()) {
            if (usuario.email === email) {
                return usuario;
            }
        }
        return null;
    }

    async buscarPorEmpresaId(empresaId) {
        return Array.from(this.storage.values()).filter(usuario => usuario.empresaId === empresaId);
    }

    async obtenerTodos() {
        return Array.from(this.storage.values());
    }

    async actualizar(usuario) {
        if (!this.storage.has(usuario.id)) {
            throw new Error(`Usuario con id ${usuario.id} no encontrado.`);
        }

        this.storage.set(usuario.id, usuario);
        return usuario;
    }

    async eliminar(id) {
        const usuario = this.storage.get(id);
        this.storage.delete(id);
        return usuario;
    }
}

module.exports = FakeUsuarioRepository;
