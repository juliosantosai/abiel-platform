export type ClassifyError = (error: unknown) => string;

export class RetryPolicy {
  maxAttempts: number;
  retryableErrorTypes: string[];

  constructor({
    maxAttempts = 1,
    retryableErrorTypes = ["retryable_error", "timeout_error"],
  }: { maxAttempts?: number; retryableErrorTypes?: string[] } = {}) {
    this.maxAttempts = Math.max(1, maxAttempts);
    this.retryableErrorTypes = retryableErrorTypes;
  }

  async execute<T>(fn: (attempt: number) => Promise<T> | T, classifyError?: ClassifyError): Promise<T> {
    let attempt = 0;
    let lastError: unknown;

    while (attempt < this.maxAttempts) {
      attempt += 1;
      try {
        return await fn(attempt);
      } catch (error) {
        lastError = error;
        const errorType = classifyError ? classifyError(error) : "non_retryable_error";
        const shouldRetry = this.retryableErrorTypes.includes(errorType);
        if (!shouldRetry || attempt >= this.maxAttempts) {
          throw lastError;
        }
      }
    }

    throw lastError;
  }
}
