module.exports = require("../../../core/execution-policy/domain/ErrorClassifier");class ErrorClassifier {
    classify(error) {
        if (!error) {
            return "validation_error";
        }

        if (error.code === "TIMEOUT") {
            return "timeout_error";
        }

        if (error.code === "CANCELLED") {
            return "cancellation_error";
        }

        if (error.code === "POLICY_DENIED" || error.code === "PERMISSION_DENIED") {
            return "permission_error";
        }

        if (error.code === "VALIDATION_ERROR" || error.name === "ValidationError") {
            return "validation_error";
        }

        if (error.code === "CAPABILITY_UNAVAILABLE") {
            return "capability_error";
        }

        return "validation_error";
    }
}

module.exports = ErrorClassifier;