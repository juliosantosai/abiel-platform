const EnviarMensajeUseCase = require("./EnviarMensajeUseCase");
const FakeMessageSender = require("../../infrastructure/adapters/FakeMessageSender");
const OutboundMessage = require("../../domain/entities/OutboundMessage");
const MensajeEnviado = require("../../domain/events/MensajeEnviado");
const EnvioFallido = require("../../domain/events/EnvioFallido");

const base = () => ({
    id: "msg-1", empresaId: "e-1", conversationId: "c-1",
    clienteId: "5599", contenido: "Hola cliente!", instanceId: "inst-1"
});

describe("EnviarMensajeUseCase", () => {
    test("envía correctamente y publica MensajeEnviado", async () => {
        const sender = new FakeMessageSender();
        const publisher = { publish: jest.fn() };
        const result = await new EnviarMensajeUseCase({ messageSender: sender, eventPublisher: publisher }).execute(base());

        expect(result).toBeInstanceOf(OutboundMessage);
        expect(result.estado).toBe("SENT");
        expect(sender.sent).toHaveLength(1);
        expect(sender.sent[0].instance).toBe("inst-1");
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(MensajeEnviado);
    });

    test("maneja error y publica EnvioFallido", async () => {
        const sender = new FakeMessageSender({ shouldFail: true });
        const publisher = { publish: jest.fn() };
        const result = await new EnviarMensajeUseCase({ messageSender: sender, eventPublisher: publisher }).execute(base());

        expect(result.estado).toBe("FAILED");
        expect(result.intentos).toBe(1);
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(EnvioFallido);
    });

    test("OutboundMessage valida campos obligatorios", () => {
        const { ValidationError } = require("../../../../shared/errors/ValidationError");
        expect(() => new OutboundMessage({ id: "x", empresaId: "e", clienteId: "c", contenido: "" })).toThrow();
    });
});
