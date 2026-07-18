export {};

const AgregarMensajeAlBufferUseCase = require("./AgregarMensajeAlBufferUseCase");
const FakeMessageBufferRepository = require("../../infrastructure/persistence/FakeMessageBufferRepository");
const BufferAbierto = require("../../domain/events/BufferAbierto");
const BufferListo = require("../../domain/events/BufferListo");

describe("AgregarMensajeAlBufferUseCase", () => {
    let repo, publisher, useCase;
    beforeEach(() => {
        repo = new FakeMessageBufferRepository();
        publisher = { publish: jest.fn() };
        useCase = new AgregarMensajeAlBufferUseCase({ repository: repo, eventPublisher: publisher, ventanaMs: 3000, maxMensajes: 10 });
    });

    test("crea buffer nuevo y publica BufferAbierto", async () => {
        const buf = await useCase.execute({
            id: "buf-1", empresaId: "e-1", conversationId: "c-1",
            mensaje: { id: "m-1", texto: "Hola", tipo: "TEXT" }
        });
        expect(buf.estado).toBe("COLLECTING");
        expect(buf.mensajes).toHaveLength(1);
        const evento = publisher.publish.mock.calls[0][0];
        expect(evento).toBeInstanceOf(BufferAbierto);
    });

    test("reutiliza buffer activo existente", async () => {
        await useCase.execute({ id: "buf-1", empresaId: "e-1", conversationId: "c-1", mensaje: { id: "m-1", texto: "A" } });
        await useCase.execute({ id: "buf-2", empresaId: "e-1", conversationId: "c-1", mensaje: { id: "m-2", texto: "B" } });
        const buf = await repo.buscarActivo("c-1", "e-1");
        expect(buf.mensajes).toHaveLength(2);
        expect(buf.id).toBe("buf-1");
    });

    test("publica BufferListo al alcanzar maxMensajes", async () => {
        useCase = new AgregarMensajeAlBufferUseCase({ repository: repo, eventPublisher: publisher, ventanaMs: 3000, maxMensajes: 2 });
        await useCase.execute({ id: "buf-1", empresaId: "e-1", conversationId: "c-1", mensaje: { id: "m-1", texto: "A" } });
        await useCase.execute({ id: "buf-2", empresaId: "e-1", conversationId: "c-1", mensaje: { id: "m-2", texto: "B" } });
        const eventos = publisher.publish.mock.calls.map(c => c[0].name);
        expect(eventos).toContain("BufferListo");
    });
});
