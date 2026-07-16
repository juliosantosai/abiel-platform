module.exports = require("../../../core/capability/application/ExecuteCapabilityUseCase");const ErrorClassifier = require("../../execution-policy/domain/ErrorClassifier");
const PermissionChecker = require("../../execution-policy/domain/PermissionChecker");

class ExecuteCapabilityUseCase {
    constructor({ capabilityRegistry, permissionChecker, errorClassifier, eventPublisher }) {
        this.capabilityRegistry = capabilityRegistry;
        this.permissionChecker = permissionChecker || new PermissionChecker();
        this.errorClassifier = errorClassifier || new ErrorClassifier();
        this.eventPublisher = eventPublisher;
    }

    async execute({ capabilityName, input = {}, executionContext = {} }) {
        const capability = await this.capabilityRegistry.findByName(capabilityName);
        const executionId = executionContext.executionId || null;
        const correlationId = executionContext.correlationId || null;
        const traceId = executionContext.traceId || null;

        try {
            if (!capability) {
                const missingError = new Error(`Capability not found: ${capabilityName}`);
                missingError.code = "CAPABILITY_UNAVAILABLE";
                throw missingError;
            }

            const permissionResult = this.permissionChecker.check(
                { permissions: executionContext.permissions || [] },
                capability.requiredPermissions
            );

            if (!permissionResult.allowed) {
                const permissionError = new Error("Capability execution denied by permissions");
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
                traceId
            });

            return {
                status: "success",
                capabilityName,
                output
            };
        } catch (error) {
            const errorType = this.errorClassifier.classify(error);
            const status = errorType === "permission_error" ? "blocked" : "failed";

            await this.publishResult({
                executionId,
                status,
                capabilityName,
                errorType,
                message: error.message,
                missingPermissions: error.missingPermissions || [],
                correlationId,
                traceId
            });

            return {
                status,
                capabilityName,
                errorType,
                message: error.message,
                missingPermissions: error.missingPermissions || []
            };
        }
    }

    async publishResult(payload) {
        if (this.eventPublisher && typeof this.eventPublisher.publish === "function") {
            await this.eventPublisher.publish({
                name: "ResultEvent",
                payload
            });
        }
    }
}

module.exports = ExecuteCapabilityUseCase;