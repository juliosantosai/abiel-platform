export {};

const CrearConversationSessionUseCase = require("./CrearConversationSessionUseCase");
const ConversationSession = require("../../domain/entities/ConversationSession");
const ConversationCreated = require("../../domain/events/ConversationCreated");

describe("CrearConversationSessionUseCase", () => {
    const makeRepo = () => ({ guardar: jest.fn(async (s) => s) });
    const makePublisher = () => ({ publish: jest.fn() });

    test("debe crear una sesión en estado BOT_ACTIVE y publicar ConversationCreated", async () => {
        const repo = makeRepo();
        const publisher = makePublisher();
        const useCase = new CrearConversationSessionUseCase({ repository: repo, eventPublisher: publisher });

        const result = await useCase.execute({ id: "c-1", empresaId: "e-1", clienteId: "cl-1" });

        expect(result).toBeInstanceOf(ConversationSession);
        expect(result.estado).toBe("BOT_ACTIVE");
        expect(repo.guardar).toHaveBeenCalledTimes(1);
        expect(publisher.publish).toHaveBeenCalledTimes(1);
        const event = publisher.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(ConversationCreated);
        expect(event.data.estado).toBe("BOT_ACTIVE");
    });
});
