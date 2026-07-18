declare const ErrorClassifier: any;
declare const PermissionChecker: any;
declare class ExecuteCapabilityUseCase {
    constructor({ capabilityRegistry, permissionChecker, errorClassifier, eventPublisher }: {
        capabilityRegistry: any;
        permissionChecker: any;
        errorClassifier: any;
        eventPublisher: any;
    });
    execute({ capabilityName, input, executionContext }: {
        capabilityName: any;
        input?: {};
        executionContext?: {};
    }): Promise<{
        status: string;
        capabilityName: any;
        output: any;
        errorType?: undefined;
        message?: undefined;
        missingPermissions?: undefined;
    } | {
        status: string;
        capabilityName: any;
        errorType: any;
        message: any;
        missingPermissions: any;
        output?: undefined;
    }>;
    publishResult(payload: any): Promise<void>;
}
//# sourceMappingURL=ExecuteCapabilityUseCase.d.ts.map