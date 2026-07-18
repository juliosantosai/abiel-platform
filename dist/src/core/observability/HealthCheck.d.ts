export interface HealthStatus {
    status: "ok" | "degraded";
    checks: Record<string, boolean>;
}
export declare class HealthCheck {
    private checks;
    constructor();
    mark(checkName: string, healthy: boolean): void;
    getStatus(): HealthStatus;
}
//# sourceMappingURL=HealthCheck.d.ts.map