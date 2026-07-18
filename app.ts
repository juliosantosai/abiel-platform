const RuntimeBootstrap = require("./src/bootstrap/RuntimeBootstrap");

export function boot() {
  const startedAt = new Date().toISOString();
  const httpEnabled = process.env.HTTP_ENABLED !== "false";
  const port = Number(process.env.PORT || 5000);
  const loadPlugins = process.env.LOAD_PLUGINS === "true";

  const runtimeContext = RuntimeBootstrap.create({
    tenantId: process.env.TENANT_ID,
    runtimeEnv: process.env.NODE_ENV,
    apiPort: port,
    loadPlugins,
    useCases: {},
    startApi: httpEnabled,
  });

  console.log("[Abiel Core V1] Bootstrapping...");
  console.log(`[Abiel Core V1] Started at: ${startedAt}`);
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

  return runtimeContext;
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
