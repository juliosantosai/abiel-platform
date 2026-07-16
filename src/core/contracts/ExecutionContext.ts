export interface ExecutionContext {
  tenantId: string;
  agentId: string;
  userId?: string;
  executionId?: string;
  correlationId?: string;
  traceId?: string;
  permissions?: string[];
  metadata?: Record<string, unknown>;
}
