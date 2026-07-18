declare const ExecutionContext: any;
declare const ExecutionLifecycle: any;
declare const ErrorClassifier: any;
declare const PermissionChecker: any;
declare const RetryPolicy: any;
declare const TimeoutPolicy: any;
declare class RuntimeEngine {
    constructor({ eventDispatcher, errorClassifier, permissionChecker }?: {});
    buildCancelledError(message?: string): Error;
    cancelExecution(executionId: any, reason?: string): Promise<{
        status: string;
        executionId: any;
        lifecycle?: undefined;
    } | {
        status: string;
        executionId: any;
        lifecycle: any;
    }>;
    execute(event: any, { metadata, identities, policySnapshot, memory, memoryWindow, requiredPermissions, capability }?: {
        metadata?: {};
        identities?: {};
        policySnapshot?: {};
        memory?: {};
        memoryWindow?: {};
        requiredPermissions?: any[];
    }): Promise<any>;
}
//# sourceMappingURL=RuntimeEngine.d.ts.map