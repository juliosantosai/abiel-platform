import { EventBus, globalEventBus } from "./EventBus";
import logger from "../../../shared/logger/Logger";

export class EventPublisher {
  private bus: EventBus;

  constructor({ bus }: { bus?: EventBus } = {}) {
    this.bus = bus || globalEventBus;
  }

  async publish(event: { name: string; id?: string; [key: string]: unknown }) {
    if (!event || !event.name) {
      throw new Error("EventPublisher.publish requiere un evento con propiedad 'name'.");
    }

    logger.info(`Evento publicado: ${event.name}`, { eventId: event.id });

    await this.bus.publish(event);
  }
}

export const globalPublisher = new EventPublisher();
export default globalPublisher;
