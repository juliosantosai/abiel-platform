const { EventBus } = require("../../../shared/events/EventBus");
const EventDispatcher = require("../infrastructure/EventDispatcher");
const RuntimeEngine = require("./RuntimeEngine");

describe("RuntimeEngine integration with EventBus", () => {
    test("publica ExecutionStarted y ResultEvent en flujo exitoso", async () => {
        const bus = new EventBus();
        const dispatcher = new EventDispatcher(bus);
        const engine = new RuntimeEngine({ eventDispatcher: dispatcher });

        const startedEvents = [];
        const resultEvents = [];

        bus.subscribe("ExecutionStarted", async (event) => {
            startedEvents.push(event);
        });

        bus.subscribe("ResultEvent", async (event) => {
            resultEvents.push(event);
        });

        const result = await engine.execute(
            { type: "UserMessage", payload: { text: "hola" }, tenantId: "tenant-1" },
            {
                metadata: {
                    pipeline: "direct",
                    permissions: ["messages:reply"]
                },
                requiredPermissions: ["messages:reply"],
                capability: async () => ({ reply: "ok" })
            }
        );

        expect(result.status).toBe("success");
        expect(startedEvents).toHaveLength(1);
        expect(startedEvents[0].name).toBe("ExecutionStarted");
        expect(startedEvents[0].payload).toEqual(
            expect.objectContaining({
                executionId: expect.any(String),
                pipeline: "direct",
                eventType: "UserMessage"
            })
        );

        expect(resultEvents).toHaveLength(1);
        expect(resultEvents[0].name).toBe("ResultEvent");
        expect(resultEvents[0].payload).toEqual(
            expect.objectContaining({
                executionId: expect.any(String),
                status: "success",
                output: { reply: "ok" }
            })
        );
    });

    test("publica ResultEvent blocked cuando faltan permisos", async () => {
        const bus = new EventBus();
        const dispatcher = new EventDispatcher(bus);
        const engine = new RuntimeEngine({ eventDispatcher: dispatcher });

        const resultEvents = [];
        bus.subscribe("ResultEvent", async (event) => {
            resultEvents.push(event);
        });

        const result = await engine.execute(
            { type: "UserMessage", payload: { text: "hola" }, tenantId: "tenant-1" },
            {
                metadata: {
                    pipeline: "direct",
                    permissions: ["messages:read"]
                },
                requiredPermissions: ["messages:reply"],
                capability: async () => ({ reply: "ok" })
            }
        );

        expect(result.status).toBe("blocked");
        expect(resultEvents).toHaveLength(1);
        expect(resultEvents[0].payload).toEqual(
            expect.objectContaining({
                executionId: expect.any(String),
                status: "blocked",
                reason: "missing_permissions",
                missingPermissions: ["messages:reply"]
            })
        );
    });

    test("publica ExecutionCancelled y ResultEvent(cancelled)", async () => {
        const bus = new EventBus();
        const dispatcher = new EventDispatcher(bus);
        const engine = new RuntimeEngine({ eventDispatcher: dispatcher });

        const executionCancelledEvents = [];
        const resultEvents = [];

        bus.subscribe("ExecutionCancelled", async (event) => {
            executionCancelledEvents.push(event);
        });

        bus.subscribe("ResultEvent", async (event) => {
            resultEvents.push(event);
        });

        const executionId = "exec-integration-cancel-1";
        const executionPromise = engine.execute(
            { type: "CancelableEvent", payload: { text: "hola" }, tenantId: "tenant-1" },
            {
                metadata: {
                    executionId,
                    pipeline: "direct",
                    permissions: []
                },
                policySnapshot: {
                    timeoutMs: 200,
                    maxAttempts: 1
                },
                capability: async () => new Promise(resolve => {
                    setTimeout(() => resolve({ reply: "late" }), 40);
                })
            }
        );

        await new Promise(resolve => setTimeout(resolve, 10));
        const cancellation = await engine.cancelExecution(executionId, "integration_cancel");
        const result = await executionPromise;

        expect(cancellation.status).toBe("cancelled");
        expect(result.status).toBe("cancelled");

        expect(executionCancelledEvents).toHaveLength(1);
        expect(executionCancelledEvents[0].payload).toEqual(
            expect.objectContaining({
                executionId,
                status: "cancelled",
                reason: "integration_cancel",
                traceId: expect.any(String),
                correlationId: expect.any(String)
            })
        );

        const cancelledResultEvents = resultEvents.filter(event => event.payload.status === "cancelled");
        expect(cancelledResultEvents).toHaveLength(1);
        expect(cancelledResultEvents[0].payload).toEqual(
            expect.objectContaining({
                executionId,
                status: "cancelled",
                reason: "integration_cancel",
                traceId: expect.any(String),
                correlationId: expect.any(String)
            })
        );
    });
});