export {};

const RuntimeEngine = require("./RuntimeEngine");

describe("RuntimeEngine", () => {
    function buildEngine() {
        const published = [];
        const eventDispatcher = {
            dispatch: jest.fn(async (name, payload) => {
                published.push({ name, payload });
            })
        };
        return {
            engine: new RuntimeEngine({ eventDispatcher }),
            eventDispatcher,
            published
        };
    }

    test("ejecucion exitosa en direct pipeline", async () => {
        const { engine, published } = buildEngine();
        const result = await engine.execute(
            { type: "UserMessage", payload: { text: "hola" }, tenantId: "t1" },
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
        expect(result.output).toEqual({ reply: "ok" });
        expect(published.find(event => event.name === "ResultEvent")).toBeDefined();
    });

    test("bloquea cuando faltan permisos", async () => {
        const { engine } = buildEngine();
        const result = await engine.execute(
            { type: "UserMessage", payload: {}, tenantId: "t1" },
            {
                metadata: {
                    permissions: ["messages:read"]
                },
                requiredPermissions: ["messages:reply"],
                capability: async () => ({})
            }
        );

        expect(result.status).toBe("blocked");
        expect(result.missingPermissions).toEqual(["messages:reply"]);
    });

    test("retorna timeout cuando la capability excede el limite", async () => {
        const { engine } = buildEngine();
        const result = await engine.execute(
            { type: "SlowEvent", payload: {}, tenantId: "t1" },
            {
                metadata: {
                    permissions: []
                },
                policySnapshot: {
                    timeoutMs: 5,
                    maxAttempts: 1
                },
                capability: async () => new Promise(resolve => {
                    setTimeout(() => resolve("late"), 25);
                })
            }
        );

        expect(result.status).toBe("timeout");
        expect(result.errorType).toBe("timeout_error");
    });

    test("falla cuando capability no esta disponible", async () => {
        const { engine } = buildEngine();
        const result = await engine.execute(
            { type: "NoCapability", payload: {}, tenantId: "t1" },
            {
                metadata: {
                    permissions: []
                }
            }
        );

        expect(result.status).toBe("failed");
        expect(result.errorType).toBe("capability_error");
    });

    test("permite cancelar ejecucion en running y retorna cancelled", async () => {
        const { engine, published } = buildEngine();
        const executionId = "exec-cancel-1";

        const executionPromise = engine.execute(
            { type: "CancelableEvent", payload: {}, tenantId: "t1" },
            {
                metadata: {
                    executionId,
                    permissions: []
                },
                policySnapshot: {
                    timeoutMs: 200,
                    maxAttempts: 1
                },
                capability: async () => new Promise(resolve => {
                    setTimeout(() => resolve("done"), 40);
                })
            }
        );

        await new Promise(resolve => setTimeout(resolve, 10));
        const cancellation = await engine.cancelExecution(executionId, "user_requested_cancel");
        const result = await executionPromise;

        expect(cancellation.status).toBe("cancelled");
        expect(result.status).toBe("cancelled");
        expect(result.errorType).toBe("cancellation_error");
        expect(published.find(event => event.name === "ExecutionCancelled")).toBeDefined();
        expect(published.find(event => event.name === "ResultEvent" && event.payload.status === "cancelled")).toBeDefined();
    });

    test("no cancela ejecucion ya terminada", async () => {
        const { engine } = buildEngine();
        const executionId = "exec-cancel-2";

        const result = await engine.execute(
            { type: "FastEvent", payload: {}, tenantId: "t1" },
            {
                metadata: {
                    executionId,
                    permissions: []
                },
                capability: async () => "ok"
            }
        );

        expect(result.status).toBe("success");

        const cancellation = await engine.cancelExecution(executionId, "late_cancel");
        expect(cancellation.status).toBe("not_found");
    });
});