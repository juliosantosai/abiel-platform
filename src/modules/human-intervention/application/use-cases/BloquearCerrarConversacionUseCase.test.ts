export {};

const BloquearConversacionUseCase = require("./BloquearConversacionUseCase");
const CerrarConversacionUseCase = require("./CerrarConversacionUseCase");
const ConversationSession = require("../../domain/entities/ConversationSession");
const ConversationLocked = require("../../domain/events/ConversationLocked");
const ConversationClosed = require("../../domain/events/ConversationClosed");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const TenantError = require("../../../../core/security/TenantError");

const makeSession = (extra = {}) => new ConversationSession({
    id: "c-1", empresaId: "e-1", clienteId: "cl-1", ...extra
});

describe("BloquearConversacionUseCase", () => {
    test("debe bloquear la conversación y publicar ConversationLocked", async () => {
        const session = makeSession();
        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn(async (s) => s) };
        const publisher = { publish: jest.fn() };
        const useCase = new BloquearConversacionUseCase({ repository: repo, eventPublisher: publisher });

        const result = await useCase.execute({ conversationId: "c-1" });

        expect(result.estado).toBe("HUMAN_LOCKED");
        expect(publisher.publish).toHaveBeenCalledTimes(1);
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(ConversationLocked);
    });

    test("debe lanzar NotFoundError si no existe", async () => {
        const repo = { buscarPorId: jest.fn(async () => null) };
        const useCase = new BloquearConversacionUseCase({ repository: repo });
        await expect(useCase.execute({ conversationId: "x" })).rejects.toThrow(NotFoundError);
    });

    test("debe rechazar si el tenant no coincide", async () => {
        const session = makeSession();
        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn() };
        const tenantGuard = new TenantGuard({ tenantContext: "e-2" });
        const useCase = new BloquearConversacionUseCase({ repository: repo, tenantGuard });

        await expect(useCase.execute({ conversationId: "c-1", tenantContext: "e-2" })).rejects.toThrow(TenantError);
        expect(repo.actualizar).not.toHaveBeenCalled();
    });
});

describe("CerrarConversacionUseCase", () => {
    test("debe cerrar la conversación y publicar ConversationClosed", async () => {
        const session = makeSession();
        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn(async (s) => s) };
        const publisher = { publish: jest.fn() };
        const useCase = new CerrarConversacionUseCase({ repository: repo, eventPublisher: publisher });

        const result = await useCase.execute({ conversationId: "c-1" });

        expect(result.estado).toBe("CLOSED");
        expect(publisher.publish).toHaveBeenCalledTimes(1);
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(ConversationClosed);
    });
});
