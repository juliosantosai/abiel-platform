const DetectarIntervencionHumanaUseCase = require("./DetectarIntervencionHumanaUseCase");
const ConversationSession = require("../../domain/entities/ConversationSession");
const HumanInterventionDetected = require("../../domain/events/HumanInterventionDetected");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const TenantError = require("../../../../shared/tenant/TenantError");

const makeSession = (extra = {}) => new ConversationSession({
    id: "c-1", empresaId: "e-1", clienteId: "cl-1", ...extra
});

describe("DetectarIntervencionHumanaUseCase", () => {
    test("debe cambiar estado a HUMAN_ACTIVE y publicar evento", async () => {
        const session = makeSession();
        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn(async (s) => s) };
        const publisher = { publish: jest.fn() };
        const useCase = new DetectarIntervencionHumanaUseCase({ repository: repo, eventPublisher: publisher });

        const result = await useCase.execute({ conversationId: "c-1" });

        expect(result.estado).toBe("HUMAN_ACTIVE");
        expect(repo.actualizar).toHaveBeenCalledTimes(1);
        expect(publisher.publish).toHaveBeenCalledTimes(1);
        const event = publisher.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(HumanInterventionDetected);
        expect(event.data.estadoAnterior).toBe("BOT_ACTIVE");
        expect(event.data.estadoNuevo).toBe("HUMAN_ACTIVE");
    });

    test("debe lanzar NotFoundError si no existe", async () => {
        const repo = { buscarPorId: jest.fn(async () => null) };
        const useCase = new DetectarIntervencionHumanaUseCase({ repository: repo });
        await expect(useCase.execute({ conversationId: "x" })).rejects.toThrow(NotFoundError);
    });

    test("debe rechazar si el tenant no coincide", async () => {
        const session = makeSession();
        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn() };
        const tenantGuard = new TenantGuard({ tenantContext: "e-2" });
        const useCase = new DetectarIntervencionHumanaUseCase({ repository: repo, tenantGuard });

        await expect(useCase.execute({ conversationId: "c-1", tenantContext: "e-2" })).rejects.toThrow(TenantError);
        expect(repo.actualizar).not.toHaveBeenCalled();
    });
});
