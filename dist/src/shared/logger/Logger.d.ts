export declare class Logger {
    private silent;
    constructor({ silent }?: {
        silent?: boolean;
    });
    info(message: string, data?: Record<string, unknown>): void;
    error(message: string, error?: Record<string, unknown>): void;
    warn(message: string, data?: Record<string, unknown>): void;
}
export declare const logger: Logger;
export default logger;
//# sourceMappingURL=Logger.d.ts.map