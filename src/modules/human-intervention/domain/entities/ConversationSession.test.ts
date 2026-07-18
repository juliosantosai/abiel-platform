export {};

const ConversationSession = require("./ConversationSession");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");

const base = () => ({
    id: "conv-1",
    empresaId: "empresa-1",
    clienteId: "cliente-1"
});

describe("ConversationSession — construcción", () => {
    test("debe crear con estado inicial BOT_ACTIVE", () => {
        const session = new ConversationSession(base());
        expect(session.estado).toBe("BOT_ACTIVE");
        expect(session.puedeResponderBot()).toBe(true);
    });

    test("debe requerir id", () => {
        expect(() => new ConversationSession({ ...base(), id: undefined })).toThrow(ValidationError);
    });

    test("debe requerir empresaId", () => {
        expect(() => new ConversationSession({ ...base(), empresaId: undefined })).toThrow(ValidationError);
    });

    test("debe requerir clienteId", () => {
        expect(() => new ConversationSession({ ...base(), clienteId: undefined })).toThrow(ValidationError);
    });

    test("debe rechazar estados inválidos", () => {
        expect(() => new ConversationSession({ ...base(), estado: "INVALIDO" })).toThrow(ValidationError);
    });
});

describe("ConversationSession — detección de intervención humana", () => {
    test("BOT_ACTIVE → HUMAN_ACTIVE", () => {
        const session = new ConversationSession(base());
        session.detectarIntervencionHumana();
        expect(session.estado).toBe("HUMAN_ACTIVE");
        expect(session.ultimaIntervencionHumana).toBeInstanceOf(Date);
        expect(session.puedeResponderBot()).toBe(false);
    });

    test("HUMAN_ACTIVE → mantiene estado y actualiza timestamp", () => {
        const session = new ConversationSession({ ...base(), estado: "HUMAN_ACTIVE" });
        const antes = session.ultimaIntervencionHumana;
        session.detectarIntervencionHumana();
        expect(session.estado).toBe("HUMAN_ACTIVE");
    });

    test("HUMAN_LOCKED → lanza DomainError", () => {
        const session = new ConversationSession({ ...base(), estado: "HUMAN_LOCKED" });
        expect(() => session.detectarIntervencionHumana()).toThrow(DomainError);
    });

    test("CLOSED → lanza DomainError", () => {
        const session = new ConversationSession({ ...base(), estado: "CLOSED" });
        expect(() => session.detectarIntervencionHumana()).toThrow(DomainError);
    });
});

describe("ConversationSession — reanudación del bot", () => {
    test("HUMAN_ACTIVE → BOT_RESUME_PENDING", () => {
        const session = new ConversationSession({ ...base(), estado: "HUMAN_ACTIVE" });
        session.iniciarReanudacion();
        expect(session.estado).toBe("BOT_RESUME_PENDING");
    });

    test("iniciarReanudacion desde BOT_ACTIVE → lanza DomainError", () => {
        const session = new ConversationSession(base());
        expect(() => session.iniciarReanudacion()).toThrow(DomainError);
    });

    test("BOT_RESUME_PENDING → BOT_ACTIVE", () => {
        const session = new ConversationSession({ ...base(), estado: "BOT_RESUME_PENDING" });
        session.reanudarBot();
        expect(session.estado).toBe("BOT_ACTIVE");
        expect(session.puedeResponderBot()).toBe(true);
    });

    test("reanudarBot desde HUMAN_ACTIVE → lanza DomainError", () => {
        const session = new ConversationSession({ ...base(), estado: "HUMAN_ACTIVE" });
        expect(() => session.reanudarBot()).toThrow(DomainError);
    });
});

describe("ConversationSession — bloqueo", () => {
    test("cualquier estado → HUMAN_LOCKED", () => {
        for (const estado of ["BOT_ACTIVE", "HUMAN_ACTIVE", "BOT_RESUME_PENDING"]) {
            const session = new ConversationSession({ ...base(), estado });
            session.bloquear();
            expect(session.estado).toBe("HUMAN_LOCKED");
        }
    });

    test("CLOSED → no puede bloquearse", () => {
        const session = new ConversationSession({ ...base(), estado: "CLOSED" });
        expect(() => session.bloquear()).toThrow(DomainError);
    });

    test("HUMAN_LOCKED → bot no puede responder", () => {
        const session = new ConversationSession({ ...base(), estado: "HUMAN_LOCKED" });
        expect(session.puedeResponderBot()).toBe(false);
    });
});

describe("ConversationSession — cierre", () => {
    test("cualquier estado → CLOSED", () => {
        for (const estado of ["BOT_ACTIVE", "HUMAN_ACTIVE", "HUMAN_LOCKED", "BOT_RESUME_PENDING"]) {
            const session = new ConversationSession({ ...base(), estado });
            session.cerrar();
            expect(session.estado).toBe("CLOSED");
        }
    });

    test("CLOSED → cerrar de nuevo no lanza error", () => {
        const session = new ConversationSession({ ...base(), estado: "CLOSED" });
        expect(() => session.cerrar()).not.toThrow();
    });
});
