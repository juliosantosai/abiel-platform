import { randomUUID } from "crypto";
import { ExecutionContext as CoreExecutionContext } from "../../../core/contracts/ExecutionContext";

export interface RuntimeEventInput {
  type?: string;
  name?: string;
  payload?: Record<string, unknown>;
  tenantId?: string;
  agentId?: string;
  userId?: string;
  conversationId?: string;
  sourceChannel?: string;
  requestedAction?: string;
}

export class ExecutionContext implements CoreExecutionContext {
  executionId?: string;
  tenantId: string;
  agentId: string;
  userId?: string;
  correlationId?: string;
  traceId?: string;
  permissions?: string[];
  metadata?: Record<string, unknown>;

  conversationId: string;
  eventType: string;
  inputPayload: Record<string, unknown>;
  sourceChannel: string;
  requestedAction: string | null;
  availableCapabilities: string[];
  policySnapshot: Record<string, unknown>;
  authContext: Record<string, unknown>;
  memory: Record<string, unknown>;
  memoryWindow: Record<string, unknown>;

  constructor({
    event,
    metadata = {},
    identities = {},
    policySnapshot = {},
    memory = {},
    memoryWindow = {},
  }: {
    event: RuntimeEventInput;
    metadata?: Record<string, unknown>;
    identities?: Record<string, unknown>;
    policySnapshot?: Record<string, unknown>;
    memory?: Record<string, unknown>;
    memoryWindow?: Record<string, unknown>;
  }) {
    if (!event || typeof event !== "object") {
      throw new Error("ExecutionContext requires a valid event");
    }

    const identitiesTenant = identities.tenantId as string | undefined;
    const identitiesAgent = identities.agentId as string | undefined;
    const identitiesUser = identities.userId as string | undefined;

    this.executionId = (metadata.executionId as string | undefined) || randomUUID();
    this.tenantId = identitiesTenant || event.tenantId || "default-tenant";
    this.agentId = identitiesAgent || event.agentId || "default-agent";
    this.userId = identitiesUser || event.userId || "anonymous";
    this.conversationId = event.conversationId || (metadata.conversationId as string | undefined) || "default-conversation";

    this.eventType = event.type || event.name || "unknown_event";
    this.inputPayload = event.payload || {};
    this.sourceChannel = (metadata.sourceChannel as string | undefined) || event.sourceChannel || "internal";
    this.requestedAction = (metadata.requestedAction as string | undefined) || event.requestedAction || null;

    this.availableCapabilities = (metadata.availableCapabilities as string[] | undefined) || [];
    this.permissions = (metadata.permissions as string[] | undefined) || [];
    this.policySnapshot = policySnapshot;
    this.authContext = (metadata.authContext as Record<string, unknown> | undefined) || {};
    this.memory = memory;
    this.memoryWindow = memoryWindow;

    this.correlationId = (metadata.correlationId as string | undefined) || this.executionId;
    this.traceId = (metadata.traceId as string | undefined) || this.executionId;
    this.metadata = {
      createdAt: new Date(),
      ...metadata,
    };

    Object.freeze(this);
  }
}
