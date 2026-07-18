export {};

const EvaluarReanudacionBotUseCase = require("./EvaluarReanudacionBotUseCase");
const ConversationSession = require("../../domain/entities/ConversationSession");
const BotResumed = require("../../domain/events/BotResumed");

const makeSession = (extra = {}) => new ConversationSession({
    id: "c-1", empresaId: "e-1", clienteId: "cl-1", ...extra
});

describe("EvaluarReanudacionBotUseCase", () => {
    test("debe reanudar el bot si el tiempo de espera se cumplió", async () => {
        const session = makeSession({ estado: "HUMAN_ACTIVE" });
        session.ultimaIntervencionHumana = new Date(Date.now() - 10 * 60 * 1000); // 10 min atrás

        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn(async (s) => s) };
        const publisher = { publish: jest.fn() };
        const useCase = new EvaluarReanudacionBotUseCase({ repository: repo, eventPublisher: publisher, tiempoEsperaMs: 5 * 60 * 1000 });

        const result = await useCase.execute({ conversationId: "c-1" });

        expect(result.estado).toBe("BOT_ACTIVE");
        expect(repo.actualizar).toHaveBeenCalledTimes(1);
        expect(publisher.publish).toHaveBeenCalledTimes(1);
        const event = publisher.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(BotResumed);
    });

    test("no debe reanudar si el tiempo de espera no se cumplió", async () => {
        const session = makeSession({ estado: "HUMAN_ACTIVE" });
        session.ultimaIntervencionHumana = new Date(Date.now() - 2 * 60 * 1000); // solo 2 min atrás

        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn() };
        const publisher = { publish: jest.fn() };
        const useCase = new EvaluarReanudacionBotUseCase({ repository: repo, eventPublisher: publisher, tiempoEsperaMs: 5 * 60 * 1000 });

        const result = await useCase.execute({ conversationId: "c-1" });

        expect(result.estado).toBe("HUMAN_ACTIVE");
        expect(repo.actualizar).not.toHaveBeenCalled();
        expect(publisher.publish).not.toHaveBeenCalled();
    });

    test("no debe hacer nada si la sesión no está en HUMAN_ACTIVE", async () => {
        const session = makeSession({ estado: "BOT_ACTIVE" });
        const repo = { buscarPorId: jest.fn(async () => session), actualizar: jest.fn() };
        const useCase = new EvaluarReanudacionBotUseCase({ repository: repo });

        const result = await useCase.execute({ conversationId: "c-1" });

        expect(result.estado).toBe("BOT_ACTIVE");
        expect(repo.actualizar).not.toHaveBeenCalled();
    });
});
