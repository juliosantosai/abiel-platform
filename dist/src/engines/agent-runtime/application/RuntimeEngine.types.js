"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeEngine_1 = require("./RuntimeEngine");
const eventDispatcher = {
    dispatch: async (_name, _payload) => { },
};
const engine = new RuntimeEngine_1.RuntimeEngine({ eventDispatcher });
void engine.execute({ type: "UserMessage", payload: { text: "hola" }, tenantId: "t1" }, {
    metadata: {
        pipeline: "direct",
        permissions: ["messages:reply"],
    },
    requiredPermissions: ["messages:reply"],
    capability: async () => ({ reply: "ok" }),
});
void engine.cancelExecution("exec-1", "cancellation_requested");
//# sourceMappingURL=RuntimeEngine.types.js.map