module.exports = require("../../../engines/agent-runtime/application/RuntimeEngine");const ExecutionContext = require("../../../engines/agent-runtime/domain/ExecutionContext");
const ExecutionLifecycle = require("../../../engines/agent-runtime/domain/ExecutionLifecycle");
const ErrorClassifier = require("../../../core/execution-policy/domain/ErrorClassifier");
const PermissionChecker = require("../../../core/execution-policy/domain/PermissionChecker");
const RetryPolicy = require("../../../core/execution-policy/domain/RetryPolicy");
const TimeoutPolicy = require("../../../core/execution-policy/domain/TimeoutPolicy");

class RuntimeEngine {
    constructor({ eventDispatcher, errorClassifier, permissionChecker } = {}) {
        if (!eventDispatcher || typeof eventDispatcher.dispatch !== "function") {
            throw new Error("RuntimeEngine requires an eventDispatcher");
        }

        this.eventDispatcher = eventDispatcher;
        this.errorClassifier = errorClassifier || new ErrorClassifier();
        this.permissionChecker = permissionChecker || new PermissionChecker();
        this.activeExecutions = new Map();
    }

    buildCancelledError(message = "Execution cancelled") {
        const error = new Error(message);
        error.code = "CANCELLED";
        return error;
    }

    async cancelExecution(executionId, reason = "cancellation_requested") {
        const activeExecution = this.activeExecutions.get(executionId);
        if (!activeExecution) {
            return { status: "not_found", executionId };
        }

        const { lifecycle, context, cancellation, policySnapshot } = activeExecution;

        if (lifecycle.isTerminal()) {
            return {
                status: "already_terminal",
                executionId,
                lifecycle: lifecycle.state
            };
        }

        if (policySnapshot.allowCancellation === false) {
            return {
                status: "cancellation_disabled",
                executionId,
                lifecycle: lifecycle.state
            };
        }

        if (lifecycle.state !== "running") {
            return {
                status: "not_cancellable_state",
                executionId,
                lifecycle: lifecycle.state
            };
        }

        cancellation.requested = true;
        cancellation.reason = reason;

        lifecycle.transitionTo("cancelled");

        if (!cancellation.dispatched) {
            await this.eventDispatcher.dispatch("ExecutionCancelled", {
                executionId: context.executionId,
                status: "cancelled",
                reason,
                traceId: context.traceId,
                correlationId: context.correlationId
            });

            await this.eventDispatcher.dispatch("ResultEvent", {
                executionId: context.executionId,
                status: "cancelled",
                reason,
                traceId: context.traceId,
                correlationId: context.correlationId
            });

            cancellation.dispatched = true;
        }

        return {
            status: "cancelled",
            executionId,
            lifecycle: lifecycle.state
        };
    }

    async execute(event, {
        metadata = {},
        identities = {},
        policySnapshot = {},
        memory = {},
        memoryWindow = {},
        requiredPermissions = [],
        capability
    } = {}) {
        const lifecycle = new ExecutionLifecycle();
        let context;
        let response;

        try {
            context = new ExecutionContext({
                event,
                metadata,
                identities,
                policySnapshot,
                memory,
                memoryWindow
            });
            this.activeExecutions.set(context.executionId, {
                lifecycle,
                policySnapshot,
                cancellation: {
                    requested: false,
                    reason: null,
                    dispatched: false
                },
                context
            });

            lifecycle.transitionTo("context_built");

            const permissionCheck = this.permissionChecker.check(context, requiredPermissions);
            if (!permissionCheck.allowed) {
                lifecycle.transitionTo("blocked");
                await this.eventDispatcher.dispatch("ResultEvent", {
                    executionId: context.executionId,
                    status: "blocked",
                    reason: "missing_permissions",
                    missingPermissions: permissionCheck.missing
                });

                response = {
                    status: "blocked",
                    executionId: context.executionId,
                    lifecycle: lifecycle.state,
                    missingPermissions: permissionCheck.missing
                };
                return response;
            }

            lifecycle.transitionTo("policy_checked");
            lifecycle.transitionTo("pipeline_selected");
            lifecycle.transitionTo("running");

            await this.eventDispatcher.dispatch("ExecutionStarted", {
                executionId: context.executionId,
                pipeline: metadata.pipeline || "direct",
                eventType: context.eventType
            });

            const timeoutPolicy = new TimeoutPolicy({ timeoutMs: policySnapshot.timeoutMs || 5000 });
            const retryPolicy = new RetryPolicy({ maxAttempts: policySnapshot.maxAttempts || 1 });

            const executeCapability = async () => {
                const activeExecution = this.activeExecutions.get(context.executionId);
                if (activeExecution && activeExecution.cancellation.requested) {
                    throw this.buildCancelledError(activeExecution.cancellation.reason);
                }

                if (typeof capability !== "function") {
                    const unavailableError = new Error("Capability is required and must be a function");
                    unavailableError.code = "CAPABILITY_UNAVAILABLE";
                    throw unavailableError;
                }

                return timeoutPolicy.execute(() => capability({
                    context,
                    event,
                    cancellationSignal: {
                        isCancelled: () => {
                            const active = this.activeExecutions.get(context.executionId);
                            return !!(active && active.cancellation.requested);
                        }
                    }
                }));
            };

            const output = await retryPolicy.execute(
                () => executeCapability(),
                (error) => this.errorClassifier.classify(error)
            );

            const activeExecution = this.activeExecutions.get(context.executionId);
            if (activeExecution && activeExecution.cancellation.requested) {
                throw this.buildCancelledError(activeExecution.cancellation.reason);
            }

            lifecycle.transitionTo("capability_executed");
            lifecycle.transitionTo("completed");

            const resultEvent = {
                executionId: context.executionId,
                status: "success",
                output,
                traceId: context.traceId,
                correlationId: context.correlationId
            };

            await this.eventDispatcher.dispatch("ResultEvent", resultEvent);

            response = {
                status: "success",
                executionId: context.executionId,
                output,
                lifecycle: lifecycle.state
            };
            return response;
        } catch (error) {
            const classification = this.errorClassifier.classify(error);
            const activeExecution = context ? this.activeExecutions.get(context.executionId) : null;

            if (classification === "cancellation_error") {
                if (lifecycle.state !== "cancelled") {
                    lifecycle.transitionTo("cancelled");
                }

                if (activeExecution && activeExecution.cancellation.dispatched) {
                    response = {
                        status: "cancelled",
                        executionId: context ? context.executionId : null,
                        errorType: classification,
                        message: error.message,
                        lifecycle: lifecycle.state
                    };
                    return response;
                }

                await this.eventDispatcher.dispatch("ExecutionCancelled", {
                    executionId: context ? context.executionId : null,
                    status: "cancelled",
                    reason: error.message,
                    traceId: context ? context.traceId : null,
                    correlationId: context ? context.correlationId : null
                });

                await this.eventDispatcher.dispatch("ResultEvent", {
                    executionId: context ? context.executionId : null,
                    status: "cancelled",
                    reason: error.message,
                    traceId: context ? context.traceId : null,
                    correlationId: context ? context.correlationId : null
                });

                response = {
                    status: "cancelled",
                    executionId: context ? context.executionId : null,
                    errorType: classification,
                    message: error.message,
                    lifecycle: lifecycle.state
                };
                return response;
            }

            if (classification === "timeout_error") {
                lifecycle.transitionTo("timeout");
            } else {
                lifecycle.transitionTo("failed");
            }

            await this.eventDispatcher.dispatch("ResultEvent", {
                executionId: context ? context.executionId : null,
                status: lifecycle.state,
                errorType: classification,
                message: error.message,
                traceId: context ? context.traceId : null,
                correlationId: context ? context.correlationId : null
            });

            response = {
                status: lifecycle.state,
                executionId: context ? context.executionId : null,
                errorType: classification,
                message: error.message,
                lifecycle: lifecycle.state
            };
            return response;
        } finally {
            if (context && context.executionId) {
                this.activeExecutions.delete(context.executionId);
            }
        }
    }
}

module.exports = RuntimeEngine;