export {};

const BotResumptionWorker = require("./BotResumptionWorker");
const FakeConversationSessionRepository = require("../../infrastructure/persistence/FakeConversationSessionRepository");
const ConversationSession = require("../../domain/entities/ConversationSession");

const makeSession = ({ id, estado, minutosAtras = 0 }) => {
    const session = new ConversationSession({ id, empresaId: "e-1", clienteId: `cl-${id}`, estado });
    if (minutosAtras > 0) {
        session.ultimaIntervencionHumana = new Date(Date.now() - minutosAtras * 60 * 1000);
    }
    return session;
};

describe("BotResumptionWorker", () => {
    test("reanuda sesiones que superaron el tiempo de espera", async () => {
        const repo = new FakeConversationSessionRepository();
        const publisher = { publish: jest.fn() };

        await repo.guardar(makeSession({ id: "c-1", estado: "HUMAN_ACTIVE", minutosAtras: 10 }));
        await repo.guardar(makeSession({ id: "c-2", estado: "HUMAN_ACTIVE", minutosAtras: 2 }));
        await repo.guardar(makeSession({ id: "c-3", estado: "BOT_ACTIVE" }));

        const worker = new BotResumptionWorker({ repository: repo, eventPublisher: publisher, tiempoEsperaMs: 5 * 60 * 1000 });
        const resultados = await worker.run();

        const c1 = await repo.buscarPorId("c-1");
        const c2 = await repo.buscarPorId("c-2");
        const c3 = await repo.buscarPorId("c-3");

        expect(c1.estado).toBe("BOT_ACTIVE");
        expect(c2.estado).toBe("HUMAN_ACTIVE");
        expect(c3.estado).toBe("BOT_ACTIVE");

        expect(publisher.publish).toHaveBeenCalledTimes(1);
        expect(resultados.find(r => r.id === "c-1").estado).toBe("BOT_ACTIVE");
        expect(resultados.find(r => r.id === "c-2").estado).toBe("HUMAN_ACTIVE");
    });

    test("no hace nada si no hay sesiones HUMAN_ACTIVE", async () => {
        const repo = new FakeConversationSessionRepository();
        const publisher = { publish: jest.fn() };

        await repo.guardar(makeSession({ id: "c-1", estado: "BOT_ACTIVE" }));

        const worker = new BotResumptionWorker({ repository: repo, eventPublisher: publisher });
        await worker.run();

        expect(publisher.publish).not.toHaveBeenCalled();
    });

    test("maneja errores individuales sin detener el proceso", async () => {
        const repo = new FakeConversationSessionRepository();
        const sessionValida = makeSession({ id: "c-1", estado: "HUMAN_ACTIVE", minutosAtras: 10 });
        await repo.guardar(sessionValida);

        // Forzar error parcial: la segunda sesión no existe en el repositorio pero se incluye en la lista
        const repoConError = {
            ...repo,
            obtenerTodas: jest.fn(async () => [
                sessionValida,
                { id: "c-roto", estado: "HUMAN_ACTIVE", ultimaIntervencionHumana: new Date(0), empresaId: "e-1" }
            ]),
            buscarPorId: jest.fn(async (id) => id === "c-roto" ? null : repo.buscarPorId(id)),
            actualizar: repo.actualizar.bind(repo)
        };

        const publisher = { publish: jest.fn() };
        const worker = new BotResumptionWorker({ repository: repoConError, eventPublisher: publisher, tiempoEsperaMs: 5 * 60 * 1000 });
        const resultados = await worker.run();

        expect(resultados.find(r => r.id === "c-roto").error).toBe(true);
        expect(resultados.find(r => r.id === "c-1").estado).toBe("BOT_ACTIVE");
    });
});
