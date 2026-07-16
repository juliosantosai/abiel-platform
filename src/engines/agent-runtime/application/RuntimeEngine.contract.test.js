const RuntimeEngine = require("./RuntimeEngine");

describe("RuntimeEngine event contracts", () => {
    function createRuntime() {
        const events = [];
        const eventDispatcher = {
            dispatch: jest.fn(async (name, payload) => {
                events.push({ name, payload });
            })
        };

        return {
            engine: new RuntimeEngine({ eventDispatcher }),
            events
        };
    }

    test("ExecutionStarted contract (success path)", async () => {
        const { engine, events } = createRuntime();

        await engine.execute(
            { type: "UserMessage", payload: { text: "hi" }, tenantId: "tenant-1" },
            {
                metadata: {
                    pipeline: "direct",
                    permissions: ["messages:reply"]
                },
                requiredPermissions: ["messages:reply"],
                capability: async () => ({ ok: true })
            }
        );

        const started = events.find((event) => event.name === "ExecutionStarted");
        expect(started).toBeDefined();
        expect(started.payload).toEqual(
            expect.objectContaining({
                executionId: expect.any(String),
                pipeline: "direct",
                eventType: "UserMessage"
            })
        );
    });

    test("ResultEvent contract (success path)", async () => {
        const { engine, events } = createRuntime();

        await engine.execute(
            { type: "UserMessage", payload: { text: "hi" }, tenantId: "tenant-1" },
            {
                metadata: {
                    pipeline: "direct",
                    permissions: ["messages:reply"]
                },
                requiredPermissions: ["messages:reply"],
                capability: async () => ({ ok: true })
            }
        );

        const resultEvent = events.find((event) => event.name === "ResultEvent");
        expect(resultEvent).toBeDefined();
        expect(resultEvent.payload).toEqual(
            expect.objectContaining({
                executionId: expect.any(String),
                status: "success",
                output: { ok: true },
                traceId: expect.any(String),
                correlationId: expect.any(String)
            })
        );
    });

    test("ResultEvent contract (blocked path)", async () => {
        const { engine, events } = createRuntime();

        await engine.execute(
            { type: "UserMessage", payload: { text: "hi" }, tenantId: "tenant-1" },
            {
                metadata: {
                    pipeline: "direct",
                    permissions: ["messages:read"]
                },
                requiredPermissions: ["messages:reply"],
                capability: async () => ({ ok: true })
            }
        );

        const resultEvent = events.find((event) => event.name === "ResultEvent");
        expect(resultEvent).toBeDefined();
        expect(resultEvent.payload).toEqual(
            expect.objectContaining({
                executionId: expect.any(String),
                status: "blocked",
                reason: "missing_permissions",
                missingPermissions: ["messages:reply"]
            })
        );
    });

    test("ResultEvent contract (failed path)", async () => {
        const { engine, events } = createRuntime();

        await engine.execute(
            { type: "UserMessage", payload: { text: "hi" }, tenantId: "tenant-1" },
            {
                metadata: {
                    pipeline: "direct",
                    permissions: ["messages:reply"]
                },
                requiredPermissions: ["messages:reply"],
                capability: async () => {
                    throw new Error("boom");
                }
            }
        );

        const resultEvent = events.find((event) => event.name === "ResultEvent");
        expect(resultEvent).toBeDefined();
        expect(resultEvent.payload).toEqual(
            expect.objectContaining({
                executionId: expect.any(String),
                status: "failed",
                errorType: "validation_error",
                message: "boom"
            })
        );
    });
});