export {};

const CerrarBufferUseCase = require("./CerrarBufferUseCase");
const ProcesarBufferUseCase = require("./ProcesarBufferUseCase");
const FakeMessageBufferRepository = require("../../infrastructure/persistence/FakeMessageBufferRepository");
const MessageBuffer = require("../../domain/entities/MessageBuffer");
const BufferListo = require("../../domain/events/BufferListo");
const BufferProcesado = require("../../domain/events/BufferProcesado");
const NotFoundError = require("../../../../../shared/errors/NotFoundError");

const makeBuffer = (extra = {}) => new MessageBuffer({ id: "buf-1", empresaId: "e-1", conversationId: "c-1", ...extra });

describe("CerrarBufferUseCase", () => {
    test("cierra el buffer y publica BufferListo", async () => {
        const repo = new FakeMessageBufferRepository();
        const publisher = { publish: jest.fn() };
        await repo.guardar(makeBuffer());
        const result = await new CerrarBufferUseCase({ repository: repo, eventPublisher: publisher }).execute({ bufferId: "buf-1" });
        expect(result.estado).toBe("READY");
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(BufferListo);
    });

    test("lanza NotFoundError si no existe", async () => {
        const repo = new FakeMessageBufferRepository();
        await expect(new CerrarBufferUseCase({ repository: repo }).execute({ bufferId: "x" })).rejects.toThrow(NotFoundError);
    });
});

describe("ProcesarBufferUseCase", () => {
    test("marca como FLUSHED y publica BufferProcesado", async () => {
        const repo = new FakeMessageBufferRepository();
        const publisher = { publish: jest.fn() };
        await repo.guardar(makeBuffer({ estado: "READY" }));
        const result = await new ProcesarBufferUseCase({ repository: repo, eventPublisher: publisher }).execute({ bufferId: "buf-1" });
        expect(result.estado).toBe("FLUSHED");
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(BufferProcesado);
    });
});
