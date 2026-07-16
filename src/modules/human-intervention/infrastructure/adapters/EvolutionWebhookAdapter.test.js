const EvolutionWebhookAdapter = require("./EvolutionWebhookAdapter");

const makePayload = (overrides = {}) => ({
    event: "messages.upsert",
    instance: "empresa-01",
    data: {
        key: {
            remoteJid: "595981234567@s.whatsapp.net",
            fromMe: false
        },
        message: { conversation: "Hola" }
    },
    ...overrides
});

describe("EvolutionWebhookAdapter", () => {
    let adapter;

    beforeEach(() => {
        adapter = new EvolutionWebhookAdapter({ botNumbers: ["bot-number"] });
    });

    test("normaliza un mensaje de cliente (fromMe=false) como CUSTOMER", () => {
        const result = adapter.normalize(makePayload());

        expect(result.senderType).toBe("CUSTOMER");
        expect(result.fromMe).toBe(false);
        expect(result.clienteId).toBe("595981234567");
        expect(result.empresaId).toBe("empresa-01");
        expect(result.messageText).toBe("Hola");
        expect(result.rawEvent).toBe("messages.upsert");
    });

    test("normaliza mensaje fromMe=true sin número de bot como HUMAN", () => {
        const payload = makePayload({
            data: { key: { remoteJid: "vendedor@s.whatsapp.net", fromMe: true }, message: { conversation: "Te ayudo" } }
        });

        const result = adapter.normalize(payload);

        expect(result.senderType).toBe("HUMAN");
        expect(result.fromMe).toBe(true);
        expect(result.clienteId).toBe("vendedor");
    });

    test("normaliza mensaje fromMe=true con número de bot como BOT", () => {
        const payload = makePayload({
            data: { key: { remoteJid: "bot-number@s.whatsapp.net", fromMe: true }, message: { conversation: "Respuesta automática" } }
        });

        const result = adapter.normalize(payload);

        expect(result.senderType).toBe("BOT");
    });

    test("extrae texto de extendedTextMessage cuando no hay conversation", () => {
        const payload = makePayload({
            data: {
                key: { remoteJid: "595981234567@s.whatsapp.net", fromMe: false },
                message: { extendedTextMessage: { text: "Texto largo" } }
            }
        });

        expect(adapter.normalize(payload).messageText).toBe("Texto largo");
    });

    test("lanza error si falta instance", () => {
        const payload = makePayload({ instance: undefined });
        expect(() => adapter.normalize(payload)).toThrow("instance");
    });

    test("lanza error si falta remoteJid", () => {
        const payload = makePayload({ data: { key: {}, message: {} } });
        expect(() => adapter.normalize(payload)).toThrow("remoteJid");
    });
});
