export {};

jest.mock("../../../../shared/database/prisma", () => ({
    conversationSession: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}));

const prisma = require("../../../../shared/database/prisma");
const PrismaConversationSessionRepository = require("./PrismaConversationSessionRepository");
const ConversationSession = require("../../domain/entities/ConversationSession");

const baseRecord = {
    id: "c-1",
    empresaId: "e-1",
    clienteId: "cl-1",
    estado: "BOT_ACTIVE",
    ultimaIntervencionHumana: null,
    creadoEn: new Date("2026-01-01T00:00:00Z"),
    actualizadoEn: new Date("2026-01-01T00:00:00Z")
};

describe("PrismaConversationSessionRepository", () => {
    let repo;

    beforeEach(() => {
        repo = new PrismaConversationSessionRepository();
        jest.clearAllMocks();
    });

    test("guardar() llama a prisma.create con los datos correctos", async () => {
        const session = new ConversationSession({ id: "c-1", empresaId: "e-1", clienteId: "cl-1" });
        prisma.conversationSession.create.mockResolvedValue(baseRecord);

        const result = await repo.guardar(session);

        expect(prisma.conversationSession.create).toHaveBeenCalledTimes(1);
        expect(prisma.conversationSession.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                id: "c-1",
                empresaId: "e-1",
                clienteId: "cl-1",
                estado: "BOT_ACTIVE"
            })
        });
        expect(result).toBe(session);
    });

    test("buscarPorId() devuelve una entidad cuando existe el registro", async () => {
        prisma.conversationSession.findUnique.mockResolvedValue(baseRecord);

        const result = await repo.buscarPorId("c-1");

        expect(prisma.conversationSession.findUnique).toHaveBeenCalledWith({ where: { id: "c-1" } });
        expect(result).toBeInstanceOf(ConversationSession);
        expect(result.id).toBe("c-1");
        expect(result.estado).toBe("BOT_ACTIVE");
    });

    test("buscarPorId() devuelve null cuando no existe el registro", async () => {
        prisma.conversationSession.findUnique.mockResolvedValue(null);

        const result = await repo.buscarPorId("no-existe");

        expect(result).toBeNull();
    });

    test("actualizar() llama a prisma.update con los campos mutables", async () => {
        const session = new ConversationSession({ id: "c-1", empresaId: "e-1", clienteId: "cl-1" });
        session.detectarIntervencionHumana();
        prisma.conversationSession.update.mockResolvedValue({ ...baseRecord, estado: "HUMAN_ACTIVE" });

        const result = await repo.actualizar(session);

        expect(prisma.conversationSession.update).toHaveBeenCalledWith({
            where: { id: "c-1" },
            data: expect.objectContaining({ estado: "HUMAN_ACTIVE" })
        });
        expect(result).toBe(session);
    });

    test("eliminar() llama a findUnique y delete, devuelve la entidad", async () => {
        prisma.conversationSession.findUnique.mockResolvedValue(baseRecord);
        prisma.conversationSession.delete.mockResolvedValue(baseRecord);

        const result = await repo.eliminar("c-1");

        expect(prisma.conversationSession.delete).toHaveBeenCalledWith({ where: { id: "c-1" } });
        expect(result).toBeInstanceOf(ConversationSession);
    });

    test("eliminar() devuelve null si no existe el registro", async () => {
        prisma.conversationSession.findUnique.mockResolvedValue(null);

        const result = await repo.eliminar("no-existe");

        expect(prisma.conversationSession.delete).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    test("buscarPorEmpresaId() devuelve un array de entidades", async () => {
        prisma.conversationSession.findMany.mockResolvedValue([baseRecord, { ...baseRecord, id: "c-2" }]);

        const result = await repo.buscarPorEmpresaId("e-1");

        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(ConversationSession);
    });
});
