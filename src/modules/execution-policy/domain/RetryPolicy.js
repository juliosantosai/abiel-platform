class RetryPolicy {
    constructor({ maxAttempts = 1, retryableErrorTypes = ["retryable_error", "timeout_error"] } = {}) {
        this.maxAttempts = Math.max(1, maxAttempts);
        this.retryableErrorTypes = retryableErrorTypes;
    }

    async execute(fn, classifyError) {
        let attempt = 0;
        let lastError;

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

module.exports = RetryPolicy;