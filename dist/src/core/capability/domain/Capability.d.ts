export type CapabilityLifecycle = "active" | "deprecated" | "inactive" | string;
export interface CapabilityExecutionContext {
    [key: string]: unknown;
}
export type CapabilityHandler<TInput = unknown, TOutput = unknown> = (input: TInput, executionContext: CapabilityExecutionContext) => Promise<TOutput> | TOutput;
export interface CapabilityProps<TInput = unknown, TOutput = unknown> {
    name: string;
    version?: string;
    requiredPermissions?: string[];
    lifecycle?: CapabilityLifecycle;
    handler: CapabilityHandler<TInput, TOutput>;
}
export declare class Capability<TInput = unknown, TOutput = unknown> {
    name: string;
    version: string;
    requiredPermissions: string[];
    lifecycle: CapabilityLifecycle;
    handler: CapabilityHandler<TInput, TOutput>;
    constructor({ name, version, requiredPermissions, lifecycle, handler }: CapabilityProps<TInput, TOutput>);
    isExecutable(): boolean;
    execute(input: TInput, executionContext: CapabilityExecutionContext): Promise<TOutput>;
}
export default Capability;
//# sourceMappingURL=Capability.d.ts.map