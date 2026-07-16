const ExecutionContext = require("./ExecutionContext");

describe("ExecutionContext", () => {
    test("crea contexto inmutable con campos requeridos", () => {
        const context = new ExecutionContext({
            event: {
                type: "UserMessageReceived",
                payload: { text: "hola" },
                tenantId: "tenant-1",
                agentId: "agent-1",
                userId: "user-1",
                conversationId: "conv-1"
            },
            metadata: {
                sourceChannel: "chat",
                requestedAction: "reply",
                permissions: ["messages:reply"],
                availableCapabilities: ["reply"]
            },
            policySnapshot: { timeoutMs: 1000 }
        });

        expect(context.executionId).toBeDefined();
        expect(context.eventType).toBe("UserMessageReceived");
        expect(context.sourceChannel).toBe("chat");
        expect(context.requestedAction).toBe("reply");
        expect(context.permissions).toEqual(["messages:reply"]);
        expect(Object.isFrozen(context)).toBe(true);
    });

    test("lanza error cuando no hay event", () => {
        expect(() => new ExecutionContext({})).toThrow("ExecutionContext requires a valid event");
    });
});