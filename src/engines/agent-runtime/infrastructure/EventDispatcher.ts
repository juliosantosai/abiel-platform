export class EventDispatcher {
  private eventBus: { publish: (event: { name: string; payload?: unknown; occurredAt: Date }) => Promise<void> | void };

  constructor(eventBus: { publish: (event: { name: string; payload?: unknown; occurredAt: Date }) => Promise<void> | void }) {
    if (!eventBus || typeof eventBus.publish !== "function") {
      throw new Error("EventDispatcher requires an eventBus with publish(event)");
    }
    this.eventBus = eventBus;
  }

  async dispatch(name: string, payload: Record<string, unknown> = {}) {
    await this.eventBus.publish({
      name,
      payload,
      occurredAt: new Date(),
    });
  }
}

export default EventDispatcher;

// CommonJS compatibility
try {
  // @ts-ignore
  module.exports = EventDispatcher;
  // @ts-ignore
  module.exports.EventDispatcher = EventDispatcher;
} catch (e) {}