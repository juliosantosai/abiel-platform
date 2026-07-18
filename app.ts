import globalEventBus from "./src/core/kernel/events/EventBus";
import EventDispatcher from "./src/engines/agent-runtime/infrastructure/EventDispatcher";
import RuntimeEngine from "./src/engines/agent-runtime/application/RuntimeEngine";
import { run as runApiMock } from "./src/infrastructure/api/infrastructure/runApiMock";

export function boot() {
  const startedAt = new Date().toISOString();
  const httpEnabled = process.env.HTTP_ENABLED !== "false";

  const eventDispatcher = new EventDispatcher(globalEventBus);
  const runtimeEngine = new RuntimeEngine({ eventDispatcher });

  if (httpEnabled) {
    runApiMock();
  }

  console.log("[Abiel Core V1] Bootstrapping...");
  console.log(`[Abiel Core V1] Started at: ${startedAt}`);
  console.log("[Abiel Core V1] EventBus: initialized");
  console.log("[Abiel Core V1] RuntimeEngine: initialized");
  console.log(`[Abiel Core V1] HTTP API: ${httpEnabled ? "enabled" : "disabled"}`);
  console.log("[Abiel Core V1] Status: running");

  const heartbeat = setInterval(() => {}, 60_000);

  const shutdown = (signal: string) => {
    clearInterval(heartbeat);
    console.log(`[Abiel Core V1] Received ${signal}. Shutting down...`);
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  return {
    runtimeEngine,
    eventBus: globalEventBus,
  };
}

if (require.main === module) {
  try {
    boot();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Abiel Core V1] Startup failed:", message);
    process.exit(1);
  }
}

export default boot;
