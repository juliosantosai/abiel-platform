export interface HealthStatus {
  status: "ok" | "degraded";
  checks: Record<string, boolean>;
}

export class HealthCheck {
  private checks: Record<string, boolean>;

  constructor() {
    this.checks = {
      core: true,
      tenant: true,
      events: true,
    };
  }

  mark(checkName: string, healthy: boolean): void {
    this.checks[checkName] = healthy;
  }

  getStatus(): HealthStatus {
    const ok = Object.values(this.checks).every(Boolean);
    return {
      status: ok ? "ok" : "degraded",
      checks: this.checks,
    };
  }
}
