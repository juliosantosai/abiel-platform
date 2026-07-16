const globalEventBus = require("./src/core/kernel/events/EventBus");
const { EventBus } = require("./src/core/kernel/events/EventBus");
const EventDispatcher = require("./src/engines/agent-runtime/infrastructure/EventDispatcher");
const RuntimeEngine = require("./src/engines/agent-runtime/application/RuntimeEngine");
const { run: runApiMock } = require("./src/infrastructure/api/infrastructure/runApiMock");

function boot() {
    const startedAt = new Date().toISOString();
    const httpEnabled = process.env.HTTP_ENABLED !== "false";

    // Keep compatibility with the existing global singleton while validating export shape.
    if (!(globalEventBus instanceof EventBus)) {
        throw new Error("Invalid EventBus singleton instance");
    }

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

    // Keep the process active as a runtime host process.
    const heartbeat = setInterval(() => {}, 60_000);

    const shutdown = (signal) => {
        clearInterval(heartbeat);
        console.log(`[Abiel Core V1] Received ${signal}. Shutting down...`);
        process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    return {
        runtimeEngine,
        eventBus: globalEventBus
    };
}

if (require.main === module) {
    try {
        boot();
    } catch (error) {
        console.error("[Abiel Core V1] Startup failed:", error.message);
        process.exit(1);
    }
}

module.exports = { boot };
