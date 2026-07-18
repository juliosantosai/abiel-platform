export interface Logger {
    info(event: string, context?: Record<string, unknown>): void;
    error(event: string, error: unknown, context?: Record<string, unknown>): void;
}
export declare class ConsoleLogger implements Logger {
    info(event: string, context?: Record<string, unknown>): void;
    error(event: string, error: unknown, context?: Record<string, unknown>): void;
}
//# sourceMappingURL=Logger.d.ts.map