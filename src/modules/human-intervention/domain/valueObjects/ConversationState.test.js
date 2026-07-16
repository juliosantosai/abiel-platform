const ConversationState = require("./ConversationState");
const ValidationError = require("../../../../shared/errors/ValidationError");

describe("ConversationState", () => {
    test("debe aceptar todos los estados válidos", () => {
        const estados = ["BOT_ACTIVE", "HUMAN_ACTIVE", "BOT_RESUME_PENDING", "HUMAN_LOCKED", "CLOSED"];
        for (const estado of estados) {
            const cs = new ConversationState(estado);
            expect(cs.value).toBe(estado);
        }
    });

    test("debe rechazar estados inválidos", () => {
        expect(() => new ConversationState("WAITING")).toThrow(ValidationError);
        expect(() => new ConversationState("")).toThrow(ValidationError);
        expect(() => new ConversationState(null)).toThrow(ValidationError);
    });

    test("debe comparar correctamente con equals()", () => {
        const a = new ConversationState("BOT_ACTIVE");
        const b = new ConversationState("BOT_ACTIVE");
        const c = new ConversationState("HUMAN_ACTIVE");
        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);
        expect(a.equals("BOT_ACTIVE")).toBe(true);
    });

    test("toString() retorna el valor", () => {
        const cs = new ConversationState("HUMAN_LOCKED");
        expect(cs.toString()).toBe("HUMAN_LOCKED");
    });
});
