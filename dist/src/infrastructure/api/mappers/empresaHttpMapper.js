"use strict";
function toEmpresaDto(empresa) {
    if (!empresa) {
        return empresa;
    }
    if (typeof empresa.toJSON === "function") {
        return empresa.toJSON();
    }
    return {
        id: empresa.id,
        nombre: empresa.nombre,
        email: empresa.email,
        telefono: empresa.telefono,
        estado: empresa.estado,
        plan: empresa.plan,
        createdAt: empresa.createdAt,
        updatedAt: empresa.updatedAt,
    };
}
module.exports = { toEmpresaDto };
//# sourceMappingURL=empresaHttpMapper.js.map