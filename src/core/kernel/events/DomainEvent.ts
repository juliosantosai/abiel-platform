import { randomUUID } from "crypto";

export class DomainEvent {
  id: string;
  name: string;
  occurredAt: Date;

  constructor() {
    this.id = randomUUID();
    this.name = (this.constructor as { eventName?: string }).eventName || this.constructor.name;
    this.occurredAt = new Date();
  }
}
