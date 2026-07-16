import { RuntimeEngine } from "./RuntimeEngine";

const eventDispatcher = {
  dispatch: async (_name: string, _payload: Record<string, unknown>) => {},
};

const engine = new RuntimeEngine({ eventDispatcher });

void engine.execute(
  { type: "UserMessage", payload: { text: "hola" }, tenantId: "t1" },
  {
    metadata: {
      pipeline: "direct",
      permissions: ["messages:reply"],
    },
    requiredPermissions: ["messages:reply"],
    capability: async () => ({ reply: "ok" }),
  }
);

void engine.cancelExecution("exec-1", "cancellation_requested");
