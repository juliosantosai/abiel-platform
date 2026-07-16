import { ErrorClassifier, ExecutionErrorType } from "../../execution-policy/domain/ErrorClassifier";
import { PermissionChecker } from "../../execution-policy/domain/PermissionChecker";
import { CapabilityRegistry } from "../domain/CapabilityRegistry";

interface ExecutionContext {
  executionId?: string | null;
  correlationId?: string | null;
  traceId?: string | null;
  permissions?: string[];
  [key: string]: unknown;
}

interface ExecuteInput {
  capabilityName: string;
  input?: Record<string, unknown>;
  executionContext?: ExecutionContext;
}

interface EventPublisherLike {
  publish(event: { name: string; payload: Record<string, unknown> }): Promise<void>;
}

export class ExecuteCapabilityUseCase {
  capabilityRegistry: CapabilityRegistry;
  permissionChecker: PermissionChecker;
  errorClassifier: ErrorClassifier;
  eventPublisher?: EventPublisherLike;

  constructor({
    capabilityRegistry,
    permissionChecker,
    errorClassifier,
    eventPublisher,
  }: {
    capabilityRegistry: CapabilityRegistry;
    permissionChecker?: PermissionChecker;
    errorClassifier?: ErrorClassifier;
    eventPublisher?: EventPublisherLike;
  }) {
    this.capabilityRegistry = capabilityRegistry;
    this.permissionChecker = permissionChecker || new PermissionChecker();
    this.errorClassifier = errorClassifier || new ErrorClassifier();
    this.eventPublisher = eventPublisher;
  }

  async execute({ capabilityName, input = {}, executionContext = {} }: ExecuteInput): Promise<Record<string, unknown>> {
    const capability = await this.capabilityRegistry.findByName(capabilityName);
    const executionId = executionContext.executionId || null;
    const correlationId = executionContext.correlationId || null;
    const traceId = executionContext.traceId || null;

    try {
      if (!capability) {
        const missingError = new Error(`Capability not found: ${capabilityName}`) as Error & { code?: string };
        missingError.code = "CAPABILITY_UNAVAILABLE";
        throw missingError;
      }

      const permissionResult = this.permissionChecker.check(
        { permissions: executionContext.permissions || [] },
        capability.requiredPermissions
      );

      if (!permissionResult.allowed) {
        const permissionError = new Error("Capability execution denied by permissions") as Error & {
          code?: string;
          missingPermissions?: string[];
        };
        permissionError.code = "PERMISSION_DENIED";
        permissionError.missingPermissions = permissionResult.missing;
        throw permissionError;
      }

      const output = await capability.execute(input, executionContext);

      await this.publishResult({
        executionId,
        status: "success",
        capabilityName,
        output,
        correlationId,
        traceId,
      });

      return {
        status: "success",
        capabilityName,
        output,
      };
    } catch (error) {
      const typedError = error as Error & { missingPermissions?: string[] };
      const errorType: ExecutionErrorType = this.errorClassifier.classify(typedError);
      const status = errorType === "permission_error" ? "blocked" : "failed";

      await this.publishResult({
        executionId,
        status,
        capabilityName,
        errorType,
        message: typedError.message,
        missingPermissions: typedError.missingPermissions || [],
        correlationId,
        traceId,
      });

      return {
        status,
        capabilityName,
        errorType,
        message: typedError.message,
        missingPermissions: typedError.missingPermissions || [],
      };
    }
  }

  async publishResult(payload: Record<string, unknown>): Promise<void> {
    if (this.eventPublisher && typeof this.eventPublisher.publish === "function") {
      await this.eventPublisher.publish({
        name: "ResultEvent",
        payload,
      });
    }
  }
}
