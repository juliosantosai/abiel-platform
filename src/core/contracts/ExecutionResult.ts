export type ExecutionStatus = "success" | "failed" | "blocked";

export interface ExecutionResult<TOutput = unknown> {
  status: ExecutionStatus;
  output?: TOutput;
  errorType?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}
