const Capability = require("./Capability");
const CapabilityRegistry = require("./CapabilityRegistry");
const InMemoryCapabilityRepository = require("../infrastructure/InMemoryCapabilityRepository");

describe("CapabilityRegistry", () => {
    test("registro correcto", async () => {
        const repository = new InMemoryCapabilityRepository();
        const registry = new CapabilityRegistry({ capabilityRepository: repository });

        const capability = new Capability({
            name: "send-message",
            handler: async () => ({ ok: true })
        });

        const registered = await registry.register(capability);
        const found = await registry.findByName("send-message");

        expect(registered).toBe(capability);
        expect(found).toBe(capability);
    });
});