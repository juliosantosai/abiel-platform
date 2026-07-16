export type ExecutionErrorType =
  | "timeout_error"
  | "cancellation_error"
  | "permission_error"
  | "validation_error"
  | "capability_error";

export interface ErrorLike {
  code?: string;
  name?: string;
}

export class ErrorClassifier {
  classify(error?: ErrorLike | null): ExecutionErrorType {
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
