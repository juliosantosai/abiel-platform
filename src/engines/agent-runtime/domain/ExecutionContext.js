const { randomUUID } = require("crypto");

class ExecutionContext {
    constructor({ event, metadata = {}, identities = {}, policySnapshot = {}, memory = {}, memoryWindow = {} }) {
        if (!event || typeof event !== "object") {
            throw new Error("ExecutionContext requires a valid event");
        }

        this.executionId = metadata.executionId || randomUUID();
        this.tenantId = identities.tenantId || event.tenantId || "default-tenant";
        this.agentId = identities.agentId || event.agentId || "default-agent";
        this.userId = identities.userId || event.userId || "anonymous";
        this.conversationId = event.conversationId || metadata.conversationId || "default-conversation";

        this.eventType = event.type || event.name || "unknown_event";
        this.inputPayload = event.payload || {};
        this.sourceChannel = metadata.sourceChannel || event.sourceChannel || "internal";
        this.requestedAction = metadata.requestedAction || event.requestedAction || null;

        this.availableCapabilities = metadata.availableCapabilities || [];
        this.permissions = metadata.permissions || [];
        this.policySnapshot = policySnapshot;
        this.authContext = metadata.authContext || {};
        this.memory = memory;
        this.memoryWindow = memoryWindow;

        this.correlationId = metadata.correlationId || this.executionId;
        this.traceId = metadata.traceId || this.executionId;
        this.metadata = {
            createdAt: new Date(),
            ...metadata
        };

        Object.freeze(this);
    }
}

module.exports = ExecutionContext;