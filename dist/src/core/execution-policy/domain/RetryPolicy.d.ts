declare class RetryPolicy {
    constructor({ maxAttempts, retryableErrorTypes }?: {
        maxAttempts?: number;
        retryableErrorTypes?: string[];
    });
    execute(fn: any, classifyError: any): Promise<any>;
}
//# sourceMappingURL=RetryPolicy.d.ts.map