import { AbielCore } from "./AbielCore";
const Capability = require("./capability/domain/Capability");

describe("AbielCore", () => {
  it("creates a tenant-aware facade and registers capabilities", async () => {
    const core = new AbielCore({ tenantId: "tenant-1" });
    const capability = new Capability({
      name: "ping",
      handler: async () => "pong",
    });

    await core.registerCapability(capability);
    const started = core.start();

    expect(started).toBe(core);
    expect(core.getTenantContext().tenantId).toBe("tenant-1");
    expect(core.getCapabilityRegistry()).toBeDefined();
    expect(await core.getCapabilityRegistry().findByName("ping")).toBeDefined();
  });
});
