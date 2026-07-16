import globalBus, { EventHandler } from "./EventBus";

export class EventSubscriber {
  subscribe(eventName: string, handler: EventHandler): void {
    globalBus.subscribe(eventName, handler);
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    globalBus.unsubscribe(eventName, handler);
  }
}

const globalSubscriber = new EventSubscriber();

export default globalSubscriber;
