"use strict";
function toUsuarioDto(usuario) {
    if (!usuario) {
        return usuario;
    }
    if (typeof usuario.toJSON === "function") {
        return usuario.toJSON();
    }
    return {
        id: usuario.id,
        empresaId: usuario.empresaId,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt,
    };
}
module.exports = { toUsuarioDto };
//# sourceMappingURL=usuarioHttpMapper.js.map