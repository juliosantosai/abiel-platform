export interface RuntimeEvent<TPayload = unknown> {
  name: string;
  id?: string;
  occurredAt?: Date;
  payload: TPayload;
  metadata?: Record<string, unknown>;
}

export interface EventPublisherPort {
  publish<TPayload = unknown>(event: RuntimeEvent<TPayload>): Promise<void>;
}
