export interface MetricsSnapshot {
    startedAt: string;
    eventsPublished: number;
    capabilitiesRegistered: number;
}
export declare class Metrics {
    private startedAt;
    private eventsPublished;
    private capabilitiesRegistered;
    constructor();
    recordEventPublished(): void;
    recordCapabilityRegistered(): void;
    snapshot(): MetricsSnapshot;
}
//# sourceMappingURL=Metrics.d.ts.map