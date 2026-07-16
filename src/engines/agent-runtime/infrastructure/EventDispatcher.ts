export interface EventBusLike {
  publish(event: { name: string; payload: Record<string, unknown>; occurredAt: Date }): Promise<void>;
}

export class EventDispatcher {
  eventBus: EventBusLike;

  constructor(eventBus: EventBusLike) {
    if (!eventBus || typeof eventBus.publish !== "function") {
      throw new Error("EventDispatcher requires an eventBus with publish(event)");
    }
    this.eventBus = eventBus;
  }

  async dispatch(name: string, payload: Record<string, unknown> = {}): Promise<void> {
    await this.eventBus.publish({
      name,
      payload,
      occurredAt: new Date(),
    });
  }
}
