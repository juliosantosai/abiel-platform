import { RuntimeEngine } from "./index";
import { TenantContext, TenantGuard } from "./index";
import { EventBus, EventPublisher } from "./index";
import { CapabilityRegistry } from "./index";

describe("public entrypoint", () => {
  it("re-exports the core runtime, security, events, and capability surface", () => {
    expect(RuntimeEngine).toBeDefined();
    expect(TenantContext).toBeDefined();
    expect(TenantGuard).toBeDefined();
    expect(EventBus).toBeDefined();
    expect(EventPublisher).toBeDefined();
    expect(CapabilityRegistry).toBeDefined();
  });
});
