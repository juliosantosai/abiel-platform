export interface DomainEventLike {
  name: string;
  [key: string]: unknown;
}

export type EventHandler<TEvent extends DomainEventLike = DomainEventLike> =
  (event: TEvent) => void | Promise<void>;

export class EventBus {
  private handlers: Record<string, EventHandler[]> = {};

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
  }

  async publish(event: DomainEventLike): Promise<void> {
    const handlers = this.handlers[event.name] || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  clear(): void {
    this.handlers = {};
  }
}

const globalBus = new EventBus();

export default globalBus;
