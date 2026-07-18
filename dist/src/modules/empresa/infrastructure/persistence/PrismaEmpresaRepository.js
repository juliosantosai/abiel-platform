"use strict";
const EmpresaRepository = require("../../domain/repositories/EmpresaRepository");
const prisma = require("../../../../shared/database/prisma");
const Empresa = require("../../domain/entities/Empresa");
class PrismaEmpresaRepository extends EmpresaRepository {
    async guardar(empresa) {
        const data = {
            id: empresa.id,
            nombre: empresa.nombre,
            email: empresa.email,
            telefono: empresa.telefono,
            whatsappInstanceId: empresa.whatsappInstanceId,
            estado: empresa.estado,
            plan: empresa.plan,
            createdAt: empresa.createdAt,
            updatedAt: empresa.updatedAt
        };
        return prisma.empresa.upsert({
            where: { id: empresa.id },
            update: data,
            create: data,
        });
    }
    async buscarPorId(id) {
        const record = await prisma.empresa.findUnique({
            where: { id }
        });
        return record ? new Empresa(record) : null;
    }
    async buscarPorWhatsappInstanceId(instanceId) {
        const record = await prisma.empresa.findFirst({
            where: { whatsappInstanceId: instanceId }
        });
        return record ? new Empresa(record) : null;
    }
    async obtenerTodas() {
        const records = await prisma.empresa.findMany();
        return records.map(record => new Empresa(record));
    }
    async actualizar(empresa) {
        const data = {
            nombre: empresa.nombre,
            email: empresa.email,
            telefono: empresa.telefono,
            whatsappInstanceId: empresa.whatsappInstanceId,
            estado: empresa.estado,
            plan: empresa.plan,
            updatedAt: empresa.updatedAt
        };
        return prisma.empresa.update({
            where: { id: empresa.id },
            data
        });
    }
    async eliminar(id) {
        return prisma.empresa.delete({
            where: { id }
        });
    }
}
module.exports = PrismaEmpresaRepository;
//# sourceMappingURL=PrismaEmpresaRepository.js.map