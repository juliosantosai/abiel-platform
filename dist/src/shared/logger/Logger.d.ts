declare class Logger {
    constructor({ silent }?: {
        silent?: boolean;
    });
    info(message: any, data?: {}): void;
    error(message: any, error?: {}): void;
    warn(message: any, data?: {}): void;
}
//# sourceMappingURL=Logger.d.ts.map