const UsuarioRepository = require("../../domain/repositories/UsuarioRepository");
const prisma = require("../../../shared/database/prisma");
const Usuario = require("../../domain/entities/Usuario");

class PrismaUsuarioRepository extends UsuarioRepository {
    async guardar(usuario) {
        const data = {
            id: usuario.id,
            empresaId: usuario.empresaId,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt
        };

        return prisma.usuario.create({ data });
    }

    async buscarPorId(id) {
        const record = await prisma.usuario.findUnique({
            where: { id }
        });

        return record ? new Usuario(record) : null;
    }

    async buscarPorEmail(email) {
        const record = await prisma.usuario.findFirst({
            where: { email }
        });

        return record ? new Usuario(record) : null;
    }

    async buscarPorEmpresaId(empresaId) {
        const records = await prisma.usuario.findMany({
            where: { empresaId }
        });

        return records.map(record => new Usuario(record));
    }

    async obtenerTodos() {
        const records = await prisma.usuario.findMany();
        return records.map(record => new Usuario(record));
    }

    async actualizar(usuario) {
        const data = {
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            updatedAt: usuario.updatedAt
        };

        return prisma.usuario.update({
            where: { id: usuario.id },
            data
        });
    }

    async eliminar(id) {
        return prisma.usuario.delete({
            where: { id }
        });
    }
}

module.exports = PrismaUsuarioRepository;
