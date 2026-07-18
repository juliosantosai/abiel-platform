export interface MetricsSnapshot {
  startedAt: string;
  eventsPublished: number;
  capabilitiesRegistered: number;
}

export class Metrics {
  private startedAt: Date;
  private eventsPublished = 0;
  private capabilitiesRegistered = 0;

  constructor() {
    this.startedAt = new Date();
  }

  recordEventPublished(): void {
    this.eventsPublished += 1;
  }

  recordCapabilityRegistered(): void {
    this.capabilitiesRegistered += 1;
  }

  snapshot(): MetricsSnapshot {
    return {
      startedAt: this.startedAt.toISOString(),
      eventsPublished: this.eventsPublished,
      capabilitiesRegistered: this.capabilitiesRegistered,
    };
  }
}
