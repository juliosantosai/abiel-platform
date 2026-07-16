import { ErrorClassifier, ExecutionErrorType } from "../../../core/execution-policy/domain/ErrorClassifier";
import { PermissionChecker } from "../../../core/execution-policy/domain/PermissionChecker";
import { RetryPolicy } from "../../../core/execution-policy/domain/RetryPolicy";
import { TimeoutPolicy } from "../../../core/execution-policy/domain/TimeoutPolicy";
import { ExecutionContext, RuntimeEventInput } from "../domain/ExecutionContext";
import { ExecutionLifecycle } from "../domain/ExecutionLifecycle";

interface EventDispatcherLike {
  dispatch(name: string, payload?: Record<string, unknown>): Promise<void>;
}

type CancellationState = {
  requested: boolean;
  reason: string | null;
  dispatched: boolean;
};

type ActiveExecution = {
  lifecycle: ExecutionLifecycle;
  policySnapshot: Record<string, unknown>;
  cancellation: CancellationState;
  context: ExecutionContext;
};

type ExecuteOptions = {
  metadata?: Record<string, unknown>;
  identities?: Record<string, unknown>;
  policySnapshot?: Record<string, unknown>;
  memory?: Record<string, unknown>;
  memoryWindow?: Record<string, unknown>;
  requiredPermissions?: string[];
  capability?: (input: {
    context: ExecutionContext;
    event: RuntimeEventInput;
    cancellationSignal: { isCancelled: () => boolean };
  }) => Promise<unknown> | unknown;
};

export class RuntimeEngine {
  eventDispatcher: EventDispatcherLike;
  errorClassifier: ErrorClassifier;
  permissionChecker: PermissionChecker;
  activeExecutions: Map<string, ActiveExecution>;

  constructor({
    eventDispatcher,
    errorClassifier,
    permissionChecker,
  }: {
    eventDispatcher: EventDispatcherLike;
    errorClassifier?: ErrorClassifier;
    permissionChecker?: PermissionChecker;
  }) {
    if (!eventDispatcher || typeof eventDispatcher.dispatch !== "function") {
      throw new Error("RuntimeEngine requires an eventDispatcher");
    }

    this.eventDispatcher = eventDispatcher;
    this.errorClassifier = errorClassifier || new ErrorClassifier();
    this.permissionChecker = permissionChecker || new PermissionChecker();
    this.activeExecutions = new Map();
  }

  buildCancelledError(message = "Execution cancelled"): Error & { code?: string } {
    const error = new Error(message) as Error & { code?: string };
    error.code = "CANCELLED";
    return error;
  }

  async cancelExecution(executionId: string, reason = "cancellation_requested"): Promise<Record<string, unknown>> {
    const activeExecution = this.activeExecutions.get(executionId);
    if (!activeExecution) {
      return { status: "not_found", executionId };
    }

    const { lifecycle, context, cancellation, policySnapshot } = activeExecution;

    if (lifecycle.isTerminal()) {
      return { status: "already_terminal", executionId, lifecycle: lifecycle.state };
    }

    if (policySnapshot.allowCancellation === false) {
      return { status: "cancellation_disabled", executionId, lifecycle: lifecycle.state };
    }

    if (lifecycle.state !== "running") {
      return { status: "not_cancellable_state", executionId, lifecycle: lifecycle.state };
    }

    cancellation.requested = true;
    cancellation.reason = reason;

    lifecycle.transitionTo("cancelled");

    if (!cancellation.dispatched) {
      await this.eventDispatcher.dispatch("ExecutionCancelled", {
        executionId: context.executionId || null,
        status: "cancelled",
        reason,
        traceId: context.traceId || null,
        correlationId: context.correlationId || null,
      });

      await this.eventDispatcher.dispatch("ResultEvent", {
        executionId: context.executionId || null,
        status: "cancelled",
        reason,
        traceId: context.traceId || null,
        correlationId: context.correlationId || null,
      });

      cancellation.dispatched = true;
    }

    return { status: "cancelled", executionId, lifecycle: lifecycle.state };
  }

  async execute(event: RuntimeEventInput, {
    metadata = {},
    identities = {},
    policySnapshot = {},
    memory = {},
    memoryWindow = {},
    requiredPermissions = [],
    capability,
  }: ExecuteOptions = {}): Promise<Record<string, unknown>> {
    const lifecycle = new ExecutionLifecycle();
    let context: ExecutionContext | undefined;
    let response: Record<string, unknown>;

    try {
      context = new ExecutionContext({ event, metadata, identities, policySnapshot, memory, memoryWindow });
      this.activeExecutions.set(context.executionId || "", {
        lifecycle,
        policySnapshot,
        cancellation: { requested: false, reason: null, dispatched: false },
        context,
      });

      lifecycle.transitionTo("context_built");

      const permissionCheck = this.permissionChecker.check(context, requiredPermissions);
      if (!permissionCheck.allowed) {
        lifecycle.transitionTo("blocked");
        await this.eventDispatcher.dispatch("ResultEvent", {
          executionId: context.executionId || null,
          status: "blocked",
          reason: "missing_permissions",
          missingPermissions: permissionCheck.missing,
        });

        response = {
          status: "blocked",
          executionId: context.executionId || null,
          lifecycle: lifecycle.state,
          missingPermissions: permissionCheck.missing,
        };
        return response;
      }

      lifecycle.transitionTo("policy_checked");
      lifecycle.transitionTo("pipeline_selected");
      lifecycle.transitionTo("running");

      await this.eventDispatcher.dispatch("ExecutionStarted", {
        executionId: context.executionId || null,
        pipeline: (metadata.pipeline as string | undefined) || "direct",
        eventType: context.eventType,
      });

      const timeoutPolicy = new TimeoutPolicy({ timeoutMs: (policySnapshot.timeoutMs as number | undefined) || 5000 });
      const retryPolicy = new RetryPolicy({ maxAttempts: (policySnapshot.maxAttempts as number | undefined) || 1 });

      const executeCapability = async () => {
        const activeExecution = this.activeExecutions.get(context?.executionId || "");
        if (activeExecution && activeExecution.cancellation.requested) {
          throw this.buildCancelledError(activeExecution.cancellation.reason || undefined);
        }

        if (typeof capability !== "function") {
          const unavailableError = new Error("Capability is required and must be a function") as Error & { code?: string };
          unavailableError.code = "CAPABILITY_UNAVAILABLE";
          throw unavailableError;
        }

        return timeoutPolicy.execute(() => capability({
          context: context as ExecutionContext,
          event,
          cancellationSignal: {
            isCancelled: () => {
              const active = this.activeExecutions.get(context?.executionId || "");
              return !!(active && active.cancellation.requested);
            },
          },
        }));
      };

      const output = await retryPolicy.execute(() => executeCapability(), (error) => this.errorClassifier.classify(error));

      const activeExecution = this.activeExecutions.get(context.executionId || "");
      if (activeExecution && activeExecution.cancellation.requested) {
        throw this.buildCancelledError(activeExecution.cancellation.reason || undefined);
      }

      lifecycle.transitionTo("capability_executed");
      lifecycle.transitionTo("completed");

      await this.eventDispatcher.dispatch("ResultEvent", {
        executionId: context.executionId || null,
        status: "success",
        output,
        traceId: context.traceId || null,
        correlationId: context.correlationId || null,
      });

      response = {
        status: "success",
        executionId: context.executionId || null,
        output,
        lifecycle: lifecycle.state,
      };
      return response;
    } catch (error) {
      const typedError = error as Error;
      const classification: ExecutionErrorType = this.errorClassifier.classify(typedError as never);
      const activeExecution = context ? this.activeExecutions.get(context.executionId || "") : null;

      if (classification === "cancellation_error") {
        if (lifecycle.state !== "cancelled") {
          lifecycle.transitionTo("cancelled");
        }

        if (activeExecution && activeExecution.cancellation.dispatched) {
          response = {
            status: "cancelled",
            executionId: context ? context.executionId || null : null,
            errorType: classification,
            message: typedError.message,
            lifecycle: lifecycle.state,
          };
          return response;
        }

        await this.eventDispatcher.dispatch("ExecutionCancelled", {
          executionId: context ? context.executionId || null : null,
          status: "cancelled",
          reason: typedError.message,
          traceId: context ? context.traceId || null : null,
          correlationId: context ? context.correlationId || null : null,
        });

        await this.eventDispatcher.dispatch("ResultEvent", {
          executionId: context ? context.executionId || null : null,
          status: "cancelled",
          reason: typedError.message,
          traceId: context ? context.traceId || null : null,
          correlationId: context ? context.correlationId || null : null,
        });

        response = {
          status: "cancelled",
          executionId: context ? context.executionId || null : null,
          errorType: classification,
          message: typedError.message,
          lifecycle: lifecycle.state,
        };
        return response;
      }

      if (classification === "timeout_error") {
        lifecycle.transitionTo("timeout");
      } else {
        lifecycle.transitionTo("failed");
      }

      await this.eventDispatcher.dispatch("ResultEvent", {
        executionId: context ? context.executionId || null : null,
        status: lifecycle.state,
        errorType: classification,
        message: typedError.message,
        traceId: context ? context.traceId || null : null,
        correlationId: context ? context.correlationId || null : null,
      });

      response = {
        status: lifecycle.state,
        executionId: context ? context.executionId || null : null,
        errorType: classification,
        message: typedError.message,
        lifecycle: lifecycle.state,
      };
      return response;
    } finally {
      if (context && context.executionId) {
        this.activeExecutions.delete(context.executionId);
      }
    }
  }
}
