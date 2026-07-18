export class EventBus {
  private handlers: Record<string, Array<(event: any) => Promise<void> | void>>;

  constructor() {
    this.handlers = {};
  }

  subscribe(eventName: string, handler: (event: any) => Promise<void> | void) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  unsubscribe(eventName: string, handler: (event: any) => Promise<void> | void) {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
  }

  async publish(event: { name: string; [key: string]: unknown }) {
    const handlers = this.handlers[event.name] || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  clear() {
    this.handlers = {};
  }
}

export const globalEventBus = new EventBus();
export default globalEventBus;
