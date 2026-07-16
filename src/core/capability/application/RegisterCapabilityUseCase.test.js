const CapabilityRegistry = require("../domain/CapabilityRegistry");
const InMemoryCapabilityRepository = require("../infrastructure/InMemoryCapabilityRepository");
const RegisterCapabilityUseCase = require("./RegisterCapabilityUseCase");

describe("RegisterCapabilityUseCase", () => {
    test("registro correcto", async () => {
        const repository = new InMemoryCapabilityRepository();
        const registry = new CapabilityRegistry({ capabilityRepository: repository });
        const eventPublisher = { publish: jest.fn(async () => undefined) };

        const useCase = new RegisterCapabilityUseCase({
            capabilityRegistry: registry,
            eventPublisher
        });

        const capability = await useCase.execute({
            name: "summarize-conversation",
            requiredPermissions: ["conversation:read"],
            handler: async () => ({ summary: "ok" })
        });

        expect(capability.name).toBe("summarize-conversation");
        expect(capability.requiredPermissions).toEqual(["conversation:read"]);
        expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
        expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({ name: "CapabilityRegistered" })
        );
    });
});