declare class TimeoutPolicy {
    constructor({ timeoutMs }?: {
        timeoutMs?: number;
    });
    execute(fn: any): Promise<unknown>;
}
//# sourceMappingURL=TimeoutPolicy.d.ts.map