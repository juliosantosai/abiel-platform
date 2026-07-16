const EvolutionWebhookHandler = require("./EvolutionWebhookHandler");
const FakeConversationSessionRepository = require("../persistence/FakeConversationSessionRepository");
const ConversationSession = require("../../domain/entities/ConversationSession");

let idCounter = 0;
const uuid = () => `gen-id-${++idCounter}`;

const makePayload = ({ fromMe = false, remoteJid = "5599@s.whatsapp.net", instance = "e-1" } = {}) => ({
    event: "messages.upsert",
    instance,
    data: {
        key: { remoteJid, fromMe },
        message: { conversation: "test" }
    }
});

describe("EvolutionWebhookHandler", () => {
    let repo;
    let publisher;
    let handler;

    beforeEach(() => {
        idCounter = 0;
        repo = new FakeConversationSessionRepository();
        publisher = { publish: jest.fn() };
        handler = new EvolutionWebhookHandler({ repository: repo, eventPublisher: publisher, uuidFn: uuid });
    });

    test("crea una sesión nueva si no existe y el remitente es CUSTOMER", async () => {
        const { session, comando } = await handler.handle(makePayload());

        expect(session.estado).toBe("BOT_ACTIVE");
        expect(comando.senderType).toBe("CUSTOMER");
        expect(session.clienteId).toBe("5599");
        expect(session.empresaId).toBe("e-1");
    });

    test("crea sesión y cambia a HUMAN_ACTIVE cuando el remitente es HUMAN", async () => {
        const { session, comando } = await handler.handle(makePayload({ fromMe: true }));

        expect(session.estado).toBe("HUMAN_ACTIVE");
        expect(comando.senderType).toBe("HUMAN");
    });

    test("reutiliza la sesión existente si ya existe para el cliente", async () => {
        const existente = new ConversationSession({ id: "existing-1", empresaId: "e-1", clienteId: "5599" });
        await repo.guardar(existente);

        const { session } = await handler.handle(makePayload());

        expect(session.id).toBe("existing-1");
    });

    test("no cambia estado si el remitente es BOT", async () => {
        const botHandler = new EvolutionWebhookHandler({
            repository: repo,
            eventPublisher: publisher,
            uuidFn: uuid,
            botNumbers: ["bot-num"]
        });

        const { session, comando } = await botHandler.handle(
            makePayload({ fromMe: true, remoteJid: "bot-num@s.whatsapp.net" })
        );

        expect(comando.senderType).toBe("BOT");
        expect(session.estado).toBe("BOT_ACTIVE");
    });
});
