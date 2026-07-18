export {};

const CapabilityRegistry = require("../domain/CapabilityRegistry");
const InMemoryCapabilityRepository = require("../infrastructure/InMemoryCapabilityRepository");
const RegisterCapabilityUseCase = require("./RegisterCapabilityUseCase");
const ExecuteCapabilityUseCase = require("./ExecuteCapabilityUseCase");

describe("ExecuteCapabilityUseCase", () => {
    async function setup() {
        const repository = new InMemoryCapabilityRepository();
        const capabilityRegistry = new CapabilityRegistry({ capabilityRepository: repository });
        const eventPublisher = { publish: jest.fn(async () => undefined) };

        return {
            capabilityRegistry,
            eventPublisher,
            registerUseCase: new RegisterCapabilityUseCase({ capabilityRegistry, eventPublisher }),
            executeUseCase: new ExecuteCapabilityUseCase({ capabilityRegistry, eventPublisher })
        };
    }

    test("capability inexistente", async () => {
        const { executeUseCase, eventPublisher } = await setup();

        const result = await executeUseCase.execute({
            capabilityName: "missing-capability",
            input: {},
            executionContext: { executionId: "exec-1" }
        });

        expect(result.status).toBe("failed");
        expect(result.errorType).toBe("capability_error");
        expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "ResultEvent",
                payload: expect.objectContaining({
                    status: "failed",
                    errorType: "capability_error"
                })
            })
        );
    });

    test("permiso rechazado", async () => {
        const { registerUseCase, executeUseCase, eventPublisher } = await setup();

        await registerUseCase.execute({
            name: "send-private-message",
            requiredPermissions: ["messages:write"],
            handler: async () => ({ ok: true })
        });

        const result = await executeUseCase.execute({
            capabilityName: "send-private-message",
            input: { text: "hola" },
            executionContext: {
                executionId: "exec-2",
                permissions: ["messages:read"]
            }
        });

        expect(result.status).toBe("blocked");
        expect(result.errorType).toBe("permission_error");
        expect(result.missingPermissions).toEqual(["messages:write"]);
        expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "ResultEvent",
                payload: expect.objectContaining({
                    status: "blocked",
                    errorType: "permission_error"
                })
            })
        );
    });

    test("ejecucion exitosa", async () => {
        const { registerUseCase, executeUseCase, eventPublisher } = await setup();

        await registerUseCase.execute({
            name: "echo",
            requiredPermissions: ["echo:run"],
            handler: async (input) => ({ echo: input.message })
        });

        const result = await executeUseCase.execute({
            capabilityName: "echo",
            input: { message: "hola" },
            executionContext: {
                executionId: "exec-3",
                permissions: ["echo:run"],
                correlationId: "corr-3",
                traceId: "trace-3"
            }
        });

        expect(result.status).toBe("success");
        expect(result.output).toEqual({ echo: "hola" });
        expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "ResultEvent",
                payload: expect.objectContaining({
                    status: "success",
                    correlationId: "corr-3",
                    traceId: "trace-3"
                })
            })
        );
    });

    test("error de capability", async () => {
        const { registerUseCase, executeUseCase, eventPublisher } = await setup();

        await registerUseCase.execute({
            name: "broken-capability",
            requiredPermissions: [],
            handler: async () => {
                throw new Error("capability failure");
            }
        });

        const result = await executeUseCase.execute({
            capabilityName: "broken-capability",
            input: {},
            executionContext: { executionId: "exec-4", permissions: [] }
        });

        expect(result.status).toBe("failed");
        expect(result.errorType).toBe("validation_error");
        expect(result.message).toBe("capability failure");
        expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "ResultEvent",
                payload: expect.objectContaining({
                    status: "failed",
                    errorType: "validation_error"
                })
            })
        );
    });
});