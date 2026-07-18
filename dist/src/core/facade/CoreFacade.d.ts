declare const os: any;
declare class CoreFacade {
    constructor({ abielCore, runtimeEngine, eventBus, metrics, logBuffer }?: {});
    listCapabilities(): Promise<any>;
    getEventBusStats(): {
        available: boolean;
        published?: undefined;
        subscribers?: undefined;
        handlersMapKeys?: undefined;
    } | {
        available: boolean;
        published: number;
        subscribers: any;
        handlersMapKeys: string[];
    };
    getRuntimeSnapshot(): {
        nodeVersion: string;
        platform: NodeJS.Platform;
        pid: number;
        uptimeSeconds: number;
        cpuCount: any;
        memory: {
            rss: number;
            heapUsed: number;
            heapTotal: number;
        };
        runtimeEngine: {
            available: boolean;
            activeExecutions: any;
        };
    };
    getMetrics(): {
        cpu: any;
        ram: number;
        heap: number;
        gc: {};
        requests: {};
        latency: {};
    };
    appendLog(entry: any): void;
    getLogs({ page, perPage }?: {
        page?: number;
        perPage?: number;
    }): any;
}
//# sourceMappingURL=CoreFacade.d.ts.map