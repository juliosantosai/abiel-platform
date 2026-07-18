export {};

const BufferExpirationWorker = require("./BufferExpirationWorker");
const FakeMessageBufferRepository = require("../../infrastructure/persistence/FakeMessageBufferRepository");
const MessageBuffer = require("../../domain/entities/MessageBuffer");

const makeBuffer = (extra = {}) => new MessageBuffer({ id: "buf-1", empresaId: "e-1", conversationId: "c-1", ventanaMs: 100, ...extra });

describe("BufferExpirationWorker", () => {
    test("cierra buffers expirados y deja intactos los no expirados", async () => {
        const repo = new FakeMessageBufferRepository();
        const publisher = { publish: jest.fn() };

        const expirado = makeBuffer({ id: "buf-exp" });
        const vigente = makeBuffer({ id: "buf-vig", ventanaMs: 999999 });
        await repo.guardar(expirado);
        await repo.guardar(vigente);

        const futuro = new Date(Date.now() + 5000);
        const worker = new BufferExpirationWorker({ repository: repo, eventPublisher: publisher });
        const resultados = await worker.run(futuro);

        expect(resultados.find(r => r.id === "buf-exp").estado).toBe("READY");
        expect(resultados.find(r => r.id === "buf-vig")).toBeUndefined();
    });

    test("tolera errores individuales sin detener el proceso", async () => {
        const repo = {
            buscarExpirados: jest.fn(async () => [{ id: "roto" }, { id: "buf-1" }]),
            buscarPorId: jest.fn(async (id) => id === "roto" ? null : new MessageBuffer({ id, empresaId: "e-1", conversationId: "c-1" })),
            actualizar: jest.fn(async b => b)
        };
        const worker = new BufferExpirationWorker({ repository: repo, eventPublisher: { publish: jest.fn() } });
        const resultados = await worker.run();
        expect(resultados.find(r => r.id === "roto").error).toBe(true);
        expect(resultados.find(r => r.id === "buf-1").estado).toBe("READY");
    });
});
