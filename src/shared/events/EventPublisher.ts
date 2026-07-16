import Logger = require("../logger/Logger");
import globalBus, { DomainEventLike, EventBus } from "./EventBus";

export class EventPublisher {
  private readonly bus: EventBus;

  constructor({ bus }: { bus?: EventBus } = {}) {
    this.bus = bus || globalBus;
  }

  async publish(event: DomainEventLike): Promise<void> {
    if (!event || !event.name) {
      throw new Error("EventPublisher.publish requiere un evento con propiedad 'name'.");
    }

    Logger.info(`Evento publicado: ${event.name}`, { eventId: event.id });

    await this.bus.publish(event);
  }
}

const globalPublisher = new EventPublisher();

export default globalPublisher;
