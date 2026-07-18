import { ConsoleLogger } from "./Logger";
import { Metrics } from "./Metrics";
import { HealthCheck } from "./HealthCheck";
import { TraceContext } from "./TraceContext";

describe("observability primitives", () => {
  it("captures metrics, health and trace context", () => {
    const logger = new ConsoleLogger();
    const metrics = new Metrics();
    const health = new HealthCheck();
    const trace = new TraceContext({ traceId: "trace-1", tenantId: "tenant-1" });

    logger.info("core.started", { tenantId: "tenant-1" });
    metrics.recordEventPublished();
    metrics.recordCapabilityRegistered();
    health.mark("runtime", true);

    expect(metrics.snapshot().eventsPublished).toBe(1);
    expect(metrics.snapshot().capabilitiesRegistered).toBe(1);
    expect(health.getStatus().status).toBe("ok");
    expect(trace.toJSON().traceId).toBe("trace-1");
  });
});
